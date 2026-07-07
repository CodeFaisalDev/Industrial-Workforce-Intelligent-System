import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ROLE_HOURLY_RATES: Record<string, number> = {
  'HR Admin': 30,
  'Floor Manager': 25,
  'Worker': 15,
};

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    const companyId = (session.user as any).company_id;

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    let query = `
      SELECT p.*, e.name as employee_name, e.email as employee_email, e.role as employee_role, d.name as department_name
      FROM payroll_ledgers p
      JOIN employees e ON p.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.company_id = $1
    `;
    const params: any[] = [companyId];

    if (role === 'Floor Manager') {
      query += `
        AND e.id IN (SELECT worker_id FROM manager_worker_access WHERE manager_id = $2)
      `;
      params.push(userId);
      if (employeeId) {
        query += ` AND p.employee_id = $3`;
        params.push(employeeId);
      }
    } else if (role === 'Worker') {
      query += `
        AND p.employee_id = $2
      `;
      params.push(userId);
    } else {
      // HR Admin
      if (employeeId) {
        query += ` AND p.employee_id = $2`;
        params.push(employeeId);
      }
    }

    query += ` ORDER BY p.period_start DESC, e.name ASC`;

    const result = await db.query(query, params);
    return NextResponse.json({ success: true, payroll: result.rows });
  } catch (error: any) {
    console.error('Failed to get payroll data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).company_id;
    const body = await request.json();
    const { period_start, period_end } = body;

    if (!period_start || !period_end) {
      return NextResponse.json(
        { success: false, error: 'period_start and period_end are required.' },
        { status: 400 }
      );
    }

    console.log(`Computing payroll from ${period_start} to ${period_end} for company ${companyId}...`);

    // 1. Get all active employees in this company
    const employeesRes = await db.query(
      `SELECT id, name, role FROM employees WHERE status = 'Active' AND company_id = $1`,
      [companyId]
    );
    const employees = employeesRes.rows;

    const payrollResults = [];

    for (const emp of employees) {
      // 2. Fetch biometric logs for the employee in the period
      // We sort logs by timestamp to pair check-in/out
      const logsRes = await db.query(
        `SELECT timestamp, log_type
         FROM biometric_logs
         WHERE employee_id = $1 AND timestamp >= $2::timestamp AND timestamp <= $3::timestamp + interval '1 day'
         ORDER BY timestamp ASC`,
        [emp.id, period_start, period_end]
      );
      const logs = logsRes.rows;

      let regularHoursTotal = 0;
      let overtimeHoursTotal = 0;

      // Match check-in and check-out pairings
      // Simple algorithm: find Check_In, then find the next Check_Out for the same day (or next log)
      let lastCheckIn: Date | null = null;

      for (const log of logs) {
        const logTime = new Date(log.timestamp);
        if (log.log_type === 'Check_In') {
          lastCheckIn = logTime;
        } else if (log.log_type === 'Check_Out' && lastCheckIn) {
          // Calculate duration in hours
          const diffMs = logTime.getTime() - lastCheckIn.getTime();
          const hours = diffMs / (1000 * 60 * 60);

          if (hours > 0 && hours < 24) {
            // max 8 regular hours per check-in session, rest is overtime
            if (hours <= 8) {
              regularHoursTotal += hours;
            } else {
              regularHoursTotal += 8;
              overtimeHoursTotal += (hours - 8);
            }
          }
          lastCheckIn = null; // Reset pairing
        }
      }

      // If they had no logs but had shifts, we can default to 0 hours
      // Determine hourly rate
      const rate = ROLE_HOURLY_RATES[emp.role] || 15;
      
      // Compute gross pay: regular hours * rate + overtime hours * rate * 1.5
      const grossPay = (regularHoursTotal * rate) + (overtimeHoursTotal * rate * 1.5);
      
      // Deduct 10% for taxes and contributions
      const deductions = grossPay * 0.1;
      const netPay = grossPay - deductions;

      // Round to 2 decimal places
      const finalRegHours = Math.round(regularHoursTotal * 100) / 100;
      const finalOtHours = Math.round(overtimeHoursTotal * 100) / 100;
      const finalGross = Math.round(grossPay * 100) / 100;
      const finalDeductions = Math.round(deductions * 100) / 100;
      const finalNet = Math.round(netPay * 100) / 100;

      // 3. Insert or Update in payroll_ledgers
      // Check if entry exists for this employee and period
      const existingRes = await db.query(
        `SELECT id FROM payroll_ledgers
         WHERE employee_id = $1 AND period_start = $2 AND period_end = $3`,
        [emp.id, period_start, period_end]
      );

      if (existingRes.rows.length > 0) {
        // Update
        const ledgerId = existingRes.rows[0].id;
        await db.query(
          `UPDATE payroll_ledgers
           SET regular_hours = $1, overtime_hours = $2, gross_pay = $3, deductions = $4, net_pay = $5, status = 'Draft'
           WHERE id = $6`,
          [finalRegHours, finalOtHours, finalGross, finalDeductions, finalNet, ledgerId]
        );
      } else {
        // Insert
        await db.query(
          `INSERT INTO payroll_ledgers (employee_id, period_start, period_end, regular_hours, overtime_hours, gross_pay, deductions, net_pay, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Draft')`,
          [emp.id, period_start, period_end, finalRegHours, finalOtHours, finalGross, finalDeductions, finalNet]
        );
      }

      payrollResults.push({
        employee_id: emp.id,
        employee_name: emp.name,
        role: emp.role,
        regular_hours: finalRegHours,
        overtime_hours: finalOtHours,
        gross_pay: finalGross,
        deductions: finalDeductions,
        net_pay: finalNet,
      });
    }

    return NextResponse.json({ success: true, message: 'Payroll computed successfully!', results: payrollResults });
  } catch (error: any) {
    console.error('Failed to compute payroll:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
