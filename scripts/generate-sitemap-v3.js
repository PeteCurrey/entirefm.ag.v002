#!/usr/bin/env node
/**
 * Generate MASTER-SITEMAP-V3.md from route-registry.json
 * Run: node scripts/generate-sitemap-v3.js
 */

const fs = require('fs');
const path = require('path');

const registry = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'config', 'route-registry.json'), 'utf-8')
);
const routes = registry.routes;

const groups = {
  'core': [],
  'hard-fm': [],
  'soft-fm': [],
  'cleaning': [],
  'maintenance': [],
  'specialist-services': [],
  'sectors': [],
  'locations': [],
  'local-services': [],
  'insights': [],
  'company': []
};

for (const r of routes) {
  if (groups[r.sitemapGroup]) groups[r.sitemapGroup].push(r);
}

const groupLabels = {
  'core': 'Core',
  'hard-fm': 'Hard FM — Mechanical, Electrical, Compliance',
  'soft-fm': 'Soft FM — Cleaning, Security, Grounds',
  'cleaning': 'Commercial & Industrial Cleaning',
  'maintenance': 'PPM & Planned Maintenance',
  'specialist-services': 'Specialist Services',
  'sectors': 'Sectors',
  'locations': 'Locations (City FM Hubs)',
  'local-services': 'Geographic Service Pages',
  'insights': 'Insights & Blog',
  'company': 'Company, Support & Legal'
};

const cities = [
  { label: 'LONDON', key: 'london' },
  { label: 'MANCHESTER', key: 'manchester' },
  { label: 'BIRMINGHAM', key: 'birmingham' },
  { label: 'SHEFFIELD', key: 'sheffield' },
  { label: 'LEEDS', key: 'leeds' },
  { label: 'LIVERPOOL', key: 'liverpool' },
  { label: 'NOTTINGHAM', key: 'nottingham' },
  { label: 'DERBY', key: 'derby' },
  { label: 'CHESTERFIELD', key: 'chesterfield' },
  { label: 'LINCOLN', key: 'lincoln' },
  { label: 'BRADFORD', key: 'bradford' },
  { label: 'TELFORD', key: 'telford' },
  { label: 'MIDLANDS', key: 'midland' },
  { label: 'OXFORD', key: 'oxford' },
  { label: 'WIGAN', key: 'wigan' },
  { label: 'BOLTON', key: 'bolton' },
  { label: 'BURY', key: 'bury' },
  { label: 'ROTHERHAM', key: 'rotherham' },
  { label: 'DONCASTER', key: 'doncaster' },
  { label: 'GRIMSBY', key: 'grimsby' },
  { label: 'PRESTON', key: 'preston' },
  { label: 'MATLOCK', key: 'matlock' },
];

const lines = [];

lines.push('# MASTER SITEMAP V3');
lines.push('## EntireFM — Complete Route Estate');
lines.push('');
lines.push('**Generated from:** `/config/route-registry.json`  ');
lines.push('**Do not hand-maintain this file.** Regenerate using `node scripts/generate-sitemap-v3.js`  ');
lines.push('**Generated:** 2026-08-22  ');
lines.push('**Total routes:** ' + routes.length);
lines.push('');
lines.push('> `LEGACY_VERIFIED` — Directly verified on historic Wix site  ');
lines.push('> `LEGACY_PROTECTED_BY_DIRECTIVE` — Protected by explicit instruction/prior SEO work  ');
lines.push('> `NEW_GROWTH` — New SEO expansion route  ');
lines.push('');

lines.push('## Route Counts by Sitemap Group');
lines.push('');
lines.push('| Group | Count | Sitemap |');
lines.push('|---|---|---|');
for (const [g, rs] of Object.entries(groups)) {
  lines.push(`| ${groupLabels[g] || g} | ${rs.length} | /sitemaps/${g}.xml |`);
}
lines.push('');

// Full geographic estate
lines.push('---');
lines.push('');
lines.push('## Full Geographic Estate');
lines.push('');
lines.push('All location routes shown with their exact paths. No summarisation permitted.');
lines.push('');

for (const city of cities) {
  const cityRoutes = groups['locations'].filter(r => r.path.includes(city.key));
  if (cityRoutes.length === 0) continue;
  lines.push(`### ${city.label}`);
  lines.push('');
  lines.push('```');
  lines.push(city.label);
  for (const r of cityRoutes) {
    lines.push(`├── ${r.path}  [${r.routeProvenance}]`);
  }
  lines.push('```');
  lines.push('');
}

lines.push('---');
lines.push('');

// All groups with full route tables
for (const [g, rs] of Object.entries(groups)) {
  lines.push(`## ${groupLabels[g] || g}`);
  lines.push('');
  lines.push(`**Sitemap:** /sitemaps/${g}.xml  |  **Count:** ${rs.length}`);
  lines.push('');
  lines.push('| Path | Provenance | Priority | Historic |');
  lines.push('|---|---|---|---|');
  for (const r of rs) {
    lines.push(`| \`${r.path}\` | ${r.routeProvenance} | ${r.priority} | ${r.historic ? 'Yes' : 'No'} |`);
  }
  lines.push('');
}

const output = lines.join('\n');
const outputPath = path.join(__dirname, '..', 'docs', 'seo-rebuild', 'MASTER-SITEMAP-V3.md');
fs.writeFileSync(outputPath, output);
console.log('Written MASTER-SITEMAP-V3.md — ' + routes.length + ' routes');

// Print city summaries
for (const city of cities) {
  const count = groups['locations'].filter(r => r.path.includes(city.key)).length;
  if (count > 0) console.log(`  ${city.label}: ${count} routes`);
}
