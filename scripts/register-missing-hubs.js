const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const regPath = path.join(repoRoot, 'config', 'route-registry.json');
const registry = JSON.parse(fs.readFileSync(regPath, 'utf8'));

const existingPaths = new Set(registry.routes.map(r => r.path));

const hubRoutesToAdd = [
  {
    path: '/sectors',
    routeType: 'sector',
    routeProvenance: 'CURRENT_LIVE_RETAINED',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'sectors',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED',
    historicSources: ['current-live-antigravity']
  },
  {
    path: '/locations',
    routeType: 'location',
    routeProvenance: 'CURRENT_LIVE_RETAINED',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'locations',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED',
    historicSources: ['current-live-antigravity']
  },
  {
    path: '/case-studies',
    routeType: 'company',
    routeProvenance: 'CURRENT_LIVE_RETAINED',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'company',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED',
    historicSources: ['current-live-antigravity']
  },
  {
    path: '/resources',
    routeType: 'company',
    routeProvenance: 'CURRENT_LIVE_RETAINED',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'company',
    priority: 'P2',
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED',
    historicSources: ['current-live-antigravity']
  }
];

let added = 0;
for (const hub of hubRoutesToAdd) {
  if (!existingPaths.has(hub.path)) {
    registry.routes.push(hub);
    added++;
  }
}

// Recalculate counts
const counts = {
  total: registry.routes.length,
  LEGACY_VERIFIED: registry.routes.filter(r => r.routeProvenance === 'LEGACY_VERIFIED').length,
  LEGACY_PROTECTED_BY_DIRECTIVE: registry.routes.filter(r => r.routeProvenance === 'LEGACY_PROTECTED_BY_DIRECTIVE').length,
  CURRENT_LIVE_RETAINED: registry.routes.filter(r => r.routeProvenance === 'CURRENT_LIVE_RETAINED').length,
  NEW_GROWTH: registry.routes.filter(r => r.routeProvenance === 'NEW_GROWTH').length,
  protected: registry.routes.filter(r => r.protected).length,
  historic: registry.routes.filter(r => r.historic).length
};

registry.counts = counts;
fs.writeFileSync(regPath, JSON.stringify(registry, null, 2));
console.log(`Added ${added} missing hub routes to registry. New total routes: ${registry.routes.length}`);
