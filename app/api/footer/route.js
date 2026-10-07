import { q } from '@/backend/lib/db'; import { isAdmin } from '@/backend/lib/auth'; import { getFooter } from '@/backend/lib/footer';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';
export async function GET() { return Response.json(await getFooter()); }
export async function PUT(req) {
  if (!(await isAdmin())) return Response.json({}, { status: 401 });
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return Response.json({ error: 'Invalid footer data.' }, { status: 400 });
    const normalize = value => Array.isArray(value) ? value.map(link => ({ label: String(link.label || '').trim(), value: String(link.value || '').trim() })).filter(link => link.label && link.value) : value;
    await q("INSERT INTO settings(key,value) VALUES('footer',$1::jsonb) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value", [JSON.stringify({ ...body, links: normalize(body.links), socials: normalize(body.socials) })]);
    revalidatePath('/', 'layout');
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Footer save failed', error);
    return Response.json({ error: 'Footer could not be saved. Check the database connection.' }, { status: 503 });
  }
}
