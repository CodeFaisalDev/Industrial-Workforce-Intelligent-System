const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function runValidation() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('--- Biometric Verification API Validation ---');

    // 1. Fetch employee Faria Sultana and another employee to test mismatch
    const empsRes = await pool.query(
      `SELECT e.id, e.name, f.embedding::text 
       FROM employees e 
       JOIN face_embeddings f ON e.id = f.employee_id 
       WHERE e.email IN ('worker@gmail.com', 'admin@gmail.com') AND f.is_active = true`
    );

    if (empsRes.rows.length < 2) {
      throw new Error('Not enough seeded employees found in database to run comparison.');
    }

    const worker = empsRes.rows.find(r => r.name === 'Faria Sultana');
    const admin = empsRes.rows.find(r => r.name === 'Prithula');

    if (!worker || !admin) {
      throw new Error('Faria Sultana or Prithula not found.');
    }

    console.log(`Loaded ${worker.name} (ID: ${worker.id}) and ${admin.name} (ID: ${admin.id})`);

    const workerEmbedding = worker.embedding.replace('[', '').replace(']', '').split(',').map(Number);
    const adminEmbedding = admin.embedding.replace('[', '').replace(']', '').split(',').map(Number);
    const randomEmbedding = Array.from({ length: 128 }, () => Math.random() * 2 - 1);

    // Helper to send attendance punch
    const sendPunch = async (payload) => {
      const response = await fetch('http://localhost:3000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return { status: response.status, data };
    };

    // Test Case 1: Match correct embedding
    console.log('\nTesting Test Case 1: Correct face embedding...');
    const tc1 = await sendPunch({
      employee_id: worker.id,
      log_type: 'Check_In',
      gps_lat: 23.81031,
      gps_lng: 90.41252,
      verified_by_face: true,
      device_id: 'kiosk_test_validation',
      device_type: 'Kiosk',
      confidence_score: 0.98,
      face_embedding: workerEmbedding
    });
    console.log('Result:', tc1);
    if (!tc1.data.success) {
      throw new Error('Verification failed when presenting correct face embedding.');
    }
    console.log('Test Case 1 Passed!');

    // Test Case 2: Present wrong employee embedding (Buddy Punching)
    console.log('\nTesting Test Case 2: Mismatched employee embedding (Buddy Punching)...');
    const tc2 = await sendPunch({
      employee_id: worker.id,
      log_type: 'Check_In',
      gps_lat: 23.81031,
      gps_lng: 90.41252,
      verified_by_face: true,
      device_id: 'kiosk_test_validation',
      device_type: 'Kiosk',
      confidence_score: 0.22,
      face_embedding: adminEmbedding
    });
    console.log('Result:', tc2);
    if (tc2.status !== 400 || tc2.data.success) {
      throw new Error('Verification did not reject mismatched embedding.');
    }
    if (!tc2.data.error.includes('Face template mismatch')) {
      throw new Error('Incorrect error message returned for mismatched embedding.');
    }
    console.log('Test Case 2 Passed!');

    // Test Case 3: Present random unregistered embedding
    console.log('\nTesting Test Case 3: Unregistered face embedding...');
    const tc3 = await sendPunch({
      employee_id: worker.id,
      log_type: 'Check_In',
      gps_lat: 23.81031,
      gps_lng: 90.41252,
      verified_by_face: true,
      device_id: 'kiosk_test_validation',
      device_type: 'Kiosk',
      confidence_score: 0.04,
      face_embedding: randomEmbedding
    });
    console.log('Result:', tc3);
    if (tc3.status !== 400 || tc3.data.success) {
      throw new Error('Verification did not reject unregistered embedding.');
    }
    console.log('Test Case 3 Passed!');

    // Test Case 4: Verify fraud queue entry
    console.log('\nTesting Test Case 4: Checking Database Fraud Queue Entries...');
    const fraudFlags = await pool.query(
      `SELECT * FROM fraud_flags WHERE employee_id = $1 AND flag_type = 'buddy_punch' ORDER BY raised_at DESC LIMIT 1`,
      [worker.id]
    );
    if (fraudFlags.rows.length === 0) {
      throw new Error('No fraud flags raised in database for buddy punching mismatch.');
    }
    const flag = fraudFlags.rows[0];
    console.log('Raised fraud flag details:', flag);
    if (!flag.details.includes('Biometric Mismatch')) {
      throw new Error('Fraud flag details do not contain mismatch explanation.');
    }
    console.log('Test Case 4 Passed!');

    console.log('\nAll Biometric Verification Tests Passed Successfully!');
  } catch (error) {
    console.error('\nValidation failed:', error.message);
  } finally {
    await pool.end();
  }
}

runValidation();
