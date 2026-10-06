import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWork, getWorks } from '@/backend/lib/content';
import { Body } from '@/frontend/lib/render';
import CTA from '@/frontend/components/CTA';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const work = await getWork(slug);
  return { title: work ? `${work.title} — Grostage` : 'Project not found — Grostage' };
}

export default async function WorkDetail({ params }) {
  const { slug } = await params;
  const works = await getWorks();
  const index = works.findIndex(work => work.slug === slug);
  if (index < 0) notFound();

  const work = works[index];
  const next = works[(index + 1) % works.length];

  return <main id="main-content">
    <section className="wrap work-detail-heading">
      <Link href="/work" className="text-link">← All projects</Link>
      <p className="eyebrow">{work.category}</p>
      <h1>{work.title}</h1>
      <div className="work-detail-meta"><p>{work.excerpt}</p><div>{work.tags.map(tag => <span className="pill" key={tag}>{tag}</span>)}</div></div>
    </section>
    <div className="wrap">
      <div className={`work-cover${work.slug === 'custom-erp' ? ' contain' : ''}`}><img src={work.image || '/projects/work-placeholder.svg'} alt={work.imageAlt || `${work.title} project`} /></div>
      {work.representative && <p className="preview-note">Representative artwork from the company profile. Campaign imagery was not supplied.</p>}
    </div>
    <section className="sec wrap case-body"><p className="eyebrow">THE PROJECT / {String(index + 1).padStart(2, '0')}</p><div className="art"><Body text={work.content} /></div></section>
    {work.gallery && <div className="wrap project-gallery"><img src={work.gallery} alt={`${work.title} project gallery`} loading="lazy" /></div>}
    <section className="next-work wrap"><p className="eyebrow">UP NEXT</p><Link href={`/work/${next.slug}`}>{next.title}<span>↗</span></Link></section>
    <CTA />
  </main>;
}
