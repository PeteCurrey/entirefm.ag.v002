#!/usr/bin/env node
/**
 * HTML SITEMAP ROUTE
 * ==================
 * Registers /html-sitemap.
 *
 * WHY IT IS WORTH A ROUTE
 * -----------------------
 * The footer has always carried a "Sitemap" link pointing at /sitemap, which
 * is not a registered route and which production-redirects.json 308s to
 * /services. So every page on the site linked to a redirect, and a visitor
 * clicking "Sitemap" landed on the services page.
 *
 * The fix could have been to delete the link. An HTML sitemap is worth more
 * than that here: the estate is 259 pages, of which 122 are held at noindex
 * pending differentiation, and the immediate goal is getting a crawler back
 * through legacy URLs that returned 404 for months. A single crawlable page
 * linking to all of them is the cheapest possible help.
 *
 * `TemplateHtmlSitemap` already existed and was already wired into the
 * template resolver for this exact path — it simply had no route to render on.
 *
 * Usage: node scripts/generate-html-sitemap-route.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const REGISTRY = path.join(__dirname, '..', 'config', 'route-registry.json');
const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));

const ROUTE = {
  path: '/html-sitemap',
  routeType: 'company',
  routeProvenance: 'NEW_GROWTH',
  historic: false,
  protected: true,
  indexable: true,
  statusRequired: 200,
  canonical: 'self',
  uniquePageRequired: true,
  sitemapGroup: 'core',
  priority: 'P3',
  contentStatus: 'CONTENT_COMPLETE',
  designStatus: 'COMPLETE',
  historicSources: [],
  note: 'HTML sitemap — crawl path to every route, including those held at noindex.',
};

if (registry.routes.some((r) => r.path === ROUTE.path)) {
  console.log('/html-sitemap already registered — nothing to do.');
  process.exit(0);
}

registry.routes.push(ROUTE);
registry.routes.sort((a, b) => (a.path === '/' ? -1 : b.path === '/' ? 1 : a.path.localeCompare(b.path)));

const counts = registry.counts ?? {};
counts.total = registry.routes.length;
counts.protected = registry.routes.filter((r) => r.protected).length;
counts.historic = registry.routes.filter((r) => r.historic).length;
counts.NEW_GROWTH = registry.routes.filter((r) => r.routeProvenance === 'NEW_GROWTH').length;
registry.counts = counts;

if (!process.argv.includes('--dry-run')) {
  fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n');
}
console.log(`Added /html-sitemap. Registry total: ${registry.routes.length}`);
