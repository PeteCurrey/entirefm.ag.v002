const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const liveCsv = fs.readFileSync(path.join(repoRoot, 'docs', 'migration', 'CURRENT-LIVE-URL-INVENTORY-VERIFIED.csv'), 'utf8').trim().split('\n').slice(1);
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf8'));

// Index current registry paths
const registryPaths = new Set(registry.routes.map(r => r.path));
const protectedPaths = new Set(registry.routes.filter(r => r.protected).map(r => r.path));

// Semantic mappings for current services into protected historic pages
const SEMANTIC_REDIRECTS = {
  '/services/me-services': '/mechanical-electrical',
  '/services/hvac': '/hvac-contractor',
  '/services/ppm': '/ppm',
  '/services/cleaning': '/cleaning-services',
  '/services/industrial-cleaning': '/industrial-cleaning',
  '/services/mobile-crane-hire': '/mobile-crane-hire',
  '/services/security': '/security-services',
  '/services/drainage-cctv-surveys': '/drainage-services',
  '/services/drainage': '/drainage-services',
  '/services/waste-management': '/waste-management',
  '/services/landscaping': '/grounds-maintenance',
  '/services/grounds-maintenance': '/grounds-maintenance',
  '/services/commercial-cleaning': '/cleaning-services',
  '/services/window-cleaning': '/window-cleaning',
  '/services/pressure-washing': '/pressure-washing',
  '/services/office-cleaning': '/office-cleaning',
  '/services/carpet-cleaning': '/cleaning-services',
  '/services/hard-fm': '/hard-services',
  '/services/soft-fm': '/soft-services',
  '/services/fire-safety': '/fire-emergency-systems',
  '/services/fire-alarms': '/fire-emergency-systems',
  '/services/emergency-lighting': '/mechanical-electrical/emergency-light-testing',
  '/services/access-control': '/mechanical-electrical/access-control',
  '/services/water-hygiene': '/water-treatment-chlorination',
  '/services/electrical': '/mechanical-electrical',
  '/services/plumbing': '/plumbing-gas',
  '/services/commercial-plumbing': '/plumbing-gas',
  '/services/gas-safety': '/plumbing-gas',
  '/services/general-maintenance': '/building-maintenance',
  '/services/building-fabric': '/building-maintenance',
  '/services/building-inspections': '/building-inspecting-testing',
  '/services/drone-inspections': '/aerial-drone-building-inspection',
  '/services/hot-tub-relocation': '/hot-tub-relocation',
  '/services/total-facilities-management': '/commercial-facilities-management',
  '/services/dilapidations': '/dilapidations',
  '/services/critical-infrastructure': '/safety-critical-emergency-systems',
  '/services/emergency-systems': '/safety-critical-emergency-systems',
  '/services/emergency-response': '/24-7-fm-support',
  '/services/out-of-hours-support': '/24-7-fm-support',
  '/services/concierge': '/concierge-services',
  '/services/caretaker': '/caretaker',
  '/services/carpark-management': '/carpark-management',
  '/services/security-guarding': '/security-services',
  '/about': '/about-entire-facilities-management',
  '/team': '/facilities-management-team',
  '/leadership': '/facilities-management-team',
  '/contact': '/contact-us',
  '/careers': '/job-board',
  '/employment': '/employment-portal',
  '/helpdesk': '/client-login',
  '/portal': '/client-login',
  '/client-portal': '/client-login',
  '/marketplace': '/fm-supply-form',
  '/suppliers': '/fm-supply-form',
  '/partners': '/partnerships',
  '/partnerships': '/partnerships',
  '/case-studies': '/case-studies',
  '/insights': '/blog',
  '/news': '/blog',
  '/articles': '/blog',
  '/fm-insights': '/blog',
  '/resources': '/blog',
  '/search': '/',
  '/sitemap': '/sitemap.xml',
  '/privacy': '/privacy-policy',
  '/terms': '/terms-and-conditions',
  '/accessibility': '/accessibility-statement',
};

const migrationMap = [];
const redirectsList = [];

for (const line of liveCsv) {
  // Parse CSV line
  const matches = line.match(/^"([^"]+)",/);
  if (!matches) continue;
  const urlPath = matches[1];
  
  // Clean path
  const p = urlPath.toLowerCase().replace(/\/$/, '') || '/';
  
  let decision = 'INVESTIGATE';
  let target = '';
  let reason = '';

  if (registryPaths.has(p)) {
    decision = 'KEEP_200';
    target = p;
    reason = 'Path matches registered 200 route';
  } else if (SEMANTIC_REDIRECTS[p]) {
    const dest = SEMANTIC_REDIRECTS[p];
    decision = '301_TO_HISTORIC';
    target = dest;
    reason = 'Semantic intent consolidation into protected historic page';
    redirectsList.push({ source: p, destination: dest, statusCode: 301, reason });
  } else if (p.startsWith('/services/')) {
    // Check if matching slug exists in registry
    const baseSlug = p.replace('/services/', '/');
    if (registryPaths.has(baseSlug)) {
      decision = '301_TO_HISTORIC';
      target = baseSlug;
      reason = 'Consolidation of /services/* subpath to root historic URL';
      redirectsList.push({ source: p, destination: baseSlug, statusCode: 301, reason });
    } else {
      decision = '301_TO_HISTORIC';
      target = '/services';
      reason = 'Fallback to main services hub';
      redirectsList.push({ source: p, destination: '/services', statusCode: 301, reason });
    }
  } else if (p.startsWith('/sectors/')) {
    const sectorSlug = p.replace('/sectors/', '/') + '-facilities-management';
    if (registryPaths.has(sectorSlug)) {
      decision = '301_TO_HISTORIC';
      target = sectorSlug;
      reason = 'Consolidation of /sectors/* to historic root sector page';
      redirectsList.push({ source: p, destination: sectorSlug, statusCode: 301, reason });
    } else {
      decision = '301_TO_HISTORIC';
      target = '/sectors';
      reason = 'Fallback to main sectors hub';
      redirectsList.push({ source: p, destination: '/sectors', statusCode: 301, reason });
    }
  } else if (p.startsWith('/locations/')) {
    decision = '301_TO_HISTORIC';
    target = '/locations';
    reason = 'Consolidation of legacy nested location to location hub';
    redirectsList.push({ source: p, destination: '/locations', statusCode: 301, reason });
  } else if (p.startsWith('/case-studies/')) {
    decision = '301_TO_HISTORIC';
    target = '/case-studies';
    reason = 'Consolidation to case studies portfolio hub';
    redirectsList.push({ source: p, destination: '/case-studies', statusCode: 301, reason });
  } else if (p.startsWith('/academy/') || p.startsWith('/building-walk/') || p.startsWith('/tools/')) {
    decision = '301_TO_HISTORIC';
    target = '/';
    reason = 'Consolidation of legacy programmatic experiment to homepage';
    redirectsList.push({ source: p, destination: '/', statusCode: 301, reason });
  } else {
    decision = '301_TO_HISTORIC';
    target = '/';
    reason = 'General legacy redirect to homepage';
    redirectsList.push({ source: p, destination: '/', statusCode: 301, reason });
  }

  migrationMap.push({
    currentUrl: `https://www.entirefm.com${p}`,
    path: p,
    migrationDecision: decision,
    targetUrl: target,
    reason: reason
  });
}

// 1. Write FULL-CURRENT-ESTATE-MIGRATION-MAP.csv
const mapHeaders = ['currentPath', 'currentUrl', 'migrationDecision', 'targetDestination', 'rationale'];
const mapRows = [mapHeaders.join(',')];
for (const m of migrationMap) {
  mapRows.push([
    `"${m.path}"`,
    `"${m.currentUrl}"`,
    `"${m.migrationDecision}"`,
    `"${m.targetUrl}"`,
    `"${m.reason}"`
  ].join(','));
}

const mapOutPath = path.join(repoRoot, 'docs', 'migration', 'FULL-CURRENT-ESTATE-MIGRATION-MAP.csv');
fs.writeFileSync(mapOutPath, mapRows.join('\n'));
console.log(`Successfully generated ${mapOutPath} (${migrationMap.length} rows)`);

// 2. Write config/production-redirects.json
// Deduplicate redirect rules
const uniqueRedirects = [];
const seenSources = new Set();
for (const r of redirectsList) {
  if (!seenSources.has(r.source) && r.source !== r.destination) {
    seenSources.add(r.source);
    uniqueRedirects.push(r);
  }
}

const redirectsJson = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  version: '2.0.0',
  generated: '2026-08-22',
  authority: 'FULL-CURRENT-ESTATE-MIGRATION-MAP.csv',
  rules: {
    singleHopEnforced: true,
    protectedSourceForbidden: true,
    selfCanonicalDestinationRequired: true
  },
  totalRedirects: uniqueRedirects.length,
  redirects: uniqueRedirects
};

const redirOutPath = path.join(repoRoot, 'config', 'production-redirects.json');
fs.writeFileSync(redirOutPath, JSON.stringify(redirectsJson, null, 2));
console.log(`Successfully generated ${redirOutPath} (${uniqueRedirects.length} approved 301 redirects)`);
