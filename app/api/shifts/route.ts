import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    const companyId = (session.user as any).company_id;

    let queryStr = `
      SELECT s.*, e.name as employee_name, e.role as employee_role, d.name as department_name
      FROM shifts s
      JOIN employees e ON s.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.company_id = $1
    `;
    const params: any[] = [companyId];

    if (role === 'Floor Manager') {
      queryStr += `
        AND (e.id IN (SELECT worker_id FROM manager_worker_access WHERE manager_id = $2) OR e.id = $2)
      `;
      params.push(userId);
    } else if (role === 'Worker') {
      queryStr += `
        AND e.id = $2
      `;
      params.push(userId);
    }

    queryStr += `
      ORDER BY s.date DESC, s.start_time ASC
      LIMIT 100
    `;

    const result = await db.query(queryStr, params);
    return NextResponse.json({ success: true, shifts: result.rows });
  } catch (error: any) {
    console.error('Failed to query shifts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt((session.user as any).id, 10);
    const role = (session.user as any).role;
    const companyId = (session.user as any).company_id;

    if (role !== 'HR Admin' && role !== 'Floor Manager') {
      return NextResponse.json({ success: false, error: 'Unauthorized to create or assign shifts.' }, { status: 403 });
    }

    const body = await request.json();
    const { employee_id, date, start_time, end_time, status } = body;

    if (!employee_id || !date || !start_time || !end_time) {
      return NextResponse.json(
        { success: false, error: 'employee_id, date, start_time, and end_time are required.' },
        { status: 400 }
      );
    }

    const targetEmpId = parseInt(employee_id, 10);

    // Verify employee belongs to the same company
    const empCheck = await db.query('SELECT company_id FROM employees WHERE id = $1', [targetEmpId]);
    if (empCheck.rows.length === 0 || empCheck.rows[0].company_id !== companyId) {
      return NextResponse.json({ success: false, error: 'Access denied: employee not in your company.' }, { status: 403 });
    }

    // Floor Manager can only assign shifts to workers in their access list or themselves
    if (role === 'Floor Manager' && targetEmpId !== userId) {
      const accessCheck = await db.query(
        'SELECT 1 FROM manager_worker_access WHERE manager_id = $1 AND worker_id = $2',
        [userId, targetEmpId]
      );
      if (accessCheck.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Access denied: employee not under your management.' }, { status: 403 });
      }
    }

    // Insert shift
    await db.query(
      `INSERT INTO shifts (employee_id, date, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [targetEmpId, date, start_time, end_time, status || 'Scheduled']
    );

    return NextResponse.json({ success: true, message: 'Shift assigned successfully!' });
  } catch (error: any) {
    console.error('Failed to create shift:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
