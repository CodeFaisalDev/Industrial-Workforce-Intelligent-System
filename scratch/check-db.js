const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT id, name, email, role FROM employees');
    console.log('--- Database Employees ---');
    console.log('Total Count:', res.rows.length);
    console.table(res.rows);
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

check();
