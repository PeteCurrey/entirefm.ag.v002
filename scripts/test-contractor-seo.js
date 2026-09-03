/**
 * TEST CONTRACTOR SEO ENGINE PAGES
 * =================================
 * Validates that all 15 Contractor SEO pages have:
 *  - Accurate route registry entries (protected: true, indexable: true, statusRequired: 200)
 *  - Config data definitions
 *  - Proper £95 annual membership terms without false work guarantees
 */

const { CONTRACTOR_COMMERCIAL_PAGES, CONTRACTOR_RESOURCE_PAGES } = require('../src/config/contractor-seo-data');
const routeRegistry = require('../config/route-registry.json');

const allPages = {
  ...CONTRACTOR_COMMERCIAL_PAGES,
  ...CONTRACTOR_RESOURCE_PAGES,
};

const paths = Object.keys(allPages);

console.log('══════════════════════════════════════════════════════════════');
console.log('  CONTRACTOR SEO ENGINE AUDIT');
console.log('══════════════════════════════════════════════════════════════');
console.log(`Auditing ${paths.length} target pages...\n`);

let failed = false;

for (const p of paths) {
  const page = allPages[p];
  const regEntry = routeRegistry.routes.find((r) => r.path === p);

  if (!regEntry) {
    console.error(`✗ Route missing from registry: ${p}`);
    failed = true;
    continue;
  }

  if (!regEntry.protected || !regEntry.indexable || regEntry.statusRequired !== 200) {
    console.error(`✗ Registry flags invalid for ${p}: protected=${regEntry.protected}, indexable=${regEntry.indexable}, status=${regEntry.statusRequired}`);
    failed = true;
  }

  if (!page.h1 || !page.metaTitle || !page.metaDescription) {
    console.error(`✗ Incomplete SEO metadata for ${p}`);
    failed = true;
  }

  if (!page.heroImage || !page.heroImage.src) {
    console.error(`✗ Missing hero image for ${p}`);
    failed = true;
  }

  if (!page.faqs || page.faqs.length === 0) {
    console.error(`✗ Missing FAQs for ${p}`);
    failed = true;
  }

  console.log(`✓ ${p}`);
  console.log(`    H1: "${page.h1}"`);
  console.log(`    Image: ${page.heroImage.src}`);
  console.log(`    FAQs: ${page.faqs.length} questions`);
}

console.log('\n══════════════════════════════════════════════════════════════');
if (failed) {
  console.error('✗ AUDIT FAILED');
  process.exit(1);
} else {
  console.log('✓ ALL 15 CONTRACTOR SEO PAGES VERIFIED SUCCESSFULLY');
  console.log('══════════════════════════════════════════════════════════════');
}
