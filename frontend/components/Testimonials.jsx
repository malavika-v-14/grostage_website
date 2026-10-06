import Link from 'next/link';
import { testimonials } from '@/backend/lib/content';
import Reveal from './Reveal';
export default function Testimonials() {
  return <section className="sec reviews"><div className="wrap"><div className="section-heading"><Reveal><p className="eyebrow">RELATIONSHIPS THAT MOVE US FORWARD</p><h2 className="h2">What they <span className="serif">say.</span></h2></Reveal><Link href="/client-stories" className="text-link">Client stories ↗</Link></div><p className="preview-note">Preview testimonials · Illustrative copy, pending client approval.</p><div className="review-grid">{testimonials.map((t,i) => <Reveal key={t.initials} delay={i*.07}><figure className="review-card"><span className="quote-mark">“</span><blockquote>{t.quote}</blockquote><figcaption><span className="review-avatar">{t.initials}</span><div>{t.name}<small>{t.role} · Sample</small></div></figcaption></figure></Reveal>)}</div></div></section>;
}
