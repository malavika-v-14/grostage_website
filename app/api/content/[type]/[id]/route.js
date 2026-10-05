import { q } from '@/lib/db'; import { isAdmin } from '@/lib/auth';
const ok = t => ['posts', 'pages'].includes(t);
const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export async function PUT(req, { params }) {
  const { type, id } = await params; if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  const b = await req.json();
  try {
    const r = await q(`UPDATE ${type} SET title=$1,slug=$2,excerpt=$3,content=$4,image=$5,published=$6 WHERE id=$7 RETURNING *`, [b.title, slugify(b.slug || b.title), b.excerpt || '', b.content || '', b.image || '', b.published !== false, id]);
    return Response.json(r[0]);
  } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
}
export async function DELETE(_, { params }) {
  const { type, id } = await params; if (!ok(type) || !(await isAdmin())) return Response.json({}, { status: 401 });
  await q(`DELETE FROM ${type} WHERE id=$1`, [id]); return Response.json({ ok: true });
}
