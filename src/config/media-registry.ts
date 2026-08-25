/**
 * CENTRAL MEDIA REGISTRY
 * ======================
 * Single authoritative source of truth for all service, sector,
 * location, and template imagery across the EntireFM website.
 *
 * Enforces the strict non-negotiable rule:
 * NO operational photograph may be reused across multiple service or sector pages.
 */

export interface PageMediaConfig {
  hero: string;
  heroAlt: string;
  card?: string;
  cardAlt?: string;
  supporting01?: string;
  supporting01Alt?: string;
  supporting02?: string;
  supporting02Alt?: string;
  capabilities?: Array<{
    title: string;
    imageSrc: string;
    imageAlt: string;
  }>;
}

// ─────────────────────────────────────────────────────────────
// 1. SERVICE MEDIA REGISTRY (Unique Hero & Supporting per route)
// ─────────────────────────────────────────────────────────────

export const SERVICE_MEDIA_REGISTRY: Record<string, PageMediaConfig> = {
  // Hard FM & Engineering
  '/mechanical-electrical': {
    hero: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    heroAlt: 'EntireFM engineer conducting precision testing on commercial LV switchgear and distribution boards',
    card: '/images/editorial/entirefm-switchgear-inspection-1200w.webp',
    cardAlt: 'Commercial electrical switchgear maintenance and testing',
    capabilities: [
      {
        title: 'LV Switchgear & Power Distribution',
        imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
        imageAlt: 'EntireFM engineer performing electrical distribution board thermographic inspection',
      },
      {
        title: 'Commercial HVAC & Climate Systems',
        imageSrc: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
        imageAlt: 'EntireFM rooftop HVAC plant deck installation and maintenance',
      },
      {
        title: 'Building Automation & Access Control',
        imageSrc: '/images/editorial/entirefm-access-control-install-2000w.webp',
        imageAlt: 'EntireFM technician commissioning commercial access control security system',
      },
      {
        title: 'EV Charging & Decarbonisation Infrastructure',
        imageSrc: '/images/editorial/entirefm-ev-charging-2000w.webp',
        imageAlt: 'EntireFM commercial EV charging station commissioning and maintenance',
      },
    ],
  },

  '/hvac-contractor': {
    hero: '/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp',
    heroAlt: 'EntireFM engineers inspecting commercial rooftop HVAC condensers at dusk',
    card: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
    cardAlt: 'Commercial HVAC rooftop condensers servicing and inspection',
    capabilities: [
      {
        title: 'VRV / VRF Air Conditioning Servicing',
        imageSrc: '/images/editorial/entirefm-hvac-cassette-service-2000w.webp',
        imageAlt: 'EntireFM technician servicing ceiling cassette air conditioning unit',
      },
      {
        title: 'AHU Ventilation & Ductwork Balancing',
        imageSrc: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
        imageAlt: 'EntireFM engineer conducting thermal survey on AHU ductwork',
      },
      {
        title: 'Primary Chiller Plant Maintenance',
        imageSrc: '/images/editorial/entirefm-hvac-plantroom-pumps-2000w.webp',
        imageAlt: 'EntireFM engineers servicing commercial chilled water circulating pumps',
      },
      {
        title: 'F-Gas Refrigerant Leak Detection',
        imageSrc: '/images/editorial/entirefm-hvac-refrigerant-check-2000w.webp',
        imageAlt: 'EntireFM F-Gas certified engineer performing electronic refrigerant leak check',
      },
    ],
  },

  '/ppm': {
    hero: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
    heroAlt: 'EntireFM technical surveyor conducting comprehensive rooftop plant condition survey',
    card: '/images/editorial/entirefm-sheffield-rooftop-survey-1280w.webp',
    cardAlt: 'Planned preventative maintenance asset condition survey',
    capabilities: [
      {
        title: 'SFG20 Maintenance Schedules',
        imageSrc: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
        imageAlt: 'EntireFM engineer verifying SFG20 maintenance schedule against main switchroom plant',
      },
      {
        title: 'Statutory Asset Verification',
        imageSrc: '/images/locations/nottingham/facilities-management-nottingham-plant-room-maintenance-1600w.webp',
        imageAlt: 'EntireFM engineer auditing plant room mechanical assets and logbooks',
      },
      {
        title: 'Digital CAFM Log Archival',
        imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
        imageAlt: 'EntireFM contract manager reviewing digital CAFM maintenance log with client',
      },
      {
        title: 'Forward Capital Lifecycle Forecasting',
        imageSrc: '/images/locations/manchester/facilities-management-manchester-rooftop-plant-engineers-1600w.webp',
        imageAlt: 'Two EntireFM technical engineers evaluating forward replacement lifecycle of rooftop chillers',
      },
    ],
  },

  '/hard-services': {
    hero: '/images/editorial/entirefm-rooftop-plant-night-2000w.webp',
    heroAlt: 'EntireFM hard facilities management rooftop plant room illuminated during evening maintenance',
    card: '/images/editorial/entirefm-rooftop-plant-night-1200w.webp',
    cardAlt: 'Commercial Hard FM plant room and building engineering services',
    capabilities: [
      {
        title: 'Critical Mechanical Infrastructure',
        imageSrc: '/images/locations/liverpool/facilities-management-liverpool-waterfront-plant-room-1600w.webp',
        imageAlt: 'EntireFM commercial mechanical pumps and pipework maintenance',
      },
      {
        title: 'Electrical Distribution Compliance',
        imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
        imageAlt: 'EntireFM electrical testing on commercial distribution infrastructure',
      },
    ],
  },

  '/fm-technical-services': {
    hero: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    heroAlt: 'EntireFM engineers conducting diagnostic calibration testing on commercial building controls',
    card: '/images/editorial/entirefm-engineers-office-testing-1200w.webp',
    cardAlt: 'Technical facilities management and building diagnostics',
  },

  '/plumbing-gas': {
    hero: '/images/editorial/entirefm-plumbing-booster-set-2000w.webp',
    heroAlt: 'EntireFM commercial plumbing engineer servicing multi-stage booster pump set',
    card: '/images/editorial/entirefm-plumbing-booster-set-1200w.webp',
    cardAlt: 'Commercial plumbing and booster pump set maintenance',
    capabilities: [
      {
        title: 'Water Booster & Pressure Testing',
        imageSrc: '/images/editorial/entirefm-plumbing-pressure-test-2000w.webp',
        imageAlt: 'EntireFM technician conducting hydrostatic pressure test on commercial pipework',
      },
      {
        title: 'Emergency Plumbing Rapid Response',
        imageSrc: '/images/editorial/entirefm-plumbing-callout-arrival-2000w.webp',
        imageAlt: 'EntireFM emergency plumbing rapid response van arriving at commercial facility',
      },
    ],
  },

  '/emergency-light-testing': {
    hero: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
    heroAlt: 'EntireFM engineer testing commercial emergency lighting in corporate office corridor',
    card: '/images/editorial/entirefm-corporate-corridor-1200w.webp',
    cardAlt: 'Statutory emergency lighting compliance testing',
  },

  '/fire-emergency-systems': {
    hero: '/images/editorial/entirefm-access-control-install-2000w.webp',
    heroAlt: 'EntireFM engineer commissioning fire alarm interface and emergency egress controls',
    card: '/images/editorial/entirefm-access-control-install-1200w.webp',
    cardAlt: 'Commercial fire and life safety systems maintenance',
  },

  '/safety-critical-emergency-systems': {
    hero: '/images/locations/london/facilities-management-london-rooftop-plant-inspection-1600w.webp',
    heroAlt: 'EntireFM safety engineer inspecting safety critical rooftop plant and fall arrest systems',
    card: '/images/locations/london/facilities-management-london-rooftop-plant-inspection-800w.webp',
    cardAlt: 'Safety critical emergency systems testing and inspection',
  },

  '/building-maintenance': {
    hero: '/images/editorial/entirefm-headquarters-exterior-2000w.webp',
    heroAlt: 'EntireFM building maintenance team managing commercial headquarters building envelope',
    card: '/images/editorial/entirefm-headquarters-exterior-1200w.webp',
    cardAlt: 'Planned and reactive commercial building maintenance',
  },

  '/building-inspecting-testing': {
    hero: '/images/locations/derby/facilities-management-derby-rooftop-survey-1600w.webp',
    heroAlt: 'EntireFM senior technical inspector surveying commercial building structure and plant',
    card: '/images/locations/derby/facilities-management-derby-rooftop-survey-800w.webp',
    cardAlt: 'Comprehensive commercial building inspections and condition testing',
  },

  '/access-control': {
    hero: '/images/editorial/entirefm-reception-2000w.webp',
    heroAlt: 'Commercial Grade-A corporate reception with automated speed gates and access control',
    card: '/images/editorial/entirefm-reception-1200w.webp',
    cardAlt: 'Corporate access control and automated entry systems',
  },

  '/gates-barriers': {
    hero: '/images/editorial/entirefm-site-arrival-2000w.webp',
    heroAlt: 'EntireFM mobile engineering van arriving at automated commercial security gates',
    card: '/images/editorial/entirefm-site-arrival-1200w.webp',
    cardAlt: 'Automated perimeter security gates and vehicle barrier maintenance',
  },

  '/security-services': {
    hero: '/images/locations/manchester/facilities-management-manchester-reception-front-of-house-1600w.webp',
    heroAlt: 'Front of house corporate security and concierge management in modern commercial building',
    card: '/images/locations/manchester/facilities-management-manchester-reception-front-of-house-800w.webp',
    cardAlt: 'Corporate security and front of house concierge services',
  },

  '/concierge-services': {
    hero: '/images/locations/manchester/facilities-management-manchester-deansgate-city-centre-1600w.webp',
    heroAlt: 'Commercial city centre building concierge and tenant reception services',
    card: '/images/locations/manchester/facilities-management-manchester-deansgate-city-centre-800w.webp',
    cardAlt: 'Corporate concierge and estate reception management',
  },

  '/caretaker': {
    hero: '/images/locations/derby/facilities-management-derby-riverside-mills-1600w.webp',
    heroAlt: 'Dedicated facilities caretaker overseeing multi-tenant commercial estate',
    card: '/images/locations/derby/facilities-management-derby-riverside-mills-800w.webp',
    cardAlt: 'On-site facilities caretaking and premises management',
  },

  '/carpark-management': {
    hero: '/images/locations/sheffield/facilities-management-sheffield-city-centre-response-1600w.webp',
    heroAlt: 'EntireFM commercial fleet vehicle stationed at managed corporate car park',
    card: '/images/locations/sheffield/facilities-management-sheffield-city-centre-response-800w.webp',
    cardAlt: 'Commercial car park management and barrier maintenance',
  },

  // Specialist & Working at Height
  '/working-at-height-rope-access-bmu': {
    hero: '/images/services/working-at-height/hero-rope-access.png',
    heroAlt: 'EntireFM IRATA certified rope access technicians operating on high-rise glass façade at dusk',
    card: '/images/services/working-at-height/commercial-envelope-access.png',
    cardAlt: 'Specialist rope access and working at height services',
    capabilities: [
      {
        title: 'Façade Inspection & Glazing Maintenance',
        imageSrc: '/images/services/working-at-height/facade-inspection-maintenance.png',
        imageAlt: 'EntireFM rope access technician conducting structural façade inspection',
      },
      {
        title: 'BMU Cradle & Building Maintenance Units',
        imageSrc: '/images/services/working-at-height/bmu-cradle-access.png',
        imageAlt: 'EntireFM building maintenance unit BMU cradle access on commercial tower',
      },
      {
        title: 'Rooftop Rigging & Safety Anchors',
        imageSrc: '/images/services/working-at-height/rooftop-rigging-access.png',
        imageAlt: 'EntireFM technician inspecting engineered rooftop rigging and anchor points',
      },
    ],
  },

  '/working-at-heights': {
    hero: '/images/services/working-at-height/commercial-envelope-access.png',
    heroAlt: 'EntireFM commercial envelope access team conducting high-level building maintenance',
    card: '/images/services/working-at-height/hero-rope-access.png',
    cardAlt: 'Commercial working at height access solutions',
  },

  '/aerial-drone-building-inspection': {
    hero: '/images/editorial/entirefm-london-aerial-poster-1280w.webp',
    heroAlt: 'High-resolution aerial thermal drone inspection over commercial city estate',
    card: '/images/editorial/entirefm-london-aerial-poster-1280w.webp',
    cardAlt: 'CAA approved commercial drone building inspections and roof surveys',
  },

  '/mobile-crane-hire': {
    hero: '/images/locations/sheffield/facilities-management-sheffield-rooftop-plant-checks-1600w.webp',
    heroAlt: 'Heavy plant crane lifting and rooftop mechanical replacement operations',
    card: '/images/locations/sheffield/facilities-management-sheffield-rooftop-plant-checks-800w.webp',
    cardAlt: 'Specialist mobile crane hire and contract lifting services',
  },

  '/bocker-crane-hire': {
    hero: '/images/locations/sheffield/facilities-management-sheffield-industrial-unit-1600w.webp',
    heroAlt: 'Compact aluminium mobile crane setup for commercial building maintenance',
    card: '/images/locations/sheffield/facilities-management-sheffield-industrial-unit-800w.webp',
    cardAlt: 'Bocker aluminium trailer and truck crane hire',
  },

  '/truck-mount-crane-hire': {
    hero: '/images/locations/derby/facilities-management-derby-industrial-estate-1600w.webp',
    heroAlt: 'Truck mounted mobile crane positioned for commercial roof access',
    card: '/images/locations/derby/facilities-management-derby-industrial-estate-800w.webp',
    cardAlt: 'Heavy truck mounted crane hire for commercial building plant',
  },

  // Soft Services & Cleaning
  '/industrial-cleaning': {
    hero: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    heroAlt: 'EntireFM industrial cleaning and facility maintenance team operating at logistics hub at dusk',
    card: '/images/editorial/entirefm-external-distribution-dusk-1200w.webp',
    cardAlt: 'Industrial cleaning and factory decontamination services',
  },

  '/cleaning-services': {
    hero: '/images/locations/sheffield/facilities-management-sheffield-winter-garden-1600w.webp',
    heroAlt: 'Professional commercial cleaning in high-spec glass architectural atrium',
    card: '/images/locations/sheffield/facilities-management-sheffield-winter-garden-800w.webp',
    cardAlt: 'Commercial cleaning and specialist facilities hygiene',
  },

  '/contract-cleaning': {
    hero: '/images/locations/birmingham/facilities-management-birmingham-city-centre-offices-1600w.webp',
    heroAlt: 'Daily corporate contract cleaning across multi-storey Grade-A office development',
    card: '/images/locations/birmingham/facilities-management-birmingham-city-centre-offices-800w.webp',
    cardAlt: 'Contract office cleaning and corporate facilities care',
  },

  '/office-cleaning': {
    hero: '/images/locations/liverpool/facilities-management-liverpool-commercial-district-1600w.webp',
    heroAlt: 'Corporate office cleaning and daytime janitorial support in commercial district',
    card: '/images/locations/liverpool/facilities-management-liverpool-commercial-district-800w.webp',
    cardAlt: 'Professional commercial office cleaning',
  },

  '/retail-cleaning': {
    hero: '/images/locations/birmingham/facilities-management-birmingham-gas-street-canal-1600w.webp',
    heroAlt: 'Commercial retail and mixed-use public destination cleaning and hygiene',
    card: '/images/locations/birmingham/facilities-management-birmingham-gas-street-canal-800w.webp',
    cardAlt: 'Retail centre and shopping park cleaning',
  },

  '/education-cleaning': {
    hero: '/images/locations/birmingham/facilities-management-birmingham-library-of-birmingham-1600w.webp',
    heroAlt: 'Educational campus and university estate cleaning management',
    card: '/images/locations/birmingham/facilities-management-birmingham-library-of-birmingham-800w.webp',
    cardAlt: 'Schools, colleges and university campus cleaning services',
  },

  '/medical-cleaning': {
    hero: '/images/locations/liverpool/facilities-management-liverpool-waterfront-plant-room-1600w.webp',
    heroAlt: 'Specialist clinical and medical hygiene sanitisation protocols',
    card: '/images/locations/liverpool/facilities-management-liverpool-waterfront-plant-room-800w.webp',
    cardAlt: 'Healthcare and clinical environment sanitisation',
  },

  '/window-cleaning': {
    hero: '/images/locations/london/facilities-management-london-engineers-st-pauls-1600w.webp',
    heroAlt: 'Commercial high-reach window cleaning and façade maintenance overlooking city skyline',
    card: '/images/locations/london/facilities-management-london-engineers-st-pauls-800w.webp',
    cardAlt: 'Commercial window cleaning and high-reach water fed pole systems',
  },

  '/pressure-washing': {
    hero: '/images/locations/derby/facilities-management-derby-cathedral-quarter-1600w.webp',
    heroAlt: 'Commercial hot water pressure washing and hard surface restoration on commercial estate',
    card: '/images/locations/derby/facilities-management-derby-cathedral-quarter-800w.webp',
    cardAlt: 'Commercial pressure washing and exterior paving cleaning',
  },

  '/grounds-maintenance': {
    hero: '/images/editorial/entirefm-totem-headquarters-2000w.webp',
    heroAlt: 'Commercial business park grounds maintenance, landscaped borders and estate roads',
    card: '/images/editorial/entirefm-totem-headquarters-1200w.webp',
    cardAlt: 'Commercial grounds maintenance and estate landscaping',
  },

  '/landscaping': {
    hero: '/images/locations/nottingham/facilities-management-nottingham-rooftop-city-view-1600w.webp',
    heroAlt: 'Commercial landscaping and green space maintenance across commercial portfolio',
    card: '/images/locations/nottingham/facilities-management-nottingham-rooftop-city-view-800w.webp',
    cardAlt: 'Commercial grounds care and soft landscaping',
  },

  '/washroom-management': {
    hero: '/images/locations/liverpool/facilities-management-liverpool-pier-head-liver-building-1600w.webp',
    heroAlt: 'Commercial washroom hygiene services and sanitary waste management across multi-storey estate',
    card: '/images/locations/liverpool/facilities-management-liverpool-pier-head-liver-building-800w.webp',
    cardAlt: 'Commercial washroom supplies and hygiene management',
  },

  '/soft-services': {
    hero: '/images/locations/nottingham/facilities-management-nottingham-operations-centre-1600w.webp',
    heroAlt: 'EntireFM soft services operations desk coordinating cleaning and site services',
    card: '/images/locations/nottingham/facilities-management-nottingham-operations-centre-800w.webp',
    cardAlt: 'Integrated soft facilities management services',
  },

  '/24-7-fm-support': {
    hero: '/images/editorial/entirefm-entirefm-premises-vans-2000w.webp',
    heroAlt: 'EntireFM rapid response mobile engineering fleet stationed 24/7',
    card: '/images/editorial/entirefm-entirefm-premises-vans-1200w.webp',
    cardAlt: '24/7 helpdesk and emergency mobile engineer response',
  },

  '/facilities-management-services': {
    hero: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
    heroAlt: 'EntireFM national operations headquarters and central facilities coordination hub',
    card: '/images/editorial/entirefm-hero-headquarters-1280w.webp',
    cardAlt: 'Total commercial facilities management and building engineering services',
  },
};

// ─────────────────────────────────────────────────────────────
// 2. SECTOR MEDIA REGISTRY (Unique Hero per sector archetype)
// ─────────────────────────────────────────────────────────────

export const SECTOR_MEDIA_REGISTRY: Record<string, PageMediaConfig> = {
  commercial: {
    hero: '/images/editorial/entirefm-reception-2000w.webp',
    heroAlt: 'Corporate Grade-A office reception with seamless tenant access control',
    card: '/images/editorial/entirefm-reception-1200w.webp',
    cardAlt: 'Commercial office facilities management',
  },

  industrial: {
    hero: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    heroAlt: 'EntireFM engineer surveying heavy industrial switchroom plant in manufacturing facility',
    card: '/images/editorial/entirefm-switchroom-survey-1200w.webp',
    cardAlt: 'Industrial manufacturing plant facilities engineering',
  },

  logistics: {
    hero: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    heroAlt: 'High-throughput distribution centre logistics park maintained by EntireFM at dusk',
    card: '/images/editorial/entirefm-external-distribution-dusk-1200w.webp',
    cardAlt: 'Logistics and warehouse facilities management',
  },

  retail: {
    hero: '/images/locations/birmingham/facilities-management-birmingham-gas-street-canal-1600w.webp',
    heroAlt: 'High-footfall mixed-use retail and commercial leisure destination',
    card: '/images/locations/birmingham/facilities-management-birmingham-gas-street-canal-800w.webp',
    cardAlt: 'Retail park and shopping centre facilities care',
  },

  education: {
    hero: '/images/locations/birmingham/facilities-management-birmingham-library-of-birmingham-1600w.webp',
    heroAlt: 'Modern higher education campus and civic learning facility',
    card: '/images/locations/birmingham/facilities-management-birmingham-library-of-birmingham-800w.webp',
    cardAlt: 'Education, university and schools facilities management',
  },

  healthcare: {
    hero: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    heroAlt: 'EntireFM engineers conducting critical system calibration in healthcare facility',
    card: '/images/editorial/entirefm-engineers-office-testing-1200w.webp',
    cardAlt: 'Healthcare and clinical estate facilities compliance',
  },

  hospitality: {
    hero: '/images/locations/manchester/facilities-management-manchester-reception-front-of-house-1600w.webp',
    heroAlt: 'Luxury hotel and commercial hospitality guest reception environment',
    card: '/images/locations/manchester/facilities-management-manchester-reception-front-of-house-800w.webp',
    cardAlt: 'Hotel and hospitality facilities management',
  },

  residential: {
    hero: '/images/locations/manchester/facilities-management-manchester-castlefield-viaduct-1600w.webp',
    heroAlt: 'Managed Build-to-Rent apartment estate and communal facilities',
    card: '/images/locations/manchester/facilities-management-manchester-castlefield-viaduct-800w.webp',
    cardAlt: 'Build-to-Rent and private residential estate facilities care',
  },

  'public-sector': {
    hero: '/images/locations/nottingham/facilities-management-nottingham-old-market-square-1600w.webp',
    heroAlt: 'Civic municipal building and public sector administrative estate',
    card: '/images/locations/nottingham/facilities-management-nottingham-old-market-square-800w.webp',
    cardAlt: 'Public sector and civic building facilities management',
  },

  technology: {
    hero: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    heroAlt: 'Mission-critical data centre electrical distribution and power testing',
    card: '/images/editorial/entirefm-distribution-board-testing-1200w.webp',
    cardAlt: 'Data centre and technical facilities infrastructure',
  },

  transport: {
    hero: '/images/locations/london/facilities-management-london-tower-bridge-response-1600w.webp',
    heroAlt: 'EntireFM mobile engineering support operating across central transport corridors',
    card: '/images/locations/london/facilities-management-london-tower-bridge-response-800w.webp',
    cardAlt: 'Transport hub and transit estate facilities engineering',
  },

  leisure: {
    hero: '/images/locations/sheffield/facilities-management-sheffield-winter-garden-1600w.webp',
    heroAlt: 'Public leisure and sports facility envelope maintained by EntireFM',
    card: '/images/locations/sheffield/facilities-management-sheffield-winter-garden-800w.webp',
    cardAlt: 'Sports venues and leisure centre facilities management',
  },

  managingAgents: {
    hero: '/images/editorial/entirefm-client-review-2000w.webp',
    heroAlt: 'EntireFM director presenting transparent CAFM audit reporting to commercial managing agent',
    card: '/images/editorial/entirefm-client-review-1200w.webp',
    cardAlt: 'Managing agent and property asset management FM partner',
  },
};

// ─────────────────────────────────────────────────────────────
// 3. RESOLVER HELPER
// ─────────────────────────────────────────────────────────────

export function getServiceMedia(path: string): PageMediaConfig {
  const cleanPath = path.toLowerCase().replace(/\/$/, '');
  if (SERVICE_MEDIA_REGISTRY[cleanPath]) {
    return SERVICE_MEDIA_REGISTRY[cleanPath];
  }

  // Smart fallback based on keyword
  if (cleanPath.includes('clean')) {
    return SERVICE_MEDIA_REGISTRY['/cleaning-services'];
  }
  if (cleanPath.includes('hvac') || cleanPath.includes('air-condition')) {
    return SERVICE_MEDIA_REGISTRY['/hvac-contractor'];
  }
  if (cleanPath.includes('plumb') || cleanPath.includes('gas')) {
    return SERVICE_MEDIA_REGISTRY['/plumbing-gas'];
  }
  if (cleanPath.includes('height') || cleanPath.includes('rope')) {
    return SERVICE_MEDIA_REGISTRY['/working-at-height-rope-access-bmu'];
  }
  if (cleanPath.includes('crane')) {
    return SERVICE_MEDIA_REGISTRY['/mobile-crane-hire'];
  }
  if (cleanPath.includes('security') || cleanPath.includes('gate')) {
    return SERVICE_MEDIA_REGISTRY['/security-services'];
  }

  return SERVICE_MEDIA_REGISTRY['/facilities-management-services'];
}
