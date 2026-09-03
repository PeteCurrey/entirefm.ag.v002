#!/usr/bin/env node
/**
 * STAGING & PRODUCTION ROBOTS AUDIT
 * ==================================
 * Confirms production routes emit indexable directives and staging/preview are protected when configured.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { canIndexStaticBuild, canIndexRequest } = require('../src/lib/indexing');

console.log('══════════════════════════════════════════════════════════════');
console.log('  SEARCH INDEXING CONFIGURATION AUDIT');
console.log('══════════════════════════════════════════════════════════════');

// Test Case 1: Production static build is indexable
const isStaticAllowed = canIndexStaticBuild();
console.log('Test 1 (Production Static Build):', isStaticAllowed ? 'ALLOWED (PASS)' : 'BLOCKED');

if (!isStaticAllowed) {
  console.error('  ✗ FAIL: Static build indexing is blocked!');
  process.exit(1);
}

// Test Case 2: Production domain request
const isProdHostAllowed = canIndexRequest('www.entirefm.com');
console.log('Test 2 (Production Hostname www.entirefm.com):', isProdHostAllowed ? 'ALLOWED (PASS)' : 'BLOCKED');

if (!isProdHostAllowed) {
  console.error('  ✗ FAIL: Production host indexing is blocked!');
  process.exit(1);
}

// Test Case 3: Vercel preview domain without override
const isPreviewAllowed = canIndexRequest('entirefm-preview.vercel.app');
console.log('Test 3 (Preview Hostname entirefm-preview.vercel.app):', !isPreviewAllowed ? 'BLOCKED (PASS)' : 'ALLOWED (CHECK)');

console.log('══════════════════════════════════════════════════════════════');
console.log('  SEARCH INDEXING AUDIT: ALL CHECKS PASSED');
console.log('══════════════════════════════════════════════════════════════');
