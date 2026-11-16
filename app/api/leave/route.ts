import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt((session.user as any).id, 10);
    const role = (session.user as any).role;
    const companyId = (session.user as any).company_id;

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    let query = `
      SELECT l.*, e.name as employee_name, e.email as employee_email, e.role as employee_role, d.name as department_name
      FROM leave_requests l
      JOIN employees e ON l.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.company_id = $1
    `;
    const params: any[] = [companyId];

    if (role === 'Floor Manager') {
      query += ` AND (l.employee_id = $2 OR l.employee_id IN (SELECT worker_id FROM manager_worker_access WHERE manager_id = $2))`;
      params.push(userId);
      if (employeeId) {
        query += ` AND l.employee_id = $3`;
        params.push(parseInt(employeeId, 10));
      }
    } else if (role === 'Worker') {
      query += ` AND l.employee_id = $2`;
      params.push(userId);
    } else {
      // HR Admin
      if (employeeId) {
        query += ` AND l.employee_id = $2`;
        params.push(parseInt(employeeId, 10));
      }
    }

    query += ` ORDER BY l.created_at DESC`;

    const result = await db.query(query, params);
    return NextResponse.json({ success: true, leave_requests: result.rows });
  } catch (error: any) {
    console.error('Failed to get leave requests:', error);
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
    const sessionUserId = parseInt((session.user as any).id, 10);
    const role = (session.user as any).role;
    const body = await request.json();
    const { employee_id, leave_type, start_date, end_date, reason } = body;

    const targetEmpId = employee_id ? parseInt(employee_id, 10) : sessionUserId;

    // Workers can only submit leave requests for themselves
    if (role === 'Worker' && targetEmpId !== sessionUserId) {
      return NextResponse.json(
        { success: false, error: 'Access denied: workers can only file leave requests for themselves.' },
        { status: 403 }
      );
    }

    if (!leave_type || !start_date || !end_date || !reason) {
      return NextResponse.json(
        { success: false, error: 'leave_type, start_date, end_date, and reason are required.' },
        { status: 400 }
      );
    }

    // Verify employee belongs to the same company
    const empCheck = await db.query('SELECT company_id FROM employees WHERE id = $1', [targetEmpId]);
    if (empCheck.rows.length === 0 || empCheck.rows[0].company_id !== companyId) {
      return NextResponse.json({ success: false, error: 'Access denied: employee not in your company.' }, { status: 403 });
    }

    const result = await db.query(
      `INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending')
       RETURNING id`,
      [targetEmpId, leave_type, start_date, end_date, reason]
    );

    return NextResponse.json({
      success: true,
      message: 'Leave request filed successfully!',
      leave_id: result.rows[0].id,
    });
  } catch (error: any) {
    console.error('Failed to submit leave request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    const sessionUserId = parseInt((session.user as any).id, 10);
    if (role !== 'HR Admin' && role !== 'Floor Manager') {
      return NextResponse.json({ success: false, error: 'Unauthorized to approve or reject leave.' }, { status: 403 });
    }

    const companyId = (session.user as any).company_id;
    const body = await request.json();
    const { leave_id, status } = body;

    if (!leave_id || !status || (status !== 'Approved' && status !== 'Rejected')) {
      return NextResponse.json({ success: false, error: 'leave_id and valid status (Approved or Rejected) are required.' }, { status: 400 });
    }

    // Verify leave request belongs to an employee in this company and within manager access scope
    let checkQuery = `
      SELECT l.id, l.employee_id, l.start_date, l.end_date
      FROM leave_requests l
      JOIN employees e ON l.employee_id = e.id
      WHERE l.id = $1 AND e.company_id = $2
    `;
    const checkParams: any[] = [leave_id, companyId];

    if (role === 'Floor Manager') {
      checkQuery += ` AND (l.employee_id = $3 OR l.employee_id IN (SELECT worker_id FROM manager_worker_access WHERE manager_id = $3))`;
      checkParams.push(sessionUserId);
    }

    const checkRes = await db.query(checkQuery, checkParams);

    if (checkRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Access denied: request not found in your managed group.' }, { status: 403 });
    }

    await db.query(
      `UPDATE leave_requests SET status = $1 WHERE id = $2`,
      [status, leave_id]
    );

    // If approved, update overlapping scheduled shifts to 'Standby' so rosters & attendance reflect approved leave
    if (status === 'Approved') {
      const leaveRecord = checkRes.rows[0];
      await db.query(
        `UPDATE shifts SET status = 'Standby'
         WHERE employee_id = $1 AND date >= $2 AND date <= $3 AND status = 'Scheduled'`,
        [leaveRecord.employee_id, leaveRecord.start_date, leaveRecord.end_date]
      );
    }

    return NextResponse.json({ success: true, message: `Leave request ${status.toLowerCase()} successfully!` });
  } catch (error: any) {
    console.error('Failed to update leave request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
