#!/usr/bin/env node
/**
 * Legacy estate verification.
 *
 * Closes the release gate left open by the Digital Rebuild & SEO Dominance Plan
 * (s10.3): reconciles the two Wix estates against the rebuild registry and
 * against whatever is currently serving production.
 *
 * TWO DISCOVERY SOURCES, BECAUSE ONE IS NOT ENOUGH
 * ------------------------------------------------
 * 1. The XML sitemaps — what Wix currently chooses to publish.
 * 2. Wix's own internal page manifest, embedded in the rendered HTML as
 *    `pageUriSEO` entries. This is the list Wix itself routes from, and it
 *    includes pages excluded from the sitemap, orphaned from navigation, or
 *    never submitted for indexing.
 *
 * The manifest found 15 real pages the sitemaps never listed. Search Console
 * could not have caught them either — that export only reaches back to
 * 2026-05-07, long after the Wix estate was live. Sitemap-only verification
 * would have silently under-reported the estate.
 *
 * Usage: node scripts/verify-legacy-estate.js [--production]
 *   default      registry coverage only (offline, safe in CI)
 *   --production also probes live HTTP status for every legacy path
 */

const fs = require('fs');
const path = require('path');

const WIX_ESTATES = [
  { id: 'g1', label: 'Wix generation 1', base: 'https://petercurrey.wixsite.com/efm-new', prefix: '/efm-new' },
  { id: 'g2', label: 'Wix generation 2', base: 'https://petercurrey.wixstudio.com/efmsut17724', prefix: '/efmsut17724' },
];

const PRODUCTION = 'https://www.entirefm.com';
const UA = 'Mozilla/5.0 (compatible; EntireFM-migration-audit/1.0)';

/**
 * Verified non-pages. Every entry was fetched and returned either the Wix 404
 * page or a hard 404 — they are Wix editor templates, uninstalled members-area
 * routes, platform internals, or unused demo content, never EntireFM pages.
 * See scripts/recover-orphan-wix-pages.js for the full record.
 */
const TEMPLATE_JUNK = new Set([
  // Unused Wix template demo content
  '/fm/epic-battle-montage',
  '/fm/good-morning-london',
  '/fm/hero-squad-interview',
  '/fm/training-session-with-master',
  '/fm/villain-showdown-finale',
  // Wix dynamic-page editor templates — named "(Title)", "(All)", "(Item)"
  '/blank', '/blank-1', '/blank-2', '/blank-4', '/blank-5',
  '/geo-landing-pages-title', '/fm-industries-item', '/hero-section-video-rotation-item',
  // Members Area routes for an app that was never installed
  '/my-account', '/my-drafts', '/notifications', '/followers', '/settings',
  '/profile-1', '/profile/admin/profile', '/blog-comments', '/blog-likes', '/blog-posts',
  // Wix platform internals
  '/error404', '/post', '/fullscreen-page',
]);

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

function toPath(url, prefix) {
  let p = new URL(url).pathname;
  if (prefix && p.startsWith(prefix)) p = p.slice(prefix.length);
  if (!p.startsWith('/')) p = `/${p}`;
  return p.length > 1 ? p.replace(/\/$/, '') : '/';
}

async function crawlEstate({ base, prefix }) {
  const found = new Set();

  // Source 1 — the published XML sitemaps.
  try {
    for (const map of locs(await get(`${base}/sitemap.xml`))) {
      try {
        locs(await get(map)).forEach((u) => found.add(toPath(u, prefix)));
      } catch (err) {
        console.warn(`  ! could not read ${map}: ${err.message}`);
      }
    }
  } catch (err) {
    console.warn(`  ! sitemap unavailable: ${err.message}`);
  }

  // Source 2 — Wix's internal page manifest. Both platforms embed it, but in
  // different responses: the classic estate carries it on the homepage, the
  // Studio estate on any client-rendered route shell.
  for (const probe of ['', '/access-control']) {
    try {
      const html = await get(`${base}${probe}`);
      for (const m of html.matchAll(/"pageUriSEO"\s*:\s*"([^"]+)"/g)) {
        found.add(toPath(`${base}/${m[1]}`, prefix));
      }
    } catch {
      /* the other probe covers it */
    }
  }

  return found;
}

async function probe(p) {
  try {
    const res = await fetch(PRODUCTION + p, { headers: { 'user-agent': UA }, redirect: 'manual' });
    return { status: res.status, location: res.headers.get('location') || '' };
  } catch {
    return { status: 0, location: '' };
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const n = i++;
        out[n] = await fn(items[n]);
      }
    })
  );
  return out;
}

(async () => {
  const checkProduction = process.argv.includes('--production');

  const registry = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'config', 'route-registry.json'), 'utf8')
  );
  const known = new Set(registry.routes.map((r) => r.path));
  const knownDecoded = new Set([...known].map((p) => decodeURIComponent(p)));

  const estates = {};
  for (const estate of WIX_ESTATES) {
    process.stdout.write(`Crawling ${estate.label} ... `);
    estates[estate.id] = await crawlEstate(estate);
    console.log(`${estates[estate.id].size} URLs`);
  }

  const union = new Set();
  Object.values(estates).forEach((s) => s.forEach((p) => union.add(p)));
  const legacy = [...union].filter((p) => !TEMPLATE_JUNK.has(p)).sort();

  const uncovered = legacy.filter(
    (p) => !known.has(p) && !knownDecoded.has(decodeURIComponent(p))
  );

  console.log(`\nLegacy estate: ${legacy.length} real URLs (${TEMPLATE_JUNK.size} Wix demo pages excluded)`);
  console.log(`Rebuild registry: ${known.size} routes`);
  console.log(`Uncovered legacy URLs: ${uncovered.length}`);
  uncovered.forEach((p) => console.log(`  MISSING  ${p}`));

  let failed = uncovered.length > 0;

  if (checkProduction) {
    console.log(`\nProbing production (${PRODUCTION}) ...`);
    const results = await mapLimit(legacy, 12, async (p) => ({ p, ...(await probe(p)) }));
    const byStatus = results.reduce((acc, r) => {
      const k = String(r.status);
      (acc[k] ||= []).push(r);
      return acc;
    }, {});
    Object.keys(byStatus)
      .sort()
      .forEach((k) => console.log(`  ${k}: ${byStatus[k].length}`));

    const gone = results.filter((r) => r.status === 404 || r.status === 410 || r.status === 0);
    if (gone.length) {
      console.log(`\n  ${gone.length} legacy URLs are not served in production:`);
      gone.forEach((r) => console.log(`    ${r.status}  ${r.p}`));
      failed = true;
    }
  }

  if (failed) {
    console.error('\nFAIL: legacy estate is not fully preserved.');
    process.exit(1);
  }
  console.log('\nPASS: every legacy URL is accounted for.');
})();
