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
    const companyId = (session.user as any).company_id;

    // 1. Get employees joined with department details, dynamically restricted by role permissions and tenant isolation
    let empQuery = `
      SELECT e.id, e.name, e.email, e.role, e.department_id, e.status, d.name as department_name,
             EXISTS(SELECT 1 FROM face_embeddings f WHERE f.employee_id = e.id AND f.is_active = true) as face_enrolled,
             (SELECT embedding::text FROM face_embeddings f WHERE f.employee_id = e.id AND f.is_active = true LIMIT 1) as face_embedding
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.company_id = $1
    `;
    const params: any[] = [companyId];

    if (role === 'Floor Manager') {
      empQuery += `
        AND (e.id IN (SELECT worker_id FROM manager_worker_access WHERE manager_id = $2) OR e.id = $2)
      `;
      params.push(userId);
    } else if (role === 'Worker') {
      empQuery += `
        AND e.id = $2
      `;
      params.push(userId);
    }

    empQuery += ` ORDER BY e.name ASC`;
    const empResult = await db.query(empQuery, params);

    // 2. Get all departments for this company
    const deptResult = await db.query(
      `SELECT id, name FROM departments WHERE company_id = $1 ORDER BY name ASC`,
      [companyId]
    );

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const sessionRole = (session.user as any).role;
    const sessionUserId = parseInt((session.user as any).id, 10);
    const companyId = (session.user as any).company_id;

    if (sessionRole !== 'HR Admin' && sessionRole !== 'Floor Manager') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Only HR Admins and Floor Managers can register employees.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, role, department_id, password } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and Email are required.' }, { status: 400 });
    }

    // Floor Managers can only register Workers
    const assignedRole = sessionRole === 'Floor Manager' ? 'Worker' : (role || 'Worker');

    const rawPassword = password || 'Worker123@';
    const hashedPassword = bcrypt.hashSync(rawPassword, 10);

    const insertRes = await db.query(
      `INSERT INTO employees (name, email, role, department_id, status, password, company_id)
       VALUES ($1, $2, $3, $4, 'Active', $5, $6)
       RETURNING id`,
      [name.trim(), email.toLowerCase().trim(), assignedRole, department_id || null, hashedPassword, companyId]
    );

    const newEmpId = insertRes.rows[0].id;

    // If registered by Floor Manager, grant access to this manager automatically
    if (sessionRole === 'Floor Manager') {
      await db.query(
        `INSERT INTO manager_worker_access (manager_id, worker_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [sessionUserId, newEmpId]
      );
    }

    return NextResponse.json({ success: true, message: 'Employee profile created successfully!', employee_id: newEmpId });
  } catch (error: any) {
    console.error('Failed to create employee:', error);
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
    const { employee_id, embedding } = body; // embedding is a number[] of length 128

    if (!employee_id || !embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { success: false, error: 'employee_id and embedding array are required.' },
        { status: 400 }
      );
    }

    // Verify employee belongs to the same company
    const empCheck = await db.query('SELECT company_id FROM employees WHERE id = $1', [employee_id]);
    if (empCheck.rows.length === 0 || empCheck.rows[0].company_id !== companyId) {
      return NextResponse.json({ success: false, error: 'Access denied: employee not found in your company.' }, { status: 403 });
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
