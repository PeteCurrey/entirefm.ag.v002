import fs from 'fs';
import path from 'path';
import { ALL_ROUTES, getRoute } from '../src/lib/routes/route-registry';
import { getAllPublishedLobbyArticles } from '../src/lib/lobby/repository';

const SRC_DIR = path.resolve(__dirname, '../src');
const APP_DIR = path.join(SRC_DIR, 'app');

// 1. Get all published lobby article slugs
const publishedArticleSlugs = new Set(getAllPublishedLobbyArticles().map((a) => a.slug));
console.log(`Loaded ${publishedArticleSlugs.size} published lobby articles.`);
console.log(`Loaded ${ALL_ROUTES.length} registry routes.`);

// 2. Discover all physical routes defined in src/app
function getPhysicalAppRoutes(dir: string, currentRoute = ''): { exactRoutes: Set<string>; dynamicRoutes: { pattern: RegExp; def: string }[] } {
  const exactRoutes = new Set<string>();
  const dynamicRoutes: { pattern: RegExp; def: string }[] = [];

  function walk(currentDir: string, routePath: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith('(') && entry.name.endsWith(')')) {
          walk(path.join(currentDir, entry.name), routePath);
        } else if (entry.name.startsWith('@')) {
          continue;
        } else {
          walk(path.join(currentDir, entry.name), routePath + '/' + entry.name);
        }
      } else if (entry.isFile() && (entry.name === 'page.tsx' || entry.name === 'page.jsx' || entry.name === 'route.ts' || entry.name === 'route.js')) {
        const fullRoute = routePath === '' ? '/' : routePath;
        if (fullRoute.includes('[')) {
          if (fullRoute === '/[...slug]') {
            // Root catch-all handled separately via route registry!
            continue;
          }
          const regexStr = '^' + fullRoute
            .replace(/\/\[\.\.\.([^\]]+)\]/g, '(?:/(.+))?')
            .replace(/\/\[([^\]]+)\]/g, '/([^/]+)') + '$';
          dynamicRoutes.push({ pattern: new RegExp(regexStr), def: fullRoute });
        } else {
          exactRoutes.add(fullRoute);
        }
      }
    }
  }

  walk(dir, '');
  return { exactRoutes, dynamicRoutes };
}

const { exactRoutes, dynamicRoutes } = getPhysicalAppRoutes(APP_DIR);
console.log(`Discovered ${exactRoutes.size} exact physical app routes and ${dynamicRoutes.length} dynamic app routes.`);

function isRouteValid(testUrl: string): { valid: boolean; reason?: string } {
  const clean = testUrl.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

  // Check 1: exact physical route in src/app
  if (exactRoutes.has(clean)) return { valid: true };

  // Check 2: Route Registry (marketing / CMS pages)
  if (getRoute(clean)) return { valid: true };

  // Check 3: Lobby article (/lobby/[slug])
  if (clean.startsWith('/lobby/')) {
    const parts = clean.split('/').filter(Boolean);
    if (parts.length === 2 && parts[0] === 'lobby') {
      const slug = parts[1];
      if (publishedArticleSlugs.has(slug)) return { valid: true };
    }
  }

  // Check 4: Other dynamic app routes (excluding root [...slug])
  for (const { pattern, def } of dynamicRoutes) {
    if (pattern.test(clean)) {
      if (def === '/lobby/[slug]') {
        return { valid: false, reason: `Matches /lobby/[slug] but article '${clean}' not in published articles` };
      }
      return { valid: true };
    }
  }

  return { valid: false, reason: `No matching app route or route registry entry` };
}

// Scan all source files
function scanFiles(dir: string, list: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        scanFiles(full, list);
      }
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      list.push(full);
    }
  }
  return list;
}

const allFiles = scanFiles(SRC_DIR);
const urlRegex = /(?:href|to|url|path|action)\s*(?:=|:)\s*["'`]((\/[a-zA-Z0-9_\-\/\.\[\]%]+))["'`]/g;

interface DeadLink {
  url: string;
  file: string;
  line: number;
  reason?: string;
}

const deadLinks: DeadLink[] = [];

for (const file of allFiles) {
  if (file.includes('/scratch/') || file.includes('/tests/') || file.includes('audit-links')) continue;

  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((lineText, idx) => {
    let match;
    while ((match = urlRegex.exec(lineText)) !== null) {
      const targetUrl = match[1];

      // Ignore API routes, images, assets, hashes, dynamic expressions
      if (
        targetUrl.startsWith('/api') ||
        targetUrl.startsWith('/images') ||
        targetUrl.startsWith('/icons') ||
        targetUrl.startsWith('/fonts') ||
        targetUrl.startsWith('/_next') ||
        targetUrl.includes('${') ||
        targetUrl.endsWith('.webp') ||
        targetUrl.endsWith('.png') ||
        targetUrl.endsWith('.jpg') ||
        targetUrl.endsWith('.svg') ||
        targetUrl.endsWith('.pdf') ||
        targetUrl.endsWith('.ico') ||
        targetUrl.endsWith('.json')
      ) {
        continue;
      }

      const res = isRouteValid(targetUrl);
      if (!res.valid) {
        deadLinks.push({
          url: targetUrl,
          file: path.relative(SRC_DIR, file),
          line: idx + 1,
          reason: res.reason
        });
      }
    }
  });
}

console.log(`\n=== AUDIT RESULTS: POTENTIAL DEAD INTERNAL LINKS (${deadLinks.length}) ===\n`);
const grouped: Record<string, { file: string; line: number; reason?: string }[]> = {};
for (const item of deadLinks) {
  if (!grouped[item.url]) grouped[item.url] = [];
  grouped[item.url].push({ file: item.file, line: item.line, reason: item.reason });
}

for (const [url, refs] of Object.entries(grouped)) {
  console.log(`[DEAD LINK] ${url}`);
  for (const ref of refs) {
    console.log(`   at ${ref.file}:${ref.line}`);
  }
}
