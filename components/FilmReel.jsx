'use client';
import { useState } from 'react';
import Link from 'next/link';
export default function FilmReel({ works }) {
  const [active, setActive] = useState(0);
  const total = works.length;
  return <section className="reel-section" aria-label="Selected work film reel"><div className="reel-backdrop" /><div className="reel-heading"><p className="eyebrow">A DIFFERENT PERSPECTIVE</p><h2>Our <span className="serif">work.</span></h2></div><div className="reel-stage">{works.map((w,i) => {
    let offset = (i - active + total) % total;
    if (offset > total/2) offset -= total;
    return <Link href={'/work/'+w.slug} key={w.slug} className={'reel-frame'+(offset === 0 ? ' is-current' : '')} style={{'--offset': offset, zIndex: total-Math.abs(offset)}} aria-label={'View '+w.title} tabIndex={Math.abs(offset)>2 ? -1 : 0}><img src={w.image} alt={w.title} /><span>{w.title}<b>↗</b></span></Link>;
  })}</div><div className="reel-controls"><button onClick={() => setActive((active+total-1)%total)} aria-label="Previous project">←</button><p aria-live="polite"><span>{String(active+1).padStart(2,'0')} / 06</span>{works[active].title}</p><button onClick={() => setActive((active+1)%total)} aria-label="Next project">→</button></div></section>;
}
