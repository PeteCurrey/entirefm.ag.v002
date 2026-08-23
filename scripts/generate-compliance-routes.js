#!/usr/bin/env node
/**
 * COMPLIANCE CENTRE ROUTE REGISTRATION
 * ====================================
 * Adds /compliance and /compliance/{topic} to the route registry.
 *
 * These are NEW_GROWTH routes: they did not exist on either Wix estate, so
 * they are additive and carry no legacy obligation. They are still `protected`
 * — once published and indexed they acquire ranking history of their own, and
 * the estate rule applies to them from that point on.
 *
 * Topic slugs are read from the TypeScript source rather than duplicated here,
 * so adding a topic to src/content/compliance/topics.ts and re-running this is
 * the whole job.
 *
 * Usage: node scripts/generate-compliance-routes.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REGISTRY = path.join(ROOT, 'config', 'route-registry.json');
const TOPICS = path.join(ROOT, 'src', 'content', 'compliance', 'topics.ts');

const source = fs.readFileSync(TOPICS, 'utf8');
const slugs = [...source.matchAll(/^\s{4}slug: '([a-z0-9-]+)',$/gm)].map((m) => m[1]);

if (!slugs.length) {
  console.error('No topic slugs found in topics.ts — check the file format.');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const existing = new Set(registry.routes.map((r) => r.path));

const route = (routePath, priority) => ({
  path: routePath,
  routeType: 'company',
  routeProvenance: 'NEW_GROWTH',
  historic: false,
  protected: true,
  indexable: true,
  statusRequired: 200,
  canonical: 'self',
  uniquePageRequired: true,
  sitemapGroup: 'insights',
  priority,
  contentStatus: 'CONTENT_COMPLETE',
  designStatus: 'COMPLETE',
  historicSources: [],
  note: 'Compliance Centre — additive authority content, not a legacy path.',
});

const added = [];
for (const [routePath, priority] of [['/compliance', 'P1'], ...slugs.map((s) => [`/compliance/${s}`, 'P1'])]) {
  if (existing.has(routePath)) continue;
  registry.routes.push(route(routePath, priority));
  added.push(routePath);
}

registry.routes.sort((a, b) =>
  a.path === '/' ? -1 : b.path === '/' ? 1 : a.path.localeCompare(b.path)
);

const counts = registry.counts ?? {};
counts.total = registry.routes.length;
counts.protected = registry.routes.filter((r) => r.protected).length;
counts.historic = registry.routes.filter((r) => r.historic).length;
counts.NEW_GROWTH = registry.routes.filter((r) => r.routeProvenance === 'NEW_GROWTH').length;
registry.counts = counts;

if (!process.argv.includes('--dry-run')) {
  fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n');
}

console.log(`Compliance Centre routes\n`);
console.log(`  topics found : ${slugs.length}`);
console.log(`  routes added : ${added.length}`);
added.forEach((p) => console.log(`      + ${p}`));
console.log(`  registry total: ${registry.routes.length}`);
