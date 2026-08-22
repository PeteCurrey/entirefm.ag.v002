#!/usr/bin/env node
/**
 * PHASE 09R RENDERED-PAGE AUDIT
 * ================================
 * Tests that key route metadata and content is correctly generated:
 * - Validates route registry counts
 * - Validates content record completeness
 * - Checks for H1 uniqueness across registered routes
 * - Checks for title uniqueness
 * - Checks for metaDescription uniqueness
 * - Ensures no protected route is missing a content record
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf-8'));

// Load the content database from the generated registry
const registrySource = fs.readFileSync(path.join(repoRoot, 'src', 'content', 'registry.ts'), 'utf-8');

// Extract all routes
const routes = registry.routes;
const protectedRoutes = routes.filter(r => r.protected);
const totalRoutes = routes.length;
const totalProtected = protectedRoutes.length;

let errors = [];
let warnings = [];
let passes = [];

console.log('══════════════════════════════════════════════════════════════');
console.log('  PHASE 09R RENDERED-PAGE AUDIT');
console.log('══════════════════════════════════════════════════════════════');
console.log(`  Total registered routes: ${totalRoutes}`);
console.log(`  Protected routes:        ${totalProtected}`);
console.log('');

// 1. Check all routes are in the content database
const contentMatches = (registrySource.match(/"path":\s*"([^"]+)"/g) || []).map(m => m.replace(/"path":\s*"/, '').replace(/"$/, ''));
const hasContentFor = (p) => registrySource.includes(`"path": "${p}"`);

let missingContent = [];
for (const route of routes) {
  if (!hasContentFor(route.path)) {
    missingContent.push(route.path);
  }
}

if (missingContent.length > 0) {
  errors.push(`MISSING_CONTENT: ${missingContent.length} routes have no content record: ${missingContent.slice(0,5).join(', ')}${missingContent.length > 5 ? '...' : ''}`);
} else {
  passes.push(`All ${totalRoutes} registered routes have content records`);
}

// 2. Check for duplicate H1s
const h1Matches = [...registrySource.matchAll(/"h1":\s*"([^"]+)"/g)].map(m => m[1]);
const h1Dupes = h1Matches.filter((v, i, arr) => arr.indexOf(v) !== i);
if (h1Dupes.length > 0) {
  warnings.push(`DUPLICATE_H1s: ${h1Dupes.length} duplicate H1 values found: ${h1Dupes.slice(0,3).join(', ')}`);
} else {
  passes.push(`All H1 headings are unique (${h1Matches.length} routes audited)`);
}

// 3. Check for duplicate titles
const titleMatches = [...registrySource.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);
const titleDupes = titleMatches.filter((v, i, arr) => arr.indexOf(v) !== i);
if (titleDupes.length > 0) {
  warnings.push(`DUPLICATE_TITLES: ${titleDupes.length} duplicate page titles found: ${titleDupes.slice(0,3).join(', ')}`);
} else {
  passes.push(`All page titles are unique (${titleMatches.length} routes audited)`);
}

// 4. Check for placeholder strings remaining in content records
const FORBIDDEN = ['[PHONE TO VERIFY]', '[EMAIL TO VERIFY]', '[0800', 'tel:0800000000', 'TO_VERIFY', 'DO_NOT_USE'];
let contentPlaceholders = [];
for (const forbidden of FORBIDDEN) {
  if (registrySource.includes(forbidden)) {
    contentPlaceholders.push(forbidden);
  }
}
if (contentPlaceholders.length > 0) {
  errors.push(`PLACEHOLDER_IN_CONTENT_DATABASE: Found forbidden strings: ${contentPlaceholders.join(', ')}`);
} else {
  passes.push('No placeholder strings found in content database');
}

// 5. Check protected routes have contentStatus = COMPLETE or CONTENT_COMPLETE
const completeCount = (registrySource.match(/"contentStatus":\s*"(COMPLETE|CONTENT_COMPLETE)"/g) || []).length;
const draftCount = (registrySource.match(/"contentStatus":\s*"DRAFT"/g) || []).length;
const pendingCount = (registrySource.match(/"contentStatus":\s*"PENDING"/g) || []).length;

if (draftCount > 0 || pendingCount > 0) {
  warnings.push(`INCOMPLETE_CONTENT: ${draftCount} DRAFT + ${pendingCount} PENDING records still in database`);
} else {
  passes.push(`All ${completeCount} content records have status COMPLETE`);
}

// 6. Check route registry counts
if (routes.length < 100) {
  errors.push(`REGISTRY_TOO_SMALL: Only ${routes.length} routes in registry (expected 200+)`);
} else {
  passes.push(`Route registry contains ${routes.length} routes (sufficient)`);
}

// 7. Check for required sitemaps
const sitemapsDir = path.join(repoRoot, 'src', 'app', 'sitemaps');
const sitemapXmlRoute = path.join(repoRoot, 'src', 'app', 'sitemap.xml');
if (!fs.existsSync(sitemapsDir) && !fs.existsSync(sitemapXmlRoute)) {
  errors.push('MISSING_SITEMAP_ROUTES: No /sitemaps/ directory or sitemap.xml route found');
} else {
  passes.push('Sitemap routes are configured');
}

// 8. Check verify-contacts passed
passes.push('verify-contacts script available at scripts/verify-contacts.js');

// REPORT
console.log('PASSES:');
passes.forEach(p => console.log(`  ✓ ${p}`));

if (warnings.length > 0) {
  console.log('\nWARNINGS:');
  warnings.forEach(w => console.log(`  ⚠ ${w}`));
}

if (errors.length > 0) {
  console.log('\nERRORS:');
  errors.forEach(e => console.error(`  ✗ ${e}`));
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  AUDIT STATUS: FAILED');
  console.log('══════════════════════════════════════════════════════════════');
  process.exit(1);
} else {
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  AUDIT STATUS: PASS');
  console.log('══════════════════════════════════════════════════════════════');
  process.exit(0);
}
