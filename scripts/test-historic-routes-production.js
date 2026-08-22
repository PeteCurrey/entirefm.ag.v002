#!/usr/bin/env node
/**
 * FULL HISTORIC ROUTE PRODUCTION VALIDATOR
 * ========================================
 * Tests ALL 205 protected historic routes against the live target domain.
 * Usage: node scripts/test-historic-routes-production.js [baseUrl]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const repoRoot = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf-8'));
const historicRoutes = registry.routes.filter(r => r.historic);

const targetHost = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

console.log(`Validating all ${historicRoutes.length} protected historic routes against: ${targetHost}\n`);

async function checkRoute(r) {
  const url = `${targetHost}${r.path}`;
  const client = url.startsWith('https') ? https : http;

  return new Promise((resolve) => {
    client.get(url, (res) => {
      resolve({ path: r.path, statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ path: r.path, statusCode: 500, error: err.message });
    });
  });
}

(async () => {
  let passed = 0;
  let failed = 0;

  for (const r of historicRoutes) {
    const res = await checkRoute(r);
    if (res.statusCode === 200) {
      passed++;
    } else {
      console.error(`✗ [FAIL] ${r.path} -> Status: ${res.statusCode}`);
      failed++;
    }
  }

  console.log(`\nHistoric Routes Audit Summary:`);
  console.log(`  Total Checked: ${historicRoutes.length}`);
  console.log(`  Passed (200):  ${passed}`);
  console.log(`  Failed:        ${failed}`);

  if (failed === 0) {
    console.log(`\n✓ 100% OF HISTORIC ROUTES RESOLVE WITH HTTP 200 OK.`);
    process.exit(0);
  } else {
    process.exit(1);
  }
})();
