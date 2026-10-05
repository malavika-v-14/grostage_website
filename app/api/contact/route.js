import { q } from '@/lib/db';
export async function POST(req) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) return Response.json({ error: 'All fields required' }, { status: 400 });
  await q('INSERT INTO contacts(name,email,message) VALUES($1,$2,$3)', [name, email, message]); return Response.json({ ok: true });
}
