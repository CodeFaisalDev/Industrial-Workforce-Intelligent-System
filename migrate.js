const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

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
        password VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'Worker',
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure password column exists if table was already created
    await client.query(`
      ALTER TABLE employees ADD COLUMN IF NOT EXISTS password VARCHAR(255);
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

    // Shift Swaps Table
    await client.query(`
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
    await client.query(`
      CREATE TABLE IF NOT EXISTS manager_worker_access (
        id SERIAL PRIMARY KEY,
        manager_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        worker_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
        UNIQUE(manager_id, worker_id)
      );
    `);

    console.log('Performing database clean reset for fresh start...');
    await client.query(`
      TRUNCATE TABLE 
        employees, 
        shifts, 
        biometric_logs, 
        shift_swaps, 
        manager_worker_access, 
        face_embeddings, 
        payroll_ledgers, 
        performance_scores, 
        fraud_flags,
        chatbot_conversations,
        chatbot_knowledge_base,
        departments
      RESTART IDENTITY CASCADE;
    `);

    // Seed Departments
    console.log('Seeding departments...');
    await client.query("INSERT INTO departments (name) VALUES ('Assembly Line 1'), ('Packaging & Sorting'), ('Quality Assurance'), ('Maintenance & Logistics')");

    // Seed Employees
    const kafiHash = bcrypt.hashSync('admin123', 10);
    console.log('Seeding fresh admin employee (Prithula)...');
    await client.query(
      'INSERT INTO employees (name, email, role, department_id, status, password) VALUES ($1, $2, $3, $4, $5, $6)',
      ['Prithula', 'admin@gmail.com', 'HR Admin', null, 'Active', kafiHash]
    );

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
          'Face recognition is mandatory for attendance check-ins. If recognition fails, workers must report to the Floor Manager (Nazmul Hasan) or HR Admin (Prithula) for manual override.',
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

    // Seed initial face embeddings if empty
    const faceCount = await client.query('SELECT COUNT(*) FROM face_embeddings');
    if (parseInt(faceCount.rows[0].count, 10) === 0) {
      console.log('Seeding initial face embeddings in migrate.js...');
      const mockVector = '[' + Array(128).fill(0.1).join(',') + ']';
      const emps = await client.query("SELECT id FROM employees WHERE role IN ('HR Admin', 'Worker')");
      for (const row of emps.rows) {
        await client.query(
          'INSERT INTO face_embeddings (employee_id, embedding, is_active) VALUES ($1, $2, true)',
          [row.id, mockVector]
        );
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
