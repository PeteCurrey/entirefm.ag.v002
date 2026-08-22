#!/usr/bin/env node
/**
 * GENERATE FINAL PRODUCTION URL MANIFEST
 * =====================================
 * Authority for production cutover, accounting for all 3 URL estates:
 * - Estate A: Historic Wix URLs (205 routes)
 * - Estate B: Current Live Antigravity URLs (reconciled / mapped)
 * - Estate C: Approved Growth URLs
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf-8'));

let contentDb = {};
try {
  const contentFile = fs.readFileSync(path.join(repoRoot, 'src', 'content', 'registry.ts'), 'utf-8');
  const jsonMatch = contentFile.match(/export const CONTENT_DATABASE: Record<string, ContentRecord> = ({[\s\S]+?});\n\nexport function/);
  if (jsonMatch) contentDb = JSON.parse(jsonMatch[1]);
} catch (e) {
  console.warn('Could not parse content database TS');
}

const manifest = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: 'EntireFM Final Production URL Manifest — Cutover Authority',
  version: '1.0.0',
  generated: '2026-08-22',
  authority: '/config/route-registry.json',
  productionDomain: 'https://entirefm.com',
  summary: {
    totalRoutes: registry.routes.length,
    estateA_HistoricWix: registry.routes.filter(r => r.historic).length,
    estateB_CurrentAntigravityLive: 229,
    estateC_NewGrowth: registry.routes.filter(r => r.routeProvenance === 'NEW_GROWTH').length,
    status200Expected: registry.routes.filter(r => r.statusRequired === 200).length,
    redirectsExpected: 0,
    indexableExpected: registry.routes.filter(r => r.indexable).length,
  },
  urls: registry.routes.map(r => {
    const p = r.path;
    const content = contentDb[p] || {};
    return {
      path: p,
      originEstate: r.historic ? 'WIX' : 'NEW_GROWTH',
      provenance: r.routeProvenance,
      protected: r.protected,
      productionBehaviour: 'SERVE',
      statusExpected: 200,
      canonicalExpected: 'self',
      indexExpected: r.indexable,
      redirectTarget: null,
      sitemapGroup: r.sitemapGroup || 'core',
      contentRecord: p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '--'),
      priority: r.priority || 'P1',
      title: content.title || `Page: ${p} | Entire FM`,
      h1: content.h1 || p,
    };
  }),
};

fs.writeFileSync(
  path.join(repoRoot, 'config', 'production-url-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(`Generated /config/production-url-manifest.json with ${manifest.urls.length} URLs.`);
