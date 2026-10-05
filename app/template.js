'use client';
import { useEffect, useRef } from 'react';
export default function Template({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    const seen = new WeakSet();
    let sequence = 0;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        if (!isIntersecting || seen.has(target) || preference.matches) return;
        seen.add(target);
        const title = target.matches('h1,h2');
        const animation = target.animate([
          {opacity: 0, transform: title ? 'perspective(900px) translateY(28px) rotateX(7deg)' : 'translateY(18px)'},
          {opacity: 1, transform: 'none'}
        ], {duration: title ? 900 : 650, delay: (sequence++ % 4) * 75 + (document.querySelector('.site-loader') ? 600 : 0), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'});
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
        observer.unobserve(target);
      });
    }, {threshold: .08});
    root.querySelectorAll('h1,h2,h3,p,blockquote,.about-feature>img,.work-cover,.article-cover,.cform>label').forEach(node => observer.observe(node));
    const loops = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => target.classList.toggle('motion-offscreen',!isIntersecting)), {threshold: 0});
    root.querySelectorAll('.hero,.reel-section,.galaxy-card,.work-marquee').forEach(node => loops.observe(node));
    const fine = matchMedia('(pointer:fine)');
    let tilted;
    const reset = () => {if(tilted){tilted.style.removeProperty('transform');tilted=null;}};
    const move = e => {
      if(preference.matches || !fine.matches) return;
      const card=e.target.closest('.service-card,.project-card,.review-card,.team-card,.blog-card');
      if(card!==tilted) reset();
      if(!card) return;
      tilted=card;
      const box=card.getBoundingClientRect();
      const x=(e.clientX-box.left)/box.width-.5, y=(e.clientY-box.top)/box.height-.5;
      card.style.transform=`perspective(1100px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-3px)`;
    };
    const cancel = () => {if(preference.matches){animations.forEach(a=>a.cancel());reset();}};
    const visibility = () => root.classList.toggle('motion-tab-hidden',document.hidden);
    document.addEventListener('visibilitychange',visibility);
    root.addEventListener('pointermove',move,{passive:true});
    root.addEventListener('pointerleave',reset);
    preference.addEventListener('change',cancel);
    return () => {observer.disconnect();loops.disconnect();animations.forEach(a=>a.cancel());reset();root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',reset);preference.removeEventListener('change',cancel);document.removeEventListener('visibilitychange',visibility);};
  }, []);
  return <div ref={ref} className="page-motion">{children}</div>;
}
