'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

export default function FluidProjectCanvas({ works = [] }) {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const el = root.current;
      const pieces = [...el.querySelectorAll('.fluid-project')];
      const layers = pieces.map(piece => ({
        node: piece,
        x: gsap.quickTo(piece, 'x', { duration: 1.1, ease: 'power3.out' }),
        y: gsap.quickTo(piece, 'y', { duration: 1.3, ease: 'power3.out' }),
        r: gsap.quickTo(piece, 'rotation', { duration: 1.3, ease: 'power3.out' }),
        img: piece.querySelector('img'),
      }));
      const move = e => {
        const b = el.getBoundingClientRect();
        const px = e.clientX / b.width - .5, py = (e.clientY - b.top) / b.height - .5;
        layers.forEach((layer, i) => { const depth = 5 + i * 4; layer.x(px * depth); layer.y(py * depth); layer.r(px * (i % 2 ? -1.2 : 1.2)); });
      };
      const leave = () => layers.forEach(layer => { layer.x(0); layer.y(0); layer.r(0); });
      el.addEventListener('pointermove', move, { passive: true }); el.addEventListener('pointerleave', leave);
      layers.forEach((layer, i) => {
        gsap.fromTo(layer.node, { x: i % 2 ? 34 : -34, y: i % 2 ? 120 : -80, rotation: i % 2 ? 4 : -4, scale: .94 }, { x: i % 2 ? -48 : 56, y: i % 2 ? -90 - i * 13 : 70 + i * 9, rotation: i % 2 ? -2 : 2, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 + i * .18 } });
        gsap.fromTo(layer.img, { scale: 1.14, skewX: i % 2 ? 1.5 : -1.5, xPercent: i % 2 ? 5 : -5 }, { scale: 1, skewX: i % 2 ? -1.5 : 1.5, xPercent: i % 2 ? -5 : 5, ease: 'none', scrollTrigger: { trigger: layer.node, start: 'top bottom', end: 'bottom top', scrub: 1.4 } });
      });
      gsap.to(el.querySelector('.fluid-canvas-aura'), { yPercent: 18, xPercent: -8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.6 } });
      gsap.to(el.querySelector('.fluid-canvas-orb'), { x: 100, y: -80, scale: 1.2, duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
    });
    return () => mm.revert();
  }, { scope: root });
  return <section ref={root} className="fluid-canvas" data-nav-theme="dark" aria-label="Our work projects">
    <div className="fluid-canvas-atmosphere" aria-hidden="true"><span className="fluid-canvas-aura" /><span className="fluid-canvas-orb" /><span className="fluid-canvas-noise" /><span className="fluid-canvas-stars" /></div>
    <header className="fluid-canvas-header"><div><p className="eyebrow"><span className="status-dot" /> Selected work / 2026</p><h1>Different challenges.<br /><span>Purposeful solutions.</span></h1></div><p>Digital products, connected operations<br />and growth experiences.</p></header>
    <div className="fluid-project-field">{works.map((work, i) => <Link key={work.slug} href={`/work/${work.slug}`} className={`fluid-project fluid-project-${i}`} data-cursor="View"><span className="fluid-project-index">0{i + 1}</span><img src={work.image} alt={work.imageAlt || work.title} loading={i < 2 ? 'eager' : 'lazy'} /><span className="fluid-project-caption"><strong>{work.title}</strong><small>{work.category}</small></span><span className="fluid-project-arrow" aria-hidden="true">↗</span></Link>)}<span className="fluid-canvas-view" aria-hidden="true">View</span></div>
    <div className="fluid-canvas-footer"><span>SCROLL TO EXPLORE THE WORK</span><span>GROSTAGE / 2026</span></div>
  </section>;
}
