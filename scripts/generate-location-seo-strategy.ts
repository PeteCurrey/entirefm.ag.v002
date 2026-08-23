/**
 * LOCATION SEO STRATEGY GENERATOR
 * ===============================
 * Produces docs/seo-rebuild/verified/LOCATION-SEO-STRATEGY.md — the per-page
 * strategy for every Tier 1 city URL.
 *
 * Generated rather than hand-written so the targets, baselines and content
 * angles stay tied to the actual Search Console export and the actual built
 * content records. If the content changes, regenerate; the document cannot
 * drift away from what the site really says.
 *
 * Usage: npx tsx scripts/generate-location-seo-strategy.ts
 */

import fs from 'fs';
import path from 'path';
import { TIER1_CITIES } from '../src/content/locations/tier1-cities';
import { buildTier1Records } from '../src/content/locations/build-tier1';

const ROOT = path.join(__dirname, '..');
const GSC = path.join(ROOT, 'docs/seo-rebuild/verified/gsc');
const OUT = path.join(ROOT, 'docs/seo-rebuild/verified/LOCATION-SEO-STRATEGY.md');

interface Row { [k: string]: string }

function readCsv(file: string): Row[] {
  const text = fs.readFileSync(path.join(GSC, file), 'utf8').trim();
  const lines = text.split(/\r?\n/);
  const head = lines[0].split(',');
  return lines.slice(1).map((l) => {
    // GSC exports don't quote these columns, but split defensively anyway.
    const cells = l.split(',');
    return Object.fromEntries(head.map((h, i) => [h, cells[i] ?? ''])) as Row;
  });
}

const num = (s: string) => parseFloat((s ?? '').replace(/[%,]/g, '')) || 0;

// ── GSC data ────────────────────────────────────────────────────────────────

const pages = readCsv('Pages.csv');
const queries = readCsv('Queries.csv');
const chart = readCsv('Chart.csv');

const dateFrom = chart[0]?.Date ?? '?';
const dateTo = chart[chart.length - 1]?.Date ?? '?';

const pageStats = new Map<string, { clicks: number; impr: number; pos: number }>();
for (const r of pages) {
  const url = r['Top pages'];
  if (!url) continue;
  let p: string;
  try {
    p = decodeURIComponent(new URL(url).pathname);
  } catch {
    continue;
  }
  p = p.length > 1 ? p.replace(/\/$/, '') : '/';
  const prev = pageStats.get(p) ?? { clicks: 0, impr: 0, pos: 0 };
  pageStats.set(p, {
    clicks: prev.clicks + num(r.Clicks),
    impr: prev.impr + num(r.Impressions),
    pos: prev.pos || num(r.Position),
  });
}

/** Queries containing a city name, strongest first. */
function queriesFor(city: string, limit = 6) {
  return queries
    .filter((q) => (q['Top queries'] ?? '').toLowerCase().includes(city.toLowerCase()))
    .sort((a, b) => num(b.Impressions) - num(a.Impressions))
    .slice(0, limit)
    .map((q) => ({
      term: q['Top queries'],
      impr: num(q.Impressions),
      clicks: num(q.Clicks),
      pos: num(q.Position),
    }));
}

// ── Variant roles ───────────────────────────────────────────────────────────

const ROLE: Record<string, { label: string; job: string; angle: string }> = {
  shortForm: {
    label: 'Short-form provider intent',
    job: 'Searcher wants a provider and is close to enquiring.',
    angle: 'Commercial proposition — one contract, supplier consolidation, mobilisation, what it costs and why.',
  },
  headTerm: {
    label: 'Head commercial term',
    job: 'Highest-volume city term. Searcher is comparing providers.',
    angle: 'Local operating conditions — the material that proves genuine local knowledge rather than a templated page.',
  },
  regional: {
    label: 'Regional / portfolio intent',
    job: 'Reversed word order skews local-first and multi-site.',
    angle: 'Districts, building stock and running a portfolio to one standard across the wider region.',
  },
  areas: {
    label: 'Coverage lookup',
    job: 'Searcher is checking whether their site is covered.',
    angle: 'District-by-district coverage, stated honestly including the absence of a local depot.',
  },
  serviceCatalogue: {
    label: 'Service listing',
    job: 'Searcher already wants a provider and is checking scope.',
    angle: 'Hard services, soft services and statutory compliance as a scannable catalogue.',
  },
};

function roleFor(p: string, slug: string): keyof typeof ROLE | null {
  if (p === `/fm-${slug}`) return 'shortForm';
  if (p === `/facilities-management-${slug}`) return 'headTerm';
  if (p === `/${slug}-facilities-management`) return 'regional';
  if (p === `/${slug}-facilities-management-areas`) return 'areas';
  if (p === `/fm-services-${slug}`) return 'serviceCatalogue';
  return null;
}

// ── Build ───────────────────────────────────────────────────────────────────

const registry = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'config/route-registry.json'), 'utf8')
) as { routes: Array<{ path: string }> };
const registryPaths = new Set(registry.routes.map((r) => r.path));
const records = buildTier1Records(registryPaths);

const cities = Object.values(TIER1_CITIES).sort(
  (a, b) => b.searchDemand.impressions - a.searchDemand.impressions
);

const out: string[] = [];
const w = (s = '') => out.push(s);

w('# Location Pages — Per-Page SEO Strategy (Tier 1)');
w();
w(`**Generated:** ${new Date().toISOString().slice(0, 10)} · regenerate with \`npm run seo:location-strategy\``);
w(`**Search Console window:** ${dateFrom} → ${dateTo}`);
w();
w('Every figure below is measured, not estimated. Page targets come from the');
w('Search Console export in `./gsc/`; content angles come from the records built');
w('by `src/content/locations/build-tier1.ts`, so this document cannot describe a');
w('page differently from how the site actually renders it.');
w();
w('---');
w();

// Summary table
w('## Tier 1 at a glance');
w();
w('Ordered by measured impressions. "Position" is the current average — most of');
w('these pages already have demand and rank badly, which is the opportunity.');
w();
w('| City | Impressions | Avg position | URLs rebuilt | Imagery |');
w('|---|---:|---:|---:|---|');
for (const c of cities) {
  const urls = Object.keys(records).filter((p) => roleFor(p, c.slug));
  w(
    `| ${c.name} | ${c.searchDemand.impressions.toLocaleString()} | ${c.searchDemand.avgPosition.toFixed(1)} | ${urls.length} | ${
      c.imageSlug ? '✓ verified' : '✗ **missing**'
    } |`
  );
}
w();

const noImagery = cities.filter((c) => !c.imageSlug);
if (noImagery.length) {
  w('> **Imagery gap.** ' +
    noImagery.map((c) => c.name).join(' and ') +
    ' have no verified photography. ' +
    'The Leeds source folder is byte-identical to Sheffield and its identifiable ' +
    'landmark is the Sheffield Winter Garden, so publishing it on a Leeds page ' +
    'would put another city on it. These pages render without an image rather ' +
    'than with a wrong one. Leeds carries the 4th-highest demand of any city and ' +
    'ranks best of all on query position — it is the highest-value shoot to commission.');
  w();
}

w('---');
w();

// Per city
for (const c of cities) {
  const cityUrls = Object.keys(records)
    .filter((p) => roleFor(p, c.slug))
    .sort();
  if (!cityUrls.length) continue;

  w(`## ${c.name}`);
  w();
  w(`*${c.region}. ${c.positioning}*`);
  w();

  const q = queriesFor(c.name);
  if (q.length) {
    w('**Measured query demand**');
    w();
    w('| Query | Impressions | Clicks | Avg position |');
    w('|---|---:|---:|---:|');
    for (const item of q) {
      w(`| ${item.term} | ${item.impr.toLocaleString()} | ${item.clicks} | ${item.pos.toFixed(1)} |`);
    }
    w();
  }

  for (const p of cityUrls) {
    const role = ROLE[roleFor(p, c.slug)!];
    const rec = records[p];
    const stat = pageStats.get(p);

    w(`### \`${p}\``);
    w();
    w(`**Role:** ${role.label} — ${role.job}`);
    w();
    w(`**Content angle:** ${role.angle}`);
    w();
    w('| | |');
    w('|---|---|');
    w(`| Target query | \`${rec.primaryIntent}\` |`);
    w(`| Secondary | ${rec.secondaryIntents.map((s) => `\`${s}\``).join(', ')} |`);
    w(`| Title | ${rec.title} |`);
    w(`| H1 | ${rec.h1} |`);
    w(
      `| GSC baseline | ${
        stat
          ? `${stat.clicks} clicks · ${stat.impr.toLocaleString()} impressions · pos ${stat.pos.toFixed(1)}`
          : 'no data — page currently 404s or has no impressions'
      } |`
    );
    w(`| Hero image | ${rec.heroImage ? `\`${rec.heroImage}\`` : '— none (no verified photography)'} |`);
    w(`| Internal links | ${rec.relatedRoutes.map((r) => `\`${r}\``).join(', ') || '—'} |`);
    w(`| Schema | WebPage · Service (areaServed: ${c.name}) · FAQPage · BreadcrumbList |`);
    w(`| Conversion goal | ${rec.conversionGoal} |`);
    w();
  }

  w('**Local material this city owns** — the facts that keep these pages distinct:');
  w();
  for (const oc of c.operatingConditions) w(`- **${oc.title}** — ${oc.detail}`);
  w();
  w('---');
  w();
}

// Method
w('## Method and cautions');
w();
w(`- **Window is short.** The export covers ${dateFrom} → ${dateTo} (~105 days), not the 16 months the filter names. The property appears to hold no earlier data, so this is a baseline of the *current damaged site*, not of the historic Wix estate. It shows where demand exists now; it does not show what the legacy pages used to earn.`);
w('- **Impressions with poor positions are the opportunity.** Several cities draw tens of thousands of impressions at average positions between 35 and 72. The demand is proven and the ranking is not — which is what a differentiated page is for.');
w('- **Restoration and indexation are separate decisions.** All 187 legacy URLs return content. Only Tier 1 carries bespoke content; the remainder should stay `noindex` until differentiated. Enforce with `npm run check:similarity`.');
w('- **No local premises are claimed anywhere.** `GEO_REGIONAL_CENTRES` is `DO_NOT_USE` in the claims registry, so no page asserts a depot, branch or operations centre in a city. Location pages emit `Service` with `areaServed`, never `LocalBusiness`.');

fs.writeFileSync(OUT, out.join('\n') + '\n');
console.log(`Wrote ${OUT}`);
console.log(`  cities: ${cities.length}   pages documented: ${Object.keys(records).length}`);
