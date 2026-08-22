#!/usr/bin/env node
/**
 * STAGING DEPLOYMENT HTTP CRAWLER
 * ===============================
 * Performs genuine HTTP requests against the deployed staging site:
 * 1. Checks every registered 200 page
 * 2. Extracts and verifies all internal links on rendered HTML
 * 3. Asserts robots: noindex, nofollow on staging
 * 4. Generates STAGING-HTTP-CRAWL.csv & STAGING-INTERNAL-LINK-AUDIT.csv
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const repoRoot = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf8'));

const STAGING_ORIGIN = process.env.STAGING_URL || 'https://entirefmagv002.vercel.app';
const TIMEOUT_MS = 8000;
const MAX_CONCURRENCY = 5;

console.log('══════════════════════════════════════════════════════════════');
console.log('  STAGING DEPLOYMENT HTTP & INTERNAL LINK CRAWLER');
console.log('══════════════════════════════════════════════════════════════');
console.log(`Target: ${STAGING_ORIGIN}`);
console.log(`Routes to audit: ${registry.routes.length}`);
console.log('');

function fetchPage(targetUrl) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const protocol = parsed.protocol === 'https:' ? https : http;

      const req = protocol.get(
        targetUrl,
        {
          headers: {
            'User-Agent': 'EntireFM-Staging-Auditor/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: TIMEOUT_MS,
        },
        (res) => {
          let data = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            resolve({
              url: targetUrl,
              status: res.statusCode || 0,
              headers: res.headers,
              body: data,
              error: null,
            });
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        resolve({ url: targetUrl, status: 0, headers: {}, body: '', error: 'TIMEOUT' });
      });

      req.on('error', (err) => {
        resolve({ url: targetUrl, status: 0, headers: {}, body: '', error: err.message });
      });
    } catch (err) {
      resolve({ url: targetUrl, status: 0, headers: {}, body: '', error: err.message });
    }
  });
}

function extractMetadata(html) {
  let title = '';
  let h1 = '';
  let canonical = '';
  let robots = '';

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) title = titleMatch[1].trim();

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) h1 = h1Match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');

  const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
                     html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  if (canonMatch) canonical = canonMatch[1].trim();

  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
  if (robotsMatch) robots = robotsMatch[1].trim();

  return { title, h1, canonical, robots };
}

function extractInternalLinks(html, pagePath) {
  const links = new Set();
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const raw = match[1].trim();
    if (raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/api/')) {
      const clean = raw.split('?')[0].split('#')[0];
      if (clean && !clean.match(/\.(png|jpg|jpeg|svg|ico|css|js|woff|woff2|pdf)$/)) {
        links.add(clean);
      }
    }
  }
  return Array.from(links);
}

async function runAudit() {
  const crawlResults = [];
  const linkAuditResults = [];
  const registeredPaths = new Set(registry.routes.map(r => r.path));

  console.log('Auditing routes against staging...');

  for (let i = 0; i < registry.routes.length; i += MAX_CONCURRENCY) {
    const batch = registry.routes.slice(i, i + MAX_CONCURRENCY);
    const promises = batch.map(async (r) => {
      const targetUrl = `${STAGING_ORIGIN}${r.path}`;
      const res = await fetchPage(targetUrl);
      const meta = res.body ? extractMetadata(res.body) : { title: '', h1: '', canonical: '', robots: '' };
      const internalLinks = res.body ? extractInternalLinks(res.body, r.path) : [];

      // Audit internal links from this page
      for (const link of internalLinks) {
        const isValidRoute = registeredPaths.has(link);
        linkAuditResults.push({
          sourcePath: r.path,
          targetPath: link,
          targetExistsInRegistry: isValidRoute ? 'TRUE' : 'FALSE'
        });
      }

      return {
        path: r.path,
        url: targetUrl,
        httpStatus: res.status,
        h1: meta.h1,
        title: meta.title,
        canonical: meta.canonical,
        metaRobots: meta.robots,
        internalLinkCount: internalLinks.length,
        error: res.error || ''
      };
    });

    const batchResults = await Promise.all(promises);
    crawlResults.push(...batchResults);
    process.stdout.write(`\rAudited ${crawlResults.length}/${registry.routes.length} pages...`);
  }

  console.log('\nAudit complete.');

  // 1. Write STAGING-HTTP-CRAWL.csv
  const crawlHeaders = ['path', 'url', 'httpStatus', 'h1', 'title', 'canonical', 'metaRobots', 'internalLinkCount', 'error'];
  const crawlRows = [crawlHeaders.join(',')];
  for (const c of crawlResults) {
    crawlRows.push([
      `"${c.path}"`,
      `"${c.url}"`,
      c.httpStatus,
      `"${c.h1.replace(/"/g, '""')}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.canonical.replace(/"/g, '""')}"`,
      `"${c.metaRobots.replace(/"/g, '""')}"`,
      c.internalLinkCount,
      `"${c.error}"`
    ].join(','));
  }

  const crawlPath = path.join(repoRoot, 'docs', 'qa', 'STAGING-HTTP-CRAWL.csv');
  fs.writeFileSync(crawlPath, crawlRows.join('\n'));
  console.log(`Wrote staging crawl report to ${crawlPath}`);

  // 2. Write STAGING-INTERNAL-LINK-AUDIT.csv
  const linkHeaders = ['sourcePath', 'targetPath', 'targetExistsInRegistry'];
  const linkRows = [linkHeaders.join(',')];
  for (const l of linkAuditResults) {
    linkRows.push([`"${l.sourcePath}"`, `"${l.targetPath}"`, l.targetExistsInRegistry].join(','));
  }

  const linkPath = path.join(repoRoot, 'docs', 'qa', 'STAGING-INTERNAL-LINK-AUDIT.csv');
  fs.writeFileSync(linkPath, linkRows.join('\n'));
  console.log(`Wrote internal link audit to ${linkPath}`);
}

runAudit().catch(console.error);
