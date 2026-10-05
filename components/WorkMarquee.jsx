'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
export default function WorkMarquee({works}) {
  const ref=useRef(null);
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
  const forward=useTransform(scrollYProgress,[0,1],[-45,45]);
  const reverse=useTransform(scrollYProgress,[0,1],[45,-45]);
  return <section ref={ref} className="work-marquee" aria-label="Selected work">
    {[forward,reverse].map((x,index)=><motion.div className="marquee-drift" key={index} style={{x:reduced?0:x}}>
      <div className={'marquee-row '+(index?'marquee-reverse':'marquee-forward')}>
        {[0,1].map(copy=><div className="marquee-group" key={copy} aria-hidden={copy===1 ? true : undefined}>{works.map(w=><Link href={'/work/'+w.slug} tabIndex={copy===1?-1:0} className="marquee-card" key={w.slug}><img src={w.image} alt="" loading="lazy"/><span>{w.title} ↗</span></Link>)}</div>)}
      </div>
    </motion.div>)}
  </section>;
}
