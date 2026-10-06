import PageIntro from '@/frontend/components/PageIntro';
import CinematicReel from '@/frontend/components/CinematicReel';
import WorkGallery from '@/frontend/components/WorkGallery';
import CTA from '@/frontend/components/CTA';
import {works} from '@/backend/lib/content';
export const metadata={title:'Our Work — Grostage'};
export default function Work(){return <main id="main-content" className="studio-work-page"><PageIntro label="SELECTED WORK / 2026" title="Different challenges." accent="Purposeful solutions." description="Digital products, connected operations and growth experiences. Built around real business needs." /><CinematicReel works={works} /><WorkGallery works={works} /><CTA /></main>;}
