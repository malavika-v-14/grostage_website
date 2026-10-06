import { q } from './db';

// Public preview content transcribed/adapted from the supplied company profile.
// Database-backed management and seeding are the next review stages.
export const services = [
  {title: 'Digital Products', slug: 'digital-products', icon: '◇', description: 'Digital experiences built around real users and real business requirements.', items: ['Websites & e-commerce', 'Mobile applications', 'SaaS & product development', 'Custom software'], detail: 'From a single-page website to a complete digital product, we build for the next stage of the business. Corporate websites, custom stores, payment integrations and cross-platform applications bring the experience together.'},
  {title: 'Business Technology', slug: 'business-technology', icon: '⌘', description: 'The right software, connected to the way your business actually works.', items: ['ERP & CRM systems', 'Operations & inventory', 'Workflow automation', 'APIs & integrations'], detail: 'We turn business processes into digital systems. Sales, purchasing, accounting, customer management and reporting come together in tools designed around your operations.'},
  {title: 'AI & Data', slug: 'ai-data', icon: '✳', description: 'Make data useful. Make automation intelligent. Turn information into action.', items: ['AI assistants & chatbots', 'AI-powered workflows', 'Power BI & analytics', 'Document processing'], detail: 'We use AI, automation and analytics to help businesses reduce repetitive work and make better decisions. Our capabilities include AI integrations, automated reporting, operational dashboards and notifications.'},
  {title: 'Digital Growth', slug: 'digital-growth', icon: '↗', description: 'Connect your digital products with the people who need them.', items: ['Strategy & performance', 'Social media & content', 'SEO & digital presence', 'Campaigns & video'], detail: 'A digital product is only valuable when it reaches the right audience. Our growth services combine strategy, creative execution and performance marketing, from campaign planning to search and social.'},
];
export const steps = [['Discover', 'Understand the business, users and objectives.'], ['Define', 'Translate requirements into a clear strategy and scope.'], ['Design', 'Create the experience, workflows and product architecture.'], ['Build', 'Develop, integrate, test and refine.'], ['Launch', 'Deploy the solution and prepare the business for adoption.'], ['Grow', 'Measure, optimize, automate and continuously improve.']];
export const works = [
  {id: 1, slug: 'fruitup', title: 'FruitUp', category: 'E-commerce / Digital product', image: '/projects/profile-11-0.jpeg', tags: ['E-commerce', 'Subscriptions', 'Brand website'], excerpt: 'Fresh thinking for fresh-cut fruit. A brand-led commerce platform built around everyday goals.', content: "A brand-led e-commerce platform for FruitUp’s fresh-cut fruit boxes, with a goal-based product catalogue and both subscription and single-purchase ordering.\n\n## The experience\n\nThe platform brings a brand website and product catalogue together, giving customers routes to discover fruit boxes and choose how they want to order.\n\n## Built around the business\n\nDigital marketing alongside the FruitUp platform connects content, campaigns and performance channels so the product reaches the right customers.", gallery: '/projects/profile-6-0.jpeg'},
  {id: 2, slug: 'chanakya-properties', title: 'Chanakya Properties', category: 'Real estate / Web experience', image: '/projects/profile-11-2.jpeg', tags: ['Website', 'Property search', 'UI/UX'], excerpt: 'A clearer path to the right property, with discovery at the heart of the experience.', content: 'A property platform with search by location, type and budget, verified listings, and dedicated routes to post a requirement or list a property.\n\n## Purposeful discovery\n\nThe digital experience organizes property search around the criteria people use to make decisions: where they want to live, the kind of property they need, and their budget.\n\n## Connected journeys\n\nDedicated routes support people looking for a property as well as those listing one, bringing both sides of the process into one platform.'},
  {id: 3, slug: 'custom-erp', title: 'Custom ERP', category: 'Business systems / Automation', image: '/projects/profile-11-1.jpeg', tags: ['ERP', 'CRM', 'Reporting'], excerpt: 'One connected view of selling, stock, accounting and customer relationships.', content: 'A business system covering selling, stock, accounting and CRM, with shortcuts, reports and sales trends that work across desktop, tablet and mobile.\n\n## Operations, connected\n\nThe system brings core business functions into a shared working environment. Shortcuts and reports help teams move between everyday tasks and the information behind them.\n\n## Across devices\n\nDesktop, tablet and mobile views keep the operational experience available across different working contexts.'},
  {id: 4, slug: 'warehouse-app', title: 'Warehouse App', category: 'Mobile application / Logistics', image: '/projects/profile-11-3.jpeg', tags: ['Mobile app', 'Operations', 'Logistics'], excerpt: 'Warehouse operations, from item search to dispatch, in the palm of your hand.', content: 'A warehouse operations app for item search, sales and purchase orders, pick lists, stock by location and a live view of dispatches and deliveries.\n\n## Designed for everyday operations\n\nItem search and stock by location bring warehouse information into a mobile workflow. Sales orders, purchase orders and pick lists support the next operational step.\n\n## A live view\n\nDispatch and delivery views connect the warehouse workflow with the movement of goods.'},
  {id: 5, slug: 'samsung-exclusive-store', title: 'Samsung Exclusive Store', category: 'Campaigns / Social media', image: '/projects/profile-13-0.jpeg', imageAlt: 'Abstract ribbon artwork from the Grostage company profile', representative: true, tags: ['Campaigns', 'Social media', 'Content'], excerpt: 'Campaign-led content that keeps a local retail store consistently visible.', content: 'Campaign and social media work for a Samsung exclusive retail store, built to keep the store consistently visible to its local audience through campaign-led content.\n\n## Consistent presence\n\nThe work combines campaigns, social media and content around the store’s local audience.\n\n## Image note\n\nThe company profile describes this engagement without campaign images. The visual shown here is Grostage artwork from the supplied profile.'},
  {id: 6, slug: 'soorya-solar', title: 'Soorya Solar', category: 'Brand growth / Digital marketing', image: '/projects/profile-8-0.jpeg', imageAlt: 'Technology illustration from the Grostage company profile', representative: true, tags: ['Brand', 'Social media', 'SEO'], excerpt: 'A clearer digital presence and a consistent voice across social and search.', content: 'Brand-led digital marketing for Soorya Solar, shaping a clearer digital presence and a consistent voice across social and search.\n\n## A connected presence\n\nBrand, social media and SEO form the foundation of this digital marketing engagement.\n\n## Image note\n\nThe company profile describes this engagement without campaign images. The visual shown here is Grostage technology artwork from the supplied profile.'},
];

const workColumns = `id,title,slug,category,excerpt,content,image,image_alt,representative,gallery,tags,published,created_at`;

export function normalizeWork(row) {
  return {
    ...row,
    tags: Array.isArray(row.tags)
      ? row.tags
      : String(row.tags || '').split(',').map(tag => tag.trim()).filter(Boolean),
    imageAlt: row.image_alt || row.imageAlt || '',
    representative: Boolean(row.representative),
  };
}

let worksReady;
export async function ensureWorksTable() {
  if (!worksReady) worksReady = (async () => {
    await q(`CREATE TABLE IF NOT EXISTS works (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT DEFAULT '',
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      image TEXT DEFAULT '',
      image_alt TEXT DEFAULT '',
      representative BOOLEAN DEFAULT false,
      gallery TEXT DEFAULT '',
      tags TEXT DEFAULT '',
      published BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now()
    )`);
    for (const work of works) {
      await q(`INSERT INTO works(title,slug,category,excerpt,content,image,image_alt,representative,gallery,tags,published)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true) ON CONFLICT(slug) DO NOTHING`, [
        work.title, work.slug, work.category, work.excerpt, work.content, work.image,
        work.imageAlt || '', Boolean(work.representative), work.gallery || '', work.tags.join(', ')
      ]);
    }
  })().catch(error => { worksReady = null; throw error; });
  return worksReady;
}

export async function getWorks({ includeDrafts = false } = {}) {
  try {
    await ensureWorksTable();
    const rows = await q(`SELECT ${workColumns} FROM works ${includeDrafts ? '' : 'WHERE published'} ORDER BY id ASC`);
    const normalized = rows.map(normalizeWork);
    return includeDrafts ? normalized : normalized.map(work => ({
      ...work,
      image: String(work.image || '').trim() || '/projects/work-placeholder.svg',
    }));
  } catch (error) {
    console.error('Work content read failed', error);
    return includeDrafts ? [] : works;
  }
}

export async function getWork(slug, { includeDrafts = false } = {}) {
  try {
    await ensureWorksTable();
    const rows = await q(`SELECT ${workColumns} FROM works WHERE slug=$1 ${includeDrafts ? '' : 'AND published'} LIMIT 1`, [slug]);
    return rows[0] ? normalizeWork(rows[0]) : null;
  } catch (error) {
    console.error('Work content read failed', error);
    return works.find(work => work.slug === slug) || null;
  }
}
export const samplePosts = [
  {id: 'sample-1', slug: 'technology-with-a-business-purpose', title: 'Technology with a business purpose.', category: 'Perspective', image: '/projects/profile-13-0.jpeg', excerpt: 'Start with the problem. Then build the right digital solution around it.', content: 'Businesses rarely need technology for the sake of technology. They need better ways to acquire customers, manage operations, automate repetitive work, understand data and deliver better experiences.\n\n## Start with the business\n\nGrostage works with businesses to understand the problem first, then design and build the right digital solution around it. Strategy gives the work direction: understanding the business, its goals and its challenges.\n\n## Bring the disciplines together\n\nDesign creates clear and purposeful experiences. Technology turns those experiences into reliable websites, software and systems. Growth connects the product with marketing, automation and measurable business objectives.\n\n## Build for what comes next\n\nA practical solution needs to be useful and maintainable. The next stage of the business should shape the decisions made today.'},
  {id: 'sample-2', slug: 'from-information-to-action', title: 'From information to insight to action.', category: 'AI & Data', image: '/projects/profile-8-0.jpeg', excerpt: 'Where AI, automation and analytics meet everyday business operations.', content: 'Grostage uses AI, automation and analytics to help businesses reduce repetitive work and make better decisions. The focus is practical: useful information, clearer insight and workflows that support action.\n\n## Make data useful\n\nPower BI dashboards, sales analytics, financial reporting and operational dashboards bring information into the context of business decisions. Automated reporting connects this information to recurring needs.\n\n## Make automation intelligent\n\nAI assistants, chatbots, document processing and AI-powered workflows can become parts of a broader business system. Integrations connect these capabilities with the tools a team uses.\n\n## Connect the workflow\n\nWorkflow automation, API integrations, data processing and notifications connect information with the next step. The starting point remains the business process that needs to improve.'},
  {id: 'sample-3', slug: 'building-commerce-around-customers', title: 'Build commerce around your customers.', category: 'Digital Products', image: '/projects/profile-11-0.jpeg', excerpt: 'A look at brand, product discovery and choice through the FruitUp platform.', content: 'The FruitUp platform combines a brand-led e-commerce experience with a goal-based catalogue for fresh-cut fruit boxes. It supports both subscription and single-purchase ordering.\n\n## Give discovery a purpose\n\nA goal-based catalogue organizes products around what customers are looking for. The website and commerce experience work together to connect brand identity with product discovery.\n\n## Support different ways to order\n\nSubscriptions and individual purchases offer different routes through the same platform. The product experience brings these choices into the ordering journey.\n\n## Connect the platform with growth\n\nDigital marketing alongside FruitUp connects content, campaigns and performance channels so the product reaches the right customers.'},
  {id: 'sample-4', slug: 'from-business-problem-to-outcome', title: 'Six steps from problem to possibility.', category: 'Our Approach', image: '/projects/profile-11-1.jpeg', excerpt: 'Discover, define, design, build, launch and grow—with the business at the centre.', content: 'Grostage’s approach starts with the business problem and carries through to continuous improvement. Six connected stages give the work a clear direction.\n\n## Discover and define\n\nFirst, understand the business, users and objectives. Then translate the requirements into a clear strategy and scope. These stages establish what the solution needs to achieve.\n\n## Design and build\n\nCreate the experience, workflows and product architecture. Develop, integrate, test and refine the solution around that foundation.\n\n## Launch and grow\n\nDeploy the solution and prepare the business for adoption. After launch, measure, optimize, automate and continuously improve. The partnership continues as the business moves forward.'},
].map(p => ({...p, created_at: '2026-10-05T00:00:00.000Z', sample: true, published: true}));
export const testimonials = [
  {quote: 'A clearer way to connect our ideas, our operations and the next stage of our business.', name: 'Business leader', role: 'Digital transformation', initials: '01'},
  {quote: 'From the first conversation to the finished experience, the focus stays on what the business needs.', name: 'Product founder', role: 'Digital product development', initials: '02'},
  {quote: 'One team bringing design, technology and growth into the same conversation.', name: 'Growth partner', role: 'Strategy & execution', initials: '03'},
];
