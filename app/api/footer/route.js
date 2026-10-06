import { q } from '@/backend/lib/db'; import { isAdmin } from '@/backend/lib/auth'; import { getFooter } from '@/backend/lib/footer';
export const dynamic = 'force-dynamic';
export async function GET() { return Response.json(await getFooter()); }
export async function PUT(req) {
  if (!(await isAdmin())) return Response.json({}, { status: 401 });
  try {
    const body = await req.json();
    await q("INSERT INTO settings(key,value) VALUES('footer',$1) ON CONFLICT(key) DO UPDATE SET value=$1", [JSON.stringify(body)]);
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Footer save failed', error);
    return Response.json({ error: 'Footer could not be saved. Check the database connection.' }, { status: 503 });
  }
}
