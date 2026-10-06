import Link from 'next/link';
import { notFound } from 'next/navigation';
import { q } from '@/backend/lib/db';
import { samplePosts } from '@/backend/lib/content';
import { Body } from '@/frontend/lib/render';
import CTA from '@/frontend/components/CTA';
export const dynamic='force-dynamic';
async function getPost(slug) {try{return (await q('SELECT * FROM posts WHERE slug=$1 AND published',[slug]))[0];}catch{return samplePosts.find(p=>p.slug===slug);}}
export async function generateMetadata({params}) {const p=await getPost((await params).slug); return {title:p ? p.title+' — Grostage' : 'Article not found — Grostage'};}
export default async function Post({params}) {
 const p=await getPost((await params).slug);if(!p) notFound();
 return <main id="main-content"><article className="article-page wrap"><Link href="/blog" className="text-link">? Back to journal</Link><p className="eyebrow">{p.category || 'Insights'} / {new Date(p.created_at).toLocaleDateString('en-GB',{dateStyle:'long',timeZone:'UTC'})}</p><h1>{p.title}</h1><p className="lead">{p.excerpt}</p>{p.sample && <p className="preview-note">Sample editorial · Adapted from the company profile</p>}{p.image && <img src={p.image} alt={p.title} className="article-cover" />}<div className="art article-body"><Body text={p.content} /></div></article><CTA /></main>;
}
