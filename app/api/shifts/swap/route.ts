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
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    let query = `
      SELECT s.* 
      FROM shift_swaps s
      JOIN employees e ON s.employee_id = e.id
      WHERE e.company_id = $1
    `;
    const params: any[] = [companyId];

    if (employeeId) {
      query += ` AND s.employee_id = $2`;
      params.push(employeeId);
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
    const body = await request.json();
    const { employee_id, employee_name, date, shift, reason } = body;

    if (!employee_id || !employee_name || !date || !shift || !reason) {
      return NextResponse.json(
        { success: false, error: 'employee_id, employee_name, date, shift, and reason are required.' },
        { status: 400 }
      );
    }

    // Verify employee belongs to the same company
    const empCheck = await db.query('SELECT company_id FROM employees WHERE id = $1', [employee_id]);
    if (empCheck.rows.length === 0 || empCheck.rows[0].company_id !== companyId) {
      return NextResponse.json({ success: false, error: 'Access denied: employee not in your company.' }, { status: 403 });
    }

    const result = await db.query(
      `INSERT INTO shift_swaps (employee_id, employee_name, date, shift, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending')
       RETURNING id`,
      [employee_id, employee_name, date, shift, reason]
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

    const companyId = (session.user as any).company_id;
    const body = await request.json();
    const { swap_id, status } = body;

    if (!swap_id || !status) {
      return NextResponse.json({ success: false, error: 'swap_id and status are required.' }, { status: 400 });
    }

    // Verify swap belongs to this company
    const swapCheck = await db.query(
      `SELECT s.id 
       FROM shift_swaps s
       JOIN employees e ON s.employee_id = e.id
       WHERE s.id = $1 AND e.company_id = $2`,
      [swap_id, companyId]
    );

    if (swapCheck.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Access denied: swap request not found in your company.' }, { status: 403 });
    }

    await db.query(
      `UPDATE shift_swaps
       SET status = $1
       WHERE id = $2`,
      [status, swap_id]
    );

    return NextResponse.json({ success: true, message: 'Shift swap status updated successfully!' });
  } catch (error: any) {
    console.error('Failed to update shift swap:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
