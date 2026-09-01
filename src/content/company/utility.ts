import type { ContentRecord } from '@/lib/routes/route-schema';

/**
 * UTILITY AND LEGACY-DUPLICATE PAGES
 * ==================================
 * Two problems solved in one file.
 *
 * 1. THE HTML SITEMAP
 * -------------------
 * `/html-sitemap` had a template wired into the resolver and no route to
 * render on, while the footer pointed at `/sitemap` — which is not a route
 * and which `production-redirects.json` 308s to `/services`. Every page on
 * the site therefore carried a "Sitemap" link that landed on Services.
 *
 * 2. THE WIX HOMEPAGE DUPLICATES
 * ------------------------------
 * Wix left four homepage artefacts — `/home`, `/home-1-1`, `/home-1-1-1` and
 * `/homeab` — and all four were serving the identical title "Entire FM |
 * Total Facilities Management & Engineering" and the identical H1. Four
 * indexable-or-not pages sharing one title string is a duplicate signal in
 * its own right, separate from whether the body copy differs.
 *
 * They must stay live 200s under the legacy rule, so instead each is given an
 * honest, distinct identity: they are secondary entry points, and each says
 * what it is and sends the reader to the real page. Three of the four are
 * already held at noindex by the indexation tiers; this stops the fourth
 * competing with the homepage on title alone.
 */

const sitemapRecord: ContentRecord = {
  path: '/html-sitemap',
  title: 'Site Index | Every Page on EntireFM',
  metaDescription:
    'A complete index of every page on the EntireFM site, covering services, sectors, locations, compliance guidance and articles, organised by section.',
  h1: 'Site index',
  eyebrow: 'Navigation',
  heroIntro:
    'Every page on this site in one place, grouped by section. Useful if you are looking for something specific, and useful to search engines finding their way through the estate.',
  heroDescription: 'A complete, crawlable index of the site.',
  historicIntent: 'Utility navigation page',
  primaryIntent: 'entirefm site index',
  secondaryIntents: ['entirefm sitemap', 'all entirefm pages'],
  pageType: 'company',
  service: null,
  sector: null,
  location: null,
  historicTopics: ['Navigation'],
  requiredSections: ['hero', 'body'],
  sections: [
    {
      heading: 'How this page is organised',
      body: 'Pages are grouped by what they are for: services, the sectors we work in, locations, compliance guidance, articles and company information. The XML sitemap for search engines is at /sitemap.xml.',
    },
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Site index', url: '/html-sitemap' },
  ],
  relatedRoutes: ['/services', '/sectors', '/locations', '/compliance', '/blog', '/contact-us'],
  conversionGoal: 'Aid navigation and provide a crawl path to every route',
  verificationRequirements: ['Every listed page must resolve to a live route'],
  contentStatus: 'CONTENT_COMPLETE',
};

/** Distinct identities for the four Wix homepage artefacts. */
function entryPoint(
  path: string,
  title: string,
  h1: string,
  intro: string,
  body: string
): ContentRecord {
  return {
    path,
    title,
    metaDescription: intro.slice(0, 158),
    h1,
    eyebrow: 'EntireFM',
    heroIntro: intro,
    heroDescription: intro,
    historicIntent: 'Legacy Wix homepage variant',
    primaryIntent: 'entirefm facilities management',
    secondaryIntents: ['facilities management company uk', 'commercial fm provider'],
    pageType: 'company',
    service: null,
    sector: null,
    location: null,
    historicTopics: ['Company overview'],
    requiredSections: ['hero', 'body', 'cta'],
    sections: [
      { heading: 'What EntireFM does', body },
      {
        heading: 'Where to go next',
        body: 'The main site covers all of this in detail. The services index lists what we maintain, the sectors index explains how the approach changes by building type, and the Compliance Centre sets out what the law actually requires as distinct from what the industry habitually does.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: h1, url: path },
    ],
    relatedRoutes: ['/', '/services', '/sectors', '/compliance', '/contact-us'],
    conversionGoal: 'Route a legacy entry point into the current site',
    verificationRequirements: ['Must not duplicate the homepage title or H1'],
    contentStatus: 'CONTENT_COMPLETE',
  };
}

export const UTILITY_CONTENT: Record<string, ContentRecord> = {
  '/html-sitemap': sitemapRecord,

  '/home': entryPoint(
    '/home',
    'EntireFM | Commercial Facilities Management Across the UK',
    'EntireFM: commercial facilities management',
    'An entry point carried over from our previous site. EntireFM maintains commercial property across the UK, providing planned maintenance, mechanical and electrical engineering, statutory compliance and reactive cover under one contract.',
    'EntireFM is an independently owned facilities management provider, maintaining commercial property across the UK since 2009. The scope covers hard services (mechanical and electrical, HVAC, plumbing and gas, fire and emergency systems, building fabric) and soft services including cleaning, security and grounds maintenance. Work is held under a single contract so responsibility does not move between suppliers while a building sits unusable.'
  ),

  '/home-1-1': entryPoint(
    '/home-1-1',
    'About EntireFM | Independent FM Provider Since 2009',
    'About EntireFM',
    'A legacy address from our previous site. EntireFM began in 2009 as a small building maintenance company and now maintains commercial property nationwide through regional operations.',
    'The business started in 2009 doing building maintenance for local companies and letting agents. It grew by reputation rather than by sales effort, and most of those first clients are still clients. The estate now includes multinational property management firms, motorway service areas, logistics and manufacturing operations, and supermarket groups, each with a different operating rhythm and a different definition of an unacceptable failure.'
  ),

  '/home-1-1-1': entryPoint(
    '/home-1-1-1',
    'EntireFM Services Overview | Hard and Soft FM',
    'EntireFM services overview',
    'A legacy address from our previous site, summarising the services EntireFM delivers across commercial property in the UK.',
    'Hard services cover mechanical and electrical installations, fixed wire testing, HVAC and refrigeration, plumbing and drainage, commercial gas, fire detection and emergency lighting, building fabric, and lifting equipment. Soft services cover contract and industrial cleaning, security, grounds maintenance and waste. Specialist work includes drone building inspection and contract lifting. Every planned maintenance schedule is built from an asset survey rather than a template.'
  ),

  '/homeab': entryPoint(
    '/homeab',
    'EntireFM | Facilities Management Enquiries',
    'Talk to EntireFM',
    'A legacy address from our previous site. If you are looking to discuss a maintenance scope, a compliance review or a single-site requirement, this is the right company and the contact details are below.',
    'EntireFM maintains commercial property across the UK. Most conversations start in one of three places: an estate whose current provider is not evidencing compliance, a building with a recurring fault nobody has owned, or a contract coming up for renewal where the incumbent scope has drifted from what the site actually needs. Any of those is a reasonable place to begin.'
  ),
};
