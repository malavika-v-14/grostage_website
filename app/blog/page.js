import Link from 'next/link';
import { q } from '@/lib/db';
import { samplePosts } from '@/lib/content';
import PageIntro from '@/components/PageIntro';
import Reveal from '@/components/Reveal';
import CTA from '@/components/CTA';
export const dynamic = 'force-dynamic';
export const metadata = {title:'Journal — Grostage'};
export default async function Blog() {
  let posts;
  try {posts = await q('SELECT * FROM posts WHERE published ORDER BY created_at DESC');} catch {posts = samplePosts;}
  return <main id="main-content"><PageIntro label="THE GROSTAGE JOURNAL" title="Ideas for your" accent="next stage." description="Perspectives on digital products, practical technology and business growth." /><section className="wrap journal-section">{posts.some(p=>p.sample) && <p className="preview-note">Sample articles · Adapted from the Grostage company profile.</p>}<div className="blog-grid">{posts.map((p,i)=><Reveal key={p.id}><Link href={'/blog/'+p.slug} className="blog-card"><div className="blog-image">{p.image && <img src={p.image} alt={p.title} loading="lazy" />}<span className="project-open">↗</span></div><div className="blog-meta"><span>{p.category || 'Insights'}</span><span>{new Date(p.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'})}</span></div><h2>{p.title}</h2><p>{p.excerpt}</p><span className="text-link">Read the story ↗</span></Link></Reveal>)}</div>{!posts.length && <p className="mut">New perspectives are on the way.</p>}</section><CTA /></main>;
}
