import PageIntro from '@/components/PageIntro';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import VideoStories from '@/components/VideoStories';
export const metadata={title:'Client Stories — Grostage'};
export default function Stories(){return <main id="main-content"><PageIntro label="CLIENT STORIES" title="Built together." accent="Better together." description="Behind every digital solution is a business, a team and a shared ambition to move forward." /><Testimonials /><section className="sec wrap"><p className="eyebrow">IN THEIR OWN WORDS</p><h2 className="h2">Stories worth<br /><span className="serif">sharing.</span></h2><p className="preview-note">Video player preview · These are sample YouTube videos, not Grostage client endorsements. Client video links are pending.</p><VideoStories /></section><CTA /></main>;}
