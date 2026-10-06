import { signToken } from '@/backend/lib/auth'; import { cookies } from 'next/headers';
export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return Response.json({ error: 'Wrong password' }, { status: 401 });
  (await cookies()).set('gs_admin', await signToken(), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 604800 });
  return Response.json({ ok: true });
}
export async function DELETE() { (await cookies()).delete('gs_admin'); return Response.json({ ok: true }); }
