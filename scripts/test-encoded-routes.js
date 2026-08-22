#!/usr/bin/env node
/**
 * TEST ENCODED HISTORIC ROUTES
 * =============================
 * Verifies that all historically encoded routes resolve correctly:
 * - Tests route resolution logic in route-registry JSON
 * - Tests decoded/encoded variations
 * - Validates content records in registry.ts
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf-8'));
const registrySource = fs.readFileSync(path.join(repoRoot, 'src', 'content', 'registry.ts'), 'utf-8');

const ENCODED_ROUTES = [
  '/facilities-management-for/education-%26-schools-facilities-management',
  '/facilities-management-for/hotels-%26-resort-facilities-management',
  '/facilities-management-for/logistics-%26-distribution-facilities-management',
  '/facilities-management-for/offices%2C-corporate-%26-co-working',
  '/facilities-management-for/restaurant-%26-hospitality-facilities-management',
  '/facilities-management-for/retail-%26-shopping-centre-facilities-management',
  '/facilities-management-for/stadium-%26-arena-facilities-management',
  '/facilities-management-for/warehouse-%26-distribution',
];

console.log('══════════════════════════════════════════════════════════════');
console.log('  ENCODED HISTORIC ROUTE RESOLUTION TEST');
console.log('══════════════════════════════════════════════════════════════');

const routeMap = new Map();
for (const r of registry.routes) {
  routeMap.set(r.path, r);
  try {
    routeMap.set(decodeURIComponent(r.path), r);
    routeMap.set(encodeURI(r.path), r);
  } catch {}
}

let failures = 0;

for (const p of ENCODED_ROUTES) {
  // Test 1: Exact encoded lookup
  const routeEncoded = routeMap.get(p);
  if (!routeEncoded) {
    console.error(`✗ FAIL: getRoute("${p}") not found in registry`);
    failures++;
    continue;
  }

  // Test 2: Decoded lookup
  const decodedPath = decodeURIComponent(p);
  const routeDecoded = routeMap.get(decodedPath);
  if (!routeDecoded) {
    console.error(`✗ FAIL: getRoute("${decodedPath}") not found in registry`);
    failures++;
    continue;
  }

  // Test 3: Content record existence
  if (!registrySource.includes(`"path": "${p}"`)) {
    console.error(`✗ FAIL: Content record missing in registry.ts for "${p}"`);
    failures++;
    continue;
  }

  console.log(`✓ PASS: ${p}`);
  console.log(`  Decoded equivalent: ${decodedPath}`);
  console.log(`  Provenance: ${routeEncoded.routeProvenance} | Protected: ${routeEncoded.protected}`);
}

console.log('══════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('  ✓ ALL 8 ENCODED HISTORIC ROUTES RESOLVE CLEANLY');
  console.log('══════════════════════════════════════════════════════════════');
  process.exit(0);
} else {
  console.error(`  ✗ ${failures} ENCODED HISTORIC ROUTE FAILURES`);
  console.log('══════════════════════════════════════════════════════════════');
  process.exit(1);
}
