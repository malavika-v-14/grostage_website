'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
const navigation = [['Home', '/'], ['About Us', '/about'], ['Services', '/services'], ['Our Work', '/work'], ['Blog', '/blog'], ['Client Stories', '/client-stories']];
export default function Nav() {
  const [open, setOpen] = useState(false);
  const header = useRef(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, progress = Math.min(1, window.scrollY / 280);
    const paint = () => {
      const target = Math.min(1, Math.max(0, window.scrollY / 280));
      progress = media.matches ? target : progress + (target - progress) * .15;
      header.current?.style.setProperty('--nav-p', progress.toFixed(5));
      frame = Math.abs(target - progress) > .0001 ? requestAnimationFrame(paint) : 0;
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', update, { passive: true });
    return () => { window.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, []);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const close = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  const dark = ['/', '/about', '/services', '/work', '/blog', '/client-stories', '/contact'].includes(pathname);
  return <header ref={header} data-theme={dark ? 'dark' : 'light'} className={`nav studio-nav fluid-nav${open ? ' is-open' : ''}`}><div className="wrap nav-in"><Logo />
    <nav className="nav-links" aria-label="Main navigation">{navigation.map(([label, href]) => <Link key={href} href={href} aria-current={(href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined}>{label}</Link>)}</nav>
    <Link href="/contact" className="btn nav-contact">Let’s Connect <span>↗</span></Link>
    <button className="burger" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><i /><i /></button>
    </div>{open && <nav id="mobile-navigation" className="mobile" aria-label="Mobile navigation">{[...navigation, ['Let’s talk ↗', '/contact']].map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav>}
  </header>;
}
