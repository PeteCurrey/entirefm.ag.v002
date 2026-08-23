/**
 * Script to add 26 new AI resource and blog routes to config/route-registry.json
 * and sync production-url-manifest.json.
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '..', 'config', 'route-registry.json');
const MANIFEST_PATH = path.join(__dirname, '..', 'config', 'production-url-manifest.json');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

const newRoutes = [
  // 1. AI in FM Pillar & Supporting Guides
  {
    path: '/resources/ai-in-facilities-management',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/predictive-maintenance',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/ai-helpdesk-work-orders',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/ai-cafm',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/energy-optimisation',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/digital-twins',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/ai-agents',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/computer-vision',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/ai-compliance',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/fm-data-readiness',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/resources/ai-in-facilities-management/ai-governance',
    routeType: 'company',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },

  // 2. 15 Substantive Blog Articles
  {
    path: '/post/ai-in-facilities-management-2026',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/predictive-maintenance-vs-ppm',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/can-ai-run-an-fm-helpdesk',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/ai-agents-in-facilities-management',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/asset-data-quality-for-fm-ai',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/ai-and-the-future-of-cafm',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/digital-twins-in-facilities-management',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/10-questions-to-ask-ai-fm-software-suppliers',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/what-should-be-included-in-a-commercial-ppm-schedule',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/how-to-change-facilities-management-provider',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/fm-contract-mobilisation-checklist',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/reactive-maintenance-vs-over-servicing-ppm',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/what-is-an-asset-register-in-fm',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/hard-fm-vs-soft-fm-scope-boundaries',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  },
  {
    path: '/post/what-to-include-in-a-monthly-fm-report',
    routeType: 'post',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P2',
    historicSources: [],
    contentStatus: 'COMPLETE',
    designStatus: 'NOT_STARTED'
  }
];

// Check for existing routes
const existingPaths = new Set(registry.routes.map(r => r.path));
let addedCount = 0;

for (const nr of newRoutes) {
  const existing = registry.routes.find(r => r.path === nr.path);
  if (existing) {
    Object.assign(existing, nr);
  } else {
    registry.routes.push(nr);
    addedCount++;
  }
}

// Sort alphabetically by path
registry.routes.sort((a, b) => a.path.localeCompare(b.path));

// Update summary counts
registry.counts = {
  total: registry.routes.length,
  LEGACY_VERIFIED: registry.routes.filter(r => r.routeProvenance === 'LEGACY_VERIFIED').length,
  LEGACY_PROTECTED_BY_DIRECTIVE: registry.routes.filter(r => r.routeProvenance === 'LEGACY_PROTECTED_BY_DIRECTIVE').length,
  CURRENT_LIVE_RETAINED: registry.routes.filter(r => r.routeProvenance === 'CURRENT_LIVE_RETAINED').length,
  NEW_GROWTH: registry.routes.filter(r => r.routeProvenance === 'NEW_GROWTH').length,
  protected: registry.routes.filter(r => r.protected).length,
  historic: registry.routes.filter(r => r.historic).length
};

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');
console.log(`Added ${addedCount} routes to route registry. Total: ${registry.routes.length}`);

// Sync manifest
const manifestRoutes = registry.routes.map(r => ({
  path: r.path,
  routeType: r.routeType,
  sitemapGroup: r.sitemapGroup,
  priority: r.priority,
  protected: r.protected,
  indexable: r.indexable
}));

fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ routes: manifestRoutes, urls: manifestRoutes }, null, 2) + '\n');
console.log(`Synced production-url-manifest.json with ${manifestRoutes.length} routes.`);
