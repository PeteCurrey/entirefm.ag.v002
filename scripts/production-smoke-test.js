#!/usr/bin/env node
/**
 * PRODUCTION SMOKE TEST SCRIPT
 * ============================
 * Tests representative commercial routes on live target host.
 * Usage: node scripts/production-smoke-test.js [baseUrl]
 */

const https = require('https');
const http = require('http');

const targetHost = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const testRoutes = [
  '/',
  '/mechanical-electrical',
  '/hvac-contractor',
  '/ppm',
  '/industrial-cleaning',
  '/fm-london',
  '/facilities-management-london',
  '/london-facilities-management',
  '/industrial-cleaning-london',
  '/industrial-facilities-management',
  '/contact-us',
];

console.log(`Starting Production Smoke Test against: ${targetHost}\n`);

async function fetchRoute(urlPath) {
  const url = `${targetHost}${urlPath}`;
  const client = url.startsWith('https') ? https : http;

  return new Promise((resolve) => {
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          hasH1: /<h1[^>]*>([\s\S]+?)<\/h1>/i.test(data),
          hasCanonical: /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i.test(data),
          hasForm: /<form/i.test(data),
          dataLength: data.length,
        });
      });
    }).on('error', (err) => {
      resolve({ path: urlPath, statusCode: 500, error: err.message });
    });
  });
}

(async () => {
  let passed = 0;
  let failed = 0;

  for (const r of testRoutes) {
    const res = await fetchRoute(r);
    if (res.statusCode === 200 && res.hasH1 && res.hasCanonical) {
      console.log(`✓ [200 OK] ${r.padEnd(35)} (H1: ✓, Canonical: ✓, Size: ${res.dataLength}b)`);
      passed++;
    } else {
      console.error(`✗ [FAIL]   ${r.padEnd(35)} Status: ${res.statusCode}, Error: ${res.error || 'Missing H1/Canonical'}`);
      failed++;
    }
  }

  console.log(`\nSmoke Test Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
})();
