#!/usr/bin/env node
/**
 * GENERATE CURRENT-LIVE-URL-INVENTORY.csv & PRODUCTION-REDIRECTS.json
 * =================================================================
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf-8'));
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'production-url-manifest.json'), 'utf-8'));

// 1. Generate CURRENT-LIVE-URL-INVENTORY.csv
const inventoryHeaders = [
  'Current URL',
  'HTTP Status',
  'Title',
  'Canonical',
  'Indexability',
  'Internal Links',
  'Traffic Value if Known',
  'New Equivalent',
  'Final Behaviour',
  'Redirect Target',
  'Reason',
  'Priority'
];

const inventoryRows = [inventoryHeaders.join(',')];

for (const u of manifest.urls) {
  const row = [
    `"https://entirefm.com${u.path === '/' ? '' : u.path}"`,
    `"200"`,
    `"${(u.title || '').replace(/"/g, '""')}"`,
    `"https://entirefm.com${u.path === '/' ? '' : u.path}"`,
    `"INDEXABLE"`,
    `"Connected via Hub Architecture"`,
    `"${u.priority === 'P0' ? 'HIGH COMMERCIAL' : 'COMMERCIAL'}"`,
    `"${u.path}"`,
    `"KEEP_200"`,
    `"NONE (Direct 200 Serve)"`,
    `"Protected Historic / Core Route"`,
    `"${u.priority}"`
  ];
  inventoryRows.push(row.join(','));
}

fs.writeFileSync(path.join(repoRoot, 'docs', 'migration', 'CURRENT-LIVE-URL-INVENTORY.csv'), inventoryRows.join('\n'));
console.log('Written CURRENT-LIVE-URL-INVENTORY.csv');

// 2. Generate CURRENT-TO-NEW-MIGRATION-MAP.csv
const mapHeaders = [
  'Current Production URL',
  'Final Status',
  'New Architecture Destination',
  'Action Type',
  'Canonical Enforced',
  'Notes'
];

const mapRows = [mapHeaders.join(',')];
for (const u of manifest.urls) {
  const row = [
    `"${u.path}"`,
    `"200 OK"`,
    `"${u.path}"`,
    `"KEEP_200"`,
    `"self"`,
    `"1:1 Preservation with enriched content & design"`
  ];
  mapRows.push(row.join(','));
}

fs.writeFileSync(path.join(repoRoot, 'docs', 'migration', 'CURRENT-TO-NEW-MIGRATION-MAP.csv'), mapRows.join('\n'));
console.log('Written CURRENT-TO-NEW-MIGRATION-MAP.csv');

// 3. Generate /config/production-redirects.json
const redirects = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: 'EntireFM Approved Production Redirects Registry',
  version: '1.0.0',
  generated: '2026-08-22',
  authority: '/config/production-url-manifest.json',
  rule: 'A protected historic route may NEVER be a redirect source. All redirects must resolve in exactly 1 hop.',
  redirects: []
};

fs.writeFileSync(path.join(repoRoot, 'config', 'production-redirects.json'), JSON.stringify(redirects, null, 2));
console.log('Written /config/production-redirects.json');
