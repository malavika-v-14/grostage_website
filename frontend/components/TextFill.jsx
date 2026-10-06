'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/frontend/lib/gsap';

export default function TextFill({ text, className = '' }) {
  const ref = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const words = ref.current.querySelectorAll('.gs-word');
      gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 45%', scrub: true } });
    });
  }, { scope: ref });
  return <p ref={ref} className={'intro-fill ' + className}>{text.split(' ').map((w, i) => <span className="gs-word" key={i}>{w} </span>)}</p>;
}
