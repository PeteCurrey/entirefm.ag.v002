#!/usr/bin/env node
/**
 * GENERATE PRODUCTION URL MANIFEST
 * ==================================
 * Generates /config/production-url-manifest.json directly from
 * /config/route-registry.json.
 *
 * Run: npm run generate:manifest
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../config/route-registry.json');
const MANIFEST_PATH = path.join(__dirname, '../config/production-url-manifest.json');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const routes = registry.routes;

const urls = routes.map(r => ({
  path: r.path,
  url: `https://www.entirefm.com${r.path === '/' ? '' : r.path}`,
  routeType: r.routeType,
  protected: r.protected,
  indexable: r.indexable,
  indexExpected: r.indexable,
  canonicalExpected: 'self',
  originEstate: r.historic ? 'WIX' : (r.routeProvenance === 'NEW_GROWTH' ? 'GROWTH' : 'CURRENT_LIVE'),
  sitemapGroup: r.sitemapGroup,
  sitemapPriority: r.sitemapPriority,
  provenance: r.routeProvenance,
  contentStatus: r.contentStatus,
}));

const manifest = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: 'EntireFM Production URL Manifest — generated from route-registry.json. Do not edit manually.',
  version: '3.0.0',
  generated: new Date().toISOString().split('T')[0],
  authority: '/config/route-registry.json',
  generatedBy: 'scripts/generate-production-manifest.js',
  warning: 'This file is auto-generated. Edit route-registry.json and re-run npm run generate:manifest.',
  summary: {
    total: urls.length,
    protected: urls.filter(u => u.protected).length,
    indexable: urls.filter(u => u.indexable).length,
    historicWix: urls.filter(u => u.originEstate === 'WIX').length,
    currentLive: urls.filter(u => u.originEstate === 'CURRENT_LIVE').length,
    growth: urls.filter(u => u.originEstate === 'GROWTH').length,
  },
  urls,
};

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log('══════════════════════════════════════════════════════════════');
console.log('  PRODUCTION URL MANIFEST — GENERATED');
console.log('══════════════════════════════════════════════════════════════');
console.log(`  Routes from registry:  ${routes.length}`);
console.log(`  Routes in manifest:    ${urls.length}`);
console.log(`  Protected routes:      ${manifest.summary.protected}`);
console.log(`  Indexable routes:      ${manifest.summary.indexable}`);
console.log(`  Historic Wix routes:   ${manifest.summary.historicWix}`);
console.log(`  Output:                config/production-url-manifest.json`);
console.log('══════════════════════════════════════════════════════════════');
console.log('  ✓ MANIFEST GENERATED — no drift possible');
console.log('══════════════════════════════════════════════════════════════');
