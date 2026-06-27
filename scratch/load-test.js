const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
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

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('--- STARTING OPERATIONAL BATCH LOAD TEST ---');
    console.log('Registering 50 load-test employees...');
    
    // Insert 50 load-test employees
    const empIds = [];
    for (let i = 1; i <= 50; i++) {
      const name = `LoadTest Worker ${i}`;
      const email = `loadtest.worker${i}@factory.com`;
      const res = await client.query(
        `INSERT INTO employees (name, email, role, department_id, status)
         VALUES ($1, $2, 'Worker', 1, 'Active')
         ON CONFLICT (email) DO UPDATE SET name = $1
         RETURNING id`,
        [name, email]
      );
      empIds.push(res.rows[0].id);
    }
    console.log(`Successfully registered ${empIds.length} workers.`);

    console.log('Constructing 1,000 biometric attendance logs...');
    const startTime = Date.now();
    const today = new Date();
    
    const logs = [];
    let logsInserted = 0;
    
    for (let dayOffset = 0; dayOffset < 20; dayOffset++) {
      const logDate = new Date(today);
      logDate.setDate(today.getDate() - dayOffset);
      
      for (const empId of empIds) {
        if (logsInserted >= 1000) break;

        // Check in
        const checkInTime = new Date(logDate);
        checkInTime.setHours(8, Math.floor(Math.random() * 10), 0);
        logs.push({ empId, time: checkInTime.toISOString(), type: 'Check_In' });
        logsInserted++;

        if (logsInserted >= 1000) break;

        // Check out
        const checkOutTime = new Date(logDate);
        checkOutTime.setHours(16, Math.floor(Math.random() * 10), 0);
        logs.push({ empId, time: checkOutTime.toISOString(), type: 'Check_Out' });
        logsInserted++;
      }
      if (logsInserted >= 1000) break;
    }

    console.log(`Inserting ${logs.length} logs in single SQL batch...`);
    const values = [];
    const valPlaceholders = [];
    let paramIndex = 1;

    for (const log of logs) {
      valPlaceholders.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5}, $${paramIndex + 6})`);
      values.push(log.empId, log.time, log.type, 'loadtest_kiosk', true, 23.8103, 90.4125);
      paramIndex += 7;
    }

    const insertQuery = `
      INSERT INTO biometric_logs (employee_id, timestamp, log_type, device_id, verified_by_face, gps_lat, gps_lng)
      VALUES ${valPlaceholders.join(',')}
    `;
    await client.query(insertQuery, values);
    
    const seedDuration = Date.now() - startTime;
    console.log(`Seeded ${logs.length} biometric logs in ${seedDuration}ms.`);

    console.log('Triggering simulated payroll calculations...');
    const payrollStart = Date.now();
    const periodStart = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
    const periodEnd = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];

    const employeesRes = await client.query(`SELECT id, name, role FROM employees WHERE status = 'Active'`);
    const employees = employeesRes.rows;

    for (const emp of employees) {
      const logsRes = await client.query(
        `SELECT timestamp, log_type
         FROM biometric_logs
         WHERE employee_id = $1 AND timestamp >= $2::timestamp AND timestamp <= $3::timestamp + interval '1 day'
         ORDER BY timestamp ASC`,
        [emp.id, periodStart, periodEnd]
      );
      
      let regHours = 0;
      let otHours = 0;
      let lastIn = null;

      for (const log of logsRes.rows) {
        const time = new Date(log.timestamp);
        if (log.log_type === 'Check_In') {
          lastIn = time;
        } else if (log.log_type === 'Check_Out' && lastIn) {
          const hours = (time.getTime() - lastIn.getTime()) / (1000 * 60 * 60);
          if (hours > 0 && hours < 24) {
            if (hours <= 8) {
              regHours += hours;
            } else {
              regHours += 8;
              otHours += (hours - 8);
            }
          }
          lastIn = null;
        }
      }
      
      const rate = 15;
      const gross = (regHours * rate) + (otHours * rate * 1.5);
      const deductions = gross * 0.1;
      const net = gross - deductions;

      const existing = await client.query(
        `SELECT id FROM payroll_ledgers WHERE employee_id = $1 AND period_start = $2 AND period_end = $3`,
        [emp.id, periodStart, periodEnd]
      );

      if (existing.rows.length > 0) {
        await client.query(
          `UPDATE payroll_ledgers SET regular_hours = $1, overtime_hours = $2, gross_pay = $3, deductions = $4, net_pay = $5 WHERE id = $6`,
          [regHours, otHours, gross, deductions, net, existing.rows[0].id]
        );
      } else {
        await client.query(
          `INSERT INTO payroll_ledgers (employee_id, period_start, period_end, regular_hours, overtime_hours, gross_pay, deductions, net_pay)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [emp.id, periodStart, periodEnd, regHours, otHours, gross, deductions, net]
        );
      }
    }

    const payrollDuration = Date.now() - payrollStart;
    console.log(`Payroll calculation for ${employees.length} employees finished in ${payrollDuration}ms.`);

    console.log('Cleaning up load-testing data from Neon...');
    await client.query(`DELETE FROM biometric_logs WHERE device_id = 'loadtest_kiosk'`);
    await client.query(`DELETE FROM payroll_ledgers WHERE period_start = $1 AND period_end = $2`, [periodStart, periodEnd]);
    await client.query(`DELETE FROM employees WHERE email LIKE 'loadtest.worker%'`);
    
    console.log('Cleanup completed successfully!');
    console.log('--- BATCH OPERATIONAL LOAD TEST SUCCESSFUL ---');
  } catch (err) {
    console.error('Load testing failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
