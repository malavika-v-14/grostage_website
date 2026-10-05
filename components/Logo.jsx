import Link from 'next/link';
export default function Logo() {
  return <Link href="/" className="logo" aria-label="Grostage home"><span className="logo-window"><img src="/brand/grostage-original.png" alt="Grostage" /></span></Link>;
}
