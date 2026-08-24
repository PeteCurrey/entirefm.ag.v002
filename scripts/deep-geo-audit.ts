import * as fs from 'fs';
import * as path from 'path';

interface RouteEntry {
  path: string;
  template: string;
  routeType: string;
  source: string;
  historic: boolean;
  protected: boolean;
  statusRequired: number;
  canonical: string;
  indexable: boolean;
  uniquePageRequired: boolean;
  sitemapGroup: string;
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const registryPath = path.join(process.cwd(), 'config', 'route-registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8')) as { routes: RouteEntry[] };
const allRoutes = registry.routes;

console.log('=== OVERALL ROUTE ESTATE SUMMARY ===');
console.log(`Total Routes: ${allRoutes.length}`);
console.log(`Protected: ${allRoutes.filter(r => r.protected).length}`);
console.log(`Indexable: ${allRoutes.filter(r => r.indexable).length}`);
console.log(`Status 200 Required: ${allRoutes.filter(r => r.statusRequired === 200).length}`);
console.log(`Self Canonical: ${allRoutes.filter(r => r.canonical === 'self').length}`);

// Group by routeType
const typeCount: Record<string, number> = {};
allRoutes.forEach(r => {
  typeCount[r.routeType] = (typeCount[r.routeType] || 0) + 1;
});
console.log('\nBy Route Type:', typeCount);

// Group by sitemapGroup
const groupCount: Record<string, number> = {};
allRoutes.forEach(r => {
  groupCount[r.sitemapGroup] = (groupCount[r.sitemapGroup] || 0) + 1;
});
console.log('\nBy Sitemap Group:', groupCount);

// Extract all Location Hubs (/locations/{city})
const locationHubs = allRoutes.filter(r => r.path.match(/^\/locations\/[a-z0-9-]+$/) && !r.path.endsWith('/services'));
console.log(`\nLocation Hubs (/locations/{city}): ${locationHubs.length}`);
locationHubs.forEach(r => console.log(`  - ${r.path}`));

// Extract all Location Services (/locations/{city}/services)
const locationServices = allRoutes.filter(r => r.path.match(/^\/locations\/[a-z0-9-]+\/services$/));
console.log(`\nLocation Services (/locations/{city}/services): ${locationServices.length}`);
locationServices.forEach(r => console.log(`  - ${r.path}`));

// Extract all legacy flat geo routes
const legacyGeoRoutes = allRoutes.filter(r => {
  const p = r.path;
  if (p === '/locations' || p.startsWith('/locations/')) return false;
  return (
    r.routeType === 'location' ||
    r.routeType === 'geographic-service' ||
    r.sitemapGroup === 'locations' ||
    r.sitemapGroup === 'local-services' ||
    p.startsWith('/fm-') ||
    p.startsWith('/facilities-management-') ||
    p.endsWith('-facilities-management') ||
    p.endsWith('-facilities-management-areas') ||
    p.startsWith('/commercial-cleaning-') ||
    p.startsWith('/industrial-cleaning-') ||
    p.startsWith('/office-cleaning-') ||
    p.startsWith('/pressure-washing-') ||
    p.startsWith('/facilities-management-glossary-') ||
    p.includes('-fm-') ||
    p === '/facilities-management-uk' ||
    p === '/facilities-management-midlands' ||
    p === '/sheffield' ||
    p === '/manchester-facilities-managment' ||
    p === '/manchester-office-cleaning'
  );
});

console.log(`\nLegacy/Flat Geo Routes: ${legacyGeoRoutes.length}`);
legacyGeoRoutes.forEach(r => console.log(`  - [${r.routeType}] ${r.path}`));

// City breakdown of all geo routes
const knownCities = [
  'london', 'manchester', 'birmingham', 'leeds', 'sheffield', 'liverpool',
  'nottingham', 'derby', 'oxford', 'chesterfield', 'doncaster', 'rotherham',
  'lincoln', 'bradford', 'bolton', 'bury', 'preston', 'wigan', 'grimsby',
  'telford', 'matlock', 'hull', 'mansfield', 'grantham', 'newark', 'scunthorpe'
];

console.log('\n=== GEO ROUTES GROUPED BY CITY ===');
const cityBuckets: Record<string, string[]> = {};
knownCities.forEach(c => { cityBuckets[c] = []; });
cityBuckets['regional_other'] = [];

const allGeo = allRoutes.filter(r => {
  const p = r.path.toLowerCase();
  return (
    r.routeType === 'location' ||
    r.routeType === 'geographic-service' ||
    r.sitemapGroup === 'locations' ||
    r.sitemapGroup === 'local-services' ||
    p.startsWith('/locations') ||
    p.includes('glossary-') ||
    knownCities.some(c => p.includes(c))
  );
});

allGeo.forEach(r => {
  const p = r.path.toLowerCase();
  let matched = false;
  for (const c of knownCities) {
    if (p.includes(c)) {
      cityBuckets[c].push(r.path);
      matched = true;
      break;
    }
  }
  if (!matched) {
    cityBuckets['regional_other'].push(r.path);
  }
});

for (const [city, paths] of Object.entries(cityBuckets)) {
  console.log(`\n[${city.toUpperCase()}] (${paths.length} routes):`);
  paths.forEach(p => console.log(`   ${p}`));
}
