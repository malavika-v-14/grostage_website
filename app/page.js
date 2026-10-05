import Link from 'next/link';
import Hero from '@/components/Hero';
import Reveal from '@/components/Reveal';
import ProjectCard from '@/components/ProjectCard';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import {services, works} from '@/lib/content';
import ServiceCard from '@/components/ServiceCard';
import WorkMarquee from '@/components/WorkMarquee';
export default function Home() {
  return <main id="main-content"><Hero />
    <div className="capability-strip"><div className="wrap"><span>DIGITAL PRODUCTS</span><i>✳</i><span>BUSINESS TECHNOLOGY</span><i>✳</i><span>AI & DATA</span><i>✳</i><span>DIGITAL GROWTH</span></div></div>
    <section className="sec intro-section"><div className="wrap intro-grid"><p className="eyebrow">01 / THE GROSTAGE WAY</p><Reveal><h2>Technology with<br />a <span className="serif">business purpose.</span></h2><div className="intro-bottom"><p>We bring strategy, design, technology and execution together. One team to turn your ideas, operational challenges and growth opportunities into practical digital solutions.</p><Link href="/about" className="circle-link" aria-label="About Grostage">↗</Link></div></Reveal></div></section>
    <section className="sec services-preview" id="services"><div className="wrap"><div className="section-heading"><Reveal><p className="eyebrow">02 / WHAT WE DO</p><h2 className="h2">Four capabilities.<br /><span className="serif">One digital partner.</span></h2></Reveal><Link href="/services" className="text-link">All our services ↗</Link></div><div className="service-grid">{services.map((s,i) => <Reveal key={s.slug} delay={i*.06}><ServiceCard service={s} index={i} /></Reveal>)}</div></div></section>
    <section className="sec selected-work" id="work"><div className="wrap"><div className="section-heading"><Reveal><p className="eyebrow">03 / SELECTED WORK</p><h2 className="h2">Real businesses.<br /><span className="serif">Thoughtful solutions.</span></h2></Reveal><Link href="/work" className="text-link">View all work <span>↗</span></Link></div><WorkMarquee works={works} /></div></section>
    <section className="approach-banner galaxy-card"><div className="galaxy-stars" aria-hidden="true" /><div className="wrap"><p className="eyebrow">BUILT AROUND WHERE YOU’RE GOING NEXT</p><h2>From first idea.<br /><span className="serif">To continuous growth.</span></h2><Link href="/work" className="btn white">See our work <span>↗</span></Link><div className="approach-orbit" aria-hidden="true"><i /><i /><i /></div></div></section>
    <Testimonials /><CTA />
  </main>;
}
