import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    let query = `SELECT * FROM shift_swaps`;
    const params: any[] = [];

    if (employeeId) {
      query += ` WHERE employee_id = $1`;
      params.push(employeeId);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await db.query(query, params);
    return NextResponse.json({ success: true, swaps: result.rows });
  } catch (error: any) {
    console.error('Failed to get shift swaps:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employee_id, employee_name, date, shift, reason } = body;

    if (!employee_id || !employee_name || !date || !shift || !reason) {
      return NextResponse.json(
        { success: false, error: 'employee_id, employee_name, date, shift, and reason are required.' },
        { status: 400 }
      );
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
    const body = await request.json();
    const { swap_id, status } = body;

    if (!swap_id || !status) {
      return NextResponse.json({ success: false, error: 'swap_id and status are required.' }, { status: 400 });
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
