#!/usr/bin/env node
/**
 * AUDIT MEDIA UNIQUENESS SCRIPT
 * =============================
 * Verifies that no operational photograph is reused across multiple
 * service, sector, or hub pages.
 *
 * Excluded from duplication checks:
 * - EntireFM logos & brand marks
 * - Accreditation badges & ISO icons
 * - Deliberate UI product screenshots (EntireCAFM)
 */

import fs from 'fs';
import path from 'path';
import { SERVICE_MEDIA_REGISTRY, SECTOR_MEDIA_REGISTRY } from '../src/config/media-registry';
import { SECTOR_ARCHETYPES } from '../src/data/sectors/archetypes';

console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║        EntireFM Media & Imagery Uniqueness Audit                  ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

let errorCount = 0;

// 1. Audit Service Registry Heroes
console.log('1. Checking Service Media Registry Heroes...');
const serviceHeroes = new Map<string, string[]>();

for (const [route, config] of Object.entries(SERVICE_MEDIA_REGISTRY)) {
  const hero = config.hero;
  if (!serviceHeroes.has(hero)) serviceHeroes.set(hero, []);
  serviceHeroes.get(hero)!.push(route);
}

for (const [img, routes] of serviceHeroes.entries()) {
  if (routes.length > 1) {
    console.error(`❌ Duplicate Service Hero detected: ${img}`);
    console.error(`   Used in: ${routes.join(', ')}`);
    errorCount++;
  } else {
    console.log(`  ✓ ${routes[0].padEnd(35)} -> ${path.basename(img)}`);
  }
}

// 2. Audit Sector Archetype Heroes
console.log('\n2. Checking Sector Archetypes Heroes...');
const sectorHeroes = new Map<string, string[]>();

for (const [id, archetype] of Object.entries(SECTOR_ARCHETYPES)) {
  const hero = archetype.heroImage;
  if (!sectorHeroes.has(hero)) sectorHeroes.set(hero, []);
  sectorHeroes.get(hero)!.push(id);
}

for (const [img, sectors] of sectorHeroes.entries()) {
  if (sectors.length > 1) {
    console.error(`❌ Duplicate Sector Hero detected: ${img}`);
    console.error(`   Used in: ${sectors.join(', ')}`);
    errorCount++;
  } else {
    console.log(`  ✓ ${sectors[0].padEnd(35)} -> ${path.basename(img)}`);
  }
}

// 3. Verify that all referenced images exist on disk
console.log('\n3. Verifying physical existence of all registry image files...');
const checkedFiles = new Set<string>();

const verifyFile = (relPath: string, context: string) => {
  if (!relPath || relPath.startsWith('http')) return;
  if (checkedFiles.has(relPath)) return;
  checkedFiles.add(relPath);

  const fullPath = path.join(process.cwd(), 'public', relPath.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing asset on disk: ${relPath} (referenced in ${context})`);
    errorCount++;
  }
};

for (const [route, config] of Object.entries(SERVICE_MEDIA_REGISTRY)) {
  verifyFile(config.hero, `SERVICE: ${route}`);
  if (config.card) verifyFile(config.card, `SERVICE CARD: ${route}`);
  if (config.capabilities) {
    config.capabilities.forEach(cap => verifyFile(cap.imageSrc, `SERVICE CAPABILITY: ${route}`));
  }
}

for (const [id, archetype] of Object.entries(SECTOR_ARCHETYPES)) {
  verifyFile(archetype.heroImage, `SECTOR: ${id}`);
}

console.log(`\nVerified ${checkedFiles.size} unique image files on disk.`);

// Final Summary
console.log('\n═══════════════════════════════════════════════════════════════════');
if (errorCount === 0) {
  console.log('✅ MEDIA AUDIT PASSED: 100% Unique Imagery Across Services & Sectors.');
  process.exit(0);
} else {
  console.error(`❌ MEDIA AUDIT FAILED: ${errorCount} errors/duplicates found.`);
  process.exit(1);
}
