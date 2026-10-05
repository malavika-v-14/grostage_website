import { Pool } from 'pg';
const g = globalThis;
export const pool = g.__pg || (g.__pg = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined }));
export const q = async (t, p) => (await pool.query(t, p)).rows;
