const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (key === 'DATABASE_URL') databaseUrl = value;
    }
  });
}

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined in env or .env.local');
  process.exit(1);
}

console.log('Connecting to Neon PostgreSQL database...');
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Connected. Enabling pgvector and pg_trgm extensions...');
    await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
    await client.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    console.log('Creating database tables...');

    // Departments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        manager_id INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Employees Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'Worker',
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Shifts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS shifts (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Biometric Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS biometric_logs (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        log_type VARCHAR(50) NOT NULL,
        device_id VARCHAR(255) NOT NULL,
        verified_by_face BOOLEAN DEFAULT FALSE,
        gps_lat DOUBLE PRECISION,
        gps_lng DOUBLE PRECISION,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Payroll Ledgers Table
    await client.query(`
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
        status VARCHAR(50) NOT NULL DEFAULT 'Draft',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Face Embeddings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS face_embeddings (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        embedding vector(128) NOT NULL,
        enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Recognition Attempts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS recognition_attempts (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
        confidence_score DOUBLE PRECISION NOT NULL,
        matched BOOLEAN NOT NULL,
        device_type VARCHAR(50) NOT NULL,
        gps_lat DOUBLE PRECISION,
        gps_lng DOUBLE PRECISION,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Staffing Forecasts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS staffing_forecasts (
        id SERIAL PRIMARY KEY,
        department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
        shift_date DATE NOT NULL,
        predicted_headcount INTEGER NOT NULL,
        confidence_band VARCHAR(50) NOT NULL,
        ai_briefing_text TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Performance Scores Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS performance_scores (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        period VARCHAR(50) NOT NULL,
        punctuality_score DOUBLE PRECISION NOT NULL,
        overtime_trend DOUBLE PRECISION NOT NULL,
        adherence_score DOUBLE PRECISION NOT NULL,
        composite_score DOUBLE PRECISION NOT NULL,
        ai_summary_text TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Fraud Flags Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fraud_flags (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
        flag_type VARCHAR(50) NOT NULL,
        raised_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        ai_digest_text TEXT,
        resolved_by INTEGER REFERENCES employees(id),
        details TEXT
      );
    `);

    // Chatbot Knowledge Base Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chatbot_knowledge_base (
        id SERIAL PRIMARY KEY,
        chunk_text TEXT NOT NULL,
        source_doc VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Chatbot Conversations Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chatbot_conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
        message TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created. Checking and seeding initial data...');

    // Seed Departments
    const deptCount = await client.query('SELECT COUNT(*) FROM departments');
    if (parseInt(deptCount.rows[0].count, 10) === 0) {
      console.log('Seeding departments...');
      await client.query("INSERT INTO departments (name) VALUES ('Assembly Line 1'), ('Packaging & Sorting'), ('Quality Assurance'), ('Maintenance & Logistics')");
    }

    // Seed Employees
    const empCount = await client.query('SELECT COUNT(*) FROM employees');
    if (parseInt(empCount.rows[0].count, 10) === 0) {
      console.log('Seeding employees...');
      const assemblyDept = await client.query("SELECT id FROM departments WHERE name = 'Assembly Line 1'");
      const packagingDept = await client.query("SELECT id FROM departments WHERE name = 'Packaging & Sorting'");
      const qaDept = await client.query("SELECT id FROM departments WHERE name = 'Quality Assurance'");
      const maintenanceDept = await client.query("SELECT id FROM departments WHERE name = 'Maintenance & Logistics'");

      const employees = [
        ['Kafi Ahmed', 'kafi@factory.com', 'HR Admin', null],
        ['Nazmul Hasan', 'nazmul@factory.com', 'Floor Manager', assemblyDept.rows[0].id],
        ['Faria Sultana', 'faria@factory.com', 'Worker', assemblyDept.rows[0].id],
        ['Abir Rahman', 'abir@factory.com', 'Worker', packagingDept.rows[0].id],
        ['Sadia Jahan', 'sadia@factory.com', 'Worker', qaDept.rows[0].id],
        ['Robiul Islam', 'robi@factory.com', 'Worker', maintenanceDept.rows[0].id],
      ];

      for (const [name, email, role, deptId] of employees) {
        await client.query(
          'INSERT INTO employees (name, email, role, department_id, status) VALUES ($1, $2, $3, $4, $5)',
          [name, email, role, deptId, 'Active']
        );
      }
    }

    // Seed Policies
    const kbCount = await client.query('SELECT COUNT(*) FROM chatbot_knowledge_base');
    if (parseInt(kbCount.rows[0].count, 10) === 0) {
      console.log('Seeding chatbot knowledge base policies...');
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
          'Face recognition is mandatory for attendance check-ins. If recognition fails, workers must report to the Floor Manager (Nazmul Hasan) or HR Admin (Kafi Ahmed) for manual override.',
          'attendance_policy.pdf',
        ],
      ];

      for (const [text, doc] of policies) {
        await client.query(
          'INSERT INTO chatbot_knowledge_base (chunk_text, source_doc) VALUES ($1, $2)',
          [text, doc]
        );
      }
    }

    // Seed Shifts and Biometric logs
    const shiftCount = await client.query('SELECT COUNT(*) FROM shifts');
    if (parseInt(shiftCount.rows[0].count, 10) === 0) {
      console.log('Seeding shifts and biometric logs...');
      const faria = await client.query("SELECT id FROM employees WHERE email = 'faria@factory.com'");
      const abir = await client.query("SELECT id FROM employees WHERE email = 'abir@factory.com'");
      const sadia = await client.query("SELECT id FROM employees WHERE email = 'sadia@factory.com'");
      const robi = await client.query("SELECT id FROM employees WHERE email = 'robi@factory.com'");

      const ids = [faria.rows[0].id, abir.rows[0].id, sadia.rows[0].id, robi.rows[0].id];
      const today = new Date();

      for (let i = -7; i <= 2; i++) {
        const shiftDate = new Date(today);
        shiftDate.setDate(today.getDate() + i);
        const dateStr = shiftDate.toISOString().split('T')[0];

        for (const employeeId of ids) {
          const isAbsent = Math.random() < 0.1;
          const status = i < 0 ? (isAbsent ? 'Absent' : 'Completed') : 'Scheduled';

          await client.query(
            'INSERT INTO shifts (employee_id, date, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5)',
            [employeeId, dateStr, '08:00:00', '16:00:00', status]
          );

          if (status === 'Completed' && i < 0) {
            const checkInTime = new Date(shiftDate);
            checkInTime.setHours(8, Math.floor(Math.random() * 15) - 5, 0);

            const checkOutTime = new Date(shiftDate);
            const overtimeHours = (employeeId === faria.rows[0].id && Math.random() < 0.4) ? 2 : 0;
            checkOutTime.setHours(16 + overtimeHours, Math.floor(Math.random() * 10), 0);

            await client.query(
              'INSERT INTO biometric_logs (employee_id, timestamp, log_type, device_id, verified_by_face, gps_lat, gps_lng) VALUES ($1, $2, $3, $4, $5, $6, $7)',
              [employeeId, checkInTime.toISOString(), 'Check_In', 'kiosk_main', true, 23.81031, 90.41252]
            );

            await client.query(
              'INSERT INTO biometric_logs (employee_id, timestamp, log_type, device_id, verified_by_face, gps_lat, gps_lng) VALUES ($1, $2, $3, $4, $5, $6, $7)',
              [employeeId, checkOutTime.toISOString(), 'Check_Out', 'kiosk_main', true, 23.81032, 90.41251]
            );
          }
        }
      }
    }

    console.log('Database initialization and seeding completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
