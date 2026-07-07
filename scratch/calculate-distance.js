const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function calc() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const res = await pool.query('SELECT employee_id, embedding::text FROM face_embeddings');
    const emps = res.rows;
    console.log('Seeded embeddings:');
    
    for (let i = 0; i < emps.length; i++) {
      for (let j = i + 1; j < emps.length; j++) {
        const e1 = emps[i];
        const e2 = emps[j];
        
        const distRes = await pool.query(
          `SELECT ($1::vector <=> $2::vector) as cosine_dist, 
                  ($1::vector <-> $2::vector) as l2_dist`,
          [e1.embedding, e2.embedding]
        );
        console.log(`Emp ${e1.employee_id} vs Emp ${e2.employee_id}:`);
        console.log(`  Cosine Distance: ${distRes.rows[0].cosine_dist}`);
        console.log(`  L2 (Euclidean) Distance: ${distRes.rows[0].l2_dist}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

calc();
