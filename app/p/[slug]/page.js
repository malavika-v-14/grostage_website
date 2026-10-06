import { notFound } from 'next/navigation'; import { q } from '@/backend/lib/db'; import { Body } from '@/frontend/lib/render'; import Reveal from '@/frontend/components/Reveal';
export const dynamic = 'force-dynamic';
export default async function Page({ params }) {
  const { slug } = await params; let p; try { p = (await q('SELECT * FROM pages WHERE slug=$1 AND published', [slug]))[0]; } catch {}
  if (!p) notFound();
  return (<main className="sec top"><article className="wrap art"><Reveal><h1 className="h2">{p.title}</h1>
    {p.image && <img src={p.image} alt="" className="cover" />}<Body text={p.content} /></Reveal></article></main>);
}
