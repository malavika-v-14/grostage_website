'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
const navigation = [['Home', '/'], ['About Us', '/about'], ['Services', '/services'], ['Our Work', '/work'], ['Blog', '/blog'], ['Client Stories', '/client-stories']];
export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const close = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  return <header className="nav"><div className="wrap nav-in"><Logo />
    <nav className="nav-links" aria-label="Main navigation">{navigation.map(([label, href]) => <Link key={href} href={href} aria-current={(href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined}>{label}</Link>)}</nav>
    <Link href="/contact" className="btn nav-contact">Let’s Connect <span>↗</span></Link>
    <button className="burger" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><i /><i /></button>
    </div>{open && <nav id="mobile-navigation" className="mobile" aria-label="Mobile navigation">{[...navigation, ['Let’s talk ↗', '/contact']].map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav>}
  </header>;
}
