import { q } from '@/lib/db'; import { isAdmin } from '@/lib/auth';
const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const ok = t => ['posts', 'pages'].includes(t);
export async function GET(_, { params }) {
  const { type } = await params; if (!ok(type)) return Response.json([], { status: 404 });
  return Response.json(await q(`SELECT * FROM ${type} ${(await isAdmin()) ? '' : 'WHERE published'} ORDER BY created_at DESC`));
}
export async function POST(req, { params }) {
  const { type } = await params; if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  const b = await req.json();
  try {
    const r = await q(`INSERT INTO ${type}(title,slug,excerpt,content,image,published) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [b.title, slugify(b.slug || b.title), b.excerpt || '', b.content || '', b.image || '', b.published !== false]);
    return Response.json(r[0]);
  } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
}
