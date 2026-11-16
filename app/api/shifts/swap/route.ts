import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).company_id;
    const sessionRole = (session.user as any).role;
    const sessionUserId = parseInt((session.user as any).id, 10);

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    let query = `
      SELECT s.* 
      FROM shift_swaps s
      JOIN employees e ON s.employee_id = e.id
      WHERE e.company_id = $1
    `;
    const params: any[] = [companyId];

    if (sessionRole === 'Worker') {
      // Workers can only view their own swap requests
      query += ` AND s.employee_id = $2`;
      params.push(sessionUserId);
    } else if (sessionRole === 'Floor Manager') {
      // Floor Managers can view swaps for workers in their oversight group or their own
      query += ` AND (s.employee_id = $2 OR s.employee_id IN (SELECT worker_id FROM manager_worker_access WHERE manager_id = $2))`;
      params.push(sessionUserId);
      if (employeeId) {
        query += ` AND s.employee_id = $3`;
        params.push(parseInt(employeeId, 10));
      }
    } else {
      // HR Admin
      if (employeeId) {
        query += ` AND s.employee_id = $2`;
        params.push(parseInt(employeeId, 10));
      }
    }

    query += ` ORDER BY s.created_at DESC`;

    const result = await db.query(query, params);
    return NextResponse.json({ success: true, swaps: result.rows });
  } catch (error: any) {
    console.error('Failed to get shift swaps:', error);
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
    const sessionRole = (session.user as any).role;
    const sessionUserId = parseInt((session.user as any).id, 10);

    const body = await request.json();
    const { employee_id, employee_name, date, shift, reason } = body;

    if (!employee_id || !employee_name || !date || !shift || !reason) {
      return NextResponse.json(
        { success: false, error: 'employee_id, employee_name, date, shift, and reason are required.' },
        { status: 400 }
      );
    }

    const targetEmpId = parseInt(employee_id, 10);

    // Workers cannot request swaps on behalf of other employees
    if (sessionRole === 'Worker' && targetEmpId !== sessionUserId) {
      return NextResponse.json(
        { success: false, error: 'Access denied: You can only submit shift swap requests for yourself.' },
        { status: 403 }
      );
    }

    // Verify employee belongs to the same company
    const empCheck = await db.query('SELECT company_id FROM employees WHERE id = $1', [targetEmpId]);
    if (empCheck.rows.length === 0 || empCheck.rows[0].company_id !== companyId) {
      return NextResponse.json({ success: false, error: 'Access denied: employee not in your company.' }, { status: 403 });
    }

    const result = await db.query(
      `INSERT INTO shift_swaps (employee_id, employee_name, date, shift, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending')
       RETURNING id`,
      [targetEmpId, employee_name, date, shift, reason]
    );

    return NextResponse.json({ success: true, message: 'Shift swap request submitted!', swap_id: result.rows[0].id });
  } catch (error: any) {
    console.error('Failed to submit shift swap:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const sessionUserId = parseInt((session.user as any).id, 10);
    const companyId = (session.user as any).company_id;

    const body = await request.json();
    const { swap_id, status } = body;

    if (!swap_id || !status) {
      return NextResponse.json({ success: false, error: 'swap_id and status are required.' }, { status: 400 });
    }

    // Role check: Only Floor Manager and HR Admin can approve or reject swaps
    if (status === 'Approved' || status === 'Rejected') {
      if (userRole !== 'Floor Manager' && userRole !== 'HR Admin') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Only Floor Managers and HR Admins can authorize or reject shift swaps.' },
          { status: 403 }
        );
      }
    }

    // Verify swap belongs to this company and fetch details
    const swapCheck = await db.query(
      `SELECT s.id, s.employee_id, s.date, s.shift, s.status, e.company_id
       FROM shift_swaps s
       JOIN employees e ON s.employee_id = e.id
       WHERE s.id = $1 AND e.company_id = $2`,
      [swap_id, companyId]
    );

    if (swapCheck.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Access denied: swap request not found in your company.' }, { status: 403 });
    }

    const swapRecord = swapCheck.rows[0];

    // If Worker is cancelling, verify ownership
    if (userRole === 'Worker') {
      if (status !== 'Cancelled' || swapRecord.employee_id !== sessionUserId) {
        return NextResponse.json({ success: false, error: 'Access denied: Workers can only cancel their own pending requests.' }, { status: 403 });
      }
    }

    // Update the swap request status
    await db.query(
      `UPDATE shift_swaps
       SET status = $1
       WHERE id = $2`,
      [status, swap_id]
    );

    // If approved, reflect the schedule adjustment in the shifts table
    if (status === 'Approved') {
      // Find shift matching employee and date (handling date string formats)
      const cleanDate = swapRecord.date.split('T')[0];
      await db.query(
        `UPDATE shifts
         SET status = 'Standby'
         WHERE employee_id = $1 AND (date::text LIKE $2 OR date::text = $3)`,
        [swapRecord.employee_id, `%${cleanDate}%`, cleanDate]
      );
    }

    return NextResponse.json({ success: true, message: `Shift swap ${status.toLowerCase()} successfully!` });
  } catch (error: any) {
    console.error('Failed to update shift swap:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
