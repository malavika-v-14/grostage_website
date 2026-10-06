'use client';
import { useEffect, useRef } from 'react';

export default function NeuralField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d'), host = c.parentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, pts = [], raf, run = true;
    const m = { x: -999, y: -999 };
    const init = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(130, (w * h) / 13000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
        if (d > 0 && d < 170) { p.x += (dx / d) * (170 - d) * 0.025; p.y += (dy / d) * (170 - d) * 0.025; }
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], l = Math.hypot(p.x - q.x, p.y - q.y);
          if (l < 140) { ctx.strokeStyle = `rgba(16,72,80,${(1 - l / 140) * 0.5})`; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        if (d < 200) { ctx.strokeStyle = `rgba(16,72,80,${(1 - d / 200) * 0.7})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(m.x, m.y); ctx.stroke(); }
        ctx.fillStyle = 'rgba(16,72,80,.75)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      if (run && !reduce) raf = requestAnimationFrame(draw);
    };
    const move = e => { const b = c.getBoundingClientRect(); m.x = e.clientX - b.left; m.y = e.clientY - b.top; };
    const leave = () => { m.x = m.y = -999; };
    const io = new IntersectionObserver(([e]) => { run = e.isIntersecting; if (run) { cancelAnimationFrame(raf); draw(); } });
    init(); draw(); io.observe(c);
    addEventListener('resize', init);
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave);
    return () => { run = false; cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', init); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); };
  }, []);
  return <canvas ref={ref} className="hx-canvas" aria-hidden="true" />;
}
