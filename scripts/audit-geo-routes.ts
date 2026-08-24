import * as fs from 'fs';
import * as path from 'path';

interface RouteRegistryEntry {
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
const registryData = JSON.parse(fs.readFileSync(registryPath, 'utf-8')) as { routes: RouteRegistryEntry[] };
const routes = registryData.routes;

console.log(`Total routes in route-registry.json: ${routes.length}`);

// Group by routeType
const byType: Record<string, number> = {};
routes.forEach(r => {
  byType[r.routeType] = (byType[r.routeType] || 0) + 1;
});
console.log('Routes by routeType:', byType);

// Group by sitemapGroup
const byGroup: Record<string, number> = {};
routes.forEach(r => {
  byGroup[r.sitemapGroup] = (byGroup[r.sitemapGroup] || 0) + 1;
});
console.log('Routes by sitemapGroup:', byGroup);

// Identify all geographical routes
const geoRoutes = routes.filter(r => {
  const p = r.path.toLowerCase();
  return (
    r.routeType === 'location' ||
    r.routeType === 'geographic-service' ||
    r.sitemapGroup === 'locations' ||
    p.startsWith('/locations') ||
    p.includes('-london') || p.includes('london-') ||
    p.includes('-manchester') || p.includes('manchester-') ||
    p.includes('-birmingham') || p.includes('birmingham-') ||
    p.includes('-leeds') || p.includes('leeds-') ||
    p.includes('-sheffield') || p.includes('sheffield-') ||
    p.includes('-liverpool') || p.includes('liverpool-') ||
    p.includes('-nottingham') || p.includes('nottingham-') ||
    p.includes('-derby') || p.includes('derby-') ||
    p.includes('-lincoln') || p.includes('lincoln-') ||
    p.includes('-chesterfield') || p.includes('chesterfield-') ||
    p.includes('-doncaster') || p.includes('doncaster-') ||
    p.includes('-rotherham') || p.includes('rotherham-') ||
    p.includes('-hull') || p.includes('hull-') ||
    p.includes('-mansfield') || p.includes('mansfield-') ||
    p.includes('-grantham') || p.includes('grantham-') ||
    p.includes('-newark') || p.includes('newark-') ||
    p.includes('-scunthorpe') || p.includes('scunthorpe-') ||
    p.includes('midlands') || p.includes('yorkshire') || p.includes('north-west')
  );
});

console.log(`\nFound ${geoRoutes.length} geo-related routes.`);
geoRoutes.forEach(r => {
  console.log(`  [${r.routeType}] ${r.path} -> template: ${r.template}, sitemapGroup: ${r.sitemapGroup}, protected: ${r.protected}`);
});
