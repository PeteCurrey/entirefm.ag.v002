/**
 * ONE-OFF BACKFILL SCRIPT: PROVIDER LOCATIONS (DEPOTS) GEOCODING
 * ==============================================================
 * Finds all provider_locations where latitude or longitude is null, geocodes their
 * postcode via Google Geocoding API (using the geocode_cache), and updates the row.
 *
 * Features:
 *   - 100% idempotent: processes only rows missing coordinates
 *   - Throttled requests (150ms delay) to respect API quotas
 *   - Exponential backoff retry on transient 429 / quota errors
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backfill-provider-location-geocodes.ts
 */

import { dbQuery, isDbConfigured } from '../src/server/db/client';
import { geocodePostcode } from '../src/server/geo/geocoding';

const THROTTLE_MS = 150;
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function backfillProviderLocationGeocodes() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM — BACKFILL PROVIDER LOCATION COORDINATES (DEPOTS)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (!isDbConfigured()) {
    console.error('❌ Supabase database not configured in environment. Exiting.');
    process.exit(1);
  }

  // 1. Fetch provider locations missing coordinates
  const { data: locations, error } = await dbQuery<any[]>(
    'provider_locations?or=(latitude.is.null,longitude.is.null)&select=id,name,postcode,city,provider_org_id&order=name.asc'
  );

  if (error) {
    console.error('❌ Failed to fetch provider locations missing geocodes:', error);
    process.exit(1);
  }

  const ungeocodedLocs = locations || [];
  console.log(`Found ${ungeocodedLocs.length} provider locations requiring geocoding.\n`);

  if (ungeocodedLocs.length === 0) {
    console.log('✨ All provider locations already have valid coordinates. Nothing to do.');
    return;
  }

  let successCount = 0;
  let failCount = 0;
  let skippedNoPostcode = 0;

  for (let i = 0; i < ungeocodedLocs.length; i++) {
    const loc = ungeocodedLocs[i];
    const progress = `[${i + 1}/${ungeocodedLocs.length}]`;

    if (!loc.postcode || loc.postcode.trim() === '') {
      console.warn(`${progress} ⚠️  Skipping location '${loc.name}' (${loc.id}): No postcode on record`);
      skippedNoPostcode++;
      continue;
    }

    let coords = null;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      coords = await geocodePostcode(loc.postcode, 'GB');
      if (coords) break;

      attempt++;
      if (attempt < MAX_RETRIES) {
        const backoffMs = 500 * Math.pow(2, attempt);
        console.warn(`  ↳ Retry ${attempt} in ${backoffMs}ms for '${loc.postcode}'...`);
        await sleep(backoffMs);
      }
    }

    if (coords) {
      const { error: updateError } = await dbQuery(
        `provider_locations?id=eq.${encodeURIComponent(loc.id)}`,
        {
          method: 'PATCH',
          body: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        }
      );

      if (updateError) {
        console.error(`${progress} ❌ Failed to update provider location '${loc.name}':`, updateError);
        failCount++;
      } else {
        console.log(
          `${progress} ✅ Geocoded '${loc.name}' (${loc.postcode}) -> (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})`
        );
        successCount++;
      }
    } else {
      console.warn(`${progress} ⚠️  Could not geocode postcode '${loc.postcode}' for '${loc.name}'`);
      failCount++;
    }

    // Rate-limit throttling between calls
    await sleep(THROTTLE_MS);
  }

  console.log('\n───────────────────────────────────────────────────────────────');
  console.log('  PROVIDER LOCATIONS BACKFILL COMPLETED');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  Total Locations Scanned:  ${ungeocodedLocs.length}`);
  console.log(`  Successfully Geocoded:    ${successCount}`);
  console.log(`  Failed / Unresolved:      ${failCount}`);
  console.log(`  Skipped (No Postcode):    ${skippedNoPostcode}`);
  console.log('───────────────────────────────────────────────────────────────\n');
}

backfillProviderLocationGeocodes().catch((err) => {
  console.error('Fatal script error:', err);
  process.exit(1);
});
