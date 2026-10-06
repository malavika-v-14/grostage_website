import Link from 'next/link';
import './home.css';
import Testimonials from '@/frontend/components/Testimonials';
import TextFill from '@/frontend/components/TextFill';
import Magnetic from '@/frontend/components/Magnetic';
import { Process } from '@/frontend/components/HomeSections';
import { ExperienceHero, ExperienceServices, ExperienceWork } from '@/frontend/components/ExperienceHome';
import { services, works } from '@/backend/lib/content';

const words = ['AI', 'Websites', 'Business apps', 'ERP', 'Automation', 'Growth'];
export default function Home() {
  return <main id="main-content">
    <ExperienceHero works={works} />
    <div className="hx hx-marq" aria-hidden="true"><div>{[0, 1].map(k => <div className="hx-marq-g" key={k}>{words.map((w, i) => <span key={w} className={i % 2 ? 'o' : ''}>{w}<b>✳</b></span>)}</div>)}</div></div>
    <section className="hx hx-about" id="hx-about">
      <p className="hx-tag"><i /> THE GROSTAGE WAY</p>
      <TextFill className="hx-statement" text="We turn ideas, operations and data into AI-powered digital products that help businesses work better, sell better and grow." />
      <Link href="/about" className="hx-link" data-cursor="Read">About Grostage <span>↗</span></Link>
    </section>
    <ExperienceServices services={services} />
    <ExperienceWork works={works} />
    <Process />
    <Testimonials />
    <section className="hx hx-cta">
      <p className="hx-tag"><i /> LET’S TALK</p>
      <h2>Ready to build <span className="serif">what’s next?</span></h2>
      <Magnetic strength={0.4}><Link href="/contact" className="hx-orb">Start a project <span>↗</span></Link></Magnetic>
    </section>
  </main>;
}
