'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

export default function CursorFX() {
  const ring = useRef(null);
  const label = useRef(null);
  useGSAP(() => {
    if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = ring.current;
    gsap.set(r, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const x = gsap.quickTo(r, 'x', { duration: 0.35, ease: 'power3' });
    const y = gsap.quickTo(r, 'y', { duration: 0.35, ease: 'power3' });
    let shown = false;
    const move = e => { x(e.clientX); y(e.clientY); if (!shown) { shown = true; gsap.to(r, { autoAlpha: 1, duration: 0.2 }); } };
    const over = e => {
      const card = e.target.closest('[data-cursor],.marquee-card,.reel-frame,.project-card');
      r.classList.toggle('is-view', !!card);
      r.classList.toggle('is-link', !card && !!e.target.closest('a,button'));
      label.current.textContent = card ? (card.dataset.cursor || 'View') : '';
    };
    addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    return () => { removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); };
  }, []);
  return <div ref={ring} className="gs-cursor" aria-hidden="true"><span ref={label} /></div>;
}
