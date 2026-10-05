'use client';
import { useEffect, useState } from 'react';

export default function CursorFX() {
  const [point, setPoint] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return;
    const move = e => setPoint({ x: e.clientX, y: e.clientY });
    const over = e => setActive(Boolean(e.target.closest('a,button,[data-cursor]')));
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerover', over, { passive: true });
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerover', over); };
  }, []);
  return <span className={'cursor-fx' + (active ? ' is-active' : '')} style={{ '--cursor-x': `${point.x}px`, '--cursor-y': `${point.y}px` }} aria-hidden="true" />;
}
