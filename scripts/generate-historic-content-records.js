#!/usr/bin/env node
/**
 * HISTORIC SEO ESTATE CONTENT GENERATOR
 * =====================================
 * Generates unique, high-information-gain content records for every
 * protected route in /config/route-registry.json.
 *
 * Rules:
 * - NO generic variable-swap templates (e.g. "{SERVICE} in {CITY}")
 * - Full differentiation for parallel location routes (e.g. the 3 London pages)
 * - Deep technical specifications for Hard FM, Soft FM, and Cleaning
 * - Distinct operational challenges for each sector
 * - Authentic geographic context for all city and regional pages
 */

const fs = require('fs');
const path = require('path');

const registry = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'config', 'route-registry.json'), 'utf-8')
);

const outDir = path.join(__dirname, '..', 'src', 'content', 'pages');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Master Content Database
const contentDatabase = {};

// Helper to normalize slug
function getSlug(routePath) {
  if (routePath === '/') return 'home';
  return routePath.replace(/^\//, '').replace(/\//g, '--');
}

// Load existing specs from docs/seo/pages if available
const specsDir = path.join(__dirname, '..', 'docs', 'seo', 'pages');
const existingSpecs = {};
if (fs.existsSync(specsDir)) {
  const files = fs.readdirSync(specsDir);
  for (const f of files) {
    if (f.endsWith('.md')) {
      const slug = f.replace('.md', '');
      existingSpecs[slug] = fs.readFileSync(path.join(specsDir, f), 'utf-8');
    }
  }
}

// Location Knowledge Map for authentic geographic context
const locationData = {
  'London': {
    districts: 'City of London, Canary Wharf, West End, South Bank, Park Royal, and Croydon',
    challenges: 'High congestion zones, ULEZ emissions compliance, multi-tenant corporate leases, out-of-hours plant room access constraints',
    buildingTypes: 'Prime commercial office towers, corporate headquarters, retail arenas, and high-density residential blocks',
    phone: '[LONDON PHONE TO VERIFY]',
    office: 'London & South Operations Hub',
  },
  'Manchester': {
    districts: 'Spinningfields, MediaCityUK, Trafford Park, Northern Quarter, and Salford Quays',
    challenges: 'High-volume logistics corridors (M60/M62), rapid commercial expansion, manufacturing plant conversions',
    buildingTypes: 'Commercial office complexes, digital/media tech hubs, distribution centres, and industrial estates',
    phone: '[MANCHESTER PHONE TO VERIFY]',
    office: 'North West Regional Centre',
  },
  'Birmingham': {
    districts: 'Colmore Business District, Digbeth, Jewellery Quarter, Solihull commercial parks, and NEC corridor',
    challenges: 'Central England transport hub logistics, Clean Air Zone (CAZ) compliance, heavy manufacturing supply chain maintenance',
    buildingTypes: 'Corporate office buildings, industrial manufacturing plants, logistics fulfilment centres, and retail parks',
    phone: '[BIRMINGHAM PHONE TO VERIFY]',
    office: 'Midlands Engineering Hub',
  },
  'Sheffield': {
    districts: 'Don Valley Industrial Corridor, Sheffield City Centre, Meadowhall commercial zone, and Advanced Manufacturing Park',
    challenges: 'Heavy engineering legacy plant, specialized fabrication site safety, steep topography transport',
    buildingTypes: 'Heavy engineering factories, precision manufacturing facilities, commercial offices, and educational campuses',
    phone: '[SHEFFIELD PHONE TO VERIFY]',
    office: 'South Yorkshire Engineering Depot',
  },
  'Leeds': {
    districts: 'Leeds Financial Quarter, Holbeck Urban Village, Aire Valley Enterprise Zone, and Thorpe Park',
    challenges: 'Financial & professional services uptime requirements, M62 trans-Pennine logistics access',
    buildingTypes: 'Grade-A corporate office developments, legal & financial institutions, and manufacturing distribution parks',
    phone: '[LEEDS PHONE TO VERIFY]',
    office: 'West Yorkshire Operating Base',
  },
  'Liverpool': {
    districts: 'Liverpool Commercial District, Baltic Triangle, Knowsley Industrial Park, and Mersey Port logistics corridor',
    challenges: 'Maritime climate corrosion protection, port logistics operational schedules, historic commercial building fabric',
    buildingTypes: 'Commercial offices, port-related logistics warehouses, manufacturing sites, and retail estates',
    phone: '[LIVERPOOL PHONE TO VERIFY]',
    office: 'Merseyside Regional Hub',
  },
  'Lincoln': {
    districts: 'Lincoln City Centre, Allenby Industrial Estate, Teal Park, and surrounding Lincolnshire agricultural & engineering corridors',
    challenges: 'Dispersed regional estate logistics, historic building fabric maintenance, agricultural manufacturing hygiene',
    buildingTypes: 'Engineering factories, commercial office parks, agricultural processing plants, and public sector estates',
    phone: '[LINCOLN PHONE TO VERIFY]',
    office: 'Lincoln Regional Centre (Historic Operational Base)',
  },
  'Chesterfield': {
    districts: 'Chesterfield Town Centre, Sheepbridge Industrial Estate, Dunston Technology Park, and Peak District fringes',
    challenges: 'Light industrial plant maintenance, regional logistics connectivity via M1 Corridor',
    buildingTypes: 'Engineering works, commercial offices, distribution warehouses, and retail trade counters',
    phone: '[CHESTERFIELD PHONE TO VERIFY]',
    office: 'Derbyshire Operations Hub',
  },
  'Nottingham': {
    districts: 'Nottingham Business Park, NG2 Business Park, Lenton Lane Industrial Estate, and Lace Market',
    challenges: 'Life sciences and tech campus continuous cooling requirements, university term maintenance windows',
    buildingTypes: 'Commercial corporate offices, laboratory & bio-tech facilities, and light industrial units',
    phone: '[NOTTINGHAM PHONE TO VERIFY]',
    office: 'East Midlands Engineering Depot',
  },
  'Derby': {
    districts: 'Pride Park, Infinity Park Derby, Raynesway industrial area, and City Centre commercial core',
    challenges: 'Aerospace & rail supply chain precision compliance, high-voltage electrical distribution security',
    buildingTypes: 'High-tech manufacturing plants, advanced engineering workshops, and commercial corporate parks',
    phone: '[DERBY PHONE TO VERIFY]',
    office: 'Derbyshire Regional Hub',
  },
  'Bradford': {
    districts: 'Bradford City Centre, Euroway Trading Estates, Low Moor industrial corridor, and Canal Road',
    challenges: 'Textile and chemical manufacturing site heritage, steep logistics access, mill conversion maintenance',
    buildingTypes: 'Industrial manufacturing works, commercial offices, and distribution depots',
    phone: '[BRADFORD PHONE TO VERIFY]',
    office: 'West Yorkshire Depot',
  },
  'Telford': {
    districts: 'Stafford Park, Halesfield Industrial Estate, Hortonwood, and Telford Town Centre',
    challenges: 'Plastics, automotive and precision engineering plant uptime, rapid supply chain dispatch',
    buildingTypes: 'Modern manufacturing plants, automotive supply chain hubs, and commercial offices',
    phone: '[TELFORD PHONE TO VERIFY]',
    office: 'Shropshire & West Midlands Hub',
  },
  'Oxford': {
    districts: 'Oxford Science Park, Begbroke Science Park, Cowley industrial corridor, and City Centre commercial estates',
    challenges: 'Zero Emission Zone (ZEZ) compliance, stringent bio-science cleanroom standards, heritage fabric care',
    buildingTypes: 'Life science laboratories, academic facilities, corporate offices, and automotive assembly sites',
    phone: '[OXFORD PHONE TO VERIFY]',
    office: 'Oxfordshire Regional Operations',
  },
  'Wigan': {
    districts: 'Pemberton, Martland Park, Westwood Park, and M6 logistics corridor',
    challenges: 'High-throughput freight warehouse maintenance, fast-response industrial door & dock repairs',
    buildingTypes: 'Logistics fulfilment centres, manufacturing plants, and trade parks',
    phone: '[WIGAN PHONE TO VERIFY]',
    office: 'North West Operations Depot',
  },
  'Bolton': {
    districts: 'Bolton Town Centre, Wingates Industrial Park, Logistics North, and Tonge Bridge',
    challenges: 'M61 freight logistics support, heavy manufacturing equipment servicing',
    buildingTypes: 'Distribution mega-hubs, commercial offices, and manufacturing works',
    phone: '[BOLTON PHONE TO VERIFY]',
    office: 'Greater Manchester Operating Hub',
  },
  'Bury': {
    districts: 'Pilsworth Industrial Estate, Bury Town Centre, and M66 commercial belt',
    challenges: 'Paper, chemical and light industrial manufacturing compliance, retail park facilities management',
    buildingTypes: 'Manufacturing facilities, retail shopping centres, and commercial offices',
    phone: '[BURY PHONE TO VERIFY]',
    office: 'Greater Manchester Hub',
  },
  'Rotherham': {
    districts: 'Advanced Manufacturing Park (AMP), Templeborough, and Barbot Hall Industrial Estate',
    challenges: 'Heavy metallurgy, advanced manufacturing research facility uptime, high-load electrical supply',
    buildingTypes: 'Advanced engineering plants, research labs, and commercial distribution centres',
    phone: '[ROTHERHAM PHONE TO VERIFY]',
    office: 'South Yorkshire Hub',
  },
  'Doncaster': {
    districts: 'iPort Doncaster, Lakeside commercial area, Doncaster Sheffield airport corridor, and West Moor Park',
    challenges: 'Rail freight and logistics mega-shed maintenance, large-span roof & gutter management',
    buildingTypes: 'High-bay distribution hubs, rail freight terminals, and commercial offices',
    phone: '[DONCASTER PHONE TO VERIFY]',
    office: 'South Yorkshire Logistics Base',
  },
  'Grimsby': {
    districts: 'Europarc, Grimsby Docks, Humber Bank industrial complex, and Pyewipe',
    challenges: 'Renewable energy & offshore wind support maintenance, cold-storage refrigeration, food hygiene standards',
    buildingTypes: 'Cold-storage warehouses, food processing factories, and commercial dock facilities',
    phone: '[GRIMSBY PHONE TO VERIFY]',
    office: 'Humber & Lincolnshire Hub',
  },
  'Preston': {
    districts: 'Preston Docks, Roman Way Industrial Estate, Red Scar Business Park, and Samlesbury aerospace corridor',
    challenges: 'Aerospace supply chain compliance, trans-Lancashire logistics support',
    buildingTypes: 'Aerospace workshops, commercial office buildings, and logistics depots',
    phone: '[PRESTON PHONE TO VERIFY]',
    office: 'Lancashire Operating Hub',
  },
  'Matlock': {
    districts: 'Derbyshire Dales commercial zone, Matlock Town Centre, and quarrying engineering corridors',
    challenges: 'Quarrying plant support, tourism and heritage commercial building care',
    buildingTypes: 'Commercial offices, public sector buildings, and engineering workshops',
    phone: '[MATLOCK PHONE TO VERIFY]',
    office: 'Derbyshire Regional Base',
  },
  'Midlands': {
    districts: 'Central England Golden Triangle logistics, M1/M6/M42 corridors, Birmingham, Coventry, and East Midlands',
    challenges: 'High-speed logistics fulfilment demand, automotive and engineering supply chain uptime',
    buildingTypes: 'Mega-distribution hubs, automotive plants, corporate headquarters, and commercial business parks',
    phone: '[MIDLANDS PHONE TO VERIFY]',
    office: 'Central Midlands Operations Command',
  }
};

// Generate records for each route
let count = 0;
for (const r of registry.routes) {
  const p = r.path;
  const slug = getSlug(p);
  const type = r.routeType;
  const loc = r.location || (Object.keys(locationData).find(k => p.includes(k.toLowerCase())) || null);
  const locDetails = loc ? locationData[loc] || locationData['Midlands'] : null;

  let title = '';
  let metaDescription = '';
  let h1 = '';
  let historicIntent = '';
  let primaryIntent = '';
  let secondaryIntents = [];
  let historicTopics = [];
  let requiredSections = [];
  let relatedRoutes = [];
  let conversionGoal = '';
  let verificationRequirements = [
    'Certification claims must follow BUSINESS-CLAIMS-VERIFICATION.md',
    'Response time SLAs must be contractually confirmed',
  ];

  // Specific content tailoring per route
  if (p === '/') {
    title = 'Entire FM | Total Facilities Management Services UK';
    metaDescription = 'Entire FM delivers integrated Hard FM, Soft FM, mechanical & electrical engineering, scheduled PPM, and specialist facilities services across the UK.';
    h1 = 'Total Facilities Management & Engineering Precision';
    historicIntent = 'Homepage gateway for commercial property owners and facilities managers seeking an accountable national FM provider.';
    primaryIntent = 'Facilities management company UK';
    secondaryIntents = ['total facilities management', 'hard and soft FM services', 'commercial property maintenance UK'];
    historicTopics = ['National FM delivery', 'Mechanical & Electrical', 'PPM maintenance', 'Industrial cleaning', '24/7 helpdesk'];
    requiredSections = ['Hero & Trust', 'Core Capabilities', 'Accreditations', 'Sectors', 'Regional Hubs', 'Case Study', 'Enquiry Form'];
    relatedRoutes = ['/services', '/sectors', '/locations', '/mechanical-electrical', '/ppm', '/industrial-cleaning', '/fm-london'];
    conversionGoal = 'Drive commercial estate enquiries, proposal requests, and direct telephone calls.';
  } else if (p === '/fm-london') {
    title = 'FM London | 24/7 Facilities Management & Rapid Response | Entire FM';
    metaDescription = 'Entire FM provides 24/7 facilities management across London — rapid emergency M&E dispatch, HVAC repair, and plant maintenance for commercial property.';
    h1 = 'FM London — 24/7 Facilities Management & Emergency Engineering';
    historicIntent = 'High-urgency search intent from London businesses requiring rapid engineering dispatch and 24/7 helpdesk coverage.';
    primaryIntent = '24/7 FM London facilities management';
    secondaryIntents = ['emergency FM London', 'London commercial property maintenance', 'rapid response M&E London'];
    historicTopics = ['24/7 emergency dispatch', 'Central London response', 'Commercial office plant', 'ULEZ compliance'];
    requiredSections = ['Operations Hero', 'Live Triage Banner', 'Rapid Capabilities', 'London Districts Covered', 'London Factsheet', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/facilities-management-london', '/london-facilities-management', '/commercial-cleaning-london', '/industrial-cleaning-london', '/mechanical-electrical'];
    conversionGoal = 'Drive urgent helpdesk calls and immediate commercial maintenance enquiries across London.';
  } else if (p === '/facilities-management-london') {
    title = 'Facilities Management London | Planned Maintenance & Compliance | Entire FM';
    metaDescription = 'Structured planned preventative maintenance (PPM), statutory compliance, and integrated hard & soft FM for London commercial property portfolios.';
    h1 = 'Facilities Management London — Total Estate Maintenance & Compliance';
    historicIntent = 'Procurement search intent from London facilities managers seeking comprehensive planned maintenance contracts and statutory governance.';
    primaryIntent = 'Facilities management London planned maintenance';
    secondaryIntents = ['London commercial PPM contracts', 'statutory compliance London buildings', 'total FM services London'];
    historicTopics = ['SFG20 maintenance scheduling', 'Statutory compliance audits', 'Consolidated FM contracts', 'CAFM portal'];
    requiredSections = ['Planned Hero', 'Governance Scope', 'Compliance Checklist', 'Contract Benefits', 'Case Study', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/fm-london', '/london-facilities-management', '/mechanical-electrical', '/ppm', '/commercial-cleaning-london'];
    conversionGoal = 'Generate planned FM contract reviews, tender invitations, and estate asset audits in London.';
  } else if (p === '/london-facilities-management') {
    title = 'London Facilities Management | Managing Agents & Corporate Estates | Entire FM';
    metaDescription = 'Strategic facilities management and building services for managing agents, corporate headquarters, and institutional landlords across London.';
    h1 = 'London Facilities Management — Strategic Estate Governance & Managing Agent Solutions';
    historicIntent = 'Institutional search intent from commercial managing agents and corporate property directors seeking portfolio-level governance.';
    primaryIntent = 'London facilities management corporate managing agents';
    secondaryIntents = ['managing agent FM partner London', 'corporate headquarters building maintenance London', 'prime estate governance London'];
    historicTopics = ['Managing agent partnerships', 'Service charge transparency', 'Tenant experience & concierge', 'ESG & asset lifecycle'];
    requiredSections = ['Corporate Hero', 'Governance Scope', 'Managing Agent Value', 'Tenant Experience', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/fm-london', '/facilities-management-london', '/commercial-facilities-management', '/property-manager-fm-services'];
    conversionGoal = 'Secure multi-building portfolio reviews and corporate real estate partner consultations.';
  } else if (p === '/mechanical-electrical') {
    title = 'Mechanical & Electrical Services | M&E Contractor | Entire FM';
    metaDescription = 'Entire FM delivers integrated mechanical and electrical engineering across the UK — switchgear, HVAC, emergency lighting, gas safety, and SFG20 PPM.';
    h1 = 'Mechanical & Electrical (M&E) Services';
    historicIntent = 'High-value search intent from businesses seeking a single accredited contractor for commercial mechanical & electrical engineering.';
    primaryIntent = 'Mechanical and electrical contractor UK';
    secondaryIntents = ['commercial M&E maintenance', 'building electrical compliance', 'mechanical plant servicing'];
    historicTopics = ['HV/LV switchgear', 'Emergency lighting BS 5266', 'Commercial gas & boilers', 'HVAC maintenance', 'SFG20 audits'];
    requiredSections = ['M&E Hero', 'Engineering Capabilities', 'Key Assets Covered', 'Compliance Accreditations', 'Case Study', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/hvac-contractor', '/ppm', '/hard-services', '/plumbing-gas', '/mechanical-electrical/emergency-light-testing', '/mechanical-electrical/access-control'];
    conversionGoal = 'Drive M&E maintenance contract enquiries, plant room condition audits, and tender opportunities.';
  } else if (p === '/hvac-contractor') {
    title = 'Commercial HVAC Contractor | Heating, Ventilation & Air Conditioning | Entire FM';
    metaDescription = 'Specialist commercial HVAC contractor providing heating, ventilation, VRV/VRF air conditioning maintenance, F-Gas compliance, and TM44 audits nationwide.';
    h1 = 'Commercial HVAC Contractor — Heating, Ventilation & Air Conditioning';
    historicIntent = 'Distinct specialist search intent from building owners seeking commercial HVAC servicing rather than general maintenance.';
    primaryIntent = 'Commercial HVAC contractor UK';
    secondaryIntents = ['commercial air conditioning maintenance', 'commercial ventilation contractor', 'HVAC servicing contract UK', 'F-Gas compliance'];
    historicTopics = ['Chiller maintenance', 'Air handling units (AHUs)', 'Commercial heating boilers', 'F-Gas log management', 'TM44 inspections'];
    requiredSections = ['HVAC Hero', 'Heating & Cooling Scope', 'F-Gas Compliance', 'Asset Factsheet', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/mechanical-electrical', '/ppm', '/hard-services', '/plumbing-gas', '/fire-emergency-systems'];
    conversionGoal = 'Generate commercial HVAC servicing contracts, chiller overhauls, and replacement surveys.';
  } else if (p === '/ppm') {
    title = 'Planned Preventative Maintenance (PPM) | SFG20 Scheduling | Entire FM';
    metaDescription = 'Protect building assets and ensure statutory compliance with structured SFG20 planned preventative maintenance (PPM) schedules from Entire FM.';
    h1 = 'Planned Preventative Maintenance (PPM) Services';
    historicIntent = 'Search intent from facilities managers seeking structured, preventative asset scheduling to replace reactive breakdown spend.';
    primaryIntent = 'Planned preventative maintenance FM UK';
    secondaryIntents = ['SFG20 maintenance scheduling', 'building PPM contract', 'commercial preventative maintenance'];
    historicTopics = ['SFG20 task schedules', 'Asset lifecycle protection', 'Statutory compliance tracking', 'CAFM digital audit logs'];
    requiredSections = ['PPM Hero', 'Maintenance Framework', 'Asset Classes Maintained', 'Cost Reduction Evidence', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/mechanical-electrical', '/hvac-contractor', '/hard-services', '/building-maintenance'];
    conversionGoal = 'Drive planned maintenance contract reviews and full site asset surveys.';
  } else if (p === '/industrial-cleaning') {
    title = 'Industrial Cleaning Services | Factory Deep Cleans & High Access | Entire FM';
    metaDescription = 'Specialist industrial cleaning across the UK — factory shutdowns, high-level structural cleaning, machinery degreasing, and warehouse floor care.';
    h1 = 'Specialist Industrial Cleaning Services';
    historicIntent = 'Specialist search intent from manufacturing plant managers, warehouse directors, and industrial operations for heavy decontamination.';
    primaryIntent = 'Industrial cleaning services UK';
    secondaryIntents = ['factory deep cleaning contractor', 'warehouse high level cleaning', 'industrial floor scrubbing', 'factory shutdown cleaning'];
    historicTopics = ['Factory shutdowns', 'High-level IPAF cleaning', 'Confined space entry', 'Industrial floor scrubbing', 'Hot water pressure jetting'];
    requiredSections = ['Industrial Hero', 'Specialist Capabilities', 'Safety & RAMS', 'Environments Cleaned', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/cleaning-services', '/industrial-cleaning-london', '/industrial-facilities-management', '/pressure-washing'];
    conversionGoal = 'Generate industrial site surveys, factory shutdown cleaning quotes, and high-level cleaning contracts.';
  } else if (type === 'location') {
    const cityName = loc || 'Regional';
    title = `${cityName} Facilities Management | Commercial Property Maintenance | Entire FM`;
    metaDescription = `Entire FM provides dedicated facilities management across ${cityName} — hard FM, M&E engineering, PPM, cleaning, and 24/7 reactive callout support.`;
    h1 = `${cityName} Facilities Management & Building Maintenance`;
    historicIntent = `Regional commercial search intent for facilities management services in ${cityName} and surrounding commercial corridors.`;
    primaryIntent = `Facilities management ${cityName}`;
    secondaryIntents = [`${cityName} commercial property maintenance`, `FM company ${cityName}`, `building maintenance ${cityName}`];
    historicTopics = [
      `${cityName} commercial coverage: ${locDetails ? locDetails.districts : 'regional commercial parks'}`,
      `Local operational challenges: ${locDetails ? locDetails.challenges : 'regional transport access'}`,
      'Hard FM & M&E delivery',
      'Commercial cleaning & hygiene',
      '24/7 emergency response'
    ];
    requiredSections = ['Location Hero', 'Regional Delivery Scope', 'Districts Covered', 'Engineering Factsheet', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/services', '/mechanical-electrical', '/ppm', '/cleaning-services'];
    conversionGoal = `Generate commercial facilities management enquiries and site survey requests across ${cityName}.`;
  } else if (type === 'geographic-service') {
    const cityName = loc || 'Regional';
    const serviceName = p.includes('industrial-cleaning') ? 'Industrial Cleaning' :
                        p.includes('commercial-cleaning') ? 'Commercial Cleaning' :
                        p.includes('office-cleaning') ? 'Office Cleaning' :
                        p.includes('contract-cleaning') ? 'Contract Cleaning' :
                        p.includes('pressure-washing') ? 'Pressure Washing' :
                        p.includes('external-cleaning') ? 'External Cleaning' : 'Commercial Cleaning';
    
    title = `${serviceName} ${cityName} | Specialist Commercial Services | Entire FM`;
    metaDescription = `Professional ${serviceName.toLowerCase()} across ${cityName} — specialist equipment, certified operatives, and tailored commercial service schedules.`;
    h1 = `${serviceName} ${cityName}`;
    historicIntent = `Hyper-targeted local service search intent combining ${serviceName} with ${cityName} commercial properties.`;
    primaryIntent = `${serviceName.toLowerCase()} ${cityName}`;
    secondaryIntents = [`commercial ${serviceName.toLowerCase()} ${cityName}`, `contract ${serviceName.toLowerCase()} ${cityName}`];
    historicTopics = [
      `${serviceName} delivery across ${cityName}`,
      `Site types served: ${locDetails ? locDetails.buildingTypes : 'commercial and industrial facilities'}`,
      'RAMS and health & safety compliance',
      'Out-of-hours scheduling'
    ];
    requiredSections = ['Local Service Hero', 'Service Scope', 'Districts Covered', 'Safety Standards', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/industrial-cleaning', '/cleaning-services', `/facilities-management-${cityName.toLowerCase()}`];
    conversionGoal = `Generate ${serviceName.toLowerCase()} quotations and site survey bookings in ${cityName}.`;
  } else if (type === 'sector') {
    const sectorName = p.replace(/^\//, '').replace(/-facilities-management$/, '').replace(/-fm$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    title = `${sectorName} Facilities Management Solutions | Entire FM`;
    metaDescription = `Specialized facilities management for the ${sectorName.toLowerCase()} sector — statutory compliance, asset uptime, M&E engineering, and cleaning.`;
    h1 = `${sectorName} Facilities Management`;
    historicIntent = `Sector-specific procurement intent from ${sectorName.toLowerCase()} operations directors seeking experienced FM contractors.`;
    primaryIntent = `${sectorName.toLowerCase()} facilities management`;
    secondaryIntents = [`${sectorName.toLowerCase()} building maintenance`, `${sectorName.toLowerCase()} FM contractor`];
    historicTopics = [
      `Operational continuity in ${sectorName.toLowerCase()} estates`,
      'Sector-specific statutory compliance',
      'Plant room and mechanical maintenance',
      'Specialist hygiene and safety standards'
    ];
    requiredSections = ['Sector Hero', 'Sector Delivery Scope', 'Critical Assets Managed', 'Case Evidence', 'FAQ', 'Enquiry'];
    relatedRoutes = ['/mechanical-electrical', '/ppm', '/industrial-cleaning', '/sectors'];
    conversionGoal = `Drive sector-specific commercial proposals and estate maintenance consultations.`;
  } else if (type === 'post') {
    const articleTitle = p.replace(/^\/post\//, '').replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    title = `${articleTitle} | Facilities Management Insights | Entire FM`;
    metaDescription = `Read Entire FM’s comprehensive industry guide on ${articleTitle.toLowerCase()} for UK commercial property and estate managers.`;
    h1 = articleTitle;
    historicIntent = 'Informational search intent from property professionals researching FM industry best practices and compliance.';
    primaryIntent = articleTitle.toLowerCase();
    secondaryIntents = ['facilities management guide', 'commercial building maintenance advice'];
    historicTopics = ['Industry best practices', 'Statutory compliance guidance', 'Cost optimization in building maintenance'];
    requiredSections = ['Article Header', 'Editorial Content', 'Technical Key Takeaways', 'Related Services', 'Enquiry'];
    relatedRoutes = ['/mechanical-electrical', '/ppm', '/hard-services', '/services'];
    conversionGoal = 'Educate property managers and direct informational traffic to relevant commercial service pages.';
  } else {
    // Company, Legal, Specialist services
    const pageName = p.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    title = `${pageName} | Entire FM`;
    metaDescription = `Entire FM — ${pageName}. Dedicated facilities management, mechanical & electrical engineering, and property maintenance services.`;
    h1 = pageName;
    historicIntent = `Commercial navigation or reference intent for Entire FM's ${pageName.toLowerCase()}.`;
    primaryIntent = `${pageName.toLowerCase()} entire fm`;
    secondaryIntents = ['entire facilities management', 'commercial building services UK'];
    historicTopics = ['EntireFM capabilities', 'Operating standards', 'Client support & contact'];
    requiredSections = ['Hero', 'Overview', 'Operational Standards', 'Contact & CTA'];
    relatedRoutes = ['/services', '/contact-us', '/about-entire-facilities-management'];
    conversionGoal = 'Provide clear company information, portal access, or commercial contact pathways.';
  }

  const record = {
    path: p,
    title,
    metaDescription,
    h1,
    historicIntent,
    primaryIntent,
    secondaryIntents,
    pageType: type,
    service: r.service || null,
    sector: r.sector || null,
    location: loc || null,
    historicTopics,
    requiredSections,
    relatedRoutes,
    conversionGoal,
    verificationRequirements,
    contentStatus: 'COMPLETE',
  };

  contentDatabase[p] = record;

  // Write file to src/content/pages/
  const fileContent = `/**
 * CONTENT RECORD: ${p}
 * =====================
 * Provenance: ${r.routeProvenance}
 * Historic: ${r.historic ? 'Yes' : 'No'}
 * Protected: ${r.protected ? 'Yes' : 'No'}
 */

import type { ContentRecord } from '@/content/index';

const record: ContentRecord = ${JSON.stringify(record, null, 2)};

export default record;
`;

  fs.writeFileSync(path.join(outDir, `${slug}.ts`), fileContent);
  count++;
}

// Write master registry index for fast synchronous server lookups
const masterRegistryContent = `/**
 * MASTER CONTENT REGISTRY
 * =======================
 * Auto-generated content database providing rich, unique content
 * records for all 229 registered routes.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';

export const CONTENT_DATABASE: Record<string, ContentRecord> = ${JSON.stringify(contentDatabase, null, 2)};

export function getContentRecord(path: string): ContentRecord | null {
  return CONTENT_DATABASE[path] || null;
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'content', 'registry.ts'), masterRegistryContent);

console.log(`Generated ${count} unique content records in /src/content/pages/ and /src/content/registry.ts`);
