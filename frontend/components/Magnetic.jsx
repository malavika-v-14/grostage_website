'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

export default function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  useGSAP(() => {
    if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,0.5)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,0.5)' });
    const move = e => { const b = el.getBoundingClientRect(); x((e.clientX - b.left - b.width / 2) * strength); y((e.clientY - b.top - b.height / 2) * strength); };
    const leave = () => { x(0); y(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, []);
  return <span ref={ref} className="gs-magnetic">{children}</span>;
}
