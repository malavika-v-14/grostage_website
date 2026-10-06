'use client';
import { useState } from 'react';
import ProjectCard from './ProjectCard';
export default function WorkGallery({works}) {
  const [filter,setFilter] = useState('All work');
  const categories = ['All work','Digital products','Business systems','Digital growth'];
  const group = work => {
    const category = String(work.category || '').toLowerCase();
    if (/growth|marketing|campaign|social|seo|brand/.test(category)) return 'Digital growth';
    if (/system|erp|crm|automation|logistics|warehouse|operations/.test(category)) return 'Business systems';
    return 'Digital products';
  };
  const filtered = works.filter(work => filter === 'All work' || group(work) === filter);
  return <section className="sec wrap"><div className="filter-bar" aria-label="Filter projects">{categories.map(c => <button key={c} aria-pressed={filter===c} onClick={() => setFilter(c)}>{c}</button>)}<span>{String(filtered.length).padStart(2,'0')} PROJECTS</span></div><div className="work-grid">{filtered.map(w => <ProjectCard work={w} key={w.slug} index={w.id-1} />)}</div></section>;
}
