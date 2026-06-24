import { Pool } from 'pg';

let pool: Pool;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the environment variables.');
}

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // Ensure we reuse the database pool across hot reloads in development
  if (!(global as any).pgPool) {
    (global as any).pgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }
  pool = (global as any).pgPool;
}

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getPool: () => pool,
};
export default db;
