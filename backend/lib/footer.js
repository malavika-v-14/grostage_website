import { q } from '@/backend/lib/db';
export const defaultFooter = {
  tagline: 'Digital products. Technology. Growth.', email: 'info@grostage.com', phone: '', address: '',
  links: 'About Us|/about\nServices|/services\nOur Work|/work\nBlog|/blog\nClient Stories|/client-stories\nContact|/contact',
  socials: 'LinkedIn|https://linkedin.com/company/grostage\nInstagram|https://instagram.com/grostage_',
  copyright: '© 2026 Grostage. All rights reserved.'
};
export async function getFooter() {
  try { const r = await q("SELECT value FROM settings WHERE key='footer'"); return { ...defaultFooter, ...(r[0]?.value || {}) }; } catch { return defaultFooter; }
}
export const parseLinks = (s = '') => s.split('\n').map(l => l.split('|')).filter(a => a[0] && a[1]).map(([label, href]) => ({ label: label.trim(), href: href.trim() }));
