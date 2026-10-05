import PageIntro from '@/components/PageIntro';
import FilmReel from '@/components/FilmReel';
import WorkGallery from '@/components/WorkGallery';
import CTA from '@/components/CTA';
import {works} from '@/lib/content';
export const metadata={title:'Our Work — Grostage'};
export default function Work(){return <main id="main-content"><PageIntro label="SELECTED WORK / 2026" title="Different challenges." accent="Purposeful solutions." description="Digital products, connected operations and growth experiences. Built around real business needs." /><FilmReel works={works} /><WorkGallery works={works} /><CTA /></main>;}
