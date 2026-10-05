import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
const key = () => new TextEncoder().encode(process.env.JWT_SECRET);
export const signToken = () => new SignJWT({ a: 1 }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(key());
export async function isAdmin() {
  try { const c = (await cookies()).get('gs_admin')?.value; if (!c) return false; await jwtVerify(c, key()); return true; } catch { return false; }
}
