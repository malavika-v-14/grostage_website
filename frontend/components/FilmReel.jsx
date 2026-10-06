'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger, useGSAP } from '@/frontend/lib/gsap';

export default function FilmReel({ works }) {
  const root = useRef(null);
  const pos = useRef(0);
  const st = useRef(null);
  const total = works.length;

  const layout = p => {
    pos.current = p;
    root.current.querySelectorAll('.reel-frame').forEach((f, i) => {
      const o = i - p, a = Math.abs(o);
      f.style.setProperty('--offset', o.toFixed(3));
      f.style.zIndex = Math.round(100 - a * 10);
      f.style.opacity = a > 3.2 ? 0 : 1;
      f.style.pointerEvents = a > 2 ? 'none' : 'auto';
      f.classList.toggle('is-current', a < 0.5);
    });
    const idx = Math.min(total - 1, Math.max(0, Math.round(p)));
    root.current.querySelector('.reel-count').textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    root.current.querySelector('.reel-name').textContent = works[idx].title;
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      root.current.classList.add('is-scrub');
      st.current = ScrollTrigger.create({ trigger: root.current, start: 'top top', end: '+=' + total * 70 + '%', pin: true, scrub: true,
        onUpdate: self => layout(self.progress * (total - 1)) });
      layout(0);
      return () => { st.current = null; root.current?.classList.remove('is-scrub'); };
    });
  }, { scope: root });

  const go = dir => {
    const target = Math.min(total - 1, Math.max(0, Math.round(pos.current) + dir));
    if (st.current) {
      const y = st.current.start + (target / (total - 1)) * (st.current.end - st.current.start);
      window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.2 }) : window.scrollTo({ top: y, behavior: 'smooth' });
    } else layout(target);
  };

  return <section ref={root} className="reel-section" aria-label="Selected work film reel"><div className="reel-backdrop" />
    <div className="reel-heading"><p className="eyebrow">A DIFFERENT PERSPECTIVE</p><h2>Our <span className="serif">work.</span></h2></div>
    <div className="reel-stage">{works.map((w, i) =>
      <Link href={'/work/' + w.slug} key={w.slug} className={'reel-frame' + (i === 0 ? ' is-current' : '')} style={{ '--offset': i, zIndex: total - i }} aria-label={'View ' + w.title}>
        <img src={w.image} alt={w.title} /><span>{w.title}<b>↗</b></span></Link>)}</div>
    <div className="reel-controls"><button onClick={() => go(-1)} aria-label="Previous project">←</button>
      <p aria-live="polite"><span className="reel-count">01 / {String(total).padStart(2, '0')}</span><span className="reel-name">{works[0].title}</span></p>
      <button onClick={() => go(1)} aria-label="Next project">→</button></div>
  </section>;
}
