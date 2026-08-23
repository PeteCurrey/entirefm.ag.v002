#!/usr/bin/env node
/**
 * PAGE SIMILARITY GATE
 * ====================
 * Fails when two indexable pages are too close to being the same page.
 *
 * WHY
 * ---
 * The rebuild restores 187 legacy URLs. Restoring them as near-identical
 * templated pages turns a recoverable technical problem (404s) into a much
 * harder one (a site-wide doorway-page assessment). The rebuild plan forbids
 * "city-name swapping"; this makes that rule enforceable instead of
 * aspirational.
 *
 * METHOD
 * ------
 * Compares 8-word shingles between rendered pages, as Jaccard similarity.
 * Navigation, header and footer are shared by design, so the threshold is set
 * above that floor rather than at zero.
 *
 * Run after `npm run build`.
 *   node scripts/check-page-similarity.js [--threshold 0.70] [--json]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BUILD_DIR = path.join(__dirname, '..', '.next', 'server', 'app');
const REGISTRY = path.join(__dirname, '..', 'config', 'route-registry.json');

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const THRESHOLD = parseFloat(arg('--threshold', '0.70'));
const SHINGLE = 8;

function textOf(file) {
  let html;
  try {
    html = fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function shingles(text) {
  const words = text.split(' ');
  const set = new Set();
  for (let i = 0; i + SHINGLE <= words.length; i++) {
    set.add(
      crypto.createHash('md5').update(words.slice(i, i + SHINGLE).join(' ')).digest('hex').slice(0, 12)
    );
  }
  return set;
}

function jaccard(a, b) {
  let shared = 0;
  for (const x of a) if (b.has(x)) shared++;
  const union = a.size + b.size - shared;
  return union ? shared / union : 0;
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const indexable = registry.routes.filter((r) => r.indexable);

const docs = new Map();
for (const route of indexable) {
  const rel = route.path === '/' ? '/index' : route.path;
  const text = textOf(path.join(BUILD_DIR, `${rel}.html`));
  if (text && text.split(' ').length > SHINGLE * 2) docs.set(route.path, shingles(text));
}

if (!docs.size) {
  console.error('No built pages found. Run `npm run build` first.');
  process.exit(1);
}

// Compare within route type — pages of different archetypes are expected to differ.
const byType = new Map();
for (const route of indexable) {
  if (!docs.has(route.path)) continue;
  if (!byType.has(route.routeType)) byType.set(route.routeType, []);
  byType.get(route.routeType).push(route.path);
}

const failures = [];
const stats = [];

for (const [type, paths] of byType) {
  if (paths.length < 2) continue;
  const sims = [];
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j++) {
      const score = jaccard(docs.get(paths[i]), docs.get(paths[j]));
      sims.push(score);
      if (score >= THRESHOLD) failures.push({ score, a: paths[i], b: paths[j], type });
    }
  }
  sims.sort((x, y) => x - y);
  stats.push({
    type,
    pages: paths.length,
    pairs: sims.length,
    median: sims[Math.floor(sims.length / 2)],
    max: sims[sims.length - 1],
  });
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ threshold: THRESHOLD, stats, failures }, null, 2));
} else {
  console.log(`Page similarity gate — threshold ${(THRESHOLD * 100).toFixed(0)}%\n`);
  console.log('  route type            pages   pairs   median      max');
  for (const s of stats.sort((a, b) => b.pairs - a.pairs)) {
    console.log(
      `  ${s.type.padEnd(20)} ${String(s.pages).padStart(5)} ${String(s.pairs).padStart(7)}` +
        `   ${(s.median * 100).toFixed(1).padStart(5)}%  ${(s.max * 100).toFixed(1).padStart(6)}%`
    );
  }
  if (failures.length) {
    console.log(`\n  ${failures.length} pair(s) at or above threshold:\n`);
    failures
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .forEach((f) => console.log(`    ${(f.score * 100).toFixed(1)}%  ${f.a}  <->  ${f.b}`));
  }
}

if (failures.length) {
  console.error(
    `\nFAIL: ${failures.length} page pair(s) exceed ${(THRESHOLD * 100).toFixed(0)}% similarity.\n` +
      'Differentiate them or set them noindex until they carry distinct content.'
  );
  process.exit(1);
}
console.log('\nPASS: no indexable page pair exceeds the threshold.');
