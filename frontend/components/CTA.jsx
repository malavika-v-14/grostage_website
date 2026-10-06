import Link from 'next/link';
import Reveal from './Reveal';
export default function CTA() {
  return <section className="cta-section"><div className="wrap"><Reveal><p className="eyebrow">GOOD THINGS START WITH A CONVERSATION</p><div className="cta-line"><h2>What’s your<br /><span className="serif">next big thing?</span></h2><Link className="cta-arrow" href="/contact" aria-label="Start a project">↗</Link></div><p>A business problem. A bold idea. Let’s build what comes next.</p></Reveal></div></section>;
}
