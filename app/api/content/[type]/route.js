import { q } from '@/backend/lib/db'; import { isAdmin } from '@/backend/lib/auth';
const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const ok = t => ['posts', 'pages'].includes(t);
export async function GET(_, { params }) {
  const { type } = await params; if (!ok(type)) return Response.json({ error: 'Unknown content type' }, { status: 404 });
  try { return Response.json(await q(`SELECT * FROM ${type} ${(await isAdmin()) ? '' : 'WHERE published'} ORDER BY created_at DESC`)); }
  catch (error) { console.error('Content read failed', error); return Response.json({ error: 'Content is unavailable' }, { status: 503 }); }
}
export async function POST(req, { params }) {
  const { type } = await params; if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!String(b.title || '').trim()) return Response.json({ error: 'Title is required' }, { status: 400 });
  try {
    const r = await q(`INSERT INTO ${type}(title,slug,excerpt,content,image,published) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [b.title, slugify(b.slug || b.title), b.excerpt || '', b.content || '', b.image || '', b.published !== false]);
    return Response.json(r[0]);
  } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
}
