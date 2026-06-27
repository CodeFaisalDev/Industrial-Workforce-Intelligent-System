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

    const { searchParams } = new URL(request.url);
    const managerId = searchParams.get('manager_id');

    if (!managerId) {
      return NextResponse.json({ success: false, error: 'manager_id is required' }, { status: 400 });
    }

    const result = await db.query(
      'SELECT worker_id FROM manager_worker_access WHERE manager_id = $1',
      [parseInt(managerId)]
    );

    const workerIds = result.rows.map((row: any) => row.worker_id);

    return NextResponse.json({ success: true, worker_ids: workerIds });
  } catch (error: any) {
    console.error('Failed to get manager worker access:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'HR Admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only HR Admin can modify access.' }, { status: 401 });
    }

    const body = await request.json();
    const { manager_id, worker_ids } = body;

    if (!manager_id || !Array.isArray(worker_ids)) {
      return NextResponse.json({ success: false, error: 'manager_id and worker_ids array are required' }, { status: 400 });
    }

    const managerIdNum = parseInt(manager_id);

    // Delete existing access entries
    await db.query('DELETE FROM manager_worker_access WHERE manager_id = $1', [managerIdNum]);

    // Insert new access entries
    for (const workerId of worker_ids) {
      await db.query(
        'INSERT INTO manager_worker_access (manager_id, worker_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [managerIdNum, parseInt(workerId)]
      );
    }

    return NextResponse.json({ success: true, message: 'Manager worker access saved successfully!' });
  } catch (error: any) {
    console.error('Failed to set manager worker access:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
