const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function clear() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const client = await pool.connect();
  try {
    console.log('Clearing face embeddings...');
    await client.query('DELETE FROM face_embeddings');
    console.log('Clearing recognition attempts...');
    await client.query('DELETE FROM recognition_attempts');
    console.log('Clearing fraud flags...');
    await client.query('DELETE FROM fraud_flags');
    console.log('Done clearing face embeddings and biometric states.');
  } catch (err) {
    console.error('Clear failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

clear();
