import { Pool } from 'pg';
const g = globalThis;
export const pool = g.__pg || (g.__pg = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined, max: 10, idleTimeoutMillis: 30000 }) : null);
export const q = async (t, p) => {
  if (!pool) throw new Error('DATABASE_URL is not configured');
  return (await pool.query(t, p)).rows;
};
