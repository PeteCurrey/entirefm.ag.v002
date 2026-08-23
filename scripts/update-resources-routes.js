#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../config/route-registry.json');
const REDIRECTS_PATH = path.join(__dirname, '../config/production-redirects.json');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
const redirectsData = JSON.parse(fs.readFileSync(REDIRECTS_PATH, 'utf8'));

const newRoutes = [
  {
    path: '/tools',
    routeType: 'company',
    routeProvenance: 'CURRENT_LIVE_RETAINED',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['current-live-antigravity'],
  },
  {
    path: '/tools/fm-health-check',
    routeType: 'company',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
  {
    path: '/tools/ppm-schedule-builder',
    routeType: 'company',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
  {
    path: '/tools/compliance-calendar',
    routeType: 'company',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
  {
    path: '/tools/ppm-estimator',
    routeType: 'company',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
  {
    path: '/tools/fm-roi-calculator',
    routeType: 'company',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
  {
    path: '/tools/tender-brief',
    routeType: 'company',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
  {
    path: '/fm-intelligence',
    routeType: 'post',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
  {
    path: '/academy',
    routeType: 'company',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
  {
    path: '/resources/document-vault',
    routeType: 'company',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
  {
    path: '/building-walk',
    routeType: 'post',
    routeProvenance: 'LEGACY_PROTECTED_BY_DIRECTIVE',
    historic: true,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['wix-generation-2', 'current-live-antigravity'],
  },
];

// Add routes if not present
const existingPaths = new Set(registry.routes.map(r => r.path));
for (const route of newRoutes) {
  if (!existingPaths.has(route.path)) {
    registry.routes.push(route);
  }
}

// Sort routes alphabetically by path
registry.routes.sort((a, b) => a.path.localeCompare(b.path));

// Update counts
registry.counts = {
  total: registry.routes.length,
  LEGACY_VERIFIED: registry.routes.filter(r => r.routeProvenance === 'LEGACY_VERIFIED').length,
  LEGACY_PROTECTED_BY_DIRECTIVE: registry.routes.filter(r => r.routeProvenance === 'LEGACY_PROTECTED_BY_DIRECTIVE').length,
  CURRENT_LIVE_RETAINED: registry.routes.filter(r => r.routeProvenance === 'CURRENT_LIVE_RETAINED').length,
  NEW_GROWTH: registry.routes.filter(r => r.routeProvenance === 'NEW_GROWTH').length,
  protected: registry.routes.filter(r => r.protected).length,
  historic: registry.routes.filter(r => r.historic).length,
};

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');
console.log(`Updated route registry: ${registry.routes.length} routes.`);

// Process redirects
const protectedPaths = new Set(registry.routes.filter(r => r.protected).map(r => r.path));

// Specific mapping for aliases
const aliasDestinations = {
  '/tools/compliance-checker': '/tools/compliance-calendar',
  '/tools/cost-savings-calculator': '/tools/fm-roi-calculator',
  '/tools/ppm-calculator': '/tools/ppm-schedule-builder',
  '/tools/risk-diagnostic': '/tools/fm-health-check',
  '/tools/sla-benchmark': '/tools/tender-brief',
  '/tools/tm44-checker': '/compliance',
  '/tools/water-risk-grader': '/compliance/legionella-water-hygiene',
  '/fm-market-report': '/fm-intelligence',
  '/academy/drone-inspection-guide': '/academy',
  '/academy/fire-safety-compliance': '/compliance/fire-risk-assessment',
  '/academy/legionella-water-safety': '/compliance/legionella-water-hygiene',
  '/academy/multi-site-fm-management': '/academy',
  '/academy/understanding-ppm': '/ppm',
  '/building-walk/hotel-fm-guest-experience': '/building-walk',
  '/building-walk/industrial-cleaning-before-after': '/building-walk',
  '/building-walk/office-building-fm-walkthrough': '/building-walk',
  '/building-walk/residential-block-fm-issues': '/building-walk',
  '/building-walk/retail-unit-compliance-walkthrough': '/building-walk',
};

const updatedRedirects = [];
for (const redir of redirectsData.redirects) {
  // If the source is now a protected route, remove it from redirects
  if (protectedPaths.has(redir.source)) {
    continue;
  }
  // If we have a more specific alias target, update it
  if (aliasDestinations[redir.source]) {
    redir.destination = aliasDestinations[redir.source];
  }
  updatedRedirects.push(redir);
}

redirectsData.redirects = updatedRedirects;
redirectsData.totalRedirects = updatedRedirects.length;

fs.writeFileSync(REDIRECTS_PATH, JSON.stringify(redirectsData, null, 2) + '\n');
console.log(`Updated redirects: ${updatedRedirects.length} redirects.`);
