'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, SplitText, useGSAP, ready } from '@/frontend/lib/gsap';
import Magnetic from './Magnetic';

export function IntelligenceOrb({ small = false }) {
  return <div className={'intelligence-orb' + (small ? ' orb-small' : '')} aria-hidden="true"><div className="orb-glow" /><div className="orb-sphere">{Array.from({length: 18}, (_, i) => <i key={i} style={{'--i': i}} />)}<div className="orb-equator" /><div className="orb-core" /></div><span className="orb-coordinate coordinate-one">INTELLIGENCE, CONNECTED.</span><span className="orb-coordinate coordinate-two">[ G / 01 ]</span><span className="orb-cross cross-one">+</span><span className="orb-cross cross-two">+</span></div>;
}

export default function Hero() {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = s => root.current.querySelectorAll(s);
      const items = q('.eyebrow,.lead,.hero-actions,.hero-bottom');
      const art = q('.hero-art');
      gsap.set(items, { autoAlpha: 0, y: 24 });
      gsap.set(art, { autoAlpha: 0, scale: 0.92 });
      const split = SplitText.create(q('h1')[0], {
        type: 'lines', mask: 'lines', maskClass: 'gs-mask', autoSplit: true,
        onSplit(self) {
          const t = gsap.fromTo(self.lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out', paused: true });
          ready().then(() => t.play());
          return t;
        }
      });
      ready().then(() => {
        gsap.to(items, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.5 });
        gsap.to(art, { autoAlpha: 0.85, scale: 1, duration: 1.6, ease: 'power3.out' });
      });
      gsap.to(art, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      const orb = q('.intelligence-orb')[0];
      const ox = gsap.quickTo(orb, 'x', { duration: 1.2, ease: 'power3' });
      const oy = gsap.quickTo(orb, 'y', { duration: 1.2, ease: 'power3' });
      const move = e => { ox((e.clientX / innerWidth - 0.5) * 40); oy((e.clientY / innerHeight - 0.5) * 30); };
      root.current.addEventListener('pointermove', move);
      return () => { root.current?.removeEventListener('pointermove', move); split.revert(); };
    });
  }, { scope: root });

  return <section className="hero" ref={root}>
    <div className="hero-grid" aria-hidden="true" />
    <div className="wrap hero-in"><div className="hero-copy">
      <p className="eyebrow"><span className="status-dot" /> YOUR NEXT STAGE OF GROWTH</p>
      <h1>Built for today.<br />Ready for<br /><span className="serif">what’s next.</span></h1>
      <p className="lead">AI-powered digital systems that help businesses<br className="desktop-break" /> work better, sell better, and grow.</p>
      <div className="row hero-actions"><Magnetic><Link href="/contact" className="btn">Build with us <span>↗</span></Link></Magnetic><Magnetic><Link href="/work" className="text-link">Explore our work <span>↗</span></Link></Magnetic></div>
    </div><div className="hero-art"><IntelligenceOrb /></div></div>
    <div className="wrap hero-bottom"><p>STRATEGY. DESIGN. TECHNOLOGY. GROWTH.</p><a href="#services">SCROLL TO EXPLORE <span>↓</span></a></div>
  </section>;
}
