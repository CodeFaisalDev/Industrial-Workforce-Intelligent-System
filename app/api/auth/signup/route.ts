import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  let client;
  try {
    const body = await request.json();
    const { company_name, admin_name, admin_email, admin_password } = body;

    if (!company_name || !admin_name || !admin_email || !admin_password) {
      return NextResponse.json(
        { success: false, error: 'All fields (company_name, admin_name, admin_email, admin_password) are required.' },
        { status: 400 }
      );
    }

    const emailClean = admin_email.toLowerCase().trim();
    const companyClean = company_name.trim();

    // 1. Validate company name uniqueness
    const companyCheck = await db.query('SELECT id FROM companies WHERE LOWER(name) = LOWER($1)', [companyClean]);
    if (companyCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'A company with this name is already registered.' },
        { status: 400 }
      );
    }

    // 2. Validate email uniqueness
    const emailCheck = await db.query('SELECT id FROM employees WHERE LOWER(email) = LOWER($1)', [emailClean]);
    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    // 3. Acquire pg-pool client for transaction safety
    client = await db.getPool().connect();
    await client.query('BEGIN');

    // Insert Company
    const companyInsert = await client.query(
      'INSERT INTO companies (name) VALUES ($1) RETURNING id',
      [companyClean]
    );
    const companyId = companyInsert.rows[0].id;

    // Hash Password
    const passwordHash = bcrypt.hashSync(admin_password, 10);

    // Insert HR Admin Employee linked to Company
    await client.query(
      `INSERT INTO employees (name, email, password, role, company_id, status)
       VALUES ($1, $2, $3, 'HR Admin', $4, 'Active')`,
      [admin_name.trim(), emailClean, passwordHash, companyId]
    );

    // Insert default Department
    await client.query(
      `INSERT INTO departments (name, company_id)
       VALUES ($1, $2)`,
      ['Main Assembly Line', companyId]
    );

    // Seed default knowledge base policies for RAG chatbot
    const policies = [
      [
        'Overtime is calculated at 1.5x of the regular hourly rate for hours worked beyond 8 hours a day. Weekend/holiday shifts are computed at 2.0x of the regular hourly rate.',
        'payroll_policy.pdf',
      ],
      [
        'Employees get 15 days of paid annual leave. Sick leave requires medical documentation if it exceeds 2 days. Casual leaves must be requested 3 days in advance.',
        'leave_policy.pdf',
      ],
      [
        'Regular shift timing: Day Shift starts at 8:00 AM and ends at 4:00 PM. Night Shift starts at 8:00 PM and ends at 4:00 AM. Shift schedules are finalized every Sunday.',
        'schedule_policy.pdf',
      ],
      [
        'Factory location geofencing is enabled. Check-ins must occur within 100 meters of the main factory gate (Latitude: 23.8103, Longitude: 90.4125). Punch-ins outside this zone are flagged as geofence violations.',
        'security_policy.pdf',
      ],
      [
        'Face recognition is mandatory for attendance check-ins. If recognition fails, workers must report to the Floor Manager or HR Admin for manual override.',
        'attendance_policy.pdf',
      ],
    ];

    for (const [text, doc] of policies) {
      await client.query(
        'INSERT INTO chatbot_knowledge_base (chunk_text, source_doc, company_id) VALUES ($1, $2, $3)',
        [text, doc, companyId]
      );
    }

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      message: 'Company registered successfully! You can now log in.',
    });
  } catch (error: any) {
    console.error('Failed company signup:', error);
    if (client) {
      try {
        await client.query('ROLLBACK');
        client.release();
      } catch (rollbackErr) {
        console.error('Failed to rollback signup transaction:', rollbackErr);
      }
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
