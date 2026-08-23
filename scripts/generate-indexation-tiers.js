#!/usr/bin/env node
/**
 * INDEXATION TIER GENERATOR
 * =========================
 * Decides which pages are offered to search engines for indexing, and writes
 * the decision to config/indexation-tiers.json.
 *
 * THE RULE THIS IMPLEMENTS
 * ------------------------
 * Every legacy URL is a real 200 page. That is non-negotiable and this script
 * never changes it — nothing here redirects, deletes or 404s anything. What it
 * controls is only whether a page carries `noindex` while it is still a
 * near-duplicate of another page.
 *
 * Restoring 187 URLs is what recovers the link equity and ranking history.
 * Offering 187 near-identical pages for indexing is what risks a site-wide
 * doorway-page assessment. Those are separate decisions, so they are made
 * separately.
 *
 * HOW A PAGE IS CLASSIFIED
 * ------------------------
 *  1. Pages are compared within their route type using 8-word shingles.
 *  2. Pairs at or above the threshold are grouped into clusters (union-find).
 *  3. Each cluster keeps ONE page indexed — its representative — chosen by
 *     measured Search Console value first, then bespoke content, then the
 *     shorter path. The rest are noindex until differentiated.
 *  4. Every page not in a cluster is indexed.
 *
 * Keeping the strongest member of each cluster indexed matters: blanket-
 * noindexing a whole cluster would drop pages that currently rank.
 *
 * A page leaves noindex by having content written for it, not by editing this
 * file — rerun after differentiating and it reclassifies itself.
 *
 * Run after `npm run build`.
 *   node scripts/generate-indexation-tiers.js [--threshold 0.70] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const BUILD_DIR = path.join(ROOT, '.next/server/app');
const OUT = path.join(ROOT, 'config/indexation-tiers.json');
const GSC_PAGES = path.join(ROOT, 'docs/seo-rebuild/verified/gsc/Pages.csv');

const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const THRESHOLD = parseFloat(arg('--threshold', '0.70'));
const SHINGLE = 8;

// ── inputs ──────────────────────────────────────────────────────────────────

const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/route-registry.json'), 'utf8'));

/** Search Console value per path, used to pick cluster representatives. */
function gscValue() {
  const map = new Map();
  if (!fs.existsSync(GSC_PAGES)) return map;
  const lines = fs.readFileSync(GSC_PAGES, 'utf8').trim().split(/\r?\n/).slice(1);
  for (const line of lines) {
    const cells = line.split(',');
    let p;
    try {
      p = decodeURIComponent(new URL(cells[0]).pathname);
    } catch {
      continue;
    }
    p = p.length > 1 ? p.replace(/\/$/, '') : '/';
    const prev = map.get(p) ?? { clicks: 0, impressions: 0 };
    map.set(p, {
      clicks: prev.clicks + (parseFloat(cells[1]) || 0),
      impressions: prev.impressions + (parseFloat(cells[2]) || 0),
    });
  }
  return map;
}

/** Paths carrying bespoke Tier 1 city content. */
function tier1Paths() {
  const cities = ['london', 'manchester', 'sheffield', 'leeds', 'birmingham', 'derby', 'nottingham', 'lincoln', 'liverpool'];
  const known = new Set(registry.routes.map((r) => r.path));
  const out = new Set();
  for (const c of cities) {
    for (const p of [`/fm-${c}`, `/facilities-management-${c}`, `/${c}-facilities-management`, `/${c}-facilities-management-areas`, `/fm-services-${c}`]) {
      if (known.has(p)) out.add(p);
    }
  }
  return out;
}

function textOf(routePath) {
  const rel = routePath === '/' ? '/index' : routePath;
  for (const candidate of new Set([rel, decodeURIComponent(rel)])) {
    const file = path.join(BUILD_DIR, `${candidate}.html`);
    if (!fs.existsSync(file)) continue;
    return fs
      .readFileSync(file, 'utf8')
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
  return null;
}

const shingles = (t) => {
  const w = t.split(' ');
  const s = new Set();
  for (let i = 0; i + SHINGLE <= w.length; i++) {
    s.add(crypto.createHash('md5').update(w.slice(i, i + SHINGLE).join(' ')).digest('hex').slice(0, 12));
  }
  return s;
};

const jaccard = (a, b) => {
  let shared = 0;
  for (const x of a) if (b.has(x)) shared++;
  const union = a.size + b.size - shared;
  return union ? shared / union : 0;
};

// ── build document set ──────────────────────────────────────────────────────

const GSC = gscValue();
const TIER1 = tier1Paths();

const docs = new Map();
for (const route of registry.routes) {
  const text = textOf(route.path);
  if (text && text.split(' ').length > SHINGLE * 2) docs.set(route.path, shingles(text));
}

if (!docs.size) {
  console.error('No built pages found. Run `npm run build` first.');
  process.exit(1);
}

// ── cluster near-duplicates within each route type ──────────────────────────

const parent = new Map([...docs.keys()].map((p) => [p, p]));
const find = (x) => {
  while (parent.get(x) !== x) {
    parent.set(x, parent.get(parent.get(x)));
    x = parent.get(x);
  }
  return x;
};
const union = (a, b) => {
  const ra = find(a);
  const rb = find(b);
  if (ra !== rb) parent.set(ra, rb);
};

/**
 * Pages only compete when they are chasing the same thing.
 *
 * Two templated city pages are textually near-identical, but /fm-bradford and
 * /fm-chesterfield target different searches. Holding one in favour of the
 * other gains nothing and removes a city from the geo estate entirely — which
 * is the failure that caused the collapse in the first place. Thin content on
 * a distinct target is a page to improve, not a page to hide.
 *
 * So the comparison is scoped to route type AND target location. Different
 * cities never cluster; the variants within a city do.
 */
const CITY_TOKENS = [
  'london', 'manchester', 'sheffield', 'leeds', 'birmingham', 'derby', 'nottingham',
  'lincoln', 'liverpool', 'bradford', 'chesterfield', 'doncaster', 'rotherham',
  'telford', 'oxford', 'bolton', 'bury', 'wigan', 'preston', 'grimsby', 'matlock',
  'midlands',
];

function targetKey(route) {
  const slug = route.path.toLowerCase();
  const city = CITY_TOKENS.find((c) => slug.includes(c));
  return `${route.routeType}::${city ?? 'national'}`;
}

const byType = new Map();
for (const route of registry.routes) {
  if (!docs.has(route.path)) continue;
  const key = targetKey(route);
  if (!byType.has(key)) byType.set(key, []);
  byType.get(key).push(route.path);
}

/** Highest similarity each page has to any other page, for reporting. */
const peak = new Map();

for (const paths of byType.values()) {
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      const score = jaccard(docs.get(paths[i]), docs.get(paths[j]));
      for (const [a, b] of [[paths[i], paths[j]], [paths[j], paths[i]]]) {
        const cur = peak.get(a);
        if (!cur || score > cur.score) peak.set(a, { score, other: b });
      }
      if (score >= THRESHOLD) union(paths[i], paths[j]);
    }
  }
}

const clusters = new Map();
for (const p of docs.keys()) {
  const root = find(p);
  if (!clusters.has(root)) clusters.set(root, []);
  clusters.get(root).push(p);
}

// ── choose a representative per cluster ─────────────────────────────────────

/** Higher is better. Measured performance wins, then bespoke content. */
function rank(p) {
  const g = GSC.get(p) ?? { clicks: 0, impressions: 0 };
  return [g.clicks, g.impressions, TIER1.has(p) ? 1 : 0, -p.length];
}
const better = (a, b) => {
  const ra = rank(a);
  const rb = rank(b);
  for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] > rb[i];
  return a < b;
};

const decisions = {};

for (const members of clusters.values()) {
  if (members.length === 1) {
    const p = members[0];
    decisions[p] = {
      indexable: true,
      tier: TIER1.has(p) ? 'TIER_1' : 'UNIQUE',
      reason: TIER1.has(p) ? 'Bespoke city content' : 'No near-duplicate above threshold',
      peakSimilarity: +(peak.get(p)?.score ?? 0).toFixed(3),
    };
    continue;
  }

  const rep = members.reduce((best, p) => (better(p, best) ? p : best), members[0]);
  for (const p of members) {
    const g = GSC.get(p) ?? { clicks: 0, impressions: 0 };
    decisions[p] =
      p === rep
        ? {
            indexable: true,
            tier: TIER1.has(p) ? 'TIER_1' : 'CLUSTER_REPRESENTATIVE',
            reason: `Strongest page in a ${members.length}-page near-duplicate cluster (${g.clicks} clicks, ${g.impressions} impressions)`,
            peakSimilarity: +(peak.get(p)?.score ?? 0).toFixed(3),
            clusterSize: members.length,
          }
        : {
            indexable: false,
            tier: 'AWAITING_DIFFERENTIATION',
            reason: `${(peak.get(p).score * 100).toFixed(1)}% similar to ${peak.get(p).other}. Page remains live and returns 200 — noindex only until it carries distinct content.`,
            peakSimilarity: +peak.get(p).score.toFixed(3),
            clusterSize: members.length,
            representative: rep,
          };
  }
}

// Any route without a built page keeps its registry setting untouched.
for (const route of registry.routes) {
  if (!decisions[route.path]) {
    decisions[route.path] = {
      indexable: route.indexable,
      tier: 'UNCLASSIFIED',
      reason: 'No rendered page available at generation time; registry setting retained.',
      peakSimilarity: 0,
    };
  }
}

const indexed = Object.values(decisions).filter((d) => d.indexable).length;
const held = Object.values(decisions).length - indexed;

const output = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description:
    'Indexation tiers. Controls noindex only — never routing. Every path here is a live 200 page ' +
    'regardless of its indexable value. Regenerate with: npm run tiers:generate',
  generated: new Date().toISOString().slice(0, 10),
  method: `8-word shingle Jaccard within route type, threshold ${THRESHOLD}`,
  guarantees: {
    noRedirects: true,
    no404s: true,
    allLegacyUrlsReturn200: true,
  },
  summary: { total: Object.keys(decisions).length, indexable: indexed, awaitingDifferentiation: held },
  tiers: decisions,
};

if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify(output.summary, null, 2));
} else {
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n');
}

const byTier = {};
for (const d of Object.values(decisions)) byTier[d.tier] = (byTier[d.tier] ?? 0) + 1;

console.log(`Indexation tiers — threshold ${(THRESHOLD * 100).toFixed(0)}%\n`);
for (const [tier, n] of Object.entries(byTier).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${tier.padEnd(26)} ${String(n).padStart(4)}`);
}
console.log(`\n  indexable                  ${String(indexed).padStart(4)}`);
console.log(`  held for differentiation   ${String(held).padStart(4)}`);
console.log(`\n  All ${Object.keys(decisions).length} routes remain live 200 pages. No redirects, no 404s.`);
if (!process.argv.includes('--dry-run')) console.log(`\nWrote ${path.relative(ROOT, OUT)}`);
