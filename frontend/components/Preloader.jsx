'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP, markReady } from '@/frontend/lib/gsap';

export default function Preloader() {
  const root = useRef(null);
  const num = useRef(null);
  useGSAP(() => {
    const el = root.current;
    const fallback = setTimeout(() => { el.style.display = 'none'; markReady(); }, 4000);
    let seen = false;
    try { seen = sessionStorage.getItem('gs-seen'); sessionStorage.setItem('gs-seen', '1'); } catch { /* Storage can be disabled in private contexts. */ }
    const skip = matchMedia('(prefers-reduced-motion: reduce)').matches || seen;
    if (skip) { el.style.display = 'none'; markReady(); return () => clearTimeout(fallback); }
    const c = { v: 0 };
    gsap.timeline({ onComplete: () => { el.style.display = 'none'; } })
      .to(c, { v: 100, duration: 0.4, ease: 'power2.inOut', onUpdate: () => { num.current.textContent = String(Math.round(c.v)).padStart(3, '0'); } })
      .to(el.querySelectorAll('.gs-pre-in'), { autoAlpha: 0, y: -12, duration: 0.15, stagger: 0.025 })
      .to(el, { yPercent: -100, duration: 0.4, ease: 'power3.inOut' }, '>-0.05')
      .call(markReady, null, '<+0.1');
    return () => clearTimeout(fallback);
  }, []);
  return (
    <div ref={root} className="gs-preloader" aria-hidden="true">
      <div className="gs-pre-in gs-pre-logo"><Image src="/brand/grostage-original.png" alt="" width={300} height={425} priority /></div>
      <span ref={num} className="gs-pre-num gs-pre-in">000</span>
    </div>
  );
}
