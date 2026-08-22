#!/usr/bin/env node
/**
 * STAGING NOINDEX VERIFICATION AUDIT
 * ==================================
 * Confirms that staging/preview environments cannot accidentally emit indexable robots directives.
 */

const { generateRouteMetadata } = require('../src/lib/metadata/generate-metadata.ts');

console.log('══════════════════════════════════════════════════════════════');
console.log('  STAGING NOINDEX TRIPLE-GATE AUDIT');
console.log('══════════════════════════════════════════════════════════════');

// Test Case 1: Staging environment without ALLOW_SEARCH_INDEXING flag
const metaStaging = generateRouteMetadata('/');
console.log('Test 1 (Default Staging Environment):');
console.log('  Robots directives generated:', JSON.stringify(metaStaging.robots));

if (metaStaging.robots && metaStaging.robots.index === false && metaStaging.robots.follow === false) {
  console.log('  ✓ PASS: Staging is safely protected with noindex, nofollow.');
} else {
  console.error('  ✗ FAIL: Staging metadata allowed indexing!');
  process.exit(1);
}

console.log('══════════════════════════════════════════════════════════════');
console.log('  STAGING NOINDEX AUDIT: PASS');
console.log('══════════════════════════════════════════════════════════════');
