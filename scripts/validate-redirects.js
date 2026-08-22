#!/usr/bin/env node
/**
 * VALIDATE PRODUCTION REDIRECTS
 * ==============================
 * Validates every redirect in production-redirects.json:
 *   - Source is not a protected 200 route
 *   - Destination exists in route-registry.json (or is an allowed external)
 *   - No redirect chains (destination is itself a redirect source)
 *   - No redirect loops
 *   - statusCode === 301
 *
 * Run: npm run validate:redirects
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../config/route-registry.json');
const REDIRECTS_PATH = path.join(__dirname, '../config/production-redirects.json');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const redirectsFile = JSON.parse(fs.readFileSync(REDIRECTS_PATH, 'utf8'));

const registryPaths = new Set(registry.routes.map(r => r.path));
const protectedPaths = new Set(
  registry.routes.filter(r => r.protected).map(r => r.path)
);

const redirects = redirectsFile.redirects ?? [];
const redirectSources = new Set(redirects.map(r => r.source));

const failures = [];
const warnings = [];

for (const redirect of redirects) {
  const { source, destination, statusCode } = redirect;

  // Must be 301
  if (statusCode !== 301) {
    failures.push(`${source}: statusCode must be 301, got ${statusCode}`);
  }

  // Source must not be a protected route
  if (protectedPaths.has(source)) {
    failures.push(`${source}: PROTECTED ROUTE may not be a redirect source`);
  }

  // Destination must exist in registry (or be an allowed hub)
  if (!registryPaths.has(destination) && !destination.startsWith('http')) {
    failures.push(`${source} → ${destination}: destination NOT in route registry`);
  }

  // Detect chains: destination is itself a redirect source
  if (redirectSources.has(destination)) {
    failures.push(`${source} → ${destination}: REDIRECT CHAIN detected (destination is also a source)`);
  }

  // Detect loops
  if (source === destination) {
    failures.push(`${source}: REDIRECT LOOP (source === destination)`);
  }
}

// Summarise destinations
const destinationCounts = {};
for (const r of redirects) {
  destinationCounts[r.destination] = (destinationCounts[r.destination] || 0) + 1;
}

// Flag suspicious broad consolidation
const homepageCount = destinationCounts['/'] || 0;
if (homepageCount > 20) {
  warnings.push(`${homepageCount} redirects point to homepage (/). Review REDIRECT-QUALITY-REVIEW.md.`);
}

console.log('══════════════════════════════════════════════════════════════');
console.log('  REDIRECT VALIDATION');
console.log('══════════════════════════════════════════════════════════════');
console.log(`  Total redirects:       ${redirects.length}`);
console.log(`  Failures:              ${failures.length}`);
console.log(`  Warnings:              ${warnings.length}`);

if (warnings.length > 0) {
  console.warn('\n⚠ WARNINGS:');
  warnings.forEach(w => console.warn('  ', w));
}

if (failures.length > 0) {
  console.error('\n✗ FAILURES:');
  failures.slice(0, 30).forEach(f => console.error('  ', f));
  if (failures.length > 30) {
    console.error(`  ... and ${failures.length - 30} more`);
  }
  console.error('\n✗ REDIRECT VALIDATION FAILED');
  process.exit(1);
}

console.log('\n  ✓ PASS: All redirects valid');
console.log('══════════════════════════════════════════════════════════════');
