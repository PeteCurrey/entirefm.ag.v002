#!/usr/bin/env node
/**
 * REGISTER CONTRACTOR SEO ENGINE ROUTES
 * =====================================
 * Adds the 14 new priority Contractor SEO pages to config/route-registry.json
 * and recalculates registry counts.
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../config/route-registry.json');
const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

const contractorRoutes = [
  // Commercial Acquisition Pages
  {
    path: '/contractors/join',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'insights',
    priority: 'P0',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
  },
  {
    path: '/contractors/find-work',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractors/approved-contractor-network',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractors/property-management',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractors/commercial-maintenance',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractors/subcontractor-opportunities',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },

  // Informational Pages
  {
    path: '/contractor-resources/rams/what-are-rams',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractor-resources/rams/how-to-write-rams',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractor-resources/rams/what-is-a-method-statement',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractor-resources/risk-assessments/what-is-a-risk-assessment',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractor-resources/risk-assessments/how-to-write-a-risk-assessment',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractor-resources/facilities-management/what-is-facilities-management',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractor-resources/facilities-management/what-is-ppm',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
  {
    path: '/contractor-resources/winning-work/how-to-get-facilities-management-work',
    routeType: 'resources',
    routeProvenance: 'NEW_GROWTH',
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
  },
];

let added = 0;
for (const cr of contractorRoutes) {
  const existingIdx = registry.routes.findIndex((r) => r.path === cr.path);
  if (existingIdx !== -1) {
    registry.routes[existingIdx] = { ...registry.routes[existingIdx], ...cr };
  } else {
    registry.routes.push(cr);
    added++;
  }
}

// Recalculate summary counts
registry.counts = {
  total: registry.routes.length,
  LEGACY_VERIFIED: registry.routes.filter((r) => r.routeProvenance === 'LEGACY_VERIFIED').length,
  LEGACY_PROTECTED_BY_DIRECTIVE: registry.routes.filter(
    (r) => r.routeProvenance === 'LEGACY_PROTECTED_BY_DIRECTIVE'
  ).length,
  NEW_GROWTH: registry.routes.filter((r) => r.routeProvenance === 'NEW_GROWTH').length,
  protected: registry.routes.filter((r) => r.protected).length,
  historic: registry.routes.filter((r) => r.historic).length,
  totalRoutes: registry.routes.length,
  indexableRoutes: registry.routes.filter((r) => r.indexable).length,
};

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');
console.log(`✓ Added/updated ${added} contractor routes in ${REGISTRY_PATH}. Total routes: ${registry.routes.length}`);
