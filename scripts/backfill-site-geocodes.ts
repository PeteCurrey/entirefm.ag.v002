/**
 * ONE-OFF BACKFILL SCRIPT: SITES GEOCODING
 * ========================================
 * Finds all sites where latitude or longitude is null, geocodes their postcode
 * via the Google Geocoding API (using the geocode_cache), and updates the row.
 *
 * Features:
 *   - 100% idempotent: processes only rows missing coordinates
 *   - Throttled requests (150ms delay) to respect API quotas
 *   - Exponential backoff retry on transient 429 / quota errors
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backfill-site-geocodes.ts
 */

import { dbQuery, isDbConfigured } from '../src/server/db/client';
import { geocodePostcode } from '../src/server/geo/geocoding';

const THROTTLE_MS = 150;
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function backfillSiteGeocodes() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM — BACKFILL SITE COORDINATES (GEOCODING)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (!isDbConfigured()) {
    console.error('❌ Supabase database not configured in environment. Exiting.');
    process.exit(1);
  }

  // 1. Fetch sites missing coordinates
  const { data: sites, error } = await dbQuery<any[]>(
    'sites?or=(latitude.is.null,longitude.is.null)&select=id,name,site_code,postcode,country,city&order=name.asc'
  );

  if (error) {
    console.error('❌ Failed to fetch sites missing geocodes:', error);
    process.exit(1);
  }

  const ungeocodedSites = sites || [];
  console.log(`Found ${ungeocodedSites.length} sites requiring geocoding.\n`);

  if (ungeocodedSites.length === 0) {
    console.log('✨ All sites already have valid coordinates. Nothing to do.');
    return;
  }

  let successCount = 0;
  let failCount = 0;
  let skippedNoPostcode = 0;

  for (let i = 0; i < ungeocodedSites.length; i++) {
    const site = ungeocodedSites[i];
    const progress = `[${i + 1}/${ungeocodedSites.length}]`;

    if (!site.postcode || site.postcode.trim() === '') {
      console.warn(`${progress} ⚠️  Skipping site '${site.name}' (${site.id}): No postcode on record`);
      skippedNoPostcode++;
      continue;
    }

    let coords = null;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      coords = await geocodePostcode(site.postcode, site.country || 'GB');
      if (coords) break;

      attempt++;
      if (attempt < MAX_RETRIES) {
        const backoffMs = 500 * Math.pow(2, attempt);
        console.warn(`  ↳ Retry ${attempt} in ${backoffMs}ms for '${site.postcode}'...`);
        await sleep(backoffMs);
      }
    }

    if (coords) {
      const { error: updateError } = await dbQuery(`sites?id=eq.${encodeURIComponent(site.id)}`, {
        method: 'PATCH',
        body: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          updated_at: new Date().toISOString(),
        },
      });

      if (updateError) {
        console.error(`${progress} ❌ Failed to update site '${site.name}':`, updateError);
        failCount++;
      } else {
        console.log(
          `${progress} ✅ Geocoded '${site.name}' (${site.postcode}) -> (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})`
        );
        successCount++;
      }
    } else {
      console.warn(`${progress} ⚠️  Could not geocode postcode '${site.postcode}' for '${site.name}'`);
      failCount++;
    }

    // Rate-limit throttling between calls
    await sleep(THROTTLE_MS);
  }

  console.log('\n───────────────────────────────────────────────────────────────');
  console.log('  BACKFILL COMPLETED');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  Total Sites Scanned:      ${ungeocodedSites.length}`);
  console.log(`  Successfully Geocoded:    ${successCount}`);
  console.log(`  Failed / Unresolved:      ${failCount}`);
  console.log(`  Skipped (No Postcode):    ${skippedNoPostcode}`);
  console.log('───────────────────────────────────────────────────────────────\n');
}

backfillSiteGeocodes().catch((err) => {
  console.error('Fatal script error:', err);
  process.exit(1);
});
