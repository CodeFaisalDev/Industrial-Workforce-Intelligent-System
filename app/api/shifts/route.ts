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

    let queryStr = `
      SELECT s.*, e.name as employee_name, e.role as employee_role, d.name as department_name
      FROM shifts s
      JOIN employees e ON s.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
    `;
    const params: any[] = [];

    if (role === 'Floor Manager') {
      queryStr += `
        INNER JOIN manager_worker_access mwa ON e.id = mwa.worker_id
        WHERE mwa.manager_id = $1
      `;
      params.push(userId);
    } else if (role === 'Worker') {
      queryStr += `
        WHERE e.id = $1
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
    const body = await request.json();
    const { employee_id, date, start_time, end_time, status } = body;

    if (!employee_id || !date || !start_time || !end_time) {
      return NextResponse.json(
        { success: false, error: 'employee_id, date, start_time, and end_time are required.' },
        { status: 400 }
      );
    }

    // Insert shift
    await db.query(
      `INSERT INTO shifts (employee_id, date, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [employee_id, date, start_time, end_time, status || 'Scheduled']
    );

    return NextResponse.json({ success: true, message: 'Shift assigned successfully!' });
  } catch (error: any) {
    console.error('Failed to create shift:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
