import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
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

    // 1. Get employees joined with department details, dynamically restricted by role permissions
    let empQuery = `
      SELECT e.id, e.name, e.email, e.role, e.department_id, e.status, d.name as department_name,
             EXISTS(SELECT 1 FROM face_embeddings f WHERE f.employee_id = e.id AND f.is_active = true) as face_enrolled
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
    `;
    const params: any[] = [];

    if (role === 'Floor Manager') {
      empQuery += `
        INNER JOIN manager_worker_access mwa ON e.id = mwa.worker_id
        WHERE mwa.manager_id = $1
      `;
      params.push(userId);
    } else if (role === 'Worker') {
      empQuery += `
        WHERE e.id = $1
      `;
      params.push(userId);
    }

    empQuery += ` ORDER BY e.name ASC`;
    const empResult = await db.query(empQuery, params);

    // 2. Get all departments
    const deptResult = await db.query(`
      SELECT id, name FROM departments ORDER BY name ASC
    `);

    return NextResponse.json({
      success: true,
      employees: empResult.rows,
      departments: deptResult.rows,
    });
  } catch (error: any) {
    console.error('Failed to fetch employees and departments:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, department_id, password } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and Email are required.' }, { status: 400 });
    }

    const rawPassword = password || 'worker123';
    const hashedPassword = bcrypt.hashSync(rawPassword, 10);

    await db.query(
      `INSERT INTO employees (name, email, role, department_id, status, password)
       VALUES ($1, $2, $3, $4, 'Active', $5)`,
      [name, email, role || 'Worker', department_id || null, hashedPassword]
    );

    return NextResponse.json({ success: true, message: 'Employee profile created successfully!' });
  } catch (error: any) {
    console.error('Failed to create employee:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { employee_id, embedding } = body; // embedding is a number[] of length 128

    if (!employee_id || !embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { success: false, error: 'employee_id and embedding array are required.' },
        { status: 400 }
      );
    }

    console.log(`Writing face embedding for employee ${employee_id} to pgvector database...`);

    // Format array of numbers as a string vector representation e.g. '[0.1,0.2,-0.12,...]'
    const vectorString = `[${embedding.join(',')}]`;

    // Disable previous face embeddings for this employee
    await db.query(`UPDATE face_embeddings SET is_active = false WHERE employee_id = $1`, [employee_id]);

    // Insert new active face embedding
    await db.query(
      `INSERT INTO face_embeddings (employee_id, embedding, is_active)
       VALUES ($1, $2, true)`,
      [employee_id, vectorString]
    );

    return NextResponse.json({ success: true, message: 'Facial biometrics locked successfully!' });
  } catch (error: any) {
    console.error('Failed to enroll face embedding:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
