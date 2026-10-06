'use client';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

const meta = [
  ['E-commerce Platform', 'Web'], ['Real Estate Website', 'Web'], ['Business Automation', 'Systems'],
  ['Mobile Logistics App', 'Mobile'], ['Social Media Campaigns', 'Marketing'], ['Brand Growth Marketing', 'Marketing'],
];
export default function WorkGalleryCanvas({ works = [] }) {
  const root = useRef(null), [filter, setFilter] = useState('All');
  const items = useMemo(() => works.map((work, i) => ({ ...work, subtitle: meta[i]?.[0] || work.category, type: meta[i]?.[1] || 'Web' })), [works]);
  const visible = items.filter(item => filter === 'All' || item.type === filter);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray('.gallery-project', root.current);
      const onScroll = () => { const velocity = Math.max(-1, Math.min(1, (window.scrollY - (onScroll.last || window.scrollY)) / 90)); onScroll.last = window.scrollY; cards.forEach((card, i) => { card.style.setProperty('--bend', `${velocity * (i % 2 ? -1.5 : 1.5)}deg`); }); };
      addEventListener('scroll', onScroll, { passive: true });
      cards.forEach((card, i) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 40, rotateX: 5 }, { autoAlpha: 1, y: 0, rotateX: 0, duration: .8, delay: i * .06, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 92%', once: true } });
        gsap.to(card, { rotateZ: i % 2 ? 1.2 : -1.2, y: i % 2 ? -22 : 26, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
      });
      return () => { removeEventListener('scroll', onScroll); };
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [visible.length] });
  const change = next => {
    if (next === filter) return;
    const cards = gsap.utils.toArray('.gallery-project', root.current);
    gsap.to(cards, { autoAlpha: 0, y: 18, scale: .97, stagger: .025, duration: .22, onComplete: () => { setFilter(next); requestAnimationFrame(() => gsap.fromTo(root.current.querySelectorAll('.gallery-project'), { autoAlpha: 0, y: 24, scale: .97 }, { autoAlpha: 1, y: 0, scale: 1, stagger: .07, duration: .65, ease: 'power3.out' })); } });
  };
  const count = type => items.filter(item => type === 'All' || item.type === type).length;
  return <section ref={root} className="studio-gallery-page" data-nav-theme="light">
    <div className="gallery-atmosphere" aria-hidden="true"><span className="gallery-arch arch-one" /><span className="gallery-arch arch-two" /><span className="gallery-particles" /></div>
    <header className="gallery-heading"><p className="gallery-kicker">GROSTAGE / SELECTED WORK</p><h1>our works</h1><p className="gallery-intro">Digital products, business systems and growth experiences built for what comes next.</p></header>
    <div className="gallery-filter-wrap"><div className="gallery-filter" role="tablist" aria-label="Filter projects">{['All', 'Web', 'Mobile', 'Marketing', 'Systems'].map(type => <button key={type} role="tab" aria-selected={filter === type} className={filter === type ? 'is-active' : ''} onClick={() => change(type)}>{type}<sup>{count(type)}</sup></button>)}</div></div>
    <div className="gallery-grid">{visible.map((work, i) => <Link href={`/work/${work.slug}`} className="gallery-project" key={work.slug} data-cursor="View"><div className="gallery-media"><img src={work.image} alt={work.imageAlt || work.title} loading={i < 2 ? 'eager' : 'lazy'} /><span className="gallery-cursor-view" aria-hidden="true">↘</span></div><div className="gallery-project-info"><div><strong>{work.title}</strong><small>{work.subtitle}</small></div><span className="gallery-type">{work.type}</span></div></Link>)}</div>
  </section>;
}
