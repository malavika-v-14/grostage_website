import PageIntro from '@/components/PageIntro';
import Reveal from '@/components/Reveal';
import CTA from '@/components/CTA';
import Link from 'next/link';
import {services} from '@/lib/content';
export const metadata={title:'Services — Grostage'};
export default function Services(){return <main id="main-content"><PageIntro label="WHAT WE DO" title="Four capabilities." accent="One digital partner." description="From first idea to continuous growth. Practical technology, thoughtful design and the expertise to bring it all together." /><section className="wrap service-details">{services.map((s,i)=><Reveal key={s.slug}><article className="service-detail" id={s.slug}><div className="service-detail-index">0{i+1}<span>{s.icon}</span></div><div><p className="eyebrow">GROSTAGE CAPABILITIES</p><h2>{s.title}</h2><p>{s.detail}</p><Link href="/contact" className="text-link">Let’s talk about your project ↗</Link></div><ul>{s.items.map(item=><li key={item}>{item}<span>↗</span></li>)}</ul></article></Reveal>)}</section><CTA /></main>;}
