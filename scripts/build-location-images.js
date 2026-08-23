#!/usr/bin/env node
/**
 * LOCATION IMAGE PIPELINE
 * =======================
 * Source images live in "Images/Geographical Page Image/{City}/" with
 * camera-roll filenames (spaces, commas, timestamps) that are unusable as
 * web URLs. This converts a curated selection into SEO-named WebP assets
 * under public/images/locations/{city-slug}/.
 *
 * Selection is explicit, not automatic: each entry below was chosen by
 * looking at the image, and the descriptor states what the image shows.
 * An image's alt text is generated from that descriptor, so a wrong
 * descriptor becomes a wrong alt text — keep them honest.
 *
 * EXCLUSION — Leeds: the Leeds source folder contains images that are
 * byte-identical to the Sheffield folder, and the identifiable landmark in
 * them (the Winter Garden glasshouse) is Sheffield. Publishing them on a
 * Leeds page would put another city's landmarks on it. Leeds is therefore
 * skipped until genuine Leeds photography exists.
 *
 * Usage: node scripts/build-location-images.js [--force]
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'Images', 'Geographical Page Image');
const OUT = path.join(ROOT, 'public', 'images', 'locations');
const EDITORIAL_OUT = path.join(ROOT, 'public', 'images', 'editorial');

/**
 * Editorial imagery used in the full-bleed and horizontal-scroll sections.
 * Same rule as the city selection: the descriptor states what is actually in
 * the frame, because it becomes the alt text.
 *
 * Only Electrical and Branded Building hold images — Images/HVAC and
 * Images/Plumbing are empty directories, so those trades have no photography
 * yet and no section pretends otherwise.
 */
const EDITORIAL = {
  Electrical: [
    { index: 0, slug: 'switchgear-inspection', alt: 'EntireFM engineer testing a distribution board in a commercial switch room' },
    { index: 4, slug: 'distribution-board-testing', alt: 'EntireFM engineer working on live distribution equipment with test instruments' },
    { index: 2, slug: 'rooftop-plant-night', alt: 'EntireFM engineer working on rooftop plant at night above a lit city skyline' },
    { index: 5, slug: 'client-review', alt: 'EntireFM engineer reviewing building performance data with a client in an operations room' },
    { index: 6, slug: 'site-arrival', alt: 'EntireFM van and engineer arriving at a commercial site at dusk' },
    { index: 9, slug: 'switchroom-survey', alt: 'Two EntireFM engineers surveying switchgear in a plant room' },
    { index: 8, slug: 'ev-charging', alt: 'EntireFM engineer servicing electric vehicle charging equipment at a commercial car park' },
    { index: 7, slug: 'access-control-install', alt: 'EntireFM engineer installing access control equipment in a corridor' },
  ],
  'Branded Building': [
    // The homepage hero. Wide, cinematic, and dark on the left where the
    // headline sits — which is why this frame rather than the tighter ones.
    { index: 5, slug: 'hero-headquarters', alt: 'EntireFM headquarters at dusk, illuminated signage along the building facade', hero: true },
    { index: 3, slug: 'headquarters-exterior', alt: 'EntireFM branded signage on a modern commercial building exterior at dusk' },
    { index: 0, slug: 'reception', alt: 'EntireFM branded reception area inside a commercial building' },
  ],
};

/** Widths emitted per image. The first is treated as the canonical asset. */
const WIDTHS = [1600, 800];

/**
 * Curated selection per city.
 * `index` is the position in the folder's sorted file listing.
 * `slug` becomes the filename; `alt` describes what is actually visible.
 */
const SELECTION = {
  London: [
    { index: 0,  slug: 'city-of-london-skyline',    alt: 'EntireFM facilities management van on a City of London street at dusk, with the Gherkin behind' },
    { index: 2,  slug: 'rooftop-plant-inspection',  alt: 'EntireFM engineer inspecting rooftop plant on a London commercial building, the Shard on the skyline' },
    { index: 4,  slug: 'tower-bridge-response',     alt: 'EntireFM mobile engineering van beside the Thames at Tower Bridge, London' },
    { index: 6,  slug: 'engineers-st-pauls',        alt: 'Two EntireFM engineers on a London rooftop reviewing plant data, St Paul’s Cathedral behind them' },
  ],
  Manchester: [
    { index: 0,  slug: 'deansgate-city-centre',     alt: 'EntireFM facilities management van on a wet Manchester city-centre street at dusk' },
    { index: 2,  slug: 'castlefield-viaduct',       alt: 'EntireFM van beside the Castlefield canal basin and railway viaducts, Manchester' },
    { index: 9,  slug: 'rooftop-plant-engineers',   alt: 'EntireFM engineers carrying out rooftop plant checks above the Manchester skyline' },
    { index: 5,  slug: 'reception-front-of-house',  alt: 'EntireFM branded reception area inside a Manchester commercial building' },
  ],
  Birmingham: [
    { index: 0,  slug: 'city-centre-offices',       alt: 'EntireFM facilities management van outside a Birmingham city-centre office building at dusk' },
    { index: 1,  slug: 'gas-street-canal',          alt: 'EntireFM van beside the Birmingham canal network at Gas Street Basin' },
    { index: 2,  slug: 'industrial-plant-survey',   alt: 'EntireFM engineers in hi-vis surveying industrial plant on a Birmingham site at night' },
    { index: 5,  slug: 'library-of-birmingham',     alt: 'EntireFM van on a Birmingham street with the Library of Birmingham illuminated behind' },
  ],
  Sheffield: [
    { index: 0,  slug: 'city-centre-response',      alt: 'EntireFM facilities management van in Sheffield city centre at dusk' },
    { index: 5,  slug: 'winter-garden',             alt: 'EntireFM engineer walking past the Sheffield Winter Garden glasshouse in Millennium Square' },
    { index: 4,  slug: 'rooftop-plant-checks',      alt: 'EntireFM engineers carrying out rooftop plant checks above Sheffield' },
    { index: 7,  slug: 'industrial-unit',           alt: 'EntireFM van at a Sheffield industrial unit loading bay' },
  ],
  Nottingham: [
    { index: 0,  slug: 'old-market-square',         alt: 'EntireFM facilities management van in Old Market Square, Nottingham, outside the Council House' },
    { index: 2,  slug: 'rooftop-city-view',         alt: 'EntireFM engineers on a Nottingham rooftop with the Council House dome on the skyline' },
    { index: 3,  slug: 'plant-room-maintenance',    alt: 'EntireFM engineer maintaining pump plant in a Nottingham commercial plant room' },
    { index: 8,  slug: 'operations-centre',         alt: 'EntireFM operations centre monitoring live building performance data' },
  ],
  Derby: [
    { index: 0,  slug: 'cathedral-quarter',         alt: 'EntireFM facilities management van in Derby’s Cathedral Quarter at dusk' },
    { index: 4,  slug: 'rooftop-survey',            alt: 'EntireFM engineers carrying out a rooftop survey above Derby city centre' },
    { index: 3,  slug: 'industrial-estate',         alt: 'EntireFM van at a Derby industrial estate loading bay at night' },
    { index: 9,  slug: 'riverside-mills',           alt: 'EntireFM van beside Derby’s historic riverside mill buildings' },
  ],
  Liverpool: [
    { index: 0,  slug: 'pier-head-liver-building',  alt: 'EntireFM facilities management van at the Pier Head with the Royal Liver Building behind, Liverpool' },
    { index: 4,  slug: 'waterfront-plant-room',     alt: 'EntireFM engineer working in a plant room overlooking the Liverpool waterfront' },
    { index: 3,  slug: 'rooftop-waterfront',        alt: 'EntireFM engineers reviewing rooftop plant above the Liverpool waterfront' },
    { index: 6,  slug: 'commercial-district',       alt: 'EntireFM engineers entering a commercial building in Liverpool’s business district' },
  ],
};

/** Cities deliberately not built, with the reason surfaced in the report. */
const EXCLUDED = {
  Leeds:
    'Source folder is byte-identical to Sheffield and the identifiable landmarks are Sheffield. ' +
    'Needs genuine Leeds photography before it can be published.',
};

const citySlug = (c) => c.toLowerCase().replace(/[^a-z0-9]+/g, '-');

async function main() {
  const force = process.argv.includes('--force');
  const manifest = { generated: new Date().toISOString().slice(0, 10), cities: {}, excluded: EXCLUDED };
  let written = 0;

  for (const [city, picks] of Object.entries(SELECTION)) {
    const dir = path.join(SRC, city);
    if (!fs.existsSync(dir)) {
      console.warn(`! missing source folder for ${city}`);
      continue;
    }
    const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
    const slug = citySlug(city);
    const outDir = path.join(OUT, slug);
    fs.mkdirSync(outDir, { recursive: true });

    manifest.cities[slug] = { city, images: [] };

    for (const pick of picks) {
      const src = files[pick.index];
      if (!src) {
        console.warn(`! ${city}: no file at index ${pick.index}`);
        continue;
      }
      const base = `facilities-management-${slug}-${pick.slug}`;
      const entry = { alt: pick.alt, source: src, widths: {} };

      for (const w of WIDTHS) {
        const name = `${base}-${w}w.webp`;
        const dest = path.join(outDir, name);
        if (force || !fs.existsSync(dest)) {
          await sharp(path.join(dir, src))
            .resize(w, null, { withoutEnlargement: true })
            .webp({ quality: 76 })
            .toFile(dest);
          written++;
        }
        entry.widths[w] = `/images/locations/${slug}/${name}`;
      }
      entry.src = entry.widths[WIDTHS[0]];
      manifest.cities[slug].images.push(entry);
    }
    console.log(`${city.padEnd(12)} ${manifest.cities[slug].images.length} images`);
  }

  for (const [city, reason] of Object.entries(EXCLUDED)) {
    console.log(`${city.padEnd(12)} SKIPPED — ${reason.split('.')[0]}.`);
  }

  // ── Editorial imagery ───────────────────────────────────────────────────
  manifest.editorial = {};
  for (const [folder, picks] of Object.entries(EDITORIAL)) {
    const dir = path.join(ROOT, 'Images', folder);
    if (!fs.existsSync(dir)) { console.warn(`! missing ${folder}`); continue; }
    const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
    if (!files.length) { console.log(`${folder.padEnd(18)} EMPTY — no photography available`); continue; }
    fs.mkdirSync(EDITORIAL_OUT, { recursive: true });

    for (const pick of picks) {
      const src = files[pick.index];
      if (!src) { console.warn(`! ${folder}: no file at index ${pick.index}`); continue; }
      const entry = { alt: pick.alt, source: src, widths: {} };
      // Hero images are rendered edge to edge on large displays, so they need
      // a wider top size than the in-page editorial imagery.
      const widths = pick.hero ? [2560, 1920, 1280, 900] : [2000, 1200, 800];
      for (const w of widths) {
        const name = `entirefm-${pick.slug}-${w}w.webp`;
        const dest = path.join(EDITORIAL_OUT, name);
        if (force || !fs.existsSync(dest)) {
          await sharp(path.join(dir, src))
            .resize(w, null, { withoutEnlargement: true })
            .webp({ quality: 74 })
            .toFile(dest);
          written++;
        }
        entry.widths[w] = `/images/editorial/${name}`;
      }
      // Widest rendition is the canonical src. Previously hard-coded to 2000,
      // which produced an empty string for hero images that top out at 2560.
      entry.src = entry.widths[widths[0]];
      manifest.editorial[pick.slug] = entry;
    }
    console.log(`${folder.padEnd(18)} ${picks.length} editorial images`);
  }

  fs.writeFileSync(
    path.join(ROOT, 'src', 'config', 'location-images.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );
  console.log(`\n${written} files written. Manifest: src/config/location-images.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
