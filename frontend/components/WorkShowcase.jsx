'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const number = n => String(n).padStart(2, '0');

export default function WorkShowcase({ works, gallery = false }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const touch = useRef(null);
  const reduce = useReducedMotion();
  if (!works.length) return null;
  const index = Math.min(active, works.length - 1);
  const work = works[index];
  const select = next => {
    setDirection(next > index ? 1 : -1);
    setActive((next + works.length) % works.length);
  };
  const transition = { duration: reduce ? 0 : .65, ease: [.22, 1, .36, 1] };
  const tilt = e => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--tilt-x', `${(e.clientX - r.left) / r.width * 5 - 2.5}deg`);
    e.currentTarget.style.setProperty('--tilt-y', `${2 - (e.clientY - r.top) / r.height * 4}deg`);
  };
  const resetTilt = e => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
  };
  return <section className={`studio-showcase${gallery ? ' is-gallery' : ''}`} aria-label={gallery ? 'Project gallery' : 'Selected work'}>
    <div className="studio-showcase-heading">
      <div><p className="studio-label"><span /> {gallery ? 'THE PROJECT COLLECTION' : 'SELECTED WORK'}</p>
        <h2>{gallery ? 'A different' : 'Real businesses.'}<br /><span className="serif">{gallery ? 'perspective.' : 'Thoughtful solutions.'}</span></h2></div>
      {gallery ? <p className="studio-heading-note">A closer look at the ideas<br />we bring to life. Explore the collection.</p> : <Link href="/work" className="studio-all">View all work <span aria-hidden="true">↗</span></Link>}
    </div>
    <div className="studio-project-stage" role="region" aria-roledescription="carousel" aria-label="Featured projects" tabIndex={0}
      onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select(index + (e.key === 'ArrowRight' ? 1 : -1)); } }}
      onTouchStart={e => { touch.current = [e.touches[0].clientX, e.touches[0].clientY]; }}
      onTouchEnd={e => { if (!touch.current) return; const dx = e.changedTouches[0].clientX - touch.current[0]; const dy = e.changedTouches[0].clientY - touch.current[1]; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) select(index + (dx < 0 ? 1 : -1)); touch.current = null; }}>
      <span className="studio-stage-number" aria-hidden="true">{number(index + 1)}</span>
      {gallery && works.length > 1 && [-1, 1].map(offset => {
        const preview = works[(index + offset + works.length) % works.length];
        return <button key={offset} className={`studio-side side-${offset < 0 ? 'left' : 'right'}`} onClick={() => select(index + offset)} aria-label={`${offset < 0 ? 'Previous' : 'Next'} project: ${preview.title}`}><img src={preview.image} alt="" /><span>{preview.title}</span></button>;
      })}
      <div className="studio-project-visual" onPointerMove={tilt} onPointerLeave={resetTilt}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div className="studio-project-frame" key={work.slug} initial={{ opacity: 0, x: reduce ? 0 : direction * 65, rotate: reduce ? 0 : direction * 3 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: reduce ? 0 : direction * -40 }} transition={transition}>
            <div className="studio-frame-top"><span><i /><i /><i /></span><span>GROSTAGE / {work.title}</span><span>{number(index + 1)}</span></div>
            <Link href={`/work/${work.slug}`} className="studio-image-link" aria-label={`View ${work.title} project`} data-cursor="View"><img src={work.image} alt={work.imageAlt || `${work.title} project`} loading="lazy" /><span className="studio-view">Explore project <b aria-hidden="true">↗</b></span></Link>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="studio-project-copy" aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false} mode="wait"><motion.div key={work.slug} initial={{ opacity: 0, y: reduce ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -12 }} transition={{ ...transition, duration: reduce ? 0 : .25 }}>
          <p className="studio-label">{work.category}</p><h3>{work.title}</h3><p className="studio-excerpt">{work.excerpt}</p>
          <div className="studio-tags">{work.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          {work.representative && <small className="studio-art-note">Representative artwork from the company profile.</small>}
        </motion.div></AnimatePresence>
      </div>
    </div>
    <div className="studio-project-bottom">
      <div className="studio-project-picker" aria-label="Choose a project">{works.map((w, i) => <button key={w.slug} className={i === index ? 'is-active' : ''} aria-label={`Show ${w.title}`} aria-pressed={i === index} onClick={() => select(i)}><img src={w.image} alt="" loading="lazy" /><span>{number(i + 1)}</span></button>)}</div>
      <div className="studio-project-controls"><span>{number(index + 1)} <i>/ {number(works.length)}</i></span><button onClick={() => select(index - 1)} aria-label="Previous project">←</button><button onClick={() => select(index + 1)} aria-label="Next project">→</button></div>
    </div>
  </section>;
}
