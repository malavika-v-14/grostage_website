import './globals.css';
import './motion.css';
import { Inter, Michroma } from 'next/font/google';
import Nav from '@/components/Nav'; import Footer from '@/components/Footer';
import CursorFX from '@/components/CursorFX';
import SiteLoader from '@/components/SiteLoader';
const inter = Inter({ subsets: ['latin'], variable: '--inter' });
const mich = Michroma({ subsets: ['latin'], weight: '400', variable: '--mich' });
export const metadata = { title: 'Grostage — Built for your next stage', description: 'AI-powered digital products, business technology and growth. Grostage brings strategy, design and technology together to move your business forward.' };
export default function RootLayout({ children }) {
  return <html lang="en" className={inter.variable + ' ' + mich.variable}><body><a href="#main-content" className="skip-link">Skip to content</a><SiteLoader /><CursorFX /><Nav />{children}<Footer /></body></html>;
}
