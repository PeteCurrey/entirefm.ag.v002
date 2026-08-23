#!/usr/bin/env node
/**
 * ORPHAN WIX PAGE RECOVERY
 * ========================
 * Adds legacy Wix URLs that the sitemaps never listed.
 *
 * WHY THE SITEMAPS WERE NOT ENOUGH
 * --------------------------------
 * The first pass built the legacy estate from both Wix XML sitemaps (192 URLs).
 * A sitemap only lists what Wix currently chooses to publish, so any page
 * excluded from search, orphaned from navigation, or dropped from the sitemap
 * is invisible to it — and Search Console cannot fill the gap because the
 * export only reaches back to 2026-05-07, long after the Wix estate was live.
 *
 * Both Wix platforms embed their own complete page manifest in the rendered
 * HTML as `pageUriSEO` entries. That manifest is authoritative: it is the list
 * Wix itself routes from. Extracting it found 159 pages on the older estate and
 * 75 on the Studio estate, including pages absent from both sitemaps.
 *
 * WHAT IS EXCLUDED, AND WHY THAT IS SAFE
 * --------------------------------------
 * Wix names dynamic-page templates with a bracketed suffix — "Items (All)",
 * "Services (Title)", "FM Industries (Item)". These are editor templates, not
 * addressable URLs, and every one was probed and confirmed to return the Wix
 * 404 page. Members-area pages (/my-account, /followers, /settings …) are Wix
 * system routes for an app that was never installed, and also return 404.
 * Restoring either group would create pages that never existed.
 *
 * Every exclusion below was verified by fetching it, not assumed from its name.
 *
 * Usage: node scripts/recover-orphan-wix-pages.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REGISTRY = path.join(ROOT, 'config/route-registry.json');

const G1 = 'https://petercurrey.wixsite.com/efm-new';
const G2 = 'https://petercurrey.wixstudio.com/efmsut17724';

/**
 * Orphan pages confirmed to render real content on Wix.
 * `title` is the page title recorded in Wix's own manifest.
 */
const RECOVERED = [
  // ── Wix Studio estate ────────────────────────────────────────────────────
  {
    path: '/access-control',
    title: 'Access Control',
    routeType: 'service',
    sitemapGroup: 'hard-fm',
    estate: 'g2',
    note: 'Flat form of the service. Wix served this alongside /mechanical-electrical/access-control; both existed, so both are restored.',
  },
  {
    path: '/emergency-light-testing',
    title: 'Emergency Light Testing',
    routeType: 'service',
    sitemapGroup: 'hard-fm',
    estate: 'g2',
    note: 'Flat form of /mechanical-electrical/emergency-light-testing.',
  },
  {
    path: '/sheffield',
    title: 'Crane Hire Sheffield',
    routeType: 'geographic-service',
    sitemapGroup: 'local-services',
    estate: 'g2',
    note: 'Crane hire landing page, not a general FM city page. Flat form of /mobile-crane-hire/sheffield.',
  },
  {
    path: '/chesterfield',
    title: 'Crane Hire Chesterfield',
    routeType: 'geographic-service',
    sitemapGroup: 'local-services',
    estate: 'g2',
    note: 'Crane hire landing page. Flat form of /mobile-crane-hire/chesterfield.',
  },
  {
    path: '/truck-mount-crane-hire',
    title: 'Truck Mount Crane Hire',
    routeType: 'service',
    sitemapGroup: 'specialist-services',
    estate: 'g2',
    note: 'Flat form of /mobile-crane-hire/truck-mount-crane-hire.',
  },
  {
    path: '/arena-facilities-management-1',
    title: 'Arena Facilities Management',
    routeType: 'sector',
    sitemapGroup: 'sectors',
    estate: 'g2',
    note: 'Wix duplicate of /arena-facilities-management, kept live as its own URL.',
  },
  {
    path: '/facilities-management-glossary',
    title: 'FM Glossary',
    routeType: 'post',
    sitemapGroup: 'insights',
    estate: 'g2',
    note: 'Flat form of /fm-support-n-contact/facilities-management-glossary.',
  },
  {
    path: '/facilities-management-industries',
    title: 'Facilities Management Industries',
    routeType: 'sector',
    sitemapGroup: 'sectors',
    estate: 'g2',
    note: 'Sector index page. Wix manifest title read "Login", which appears to be an editor labelling error — the page renders sector content.',
  },
  {
    path: '/account-registration',
    title: 'Account Registration',
    routeType: 'company',
    sitemapGroup: 'company',
    estate: 'g2',
    note: 'Flat form of /client-login/account-registration.',
  },
  {
    path: '/portal',
    title: 'Client Portal',
    routeType: 'company',
    sitemapGroup: 'company',
    estate: 'g2',
    note: 'Client portal entry point.',
  },
  {
    path: '/home-1-1',
    title: 'Home',
    routeType: 'home',
    sitemapGroup: 'core',
    estate: 'g2',
    note: 'Homepage variant retained by Wix. Duplicate of / — restored as a live page, expected to be held noindex by the tier gate.',
  },
  {
    path: '/home-1-1-1',
    title: 'New Home Design',
    routeType: 'home',
    sitemapGroup: 'core',
    estate: 'g2',
    note: 'Later homepage design variant. Duplicate of / — live, expected noindex.',
  },

  // ── Older Wix estate ─────────────────────────────────────────────────────
  {
    path: '/home',
    title: 'Home',
    routeType: 'home',
    sitemapGroup: 'core',
    estate: 'g1',
    note: 'Homepage variant on the older estate. Duplicate of / — live, expected noindex.',
  },
  {
    path: '/homeab',
    title: 'Home AB',
    routeType: 'home',
    sitemapGroup: 'core',
    estate: 'g1',
    note: 'A/B homepage variant. Duplicate of / — live, expected noindex.',
  },
  {
    path: '/search',
    title: 'Search Results',
    routeType: 'company',
    sitemapGroup: 'company',
    estate: 'g1',
    note: 'Site search results page. Live, but search-results pages should not be indexed.',
  },
];

/**
 * Verified non-pages. Each was fetched and returned either the Wix 404 page or
 * a hard 404. Recorded so the decision is auditable rather than repeated.
 */
const EXCLUDED = {
  'dynamic-page templates': {
    reason: 'Wix editor templates for dynamic pages, not addressable URLs. All return the Wix 404 page.',
    paths: ['/blank', '/blank-1', '/blank-2', '/blank-4', '/blank-5', '/geo-landing-pages-title', '/fm-industries-item', '/hero-section-video-rotation-item'],
  },
  'members-area system pages': {
    reason: 'Wix Members Area routes for an app that was never installed. All return the Wix 404 page.',
    paths: ['/my-account', '/my-drafts', '/notifications', '/followers', '/settings', '/profile-1', '/profile/admin/profile', '/blog-comments', '/blog-likes', '/blog-posts'],
  },
  'platform routes': {
    reason: 'Wix platform internals. /error404 is the 404 page itself; /post is a bare router that returns 404.',
    paths: ['/error404', '/post', '/fullscreen-page'],
  },
  'wix demo content': {
    reason: 'Unused Wix template demo pages. Never EntireFM content — recommend 410 Gone.',
    paths: ['/fm/epic-battle-montage', '/fm/good-morning-london', '/fm/hero-squad-interview', '/fm/training-session-with-master', '/fm/villain-showdown-finale'],
  },
};

// ── apply ───────────────────────────────────────────────────────────────────

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const existing = new Set(registry.routes.map((r) => r.path));

const added = [];
for (const page of RECOVERED) {
  if (existing.has(page.path)) continue;
  registry.routes.push({
    path: page.path,
    routeType: page.routeType,
    routeProvenance: 'LEGACY_VERIFIED',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: page.sitemapGroup,
    priority: 'P2',
    contentStatus: 'CONTENT_COMPLETE',
    designStatus: 'NOT_STARTED',
    historicSources: [page.estate === 'g1' ? 'wix-generation-1' : 'wix-generation-2'],
    ...(page.estate === 'g1' ? { g1_url: `${G1}${page.path}` } : { g2_url: `${G2}${page.path}` }),
    recoveryNote: page.note,
    discoveredVia: 'wix-internal-page-manifest',
  });
  added.push(page.path);
}

registry.routes.sort((a, b) => (a.path === '/' ? -1 : b.path === '/' ? 1 : a.path.localeCompare(b.path)));

const counts = registry.counts ?? {};
counts.total = registry.routes.length;
counts.protected = registry.routes.filter((r) => r.protected).length;
counts.historic = registry.routes.filter((r) => r.historic).length;
counts.LEGACY_VERIFIED = registry.routes.filter((r) => r.routeProvenance === 'LEGACY_VERIFIED').length;
registry.counts = counts;
registry.orphanRecovery = {
  generated: new Date().toISOString().slice(0, 10),
  method: "Wix internal pageUriSEO manifest, extracted from rendered HTML on both estates",
  recovered: RECOVERED.length,
  excluded: EXCLUDED,
};

if (!process.argv.includes('--dry-run')) {
  fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n');
}

console.log(`Orphan Wix page recovery\n`);
console.log(`  recovered and added : ${added.length}`);
added.forEach((p) => console.log(`      + ${p}`));
console.log(`  already present     : ${RECOVERED.length - added.length}`);
console.log(`  registry total      : ${registry.routes.length}`);
console.log(`\n  verified non-pages excluded:`);
for (const [group, v] of Object.entries(EXCLUDED)) {
  console.log(`      ${group.padEnd(26)} ${String(v.paths.length).padStart(2)}  ${v.reason}`);
}
if (process.argv.includes('--dry-run')) console.log('\n(dry run — registry not written)');
