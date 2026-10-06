'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/frontend/lib/gsap';
export default function CursorFX() {
  const ring = useRef(null), label = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(pointer: fine) and (min-width: 601px) and (prefers-reduced-motion: no-preference)', () => {
      const r = ring.current;
      gsap.set(r, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const x = gsap.quickTo(r, 'x', { duration: .3, ease: 'power3.out' });
      const y = gsap.quickTo(r, 'y', { duration: .3, ease: 'power3.out' });
      let shown = false;
      const hide = () => { shown = false; gsap.to(r, { autoAlpha: 0, duration: .15, overwrite: 'auto' }); };
      const move = e => {
        if (e.target.closest('input,textarea,select,iframe,.adm')) { hide(); return; }
        x(e.clientX); y(e.clientY);
        if (!shown) { shown = true; gsap.to(r, { autoAlpha: 1, duration: .15, overwrite: 'auto' }); }
        const card = e.target.closest('[data-cursor],.reel-frame,.project-card');
        r.classList.toggle('is-view', !!card);
        r.classList.toggle('is-link', !card && !!e.target.closest('a,button'));
        label.current.textContent = card ? card.dataset.cursor || 'View' : '';
      };
      document.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', hide);
      window.addEventListener('blur', hide);
      return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide); window.removeEventListener('blur', hide); gsap.set(r, { autoAlpha: 0 }); };
    });
    return () => mm.revert();
  }, []);
  return <div ref={ring} className="gs-cursor" aria-hidden="true"><span ref={label} /></div>;
}
