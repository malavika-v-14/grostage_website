import PageIntro from '@/frontend/components/PageIntro';
import CinematicReel from '@/frontend/components/CinematicReel';
import WorkGallery from '@/frontend/components/WorkGallery';
import CTA from '@/frontend/components/CTA';
import {getWorks} from '@/backend/lib/content';
export const metadata={title:'Our Work — Grostage'};
export const dynamic='force-dynamic';
export default async function Work(){const works=await getWorks();return <main id="main-content" className="studio-work-page"><PageIntro label="SELECTED WORK / 2026" title="Different challenges." accent="Purposeful solutions." description="Digital products, connected operations and growth experiences. Built around real business needs." /><CinematicReel works={works} /><WorkGallery works={works} /><CTA /></main>;}
