'use client';
import { useState } from 'react';
import ProjectCard from './ProjectCard';
export default function WorkGallery({works}) {
  const [filter,setFilter] = useState('All work');
  const categories = ['All work','Digital products','Business systems','Digital growth'];
  const filtered = works.filter(w => filter === 'All work' || (filter === 'Digital products' ? [1,2,4].includes(w.id) : filter === 'Business systems' ? w.id === 3 : [5,6].includes(w.id)));
  return <section className="sec wrap"><div className="filter-bar" aria-label="Filter projects">{categories.map(c => <button key={c} aria-pressed={filter===c} onClick={() => setFilter(c)}>{c}</button>)}<span>{String(filtered.length).padStart(2,'0')} PROJECTS</span></div><div className="work-grid">{filtered.map(w => <ProjectCard work={w} key={w.slug} index={w.id-1} />)}</div></section>;
}
