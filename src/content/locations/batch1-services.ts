import type { ContentRecord } from '@/lib/routes/route-schema';

/**
 * ENTIREFM PHASE 2B BATCH 1 CONTENT RECORDS
 * =========================================
 * 10 High-Intent Service × Location Landing Pages:
 * 1.  /ppm-london
 * 2.  /ppm-manchester
 * 3.  /hvac-london
 * 4.  /mechanical-electrical-london
 * 5.  /ppm-birmingham
 * 6.  /hvac-manchester
 * 7.  /ppm-leeds
 * 8.  /ppm-sheffield
 * 9.  /commercial-cleaning-liverpool
 * 10. /commercial-cleaning-derby
 */

export const BATCH1_GEO_CONTENT: Record<string, ContentRecord> = {
  // ============================================================
  // 1. /ppm-london
  // ============================================================
  '/ppm-london': {
    path: '/ppm-london',
    title: 'Planned Preventative Maintenance London | Commercial PPM & SFG20 | EntireFM',
    metaDescription: 'Planned Preventative Maintenance (PPM) contractor in London. SFG20 compliant asset maintenance, HVAC, electrical testing, and statutory building compliance for London commercial property.',
    h1: 'Planned Preventative Maintenance in London',
    eyebrow: 'LONDON COMMERCIAL PPM · SFG20 ASSET CARE',
    heroIntro: 'Statutory Planned Preventative Maintenance and Asset Protection for London Commercial Estates and Corporate Headquarters.',
    heroDescription: 'EntireFM delivers scheduled mechanical, electrical, and fabric maintenance across London. Structured to SFG20 standards, coordinated around high-density corporate operations, and logged with real-time audit certificates in the EntireCAFM compliance vault.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial PPM contractor London SFG20 planned maintenance schedules',
    primaryIntent: 'ppm london',
    secondaryIntents: [
      'planned preventative maintenance london',
      'commercial ppm contractor london',
      'sfg20 maintenance london',
      'statutory building maintenance london',
      'commercial property maintenance london',
    ],
    pageType: 'geographic-service',
    service: 'Planned Preventative Maintenance',
    sector: 'Commercial Property & Corporate Headquarters',
    location: 'London',
    historicTopics: [
      'SFG20 Maintenance Schedules',
      'HVAC & Chiller Servicing',
      'Commercial Electrical EICR',
      'Statutory Gas Safety (CP15/CP17)',
      'Water Hygiene L8 Legionella',
      'London High-Rise Building Systems',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'SFG20-Aligned Statutory Maintenance for London Estates',
        body: 'Operating high-density commercial property in the City of London, Canary Wharf, and the West End demands uncompromising maintenance discipline. EntireFM builds asset-specific 52-week PPM schedules that satisfy all statutory obligations—from F-Gas regulations and BS 7671 electrical testing to ACoP L8 water hygiene and TM44 energy inspections.',
      },
      {
        heading: 'Minimising Disruption Across London Workplace Environments',
        body: 'Our qualified engineering fleet operates 24/7/365 with scheduled out-of-hours, weekend, and early-morning servicing windows. We maintain critical plant—including roof-mounted chillers, VRV heat pumps, AHU filter banks, and central switchgear—without disrupting daytime tenant operations or breaching noise constraints in mixed-use London boroughs.',
      },
      {
        heading: 'Digital Compliance Vault & Asset Lifecycle Reporting',
        body: 'Every PPM service event generates immediate electronic certification uploaded directly into your EntireCAFM dashboard. Managing agents and facilities directors receive transparent asset health scores, forward capital expenditure recommendations, and audit-ready statutory compliance logs.',
      },
    ],
    capabilities: [
      {
        name: 'SFG20 Asset Register & Scheduling',
        description: 'Comprehensive barcoding, asset tagging, and 52-week proactive maintenance regimes aligned with CIBSE and SFG20 industry standards.',
        tag: 'Asset Management',
      },
      {
        name: 'HVAC, Chillers & Ventilation Servicing',
        description: 'Quarterly F-Gas leak checks, coil sanitisation, compressor performance testing, and AHU belt/filter renewals for optimal IAQ.',
        tag: 'Mechanical Care',
      },
      {
        name: 'Fixed Wire Electrical & Emergency Lighting',
        description: 'Periodic EICR inspections, thermal imaging surveys of distribution boards, and monthly 3-hour emergency lighting discharge tests.',
        tag: 'Electrical Safety',
      },
      {
        name: 'Water Hygiene & Legionella Control',
        description: 'Monthly temperature monitoring, quarterly calorifier descaling, water sampling, and annual CWST chlorination adhering to HSG274.',
        tag: 'Statutory Health',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'How do you schedule PPM visits in central London to avoid tenant disruption?',
        answer: 'We coordinate all intrusive mechanical and electrical maintenance outside standard office hours (evenings from 18:00 or weekends) at no penalty rate for contracted PPM clients. Our engineers operate ULEZ-compliant mobile workshops carrying rapid-replacement consumables.',
      },
      {
        question: 'Does EntireFM provide SFG20 asset tagging for newly mobilised London buildings?',
        answer: 'Yes. During mobilisation, our senior engineering lead conducts a full site survey, applies QR/RFID asset tags to all plant items, and builds an auditable digital register within EntireCAFM linked directly to SFG20 maintenance task codes.',
      },
      {
        question: 'How do managing agents access statutory compliance records for London portfolios?',
        answer: 'All certificates, engineer worksheets, and thermographic survey reports are uploaded to the EntireCAFM portal immediately following visit sign-off, providing instant 24/7 audit readiness for insurance and RICS service charge audits.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'PPM London', url: '/ppm-london' },
    ],
    relatedRoutes: [
      '/ppm',
      '/locations/london',
      '/locations/london/services',
      '/mechanical-electrical-london',
      '/hvac-london',
      '/facilities-management-london',
      '/fm-london',
    ],
    conversionGoal: 'Book an SFG20 PPM estate survey with our London technical desk via london@entirefm.com or 020 4586 5422',
    verificationRequirements: [
      'Direct London technical routing configured (london@entirefm.com / 020 4586 5422)',
      'SFG20 compliance claims adhere to certified engineering scope',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ============================================================
  // 2. /ppm-manchester
  // ============================================================
  '/ppm-manchester': {
    path: '/ppm-manchester',
    title: 'Planned Preventative Maintenance Manchester | Commercial PPM & M&E | EntireFM',
    metaDescription: 'Specialist Planned Preventative Maintenance (PPM) contractor in Manchester. SFG20 asset maintenance, commercial HVAC, electrical compliance, and building engineering across Greater Manchester.',
    h1: 'Planned Preventative Maintenance in Manchester',
    eyebrow: 'MANCHESTER COMMERCIAL PPM · REGIONAL ASSET CARE',
    heroIntro: 'Proactive Mechanical, Electrical, and Building Maintenance Schedules for Manchester Commercial Property & Logistics Hubs.',
    heroDescription: 'From Grade A office towers in Spinningfields and MediaCityUK to high-throughput logistics depots in Trafford Park, EntireFM delivers reliable, certified Planned Preventative Maintenance (PPM) backed by the EntireCAFM digital platform.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial PPM contractor Manchester planned preventative maintenance',
    primaryIntent: 'ppm manchester',
    secondaryIntents: [
      'planned preventative maintenance manchester',
      'commercial ppm contractor manchester',
      'sfg20 maintenance manchester',
      'building maintenance manchester',
      'm&e ppm manchester',
    ],
    pageType: 'geographic-service',
    service: 'Planned Preventative Maintenance',
    sector: 'Commercial Offices, Media & Logistics',
    location: 'Manchester',
    historicTopics: [
      'SFG20 Maintenance Schedules',
      'Trafford Park Industrial Maintenance',
      'Commercial Air Conditioning & Heating',
      'Electrical Periodic Testing',
      'Digital CAFM Asset Tagging',
      'North West Engineering Fleet',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'Tailored PPM Regimes for Manchester’s Diverse Building Stock',
        body: 'Greater Manchester features a sophisticated mix of cutting-edge Grade A commercial developments and complex industrial infrastructure. EntireFM delivers structured planned maintenance programmes tailored to modern BMS systems, legacy plant room conversions, and high-bay distribution centres.',
      },
      {
        heading: 'Eliminating Costly Breakdowns & Enhancing Asset Lifespan',
        body: 'Unplanned plant failure disrupts commercial tenants and incurs emergency callout premiums. Our scheduled servicing regimes detect bearing wear, refrigerant pressure drops, electrical hotspots, and water filtration degradation before they evolve into critical operational failures.',
      },
      {
        heading: 'Transparent Digital Compliance for North West Portfolio Managers',
        body: 'Through EntireCAFM, North West property managers and facilities teams maintain continuous visibility over service completion rates, statutory compliance scores, and engineer attendance timestamps across all Greater Manchester sites.',
      },
    ],
    capabilities: [
      {
        name: 'Commercial Heating & Chilled Water Systems',
        description: 'Comprehensive servicing of commercial gas boilers, heat pumps, air handling plant, and secondary chilled water circulation loops.',
        tag: 'HVAC & Heating',
      },
      {
        name: 'Fixed Wire & Industrial Power Distribution',
        description: 'EICR testing, three-phase switchboard inspections, RCD trip testing, and power quality monitoring for commercial and logistics facilities.',
        tag: 'Electrical Care',
      },
      {
        name: 'Statutory Water Safety & Legionella Control',
        description: 'Routine water temperature logging, tank cleaning, chemical dosing, and UKAS-accredited microbiological sampling.',
        tag: 'Water Safety',
      },
      {
        name: 'Building Fabric & Envelope Maintenance',
        description: 'Proactive roof inspections, gutter clearance, automated door servicing, and fire door integrity inspections across commercial portfolios.',
        tag: 'Fabric Care',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'Which areas of Greater Manchester does your PPM engineering fleet cover?',
        answer: 'Our North West operations desk covers central Manchester (Spinningfields, NOMA, Ancoats), Salford Quays/MediaCityUK, Trafford Park, Stockport, Bolton, Bury, Rochdale, and the airport commercial corridor.',
      },
      {
        question: 'Do you offer emergency breakdown cover alongside scheduled PPM in Manchester?',
        answer: 'Yes. Contracted PPM clients benefit from our 24/7/365 priority helpdesk with agreed contractual emergency attendance windows across Greater Manchester.',
      },
      {
        question: 'Can you consolidate PPM and contract cleaning into a single Manchester agreement?',
        answer: 'Yes. Combining Hard FM planned engineering with Soft FM daily commercial cleaning under one EntireFM contract streamlines supplier management and lowers overall estate operational overheads.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'PPM Manchester', url: '/ppm-manchester' },
    ],
    relatedRoutes: [
      '/ppm',
      '/locations/manchester',
      '/locations/manchester/services',
      '/mechanical-electrical-manchester',
      '/hvac-manchester',
      '/facilities-management-manchester',
      '/fm-manchester',
    ],
    conversionGoal: 'Request a Manchester PPM estate survey via manchester@entirefm.com or 0845 094 8583',
    verificationRequirements: [
      'North West regional routing active (manchester@entirefm.com / 0845 094 8583)',
      'SFG20 engineering standards verified',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ============================================================
  // 3. /hvac-london
  // ============================================================
  '/hvac-london': {
    path: '/hvac-london',
    title: 'Commercial HVAC & Air Conditioning London | Servicing & Chillers | EntireFM',
    metaDescription: 'Commercial HVAC contractor in London. Chiller maintenance, VRF/VRV air conditioning servicing, F-Gas compliance, and 24/7 emergency breakdown cover across Greater London.',
    h1: 'Commercial HVAC & Air Conditioning in London',
    eyebrow: 'LONDON COMMERCIAL HVAC · CHILLERS & AIR CONDITIONING',
    heroIntro: 'Specialist HVAC Engineering, Chiller Maintenance, and Temperature Control for London Commercial Offices and High-Density Estates.',
    heroDescription: 'EntireFM delivers end-to-end commercial HVAC solutions across London. From critical rooftop chiller servicing and VRF heat recovery systems to ventilation air quality auditing and F-Gas statutory logging.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial HVAC contractor London air conditioning chiller maintenance',
    primaryIntent: 'hvac london',
    secondaryIntents: [
      'commercial air conditioning london',
      'commercial hvac contractor london',
      'chiller maintenance london',
      'vrf air conditioning london',
      'f-gas compliance london',
    ],
    pageType: 'geographic-service',
    service: 'Commercial HVAC',
    sector: 'Commercial Offices & Corporate Real Estate',
    location: 'London',
    historicTopics: [
      'Commercial Chillers & Cooling Towers',
      'VRF/VRV Air Conditioning Systems',
      'F-Gas Statutory Logbooks',
      'Air Handling Units (AHUs) & Filtration',
      'TM44 Energy Inspections',
      '24/7 London Emergency HVAC Response',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'Precision Climate Control for London Commercial Real Estate',
        body: 'London corporate occupiers require constant thermal stability and superior indoor air quality. EntireFM maintains complex cooling and ventilation plant across landmark City towers, West End embassies, and Canary Wharf trading floors, ensuring peak energy efficiency and quiet acoustic operation.',
      },
      {
        heading: 'F-Gas Compliance & Refrigerant Management Regimes',
        body: 'All EntireFM air conditioning technicians are REFCOM-accredited and certified to City & Guilds 2079 Category 1. We maintain electronic F-Gas logbooks tracking refrigerant weight, leak testing schedules, and system efficiency to ensure full statutory compliance with UK Environmental Agency regulations.',
      },
      {
        heading: 'Rapid Breakdown Response & Proactive Plant Optimisation',
        body: 'When cooling or heating systems fail in mission-critical environments, our London-based mobile engineering fleet responds swiftly with on-board diagnostic tooling and core replacement parts to restore climate control without delay.',
      },
    ],
    capabilities: [
      {
        name: 'Chiller Servicing & Water Treatment',
        description: 'Comprehensive mechanical servicing of scroll, screw, and centrifugal chillers, including glycol testing, condenser descaling, and oil analysis.',
        tag: 'Chiller Engineering',
      },
      {
        name: 'VRF / VRV Multi-Split Air Conditioning',
        description: 'Planned servicing, electronic expansion valve testing, filter sanitisation, and condensate drainage clearing across multi-floor commercial systems.',
        tag: 'Air Conditioning',
      },
      {
        name: 'Air Handling Units (AHUs) & Heat Recovery',
        description: 'HEPA and carbon filter replacement, belt tensioning, inverter drive calibration, and coil hygiene deep cleaning.',
        tag: 'Ventilation & IAQ',
      },
      {
        name: 'BMS Integration & Climate Optimisation',
        description: 'Sensor calibration, setpoint fine-tuning, and time schedule optimisation to reduce peak electrical demand and support EPC ratings.',
        tag: 'BMS Controls',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'Are your engineers certified to carry out statutory F-Gas leak checks in London?',
        answer: 'Yes. EntireFM is a REFCOM Elite registered company. All HVAC engineers hold Category 1 F-Gas certifications, and every inspection is logged digitally in your EntireCAFM compliance vault with certificate generation.',
      },
      {
        question: 'How do you access and maintain rooftop chillers on high-rise London properties?',
        answer: 'Our technicians are fully trained in rooftop safety, edge protection protocols, and permit-to-work systems. Where required, our in-house Working at Height team coordinates crane lifting or specialist access.',
      },
      {
        question: 'Can you service heritage or listed building heating and cooling systems in Westminster or the City?',
        answer: 'Yes. We frequently maintain sensitively retrofitted VRF and hydronic systems in Grade I and Grade II listed commercial buildings, ensuring compliance with conservation requirements.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'HVAC London', url: '/hvac-london' },
    ],
    relatedRoutes: [
      '/hvac-contractor',
      '/locations/london',
      '/locations/london/services',
      '/ppm-london',
      '/mechanical-electrical-london',
      '/facilities-management-london',
    ],
    conversionGoal: 'Enquire for London commercial HVAC maintenance and survey via london@entirefm.com or 020 4586 5422',
    verificationRequirements: [
      'REFCOM accreditation reference verified',
      'London regional desk direct routing configured',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ============================================================
  // 4. /mechanical-electrical-london
  // ============================================================
  '/mechanical-electrical-london': {
    path: '/mechanical-electrical-london',
    title: 'Mechanical & Electrical Maintenance London | Commercial M&E | EntireFM',
    metaDescription: 'Commercial Mechanical & Electrical (M&E) engineering contractor in London. Hard FM maintenance, commercial electrical testing, plant room servicing, and 24/7 helpdesk.',
    h1: 'Mechanical & Electrical Maintenance in London',
    eyebrow: 'LONDON COMMERCIAL M&E · HARD FM ENGINEERING',
    heroIntro: 'Integrated Mechanical & Electrical Engineering and Hard Facilities Management for London Commercial Portfolios.',
    heroDescription: 'EntireFM provides comprehensive M&E engineering services across Greater London. We deliver statutory compliance, electrical infrastructure care, HVAC mechanical servicing, and reactive engineering support for demanding commercial property portfolios.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial mechanical and electrical maintenance contractor London M&E Hard FM',
    primaryIntent: 'mechanical electrical london',
    secondaryIntents: [
      'm&e contractor london',
      'commercial mechanical electrical london',
      'hard fm maintenance london',
      'commercial electrical engineering london',
      'plant room maintenance london',
    ],
    pageType: 'geographic-service',
    service: 'Mechanical & Electrical',
    sector: 'Commercial Offices, Multi-Tenant Portfolios',
    location: 'London',
    historicTopics: [
      'Commercial Plant Room Maintenance',
      'EICR Fixed Wire Periodic Inspection',
      'Pumps, Motors & Inverters',
      'Commercial Plumbing & Gas Safety',
      'BMS & Controls Engineering',
      '24/7 London Emergency Dispatch',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'Integrated Hard FM Engineering for London Corporate Assets',
        body: 'Managing commercial building engineering in London requires deep multi-skilled technical capability. EntireFM integrates electrical, mechanical, plumbing, and control systems under one accountable team, eliminating multi-contractor friction and delivering cohesive asset reliability.',
      },
      {
        heading: 'Plant Room Health, Energy Efficiency & Statutory Compliance',
        body: 'We service central boiler rooms, booster pump sets, chilled water circuits, main distribution switchboards, and ventilation plant. Routine thermal imaging, vibration analysis, and water treatment ensure your building systems run cleanly with minimal energy waste.',
      },
      {
        heading: 'Accountable 24/7 M&E Operations Desk for London Estates',
        body: 'Our central operations helpdesk coordinates direct-delivery mobile technicians across the London area. With agreed contractual response windows, urgent electrical trip investigations or mechanical pump breakdowns are addressed with urgency and technical competence.',
      },
    ],
    capabilities: [
      {
        name: 'Electrical Distribution & EICR Testing',
        description: 'Complete BS 7671 electrical testing, sub-main servicing, harmonic analysis, and thermal imaging of critical distribution boards.',
        tag: 'Electrical Engineering',
      },
      {
        name: 'Mechanical Plant & Booster Pumps',
        description: 'Servicing of pressurisation units, variable speed booster sets, circulatory pumps, balancing valves, and heat exchangers.',
        tag: 'Mechanical Care',
      },
      {
        name: 'Commercial Gas & Boiler Engineering',
        description: 'Gas Safe registered servicing of commercial gas burners, calorifiers, pipework tightness testing, and CP15 certification.',
        tag: 'Gas & Heating',
      },
      {
        name: 'Life Safety & Emergency Systems',
        description: 'Emergency lighting battery discharge testing, fire damper drop testing, and primary/secondary power changeover testing.',
        tag: 'Compliance Safety',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'Are your M&E engineers fully qualified to work on commercial London installations?',
        answer: 'Yes. Our electrical engineers are NICEIC-approved and 18th Edition certified. Our gas engineers are Gas Safe registered for commercial appliances, and mechanical technicians hold relevant NVQ/City & Guilds qualifications.',
      },
      {
        question: 'Do you provide full M&E condition surveys prior to contract commencement?',
        answer: 'Yes. During mobilisation, we conduct a comprehensive dilapidation and asset condition survey, identifying legacy defects, statutory non-compliance, and energy optimisation opportunities.',
      },
      {
        question: 'How do you handle emergency M&E callouts in central London?',
        answer: 'Our 24/7 central helpdesk dispatches local mobile engineers with live GPS tracking. We maintain rapid response SLAs for emergency priorities such as complete power loss, gas leaks, or major water escapes.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'M&E London', url: '/mechanical-electrical-london' },
    ],
    relatedRoutes: [
      '/mechanical-electrical',
      '/locations/london',
      '/locations/london/services',
      '/ppm-london',
      '/hvac-london',
      '/facilities-management-london',
    ],
    conversionGoal: 'Request a London M&E maintenance proposal via london@entirefm.com or 020 4586 5422',
    verificationRequirements: [
      'NICEIC and Gas Safe compliance references verified',
      'London regional desk direct routing configured',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ============================================================
  // 5. /ppm-birmingham
  // ============================================================
  '/ppm-birmingham': {
    path: '/ppm-birmingham',
    title: 'Planned Preventative Maintenance Birmingham | Commercial PPM & SFG20 | EntireFM',
    metaDescription: 'Planned Preventative Maintenance (PPM) contractor in Birmingham. SFG20 asset care, HVAC servicing, electrical compliance, and building engineering across the West Midlands.',
    h1: 'Planned Preventative Maintenance in Birmingham',
    eyebrow: 'BIRMINGHAM COMMERCIAL PPM · WEST MIDLANDS ASSET CARE',
    heroIntro: 'Proactive Planned Preventative Maintenance and Statutory Engineering for Birmingham Commercial Offices & Industrial Estates.',
    heroDescription: 'EntireFM delivers scheduled building engineering, HVAC maintenance, electrical testing, and statutory compliance across Birmingham and the wider West Midlands commercial corridor.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial PPM contractor Birmingham SFG20 planned preventative maintenance',
    primaryIntent: 'ppm birmingham',
    secondaryIntents: [
      'planned preventative maintenance birmingham',
      'commercial ppm contractor birmingham',
      'sfg20 maintenance birmingham',
      'commercial property maintenance birmingham',
      'm&e ppm birmingham',
    ],
    pageType: 'geographic-service',
    service: 'Planned Preventative Maintenance',
    sector: 'Commercial Offices, Manufacturing & Logistics',
    location: 'Birmingham',
    historicTopics: [
      'Colmore District Commercial Maintenance',
      'SFG20 Statutory Schedules',
      'West Midlands Industrial Engineering',
      'Commercial Air Conditioning & Gas',
      'Electrical EICR & Emergency Lighting',
      'EntireCAFM Real-Time Portal',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'Strategic Planned Maintenance for Birmingham’s Expanding Commercial Hub',
        body: 'With major commercial developments around Colmore Row, Snow Hill, and Digbeth, Birmingham property operators need reliable, engineering-led maintenance. EntireFM establishes robust PPM schedules that safeguard asset longevity, maintain tenant comfort, and satisfy insurer requirements.',
      },
      {
        heading: 'Industrial & Manufacturing Maintenance across the West Midlands',
        body: 'Beyond the city centre, our mobile engineering fleet supports manufacturing facilities, business parks, and logistics depots across Solihull, Aston, and the Black Country corridor, delivering production-critical electrical, mechanical, and compressed air servicing.',
      },
      {
        heading: 'Complete Statutory Compliance Tracking with EntireCAFM',
        body: 'We remove compliance uncertainty. Every scheduled visit generates digital proof of service, asset condition scoring, and electronic certification accessible 24/7 through your EntireCAFM client portal.',
      },
    ],
    capabilities: [
      {
        name: 'SFG20 Planned Maintenance Regimes',
        description: 'Standardised, auditable 52-week maintenance calendars covering all mechanical, electrical, and fabric building elements.',
        tag: 'Statutory Care',
      },
      {
        name: 'Commercial Air Conditioning & Ventilation',
        description: 'Scheduled F-Gas inspections, filter changes, condenser cleaning, and temperature control calibration for offices and industrial workspaces.',
        tag: 'HVAC Servicing',
      },
      {
        name: 'Electrical Testing & Periodic Inspection',
        description: 'Fixed wire testing (EICR), distribution board thermal imaging, portable appliance testing (PAT), and emergency lighting tests.',
        tag: 'Electrical Safety',
      },
      {
        name: 'Plumbing, Drainage & Water Safety',
        description: 'Calorifier inspections, Legionella water temperature logs, pump maintenance, and periodic commercial drainage flushing.',
        tag: 'Plumbing & Water',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'Which West Midlands areas do your Birmingham PPM engineers cover?',
        answer: 'We cover the entire West Midlands conurbation including Birmingham City Centre, Solihull, Sutton Coldfield, West Bromwich, Wolverhampton, Walsall, and Coventry.',
      },
      {
        question: 'How do you ensure Clean Air Zone compliance for Birmingham maintenance visits?',
        answer: 'Our mobile engineering fleet is fully compliant with the Birmingham Clean Air Zone (CAZ) standards, ensuring reliable access to city centre properties with zero access surcharges.',
      },
      {
        question: 'Can you take over existing maintenance contracts without disruption to tenants?',
        answer: 'Yes. We manage smooth contract mobilisations with full TUPE handling where applicable, initial asset surveys, and immediate baseline compliance audits.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'PPM Birmingham', url: '/ppm-birmingham' },
    ],
    relatedRoutes: [
      '/ppm',
      '/locations/birmingham',
      '/locations/birmingham/services',
      '/commercial-cleaning-birmingham',
      '/facilities-management-birmingham',
      '/fm-birmingham',
    ],
    conversionGoal: 'Schedule a Birmingham PPM site survey via birmingham@entirefm.com or 0845 094 8583',
    verificationRequirements: [
      'Midlands regional desk direct routing configured (birmingham@entirefm.com)',
      'SFG20 compliance claims verified',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ============================================================
  // 6. /hvac-manchester
  // ============================================================
  '/hvac-manchester': {
    path: '/hvac-manchester',
    title: 'Commercial HVAC & Air Conditioning Manchester | Chillers & Servicing | EntireFM',
    metaDescription: 'Commercial HVAC contractor in Manchester. VRF/VRV air conditioning servicing, commercial chiller maintenance, F-Gas compliance, and 24/7 emergency response across Greater Manchester.',
    h1: 'Commercial HVAC & Air Conditioning in Manchester',
    eyebrow: 'MANCHESTER COMMERCIAL HVAC · AIR CONDITIONING & CHILLERS',
    heroIntro: 'Complete Commercial Air Conditioning, Chiller Engineering, and Ventilation Solutions for Manchester Businesses.',
    heroDescription: 'EntireFM provides certified commercial HVAC maintenance, installation servicing, and emergency breakdown cover across Greater Manchester. We support office towers, broadcasting studios, retail parks, and manufacturing facilities.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial HVAC contractor Manchester air conditioning chiller maintenance',
    primaryIntent: 'hvac manchester',
    secondaryIntents: [
      'commercial air conditioning manchester',
      'commercial hvac contractor manchester',
      'chiller maintenance manchester',
      'vrf air conditioning manchester',
      'f-gas compliance manchester',
    ],
    pageType: 'geographic-service',
    service: 'Commercial HVAC',
    sector: 'Commercial Offices, Media & Industrial',
    location: 'Manchester',
    historicTopics: [
      'Commercial Air Conditioning Servicing',
      'Chiller Maintenance & Efficiency',
      'VRF/VRV Heat Recovery Systems',
      'F-Gas Statutory Logbooks',
      'AHU Filter & Ventilation Servicing',
      '24/7 North West Breakdown Cover',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'Reliable HVAC Performance for Manchester Workplaces & Media Hubs',
        body: 'Maintaining consistent temperature and fresh air exchange is critical for modern commercial occupiers across Manchester. EntireFM delivers planned servicing and responsive diagnostic care for multi-split air conditioning, VRF systems, and central chilled water plant.',
      },
      {
        heading: 'F-Gas Certified Engineering & Energy Efficiency',
        body: 'Our technicians are fully F-Gas certified and REFCOM-registered. We conduct statutory leak inspections, system pressure checks, and thermal efficiency audits, helping Manchester property owners lower energy consumption and meet decarbonisation targets.',
      },
      {
        heading: '24/7 Emergency Breakdown Cover Across Greater Manchester',
        body: 'A sudden HVAC failure can cause severe disruption to server rooms, office floors, or manufacturing areas. Our North West engineering desk provides 24/7 emergency dispatch with fast response times across the M60 ring road corridor.',
      },
    ],
    capabilities: [
      {
        name: 'VRF & Multi-Split AC Servicing',
        description: 'Routine maintenance, refrigerant leak detection, filter cleaning, and electronic control calibration for commercial air conditioning.',
        tag: 'Air Conditioning',
      },
      {
        name: 'Chillers & Secondary Cooling',
        description: 'Comprehensive mechanical servicing of commercial chillers, condenser coil cleaning, and glycol concentration testing.',
        tag: 'Chiller Care',
      },
      {
        name: 'Ventilation & Air Handling Units',
        description: 'Supply and extract fan maintenance, filter replacements (G4 to HEPA), damper inspections, and airflow volume balancing.',
        tag: 'Ventilation & IAQ',
      },
      {
        name: 'Server Room & Critical Cooling',
        description: 'Specialist close-control air conditioning (CRAC) maintenance for data suites and critical commercial infrastructure.',
        tag: 'Critical Cooling',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'How often should commercial air conditioning systems be serviced in Manchester?',
        answer: 'Standard commercial systems should be serviced at least twice annually (pre-summer cooling and pre-winter heating checks). Systems containing over 5 tonnes CO2 equivalent of refrigerant also require statutory F-Gas leak inspections every 6 to 12 months.',
      },
      {
        question: 'Do you service air conditioning systems in converted mill and warehouse properties in Manchester?',
        answer: 'Yes. We have extensive experience servicing complex retrofitted VRF and exposed ductwork ventilation systems across converted heritage properties in Ancoats, Castlefield, and the Northern Quarter.',
      },
      {
        question: 'What is your emergency response time for HVAC failures in Manchester?',
        answer: 'For contracted commercial clients, our 24/7 helpdesk provides emergency attendance within 2 to 4 hours for critical failures such as server room cooling loss or complete plant failure.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'HVAC Manchester', url: '/hvac-manchester' },
    ],
    relatedRoutes: [
      '/hvac-contractor',
      '/locations/manchester',
      '/locations/manchester/services',
      '/ppm-manchester',
      '/mechanical-electrical-manchester',
      '/facilities-management-manchester',
    ],
    conversionGoal: 'Book a Manchester commercial HVAC inspection via manchester@entirefm.com or 0845 094 8583',
    verificationRequirements: [
      'REFCOM accreditation references verified',
      'North West regional desk direct routing configured',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ============================================================
  // 7. /ppm-leeds
  // ============================================================
  '/ppm-leeds': {
    path: '/ppm-leeds',
    title: 'Planned Preventative Maintenance Leeds | Commercial PPM & SFG20 | EntireFM',
    metaDescription: 'Planned Preventative Maintenance (PPM) contractor in Leeds. SFG20 asset care, HVAC servicing, commercial electrical testing, and building maintenance across West Yorkshire.',
    h1: 'Planned Preventative Maintenance in Leeds',
    eyebrow: 'LEEDS COMMERCIAL PPM · YORKSHIRE ASSET CARE',
    heroIntro: 'Proactive Planned Preventative Maintenance and Statutory Engineering for Leeds Commercial Portfolios.',
    heroDescription: 'EntireFM delivers planned mechanical, electrical, and building fabric maintenance across Leeds. From high-specification financial headquarters in Wellington Place to logistics parks along the Aire Valley corridor.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial PPM contractor Leeds SFG20 planned preventative maintenance',
    primaryIntent: 'ppm leeds',
    secondaryIntents: [
      'planned preventative maintenance leeds',
      'commercial ppm contractor leeds',
      'sfg20 maintenance leeds',
      'commercial property maintenance leeds',
      'm&e ppm leeds',
    ],
    pageType: 'geographic-service',
    service: 'Planned Preventative Maintenance',
    sector: 'Commercial Offices, Legal/Financial & Logistics',
    location: 'Leeds',
    historicTopics: [
      'Wellington Place Commercial Maintenance',
      'SFG20 Asset Maintenance',
      'Commercial Air Conditioning & Heating',
      'West Yorkshire Electrical Testing',
      'Statutory Building Compliance',
      'EntireCAFM Client Portal',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'High-Standard Planned Asset Maintenance for Leeds Property Portfolios',
        body: 'Leeds has developed into one of the UK’s premier legal and professional services hubs. Managing high-value commercial buildings here requires reliable, professional maintenance partners who ensure zero downtime and strict adherence to lease covenants.',
      },
      {
        heading: 'Comprehensive Engineering Scope: Mechanical, Electrical & Fabric',
        body: 'Our planned maintenance contracts integrate routine HVAC servicing, boiler maintenance, electrical fixed wire inspections (EICR), emergency lighting testing, and proactive building fabric checks into one cohesive 52-week calendar.',
      },
      {
        heading: 'Audit-Ready Digital Compliance for Yorkshire Managing Agents',
        body: 'Every service visit is verified electronically with engineer time-stamps, completed task checklists, and statutory certificates stored directly in the EntireCAFM compliance vault, streamlining RICS service charge audits.',
      },
    ],
    capabilities: [
      {
        name: 'SFG20 Maintenance Schedules',
        description: 'Industry-standard planned maintenance task specifications covering all primary mechanical and electrical building assets.',
        tag: 'SFG20 Standards',
      },
      {
        name: 'Commercial HVAC & Air Conditioning',
        description: 'Planned servicing of VRF units, chillers, AHUs, and heating plant to maintain occupant comfort and energy efficiency.',
        tag: 'HVAC Engineering',
      },
      {
        name: 'Electrical Compliance & EICR',
        description: 'Periodic fixed wire testing, thermal imaging of electrical distribution panels, and regular emergency lighting discharge testing.',
        tag: 'Electrical Safety',
      },
      {
        name: 'Water Hygiene & Legionella Compliance',
        description: 'Legionella risk assessment reviews, monthly water temperature monitoring, and routine tank sanitisation in accordance with ACoP L8.',
        tag: 'Water Safety',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'Which areas around Leeds do your PPM engineering teams support?',
        answer: 'We cover central Leeds (Wellington Place, South Bank, Financial Quarter), Thorpe Park, White Rose Office Park, Kirkstall, as well as wider West Yorkshire including Bradford, Wakefield, and Huddersfield.',
      },
      {
        question: 'Can you align PPM visits with our commercial building access restrictions?',
        answer: 'Yes. We frequently arrange early morning, evening, or weekend maintenance visits to avoid disrupting commercial tenants in high-density office environments.',
      },
      {
        question: 'How do you help Leeds commercial properties reduce energy consumption?',
        answer: 'Our PPM visits include HVAC filter changes, sensor calibration, BMS scheduling reviews, and burner tuning—all of which significantly improve plant efficiency and reduce utility costs.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'PPM Leeds', url: '/ppm-leeds' },
    ],
    relatedRoutes: [
      '/ppm',
      '/locations/leeds',
      '/locations/leeds/services',
      '/commercial-cleaning-leeds',
      '/facilities-management-leeds',
      '/fm-leeds',
    ],
    conversionGoal: 'Request a Leeds PPM contract proposal via leeds@entirefm.com or 0845 094 8583',
    verificationRequirements: [
      'Yorkshire regional desk direct routing configured (leeds@entirefm.com)',
      'SFG20 maintenance standards verified',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ============================================================
  // 8. /ppm-sheffield
  // ============================================================
  '/ppm-sheffield': {
    path: '/ppm-sheffield',
    title: 'Planned Preventative Maintenance Sheffield | Industrial & Commercial PPM | EntireFM',
    metaDescription: 'Planned Preventative Maintenance (PPM) contractor in Sheffield. SFG20 asset care, industrial engineering maintenance, commercial HVAC, and electrical compliance in South Yorkshire.',
    h1: 'Planned Preventative Maintenance in Sheffield',
    eyebrow: 'SHEFFIELD COMMERCIAL & INDUSTRIAL PPM · SOUTH YORKSHIRE',
    heroIntro: 'Proactive Planned Preventative Maintenance and Heavy Engineering Support for Sheffield Commercial & Industrial Estates.',
    heroDescription: 'From high-tech manufacturing facilities at the Advanced Manufacturing Park (AMP) to commercial office portfolios in Sheffield city centre, EntireFM delivers robust, certified planned maintenance solutions.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial PPM contractor Sheffield industrial planned maintenance',
    primaryIntent: 'ppm sheffield',
    secondaryIntents: [
      'planned preventative maintenance sheffield',
      'commercial ppm contractor sheffield',
      'industrial maintenance sheffield',
      'sfg20 maintenance sheffield',
      'm&e engineering sheffield',
    ],
    pageType: 'geographic-service',
    service: 'Planned Preventative Maintenance',
    sector: 'Advanced Manufacturing, Industrial & Commercial',
    location: 'Sheffield',
    historicTopics: [
      'Advanced Manufacturing Park (AMP) Maintenance',
      'Industrial Power & LEV Servicing',
      'SFG20 Maintenance Schedules',
      'Commercial Air Conditioning & Heating',
      'South Yorkshire Engineering Fleet',
      'EntireCAFM Compliance Vault',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'Engineered for Sheffield’s Industrial Heritage & Modern Advanced Tech',
        body: 'Sheffield’s commercial landscape is defined by advanced manufacturing, materials research, and dynamic commercial offices. EntireFM delivers planned maintenance designed for high-load industrial power, cleanroom HVAC systems, and commercial building services.',
      },
      {
        heading: 'Preventing Unscheduled Plant Downtime in Production Facilities',
        body: 'In industrial environments, unplanned equipment breakdowns bring operations to an expensive halt. Our scheduled maintenance regimes target motors, drives, compressors, extraction systems, and power distribution boards before faults escalate.',
      },
      {
        heading: 'Complete Digital Assurance for South Yorkshire Facility Leads',
        body: 'Through the EntireCAFM platform, facilities managers gain real-time visibility over statutory compliance percentages, engineer visit reports, asset replacement forecasting, and maintenance spend across all Sheffield sites.',
      },
    ],
    capabilities: [
      {
        name: 'Industrial Power & Three-Phase Distribution',
        description: 'Fixed wire testing, thermographic switchboard surveys, transformer inspections, and power quality monitoring.',
        tag: 'Industrial Electrical',
      },
      {
        name: 'Commercial & Process HVAC Maintenance',
        description: 'Scheduled maintenance for commercial heating, cleanroom ventilation, process chillers, and F-Gas compliance.',
        tag: 'HVAC & Process Cooling',
      },
      {
        name: 'Mechanical Plant & Pumping Systems',
        description: 'Servicing of industrial pumps, compressed air lines, hydraulic lift mechanisms, and water treatment systems.',
        tag: 'Mechanical Systems',
      },
      {
        name: 'Statutory Building Safety & Compliance',
        description: 'Emergency lighting, fire damper testing, Legionella monitoring, and gas safety certification (CP15/CP17).',
        tag: 'Statutory Compliance',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'Do you provide planned maintenance for advanced manufacturing and research facilities in Sheffield?',
        answer: 'Yes. We support facilities at the Advanced Manufacturing Park (AMP), Don Valley, and Shepcote Lane with specialised engineering maintenance covering cleanroom HVAC, high-voltage distribution, and LEV systems.',
      },
      {
        question: 'Which areas of South Yorkshire do your PPM engineers cover?',
        answer: 'Our South Yorkshire desk covers Sheffield, Rotherham, Chesterfield, Doncaster, Barnsley, and the M1 J33–J36 industrial corridors.',
      },
      {
        question: 'Can you combine PPM with specialist high-level cleaning or crane access in Sheffield?',
        answer: 'Yes. EntireFM operates integrated specialist services including high-level industrial cleaning and truck-mounted mobile crane hire across South Yorkshire.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'PPM Sheffield', url: '/ppm-sheffield' },
    ],
    relatedRoutes: [
      '/ppm',
      '/locations/sheffield',
      '/locations/sheffield/services',
      '/commercial-cleaning-sheffield',
      '/industrial-cleaning-sheffield',
      '/facilities-management-sheffield',
    ],
    conversionGoal: 'Enquire for a Sheffield PPM site assessment via sheffield@entirefm.com or 0845 094 8583',
    verificationRequirements: [
      'South Yorkshire regional desk direct routing configured (sheffield@entirefm.com)',
      'Industrial engineering capabilities verified',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ============================================================
  // 9. /commercial-cleaning-liverpool
  // ============================================================
  '/commercial-cleaning-liverpool': {
    path: '/commercial-cleaning-liverpool',
    title: 'Commercial Cleaning Liverpool | Office & Contract Cleaning | EntireFM',
    metaDescription: 'Commercial cleaning contractor in Liverpool. Daily contract office cleaning, corporate janitorial, retail hygiene, and specialist floor care across Liverpool and Merseyside.',
    h1: 'Commercial Cleaning Services in Liverpool',
    eyebrow: 'LIVERPOOL COMMERCIAL CLEANING · CONTRACT & OFFICE HYGIENE',
    heroIntro: 'Professional Commercial Cleaning, Daily Office Janitorial, and Multi-Site Contract Cleaning in Liverpool.',
    heroDescription: 'EntireFM delivers high-standard commercial contract cleaning across Liverpool and Merseyside. We provide vetted cleaning operatives, proactive supervision, and eco-friendly hygiene regimes for corporate offices, retail centres, and public facilities.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial cleaning contractor Liverpool office contract cleaning services',
    primaryIntent: 'commercial cleaning liverpool',
    secondaryIntents: [
      'office cleaning liverpool',
      'contract cleaning liverpool',
      'commercial cleaning company liverpool',
      'corporate janitorial liverpool',
      'commercial cleaners liverpool',
    ],
    pageType: 'geographic-service',
    service: 'Commercial Cleaning',
    sector: 'Commercial Offices, Retail & Professional Services',
    location: 'Liverpool',
    historicTopics: [
      'Liverpool Commercial Office Cleaning',
      'Daily Contract Janitorial Services',
      'COSHH & Risk Assessed Cleaning Regimes',
      'Commercial Floor Care & Carpet Extraction',
      'Washroom Hygiene Management',
      'Merseyside Regional Cleaning Team',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'Pristine Commercial Environments Across Liverpool Commercial Hubs',
        body: 'From professional firms in the Commercial District along Old Hall Street and Castle Street to retail environments around Liverpool ONE and the Royal Albert Dock, EntireFM delivers reliable, high-spec commercial cleaning services tailored to high-footfall commercial spaces.',
      },
      {
        heading: 'Vetted, Trained & Accountable Cleaning Personnel',
        body: 'All EntireFM cleaning operatives are fully vetted, uniformed, and trained in COSHH regulations, colour-coded cross-contamination prevention, and health & safety compliance. Dedicated regional area managers conduct regular quality audits with scored digital checklists.',
      },
      {
        heading: 'Flexible Schedules & Sustainable Cleaning Solutions',
        body: 'We adapt to your business operational hours with early morning, evening, or daytime janitorial cover. We utilise eco-certified cleaning chemicals, microfibre technology, and low-energy machinery to support our clients’ environmental and sustainability targets.',
      },
    ],
    capabilities: [
      {
        name: 'Daily Commercial & Office Cleaning',
        description: 'Comprehensive desk sanitisation, communal area care, vacuuming, waste management, and kitchen deep cleans.',
        tag: 'Office Cleaning',
      },
      {
        name: 'Washroom Hygiene & Replenishment',
        description: 'Scheduled sanitisation, soap and paper consumable restocking, sanitary disposal unit management, and air care.',
        tag: 'Washroom Care',
      },
      {
        name: 'Hard Floor & Carpet Care',
        description: 'Commercial carpet hot-water extraction, vinyl scrubbing and resealing, and high-gloss floor buffering.',
        tag: 'Floor Maintenance',
      },
      {
        name: 'Deep Cleaning & Periodic Sanitisations',
        description: 'End-of-tenancy cleans, touchpoint antimicrobial sanitisation, and periodic commercial kitchen extract cleans.',
        tag: 'Deep Cleaning',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'Which areas of Liverpool and Merseyside does your cleaning team cover?',
        answer: 'We cover the Commercial District (Old Hall St, Castle St), Baltic Triangle, Knowledge Quarter, Liverpool ONE, Speke, Bootle, and Wirral commercial parks.',
      },
      {
        question: 'Do you manage TUPE transfers when switching cleaning contractors in Liverpool?',
        answer: 'Yes. We have comprehensive in-house HR expertise to manage compliant TUPE transfers smoothly, ensuring staff are retained, re-trained, and integrated seamlessly.',
      },
      {
        question: 'Can you provide daytime janitorial attendance in addition to evening cleans?',
        answer: 'Yes. We provide daytime housekeepers and janitors for constant washroom maintenance, meeting room turnarounds, and spill management in active corporate workplaces.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Commercial Cleaning Liverpool', url: '/commercial-cleaning-liverpool' },
    ],
    relatedRoutes: [
      '/cleaning-services',
      '/locations/liverpool',
      '/locations/liverpool/services',
      '/facilities-management-liverpool',
      '/fm-liverpool',
    ],
    conversionGoal: 'Request a Liverpool commercial cleaning quote via liverpool@entirefm.com or 0845 094 8583',
    verificationRequirements: [
      'Merseyside regional desk direct routing configured (liverpool@entirefm.com)',
      'COSHH and health & safety compliance verified',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ============================================================
  // 10. /commercial-cleaning-derby
  // ============================================================
  '/commercial-cleaning-derby': {
    path: '/commercial-cleaning-derby',
    title: 'Commercial Cleaning Derby | Office & Contract Cleaning | EntireFM',
    metaDescription: 'Commercial cleaning contractor in Derby. Contract office cleaning, corporate janitorial, business park hygiene, and industrial office cleaning across Pride Park and Derbyshire.',
    h1: 'Commercial Cleaning Services in Derby',
    eyebrow: 'DERBY COMMERCIAL CLEANING · CONTRACT & WORKPLACE HYGIENE',
    heroIntro: 'Dependable Commercial Office Cleaning, Daily Janitorial Services, and Business Park Hygiene across Derby.',
    heroDescription: 'EntireFM provides high-standard commercial contract cleaning across Derby and Derbyshire. Supporting corporate headquarters in Pride Park, advanced manufacturing offices, and commercial property portfolios with vetted staff and dedicated quality auditing.',
    heroImage: '/branding/EntireFM Branding 001.png',
    historicIntent: 'Commercial cleaning contractor Derby office contract cleaning services',
    primaryIntent: 'commercial cleaning derby',
    secondaryIntents: [
      'office cleaning derby',
      'contract cleaning derby',
      'commercial cleaning company derby',
      'pride park office cleaning',
      'commercial cleaners derby',
    ],
    pageType: 'geographic-service',
    service: 'Commercial Cleaning',
    sector: 'Commercial Offices, Aerospace/Rail Engineering & Business Parks',
    location: 'Derby',
    historicTopics: [
      'Pride Park Commercial Cleaning',
      'Daily Office Cleaning & Janitorial',
      'Industrial Facility Office Hygiene',
      'COSHH Compliant Cleaning Programmes',
      'Commercial Floor Care & Carpet Cleaning',
      'East Midlands Regional Operations',
    ],
    requiredSections: ['hero', 'capabilities', 'body', 'faq', 'cta', 'districts', 'cafm'],
    sections: [
      {
        heading: 'Dedicated Commercial Cleaning for Derby’s Business Parks & Offices',
        body: 'As a major centre for advanced engineering, aerospace, and professional services, Derby businesses require pristine, hygienic workspaces that project corporate excellence. EntireFM delivers tailored cleaning contracts across Pride Park, Infinity Park, and Derby city centre.',
      },
      {
        heading: 'Vetted Personnel & Rigorous Quality Management',
        body: 'Our cleaning teams are rigorously vetted, trained in modern hygiene methodologies, and equipped with industry-grade equipment. Regular site audits by our East Midlands area managers ensure high standards are consistently maintained week after week.',
      },
      {
        heading: 'Complete Cleaning & FM Integration for Derby Facilities',
        body: 'In addition to daily office cleaning, EntireFM can combine industrial floor scrubbing, high-level cleaning, washroom management, and M&E maintenance into one unified agreement, simplifying facilities management for local operations leads.',
      },
    ],
    capabilities: [
      {
        name: 'Daily Office & Workplace Cleaning',
        description: 'Thorough sanitisation of workstations, meeting suites, reception areas, and kitchenettes tailored to your working patterns.',
        tag: 'Office Hygiene',
      },
      {
        name: 'Industrial Facility Admin Cleaning',
        description: 'Specialised cleaning for engineering and manufacturing office annexes, changing facilities, and technical briefing rooms.',
        tag: 'Industrial Offices',
      },
      {
        name: 'Washroom Services & Consumables',
        description: 'Complete washroom servicing, eco-friendly hand wash and paper supply management, and hygienic deep sanitisation.',
        tag: 'Washrooms',
      },
      {
        name: 'Carpet Extraction & Hard Floor Scrubbing',
        description: 'Deep hot-water extraction for commercial carpets and machine scrubbing and buffing for hard flooring.',
        tag: 'Floor Care',
      },
    ],
    assetTypes: [],
    faqs: [
      {
        question: 'Which areas around Derby do you service for commercial cleaning contracts?',
        answer: 'We cover Pride Park, Infinity Park, Derby City Centre, Wyvern Business Park, Raynesway, Belper, and the A38/A50 commercial corridors.',
      },
      {
        question: 'Do you provide weekend or early morning cleaning in Derby?',
        answer: 'Yes. We offer fully flexible cleaning rotas including early mornings before staff arrive (e.g. 05:00–08:00), evening shifts, or weekend deep cleans.',
      },
      {
        question: 'Can you combine daily office cleaning with industrial cleaning in Derby?',
        answer: 'Yes. We frequently deliver comprehensive cleaning contracts that encompass corporate offices alongside factory floor scrubbing, parts stores, and workshop areas.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Commercial Cleaning Derby', url: '/commercial-cleaning-derby' },
    ],
    relatedRoutes: [
      '/cleaning-services',
      '/locations/derby',
      '/locations/derby/services',
      '/industrial-cleaning-derby',
      '/facilities-management-derby',
      '/fm-derby',
    ],
    conversionGoal: 'Request a Pride Park & Derby cleaning proposal via derby@entirefm.com or 0845 094 8583',
    verificationRequirements: [
      'East Midlands regional desk direct routing configured (derby@entirefm.com)',
      'COSHH and health & safety compliance verified',
      'Self-referencing canonical enforced',
    ],
    contentStatus: 'CONTENT_COMPLETE',
  },
};
