import { q } from '@/lib/db'; import { isAdmin } from '@/lib/auth'; import { getFooter } from '@/lib/footer';
export const dynamic = 'force-dynamic';
export async function GET() { return Response.json(await getFooter()); }
export async function PUT(req) {
  if (!(await isAdmin())) return Response.json({}, { status: 401 });
  await q("INSERT INTO settings(key,value) VALUES('footer',$1) ON CONFLICT(key) DO UPDATE SET value=$1", [JSON.stringify(await req.json())]);
  return Response.json({ ok: true });
}
