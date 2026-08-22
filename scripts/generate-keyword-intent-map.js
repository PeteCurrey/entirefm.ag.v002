#!/usr/bin/env node
/**
 * GENERATE HISTORIC-KEYWORD-INTENT-MAP.csv
 * ========================================
 * Generates comprehensive search-intent mapping for all routes.
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

const headers = [
  'URL',
  'Priority',
  'Route Provenance',
  'Primary Search Intent',
  'Primary Query Family',
  'Secondary Query Families',
  'Commercial Modifiers',
  'Geographic Modifiers',
  'Relevant Entities',
  'Relevant Services',
  'Relevant Sectors',
  'Related Informational Queries',
  'Conversion Intent'
];

const rows = [headers.join(',')];

for (const r of registry.routes) {
  const p = r.path;
  const c = contentDb[p] || {};
  const prio = r.priority || (p === '/' || p.includes('london') || p === '/mechanical-electrical' || p === '/hvac-contractor' || p === '/ppm' || p === '/industrial-cleaning' ? 'P0' : r.routeType === 'post' ? 'P2' : 'P1');
  const loc = r.location || (p.includes('london') ? 'London' : p.includes('manchester') ? 'Manchester' : p.includes('birmingham') ? 'Birmingham' : p.includes('sheffield') ? 'Sheffield' : p.includes('leeds') ? 'Leeds' : p.includes('lincoln') ? 'Lincoln' : 'UK Nationwide');

  const row = [
    `"${p}"`,
    `"${prio}"`,
    `"${r.routeProvenance}"`,
    `"${(c.primaryIntent || 'Commercial facilities management').replace(/"/g, '""')}"`,
    `"${(c.primaryIntent || p.replace(/^\//, '').replace(/-/g, ' ')).replace(/"/g, '""')}"`,
    `"${(c.secondaryIntents || []).join('; ').replace(/"/g, '""')}"`,
    `"contractor, maintenance, PPM, quote, cost, SLA, emergency, compliance"`,
    `"${loc}"`,
    `"Entire Facilities Management Ltd, SFG20, NICEIC, Gas Safe Register, CIBSE, HSE"`,
    `"${r.service || 'Hard FM, Soft FM, PPM, Mechanical & Electrical'}"`,
    `"${r.sector || 'Commercial, Industrial, Logistics, Corporate'}"`,
    `"What is included in ${p.replace(/^\//, '').replace(/-/g, ' ')}? How often is PPM required?"`,
    `"${(c.conversionGoal || 'Generate commercial enquiries and site survey requests').replace(/"/g, '""')}"`
  ];
  rows.push(row.join(','));
}

fs.writeFileSync(path.join(repoRoot, 'docs', 'seo-rebuild', 'HISTORIC-KEYWORD-INTENT-MAP.csv'), rows.join('\n'));
console.log(`Generated HISTORIC-KEYWORD-INTENT-MAP.csv (${registry.routes.length} routes)`);
