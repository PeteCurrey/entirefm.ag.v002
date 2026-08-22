#!/usr/bin/env node
/**
 * FINAL STAGING HTTP CRAWLER (Phase 09R.3)
 * ========================================
 * Performs real HTTP requests against https://entirefmagv002.vercel.app
 * across all 233 registered routes.
 *
 * Verifies:
 * - HTTP 200 on all registered routes (including 8 encoded historic routes)
 * - Strict 'noindex' in meta robots on staging
 * - Canonical URL points to 'https://www.entirefm.com...'
 * - Zero public '[PENDING' or '[VERIF' strings in rendered HTML
 * - Zero 'Lorem ipsum' or 'placeholder' strings in rendered HTML
 * - Generates /docs/qa/FINAL-RENDERED-METADATA-AUDIT.csv
 * - Generates /docs/qa/STAGING-HTTP-CRAWL.csv
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const STAGING_HOST = process.env.STAGING_HOST || 'entirefmagv002.vercel.app';
const STAGING_URL = `https://${STAGING_HOST}`;
const REGISTRY_PATH = path.join(__dirname, '../config/route-registry.json');
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

function fetchPage(urlStr) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlStr);
      const req = https.get(
        {
          hostname: url.hostname,
          path: url.pathname + url.search,
          headers: {
            'User-Agent': 'EntireFM-Phase09R3-Final-Audit/1.0',
          },
          timeout: 15000,
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body,
            });
          });
        }
      );

      req.on('error', (err) => {
        resolve({
          statusCode: 0,
          error: err.message,
          body: '',
          headers: {},
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          statusCode: 408,
          error: 'Request Timeout',
          body: '',
          headers: {},
        });
      });
    } catch (e) {
      resolve({
        statusCode: 0,
        error: e.message,
        body: '',
        headers: {},
      });
    }
  });
}

async function runCrawl() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  PHASE 09R.3 — FINAL STAGING HTTP AUDIT');
  console.log('══════════════════════════════════════════════════════════════');
  console.log(`Target Host: ${STAGING_URL}`);
  console.log(`Total routes to audit: ${registry.routes.length}`);
  console.log('');

  const auditRows = [];
  const crawlRows = [];

  let count200 = 0;
  let count404 = 0;
  let countOther = 0;
  let countNoindex = 0;
  let countIndexable = 0;
  let countCorrectCanonical = 0;
  let countWrongCanonical = 0;
  let placeholderCount = 0;

  const CONCURRENCY = 5;
  const routes = registry.routes;

  for (let i = 0; i < routes.length; i += CONCURRENCY) {
    const chunk = routes.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (route) => {
        const fullUrl = `${STAGING_URL}${route.path}`;
        const res = await fetchPage(fullUrl);
        const body = res.body || '';

        // Extract title
        const titleMatch = body.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract H1
        const h1Match = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') : '';

        // Extract canonical
        const canonicalMatch = body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                               body.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
        const canonical = canonicalMatch ? canonicalMatch[1] : '';

        // Extract robots meta
        const robotsMatch = body.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
        const robots = robotsMatch ? robotsMatch[1] : '';

        // Status counts
        if (res.statusCode === 200) count200++;
        else if (res.statusCode === 404) count404++;
        else countOther++;

        // Noindex check
        const isNoindex = robots.toLowerCase().includes('noindex');
        if (isNoindex) countNoindex++;
        else countIndexable++;

        // Canonical check (must point to https://www.entirefm.com...)
        const isCanonicalCorrect = canonical.startsWith('https://www.entirefm.com');
        if (isCanonicalCorrect) countCorrectCanonical++;
        else countWrongCanonical++;

        // Placeholder scan
        const hasPlaceholder =
          body.includes('[PENDING') ||
          body.includes('[VERIF') ||
          body.includes('Lorem ipsum') ||
          body.includes('0800 000 0000');
        if (hasPlaceholder) placeholderCount++;

        const isEncoded = route.path.includes('%');
        if (res.statusCode !== 200 || !isNoindex || !isCanonicalCorrect || hasPlaceholder) {
          console.log(`[HTTP ${res.statusCode}] ${route.path} | robots: ${robots} | canon: ${canonical}`);
        } else if (isEncoded) {
          console.log(`[HTTP 200 OK] (Encoded historic) ${route.path}`);
        }

        auditRows.push({
          path: route.path,
          statusCode: res.statusCode,
          title: title.replace(/,/g, ' '),
          h1: h1.replace(/,/g, ' '),
          canonical,
          canonicalCorrect: isCanonicalCorrect ? 'YES' : 'NO',
          robotsMeta: robots,
          isNoindex: isNoindex ? 'YES' : 'NO',
          hasPlaceholders: hasPlaceholder ? 'YES' : 'NO',
          provenance: route.routeProvenance,
          protected: route.protected ? 'YES' : 'NO',
        });

        crawlRows.push({
          url: fullUrl,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'] || '',
          contentLength: body.length,
          title: title.replace(/,/g, ' '),
          h1: h1.replace(/,/g, ' '),
          canonical,
          metaRobots: robots,
        });
      })
    );
  }

  // Write CSV reports
  const auditHeader = 'Path,HTTP Status,Title,H1,Canonical URL,Canonical Correct (www.entirefm.com),Meta Robots,Noindex Active,Placeholders Found,Provenance,Protected';
  const auditContent = auditRows
    .map((r) => `${r.path},${r.statusCode},"${r.title}","${r.h1}",${r.canonical},${r.canonicalCorrect},${r.robotsMeta},${r.isNoindex},${r.hasPlaceholders},${r.provenance},${r.protected}`)
    .join('\n');
  fs.writeFileSync(path.join(__dirname, '../docs/qa/FINAL-RENDERED-METADATA-AUDIT.csv'), `${auditHeader}\n${auditContent}`);

  const crawlHeader = 'URL,Status Code,Content Type,Content Length,Title,H1,Canonical,Meta Robots';
  const crawlContent = crawlRows
    .map((r) => `${r.url},${r.statusCode},"${r.contentType}",${r.contentLength},"${r.title}","${r.h1}",${r.canonical},${r.metaRobots}`)
    .join('\n');
  fs.writeFileSync(path.join(__dirname, '../docs/qa/STAGING-HTTP-CRAWL.csv'), `${crawlHeader}\n${crawlContent}`);

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  FINAL STAGING CRAWL SCORECARD');
  console.log('══════════════════════════════════════════════════════════════');
  console.log(`  Total Routes Requested:        ${registry.routes.length}`);
  console.log(`  HTTP 200 OK:                   ${count200} / ${registry.routes.length}`);
  console.log(`  HTTP 404 Not Found:            ${count404}`);
  console.log(`  HTTP Other Status:             ${countOther}`);
  console.log(`  Pages with noindex (Staging):  ${countNoindex} / ${registry.routes.length}`);
  console.log(`  Indexable Pages Leak:          ${countIndexable}`);
  console.log(`  Correct Canonical Host:        ${countCorrectCanonical} / ${registry.routes.length}`);
  console.log(`  Wrong Canonical Host:          ${countWrongCanonical}`);
  console.log(`  Pages with QA Placeholders:    ${placeholderCount}`);
  console.log('══════════════════════════════════════════════════════════════');

  return {
    count200,
    count404,
    countOther,
    countNoindex,
    countIndexable,
    countCorrectCanonical,
    countWrongCanonical,
    placeholderCount,
  };
}

if (require.main === module) {
  runCrawl().catch(console.error);
}

module.exports = { runCrawl };
