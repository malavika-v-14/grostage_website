'use client';
import { useEffect, useRef } from 'react';
export default function Reveal({ children, delay = 0, y = 28, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    if (node.getBoundingClientRect().top > window.innerHeight) node.classList.add('reveal-pending');
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {node.classList.remove('reveal-pending');observer.disconnect();}
    }, {threshold: 0, rootMargin: '0px 0px -30px 0px'});
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={'reveal '+className} style={{'--reveal-delay':delay+'s','--reveal-y':y+'px'}}>{children}</div>;
}
