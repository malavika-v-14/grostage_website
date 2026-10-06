import { q } from '@/backend/lib/db';
export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const message = String(body.message || '').trim();
    if (!name || !email || !message) return Response.json({ error: 'All fields required' }, { status: 400 });
    if (name.length > 150 || email.length > 254 || message.length > 10000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Please check the submitted details' }, { status: 400 });
    }
    await q('INSERT INTO contacts(name,email,message) VALUES($1,$2,$3)', [name, email, message]);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Contact submission failed', error);
    return Response.json({ error: 'Unable to save your message right now' }, { status: 503 });
  }
}
