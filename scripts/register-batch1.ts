import * as fs from 'fs';
import * as path from 'path';

interface RouteEntry {
  path: string;
  routeType: string;
  routeProvenance: string;
  historic: boolean;
  protected: boolean;
  indexable: boolean;
  statusRequired: number;
  canonical: string;
  uniquePageRequired: boolean;
  sitemapGroup: string;
  priority: string;
  contentStatus: string;
  designStatus: string;
  historicSources?: string[];
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const batch1Routes: RouteEntry[] = [
  {
    path: '/ppm-london',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Planned Preventative Maintenance in London',
    metaTitle: 'Planned Preventative Maintenance London | Commercial PPM & SFG20 | EntireFM',
    metaDescription: 'Planned Preventative Maintenance (PPM) contractor in London. SFG20 compliant asset maintenance, HVAC, electrical testing, and statutory building compliance for London commercial property.',
  },
  {
    path: '/ppm-manchester',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Planned Preventative Maintenance in Manchester',
    metaTitle: 'Planned Preventative Maintenance Manchester | Commercial PPM & M&E | EntireFM',
    metaDescription: 'Specialist Planned Preventative Maintenance (PPM) contractor in Manchester. SFG20 asset maintenance, commercial HVAC, electrical compliance, and building engineering across Greater Manchester.',
  },
  {
    path: '/hvac-london',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Commercial HVAC & Air Conditioning in London',
    metaTitle: 'Commercial HVAC & Air Conditioning London | Servicing & Chillers | EntireFM',
    metaDescription: 'Commercial HVAC contractor in London. Chiller maintenance, VRF/VRV air conditioning servicing, F-Gas compliance, and 24/7 emergency breakdown cover across Greater London.',
  },
  {
    path: '/mechanical-electrical-london',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Mechanical & Electrical Maintenance in London',
    metaTitle: 'Mechanical & Electrical Maintenance London | Commercial M&E | EntireFM',
    metaDescription: 'Commercial Mechanical & Electrical (M&E) engineering contractor in London. Hard FM maintenance, commercial electrical testing, plant room servicing, and 24/7 helpdesk.',
  },
  {
    path: '/ppm-birmingham',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Planned Preventative Maintenance in Birmingham',
    metaTitle: 'Planned Preventative Maintenance Birmingham | Commercial PPM & SFG20 | EntireFM',
    metaDescription: 'Planned Preventative Maintenance (PPM) contractor in Birmingham. SFG20 asset care, HVAC servicing, electrical compliance, and building engineering across the West Midlands.',
  },
  {
    path: '/hvac-manchester',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Commercial HVAC & Air Conditioning in Manchester',
    metaTitle: 'Commercial HVAC & Air Conditioning Manchester | Chillers & Servicing | EntireFM',
    metaDescription: 'Commercial HVAC contractor in Manchester. VRF/VRV air conditioning servicing, commercial chiller maintenance, F-Gas compliance, and 24/7 emergency response across Greater Manchester.',
  },
  {
    path: '/ppm-leeds',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Planned Preventative Maintenance in Leeds',
    metaTitle: 'Planned Preventative Maintenance Leeds | Commercial PPM & SFG20 | EntireFM',
    metaDescription: 'Planned Preventative Maintenance (PPM) contractor in Leeds. SFG20 asset care, HVAC servicing, commercial electrical testing, and building maintenance across West Yorkshire.',
  },
  {
    path: '/ppm-sheffield',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Planned Preventative Maintenance in Sheffield',
    metaTitle: 'Planned Preventative Maintenance Sheffield | Industrial & Commercial PPM | EntireFM',
    metaDescription: 'Planned Preventative Maintenance (PPM) contractor in Sheffield. SFG20 asset care, industrial engineering maintenance, commercial HVAC, and electrical compliance in South Yorkshire.',
  },
  {
    path: '/commercial-cleaning-liverpool',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Commercial Cleaning Services in Liverpool',
    metaTitle: 'Commercial Cleaning Liverpool | Office & Contract Cleaning | EntireFM',
    metaDescription: 'Commercial cleaning contractor in Liverpool. Daily contract office cleaning, corporate janitorial, retail hygiene, and specialist floor care across Liverpool and Merseyside.',
  },
  {
    path: '/commercial-cleaning-derby',
    routeType: 'geographic-service',
    routeProvenance: 'NEW_GROWTH',
    historic: false,
    protected: true,
    indexable: true,
    statusRequired: 200,
    canonical: 'self',
    uniquePageRequired: true,
    sitemapGroup: 'local-services',
    priority: 'P1',
    contentStatus: 'COMPLETE',
    designStatus: 'COMPLETE',
    historicSources: ['new-growth-directive'],
    h1: 'Commercial Cleaning Services in Derby',

    metaTitle: 'Commercial Cleaning Derby | Office & Contract Cleaning | EntireFM',
    metaDescription: 'Commercial cleaning contractor in Derby. Contract office cleaning, corporate janitorial, business park hygiene, and industrial office cleaning across Pride Park and Derbyshire.',
  },
];

// 1. Update config/route-registry.json
const registryPath = path.join(process.cwd(), 'config', 'route-registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

let addedCount = 0;
for (const r of batch1Routes) {
  const existingIdx = registry.routes.findIndex((existing: RouteEntry) => existing.path === r.path);
  if (existingIdx >= 0) {
    registry.routes[existingIdx] = r;
  } else {
    registry.routes.push(r);
    addedCount++;
  }
}

// Sort alphabetically by path
registry.routes.sort((a: RouteEntry, b: RouteEntry) => a.path.localeCompare(b.path));

// Update counts
registry.counts.total = registry.routes.length;
registry.counts.protected = registry.routes.filter((r: RouteEntry) => r.protected).length;
registry.counts.NEW_GROWTH = registry.routes.filter((r: RouteEntry) => r.routeProvenance === 'NEW_GROWTH').length;

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log(`✓ Updated route-registry.json. Total routes: ${registry.routes.length} (${addedCount} newly added)`);

// 2. Update config/protected-legacy-routes.ts
const protectedLegacyPath = path.join(process.cwd(), 'config', 'protected-legacy-routes.ts');
let legacyContent = fs.readFileSync(protectedLegacyPath, 'utf-8');

const newEntries: string[] = [];
for (const r of batch1Routes) {
  if (!legacyContent.includes(`"path": "${r.path}"`)) {
    newEntries.push(`  {
    "path": "${r.path}",
    "source": "NEW_GROWTH_ROUTE",
    "historic": false,
    "protected": true,
    "statusRequired": 200,
    "canonical": "self",
    "uniquePageRequired": true
  }`);
  }
}

if (newEntries.length > 0) {
  legacyContent = legacyContent.replace(
    /export const PROTECTED_LEGACY_ROUTES: ProtectedRoute\[\] = \[([\s\S]*?)\];/,
    (match, p1) => {
      const trimmed = p1.trim();
      return `export const PROTECTED_LEGACY_ROUTES: ProtectedRoute[] = [\n${trimmed},\n${newEntries.join(',\n')}\n];`;
    }
  );
  fs.writeFileSync(protectedLegacyPath, legacyContent, 'utf-8');
  console.log(`✓ Updated protected-legacy-routes.ts with ${newEntries.length} new growth routes.`);
}
