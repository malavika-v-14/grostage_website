'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { works } from '@/lib/content';
export function IntelligenceOrb({ small = false }) {
  return <div className={'intelligence-orb' + (small ? ' orb-small' : '')} aria-hidden="true"><div className="orb-glow" /><div className="orb-sphere">{Array.from({length: 18}, (_, i) => <i key={i} style={{'--i': i}} />)}<div className="orb-equator" /><div className="orb-core" /></div><span className="orb-coordinate coordinate-one">INTELLIGENCE, CONNECTED.</span><span className="orb-coordinate coordinate-two">[ G / 01 ]</span><span className="orb-cross cross-one">+</span><span className="orb-cross cross-two">+</span></div>;
}
export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({target: ref, offset: ['start start', 'end start']});
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  return <section className="hero" ref={ref}>
    <div className="hero-grid" aria-hidden="true" />
    <div className="wrap hero-in"><div className="hero-copy">
      <p className="eyebrow"><span className="status-dot" /> YOUR NEXT STAGE OF GROWTH</p>
      <h1>Built for today.<br />Ready for<br /><span className="serif">what’s next.</span></h1>
      <p className="lead">AI-powered digital systems that help businesses<br className="desktop-break" /> work better, sell better, and grow.</p>
      <div className="row hero-actions"><Link href="/contact" className="btn">Build with us <span>↗</span></Link><Link href="/work" className="text-link">Explore our work <span>↗</span></Link></div>
    </div><motion.div className="hero-art" style={{y: reduce ? 0 : y}}><IntelligenceOrb /></motion.div></div>
    <div className="wrap hero-bottom"><p>STRATEGY. DESIGN. TECHNOLOGY. GROWTH.</p><a href="#services">SCROLL TO EXPLORE <span>↓</span></a></div>
  </section>;
}
