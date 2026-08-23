#!/usr/bin/env node
/**
 * VALIDATE MANIFEST AGAINST REGISTRY
 * =====================================
 * Hard-fails if any drift is detected between route-registry.json and
 * production-url-manifest.json.
 *
 * Run: npm run validate:manifest
 * CI gate: must pass before any deployment.
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../config/route-registry.json');
const MANIFEST_PATH = path.join(__dirname, '../config/production-url-manifest.json');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

const registryPaths = new Set(registry.routes.map(r => r.path));
const manifestList = manifest.urls || manifest.routes || [];
const manifestPaths = new Set(manifestList.map(u => u.path));

const inRegistryNotManifest = [...registryPaths].filter(p => !manifestPaths.has(p));
const inManifestNotRegistry = [...manifestPaths].filter(p => !registryPaths.has(p));

console.log('══════════════════════════════════════════════════════════════');
console.log('  MANIFEST ↔ REGISTRY DRIFT VALIDATION');
console.log('══════════════════════════════════════════════════════════════');
console.log(`  Registry routes:       ${registryPaths.size}`);
console.log(`  Manifest routes:       ${manifestPaths.size}`);
console.log(`  In registry not manifest: ${inRegistryNotManifest.length}`);
console.log(`  In manifest not registry: ${inManifestNotRegistry.length}`);

let failed = false;

if (inRegistryNotManifest.length > 0) {
  console.error('\n✗ FAIL: Registry routes missing from manifest:');
  inRegistryNotManifest.forEach(p => console.error('  ', p));
  failed = true;
}

if (inManifestNotRegistry.length > 0) {
  console.error('\n✗ FAIL: Manifest routes absent from registry:');
  inManifestNotRegistry.forEach(p => console.error('  ', p));
  failed = true;
}

if (failed) {
  console.error('\nRun: npm run generate:manifest to regenerate from registry.');
  process.exit(1);
}

console.log('\n  ✓ PASS: Registry / manifest drift = 0');
console.log('══════════════════════════════════════════════════════════════');
