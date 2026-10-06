'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/frontend/lib/gsap';

export default function SmoothScroll() {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let lenis;
    const tick = t => lenis?.raf(t * 1000);
    const setup = () => {
      gsap.ticker.remove(tick); lenis?.destroy(); lenis = null; delete window.__lenis;
      if (media.matches) return;
      lenis = new Lenis({ lerp: .1, smoothWheel: true, anchors: true });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
    };
    setup(); media.addEventListener('change', setup);
    return () => { media.removeEventListener('change', setup); gsap.ticker.remove(tick); lenis?.destroy(); delete window.__lenis; };
  }, []);
  return null;
}
