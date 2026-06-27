import { db } from './db';
import bcrypt from 'bcryptjs';

export async function initDatabase() {
  console.log('Starting database initialization...');

  // 1. Enable extensions
  await db.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
  await db.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
  console.log('Extensions "vector" and "pg_trgm" verified/enabled.');

  // 2. Create tables
  // Departments
  await db.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      manager_id INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Employees
  await db.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      role VARCHAR(50) NOT NULL DEFAULT 'Worker', -- 'HR Admin', 'Floor Manager', 'Worker'
      department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'Inactive'
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure password column exists if table was already created
  await db.query(`
    ALTER TABLE employees ADD COLUMN IF NOT EXISTS password VARCHAR(255);
  `);

  // Update departments table manager foreign key if needed (done after employee table exists)
  // We make it nullable so it doesn't cause circular dependency issues during table creation

  // Shifts
  await db.query(`
    CREATE TABLE IF NOT EXISTS shifts (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'Absent', 'Standby'
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Biometric Logs (Attendance logs)
  await db.query(`
    CREATE TABLE IF NOT EXISTS biometric_logs (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
      log_type VARCHAR(50) NOT NULL, -- 'Check_In', 'Check_Out'
      device_id VARCHAR(255) NOT NULL,
      verified_by_face BOOLEAN DEFAULT FALSE,
      gps_lat DOUBLE PRECISION,
      gps_lng DOUBLE PRECISION,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Payroll Ledgers
  await db.query(`
    CREATE TABLE IF NOT EXISTS payroll_ledgers (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      regular_hours DOUBLE PRECISION NOT NULL DEFAULT 0,
      overtime_hours DOUBLE PRECISION NOT NULL DEFAULT 0,
      gross_pay DOUBLE PRECISION NOT NULL DEFAULT 0,
      deductions DOUBLE PRECISION NOT NULL DEFAULT 0,
      net_pay DOUBLE PRECISION NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'Draft', -- 'Draft', 'Approved', 'Paid'
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Face Embeddings
  await db.query(`
    CREATE TABLE IF NOT EXISTS face_embeddings (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      embedding vector(128) NOT NULL,
      enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT TRUE
    );
  `);

  // Recognition Attempts
  await db.query(`
    CREATE TABLE IF NOT EXISTS recognition_attempts (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
      confidence_score DOUBLE PRECISION NOT NULL,
      matched BOOLEAN NOT NULL,
      device_type VARCHAR(50) NOT NULL, -- 'Kiosk', 'Mobile'
      gps_lat DOUBLE PRECISION,
      gps_lng DOUBLE PRECISION,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Staffing Forecasts
  await db.query(`
    CREATE TABLE IF NOT EXISTS staffing_forecasts (
      id SERIAL PRIMARY KEY,
      department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
      shift_date DATE NOT NULL,
      predicted_headcount INTEGER NOT NULL,
      confidence_band VARCHAR(50) NOT NULL, -- 'High', 'Medium', 'Low'
      ai_briefing_text TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Performance Scores
  await db.query(`
    CREATE TABLE IF NOT EXISTS performance_scores (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      period VARCHAR(50) NOT NULL, -- e.g., '2026-06'
      punctuality_score DOUBLE PRECISION NOT NULL,
      overtime_trend DOUBLE PRECISION NOT NULL,
      adherence_score DOUBLE PRECISION NOT NULL,
      composite_score DOUBLE PRECISION NOT NULL,
      ai_summary_text TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Fraud Flags
  await db.query(`
    CREATE TABLE IF NOT EXISTS fraud_flags (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
      flag_type VARCHAR(50) NOT NULL, -- 'ghost_punch', 'buddy_punch', 'geofence', 'overtime_outlier'
      raised_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Reviewed', 'Dismissed', 'Confirmed'
      ai_digest_text TEXT,
      resolved_by INTEGER REFERENCES employees(id),
      details TEXT
    );
  `);

  // Chatbot Knowledge Base
  await db.query(`
    CREATE TABLE IF NOT EXISTS chatbot_knowledge_base (
      id SERIAL PRIMARY KEY,
      chunk_text TEXT NOT NULL,
      source_doc VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Chatbot Conversations
  await db.query(`
    CREATE TABLE IF NOT EXISTS chatbot_conversations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
      message TEXT NOT NULL,
      role VARCHAR(50) NOT NULL, -- 'user', 'assistant'
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Shift Swaps Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS shift_swaps (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      employee_name VARCHAR(255) NOT NULL,
      date VARCHAR(100) NOT NULL,
      shift VARCHAR(100) NOT NULL,
      reason TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Manager Worker Access Table (defines manager access override)
  await db.query(`
    CREATE TABLE IF NOT EXISTS manager_worker_access (
      id SERIAL PRIMARY KEY,
      manager_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      worker_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
      UNIQUE(manager_id, worker_id)
    );
  `);

  console.log('All database tables verified/created.');

  // 3. Seed initial mock data if tables are empty
  const deptCount = await db.query('SELECT COUNT(*) FROM departments');
  if (parseInt(deptCount.rows[0].count, 10) === 0) {
    console.log('Seeding initial departments...');
    const depts = [
      ['Assembly Line 1', null],
      ['Packaging & Sorting', null],
      ['Quality Assurance', null],
      ['Maintenance & Logistics', null],
    ];
    for (const [name] of depts) {
      await db.query('INSERT INTO departments (name) VALUES ($1)', [name]);
    }
  }

  const empCount = await db.query('SELECT COUNT(*) FROM employees');
  const kafiHash = bcrypt.hashSync('admin123', 10);
  const managerHash = bcrypt.hashSync('manager123', 10);
  const workerHash = bcrypt.hashSync('worker123', 10);

  if (parseInt(empCount.rows[0].count, 10) === 0) {
    console.log('Seeding initial admin employee...');
    await db.query(
      'INSERT INTO employees (name, email, role, department_id, status, password) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Prithula', 'admin@gmail.com', 'HR Admin', null, 'Active', kafiHash]
    );
  } else {
    // Update emails and passwords for existing employees to ensure they match request
    console.log('Updating emails and passwords for existing admin in init-db.ts...');
    await db.query(`
      UPDATE employees SET name = 'Prithula', email = 'admin@gmail.com', password = $1 WHERE role = 'HR Admin';
    `, [kafiHash]);
  }

  const kbCount = await db.query('SELECT COUNT(*) FROM chatbot_knowledge_base');
  if (parseInt(kbCount.rows[0].count, 10) === 0) {
    console.log('Seeding initial chatbot knowledge base policies...');
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
        'Face recognition is mandatory for attendance check-ins. If recognition fails, workers must report to the Floor Manager (Nazmul Hasan) or HR Admin (Prithula) for manual override.',
        'attendance_policy.pdf',
      ],
    ];

    for (const [text, doc] of policies) {
      await db.query(
        'INSERT INTO chatbot_knowledge_base (chunk_text, source_doc) VALUES ($1, $2)',
        [text, doc]
      );
    }
  }

  // Seed mock shifts for today and past few days to have analytics data
  const shiftCount = await db.query('SELECT COUNT(*) FROM shifts');
  if (parseInt(shiftCount.rows[0].count, 10) === 0) {
    console.log('Seeding mock shifts...');
    const faria = await db.query("SELECT id FROM employees WHERE email = 'faria@factory.com'");
    const abir = await db.query("SELECT id FROM employees WHERE email = 'abir@factory.com'");
    const sadia = await db.query("SELECT id FROM employees WHERE email = 'sadia@factory.com'");
    const robi = await db.query("SELECT id FROM employees WHERE email = 'robi@factory.com'");

    const ids = [faria.rows[0].id, abir.rows[0].id, sadia.rows[0].id, robi.rows[0].id];
    
    // Seed shifts for last 7 days and next 2 days
    const today = new Date();
    for (let i = -7; i <= 2; i++) {
      const shiftDate = new Date(today);
      shiftDate.setDate(today.getDate() + i);
      const dateStr = shiftDate.toISOString().split('T')[0];

      for (const employeeId of ids) {
        // Randomize status: 90% Scheduled/Completed, 10% Absent
        const isAbsent = Math.random() < 0.1;
        const status = i < 0 ? (isAbsent ? 'Absent' : 'Completed') : 'Scheduled';
        
        await db.query(
          'INSERT INTO shifts (employee_id, date, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5)',
          [employeeId, dateStr, '08:00:00', '16:00:00', status]
        );

        // For past completed shifts, seed biometric logs to compute payroll/fraud
        if (status === 'Completed' && i < 0) {
          const checkInTime = new Date(shiftDate);
          checkInTime.setHours(8, Math.floor(Math.random() * 15) - 5, 0); // checked in around 8:00 AM (-5 to +10 mins)

          const checkOutTime = new Date(shiftDate);
          // Let's add some overtime to Faria occasionally
          const overtimeHours = (employeeId === faria.rows[0].id && Math.random() < 0.4) ? 2 : 0;
          checkOutTime.setHours(16 + overtimeHours, Math.floor(Math.random() * 10), 0);

          await db.query(
            'INSERT INTO biometric_logs (employee_id, timestamp, log_type, device_id, verified_by_face, gps_lat, gps_lng) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [employeeId, checkInTime.toISOString(), 'Check_In', 'kiosk_main', true, 23.81031, 90.41252]
          );

          await db.query(
            'INSERT INTO biometric_logs (employee_id, timestamp, log_type, device_id, verified_by_face, gps_lat, gps_lng) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [employeeId, checkOutTime.toISOString(), 'Check_Out', 'kiosk_main', true, 23.81032, 90.41251]
          );
        }
      }
    }
  }

  // Seed initial face embeddings if empty
  const faceCount = await db.query('SELECT COUNT(*) FROM face_embeddings');
  if (parseInt(faceCount.rows[0].count, 10) === 0) {
    console.log('Seeding initial face embeddings...');
    const mockVector = '[' + Array(128).fill(0.1).join(',') + ']';
    const emps = await db.query("SELECT id FROM employees WHERE role IN ('HR Admin', 'Worker')");
    for (const row of emps.rows) {
      await db.query(
        'INSERT INTO face_embeddings (employee_id, embedding, is_active) VALUES ($1, $2, true)',
        [row.id, mockVector]
      );
    }
  }

  // Seed shift swap requests if empty
  const swapCount = await db.query('SELECT COUNT(*) FROM shift_swaps');
  if (parseInt(swapCount.rows[0].count, 10) === 0) {
    console.log('Seeding initial shift swap request...');
    const faria = await db.query("SELECT id FROM employees WHERE email = 'worker@gmail.com'");
    if (faria.rows.length > 0) {
      await db.query(`
        INSERT INTO shift_swaps (employee_id, employee_name, date, shift, reason, status)
        VALUES ($1, 'Faria Sultana', 'Tomorrow', 'Day Shift', 'Family engagement', 'Pending')
      `, [faria.rows[0].id]);
    }
  }
  // Seed manager-worker access mappings if empty
  const accessCount = await db.query('SELECT COUNT(*) FROM manager_worker_access');
  if (parseInt(accessCount.rows[0].count, 10) === 0) {
    console.log('Seeding initial manager-worker access mappings...');
    const manager = await db.query("SELECT id FROM employees WHERE email = 'manager@gmail.com'");
    if (manager.rows.length > 0) {
      const workers = await db.query("SELECT id FROM employees WHERE role = 'Worker'");
      for (const w of workers.rows) {
        await db.query(`
          INSERT INTO manager_worker_access (manager_id, worker_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [manager.rows[0].id, w.id]);
      }
    }
  }

  console.log('Database initialization and seeding completed successfully!');
}
export default initDatabase;
