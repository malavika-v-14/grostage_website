'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/frontend/lib/gsap';

const HIDDEN = 'inset(100% 0% 0% 0%)';
export default function PageTransition() {
  const el = useRef(null);
  const path = usePathname();
  const router = useRouter();
  const busy = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onClick = e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || url.pathname.startsWith('/admin')) return;
      e.preventDefault();
      if (busy.current) return;
      busy.current = true;
      gsap.fromTo(el.current, { clipPath: HIDDEN }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut',
        onComplete: () => router.push(url.pathname + url.search + url.hash) });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.__lenis?.scrollTo(0, { immediate: true });
    if (!busy.current) { setTimeout(() => ScrollTrigger.refresh(), 100); return; }
    gsap.to(el.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, delay: 0.1, ease: 'power4.inOut',
      onComplete: () => { busy.current = false; gsap.set(el.current, { clipPath: HIDDEN }); ScrollTrigger.refresh(); } });
  }, [path]);

  return <div ref={el} className="gs-curtain" aria-hidden="true"><span>Grostage</span></div>;
}
