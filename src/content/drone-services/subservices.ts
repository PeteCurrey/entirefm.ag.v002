/**
 * CONTENT RECORDS: DRONE SERVICES SUBSERVICES (11 ROUTES)
 * ========================================================
 * High-authority, technically literate records for each specialized aerial service.
 * Includes scope matrices, defect taxonomies, deliverables, EntireFM remediation bridges, and FAQs.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';

export interface DroneSubserviceData {
  heroBadge: string;
  scopeSummary: string;
  inspectScope: Array<{ title: string; desc: string; icon?: string }>;
  typicalApplications: Array<{ title: string; desc: string; sector: string }>;
  whatWeLookFor: Array<{ defect: string; indicator: string; severity: 'Routine' | 'Advisory' | 'Critical' }>;
  deliverables: Array<{ title: string; format: string; desc: string }>;
  remediationBridge: {
    heading: string;
    description: string;
    tradeCapabilities: string[];
    cafmWorkflow: string;
  };
  sampleVisualType: 'roof-annotated' | 'thermal-toggle' | 'facade-zones' | 'solar-thermal' | 'orthomosaic-map' | 'construction-timeline' | 'digital-twin-mesh' | 'volumetric-cutfill' | 'emergency-triage' | 'aerial-media';
}

export const droneSubservicesRecords: Record<string, ContentRecord> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DRONE INSPECTIONS (General Commercial Building Entrypoint)
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/drone-inspections': {
    path: '/services/drone-services/drone-inspections',
    title: 'Commercial Drone Building Inspections | High-Level Surveys | EntireFM',
    metaDescription: 'High-level visual drone inspections for commercial buildings, industrial structures, and inaccessible assets across the UK. Safe, rapid condition reporting.',
    h1: 'Commercial Drone Building & Asset Inspections',
    eyebrow: 'AERIAL VISUAL INSPECTION',
    heroIntro: 'Ultra-high-resolution optical inspections of high-level building fabric, rooftop plant, industrial chimneys, and structural towers without scaffolding, cranes, or MEWPs.',
    heroDescription: 'EntireFM deploys industrial inspection UAVs equipped with high-resolution mechanical zoom optics to capture millimeter-level structural detail. Every flight converts raw aerial visual evidence into structured condition reports and actionable maintenance orders.',
    heroImage: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
    historicIntent: 'Commercial drone building inspection and structural condition surveys UK',
    primaryIntent: 'commercial drone building inspection',
    secondaryIntents: [
      'high level drone inspection',
      'drone building survey contractor',
      'drone plant deck inspection',
      'drone asset condition report',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'High-level visual inspection',
      'Inaccessible asset auditing',
      'Rooftop plant surveys',
      'Structural condition reporting',
      'Actionable defect triage',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'High-Level Visual Audits', description: '4K/8K optical capture of inaccessible structural elements, towers, spires, and high-rise facades.', tag: 'OPTICAL ZOOM' },
      { name: 'Rooftop Plant & Deck Surveys', description: 'Inspection of AHUs, chillers, pipework bridges, louvres, and duct penetrations across complex roofscapes.', tag: 'PLANT ASSETS' },
      { name: 'Structural Anomaly Mapping', description: 'Close-range documentation of spalling masonry, corroded structural steel, loose fixings, and storm impact.', tag: 'STRUCTURAL AUDIT' },
      { name: 'Defect Condition Scoring', description: 'Standardized RAG condition grading categorized by urgency, asset risk, and recommended remediation timeline.', tag: 'CONDITION MATRIX' },
    ],
    faqs: [
      {
        question: 'What types of buildings and structures can be inspected using drones?',
        answer: 'We inspect multi-storey commercial offices, industrial warehouses, logistics hubs, retail parks, hospitals, universities, manufacturing plants, heritage landmarks, communications masts, and structural towers across the UK.',
      },
      {
        question: 'How does optical zoom capability protect building occupants and site safety?',
        answer: 'Our inspection aircraft carry high-powered optical zoom payloads (up to 30x–200x hybrid zoom). This allows our flight crews to inspect fine surface cracks, bolt torques, and sealant joints from a safe standoff distance, eliminating close-proximity propeller downdraft risks and preserving occupant privacy.',
      },
      {
        question: 'What happens once a defect is identified during a drone inspection?',
        answer: 'Every identified defect is logged with precise location coordinates, high-resolution imagery, and a recommended priority rating. As a Total FM provider, EntireFM can immediately quote and coordinate the physical repair—whether via rope access, BMU, or ground engineering—and verify completion through EntireCAFM.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Drone Inspections', url: '/services/drone-services/drone-inspections' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/roof-inspections',
      '/services/drone-services/building-envelope-inspections',
      '/working-at-height-rope-access-bmu',
      '/building-maintenance',
      '/ppm',
    ],
    conversionGoal: 'Request a commercial drone building inspection survey specification and quote.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. ROOF & GUTTER DRONE INSPECTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/roof-inspections': {
    path: '/services/drone-services/roof-inspections',
    title: 'Commercial Roof & Gutter Drone Surveys | Aerial Inspection | EntireFM',
    metaDescription: 'Commercial drone roof surveys and gutter inspections across the UK. Inspect flat roofs, valleys, membrane seams, parapets, and drainage without high-access risks.',
    h1: 'Commercial Roof & Gutter Drone Inspections',
    eyebrow: 'ROOF DRAINAGE & FABRIC AUDIT',
    heroIntro: 'Comprehensive aerial condition surveys for flat roofs, pitched roofscapes, valley gutters, copings, and rainwater goods across commercial property portfolios.',
    heroDescription: 'Water ingress is the single most frequent cause of commercial building fabric damage. EntireFM roof drone surveys inspect every square metre of your roof deck, identifying failed waterproofing membranes, standing water, blocked downpipes, and perished flashings before internal leaks occur.',
    heroImage: '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
    historicIntent: 'Commercial roof drone surveys, gutter inspection and flat roof leak detection',
    primaryIntent: 'drone roof inspection',
    secondaryIntents: [
      'commercial roof drone survey UK',
      'drone gutter inspection',
      'flat roof condition survey drone',
      'roof water ingress drone audit',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Flat roof membrane inspection',
      'Gutter and valley debris audits',
      'Parapet and coping stone condition',
      'Water ingress investigation',
      'Remedial roofing works integration',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Single-Ply & Felt Membrane Audits', description: 'Close visual detection of blistering, tears, seam delamination, punctures, and standing water ponding.', tag: 'FLAT ROOFS' },
      { name: 'Valley Gutters & Downpipes', description: 'Inspection of silt buildup, vegetation growth, joint separation, and corrosion along high-capacity commercial gutters.', tag: 'DRAINAGE' },
      { name: 'Parapets, Flashings & Copings', description: 'Detailed examination of lead dressings, expansion joints, coping mortar degradation, and perimeter upstands.', tag: 'PERIMETER INTEGRITY' },
      { name: 'Roof Penetrations & Skylights', description: 'Auditing seals around HVAC duct penetrations, soil vent pipes, rooflights, safety eye bolts, and plant plinths.', tag: 'PENETRATION SEALS' },
    ],
    faqs: [
      {
        question: 'Can a drone roof survey identify leaks without stepping on fragile roof surfaces?',
        answer: 'Yes. Drones eliminate the severe health and safety risks of walking on fragile asbestos-cement sheets, brittle skylights, or aged corrugated metal. High-resolution zoom cameras and radiometric thermal payloads can pinpoint ponding water, compromised flashings, and saturated insulation without foot traffic.',
      },
      {
        question: 'If a roof defect or blocked gutter is identified, can EntireFM fix it?',
        answer: 'Yes. Unlike standalone survey contractors who only provide photographic reports, EntireFM operates dedicated roofing, drainage, and working-at-height teams. We can immediately clear blocked valley gutters, replace damaged coping seals, patch membrane tears, and provide post-work photographic proof of completion.',
      },
      {
        question: 'How frequently should commercial roofs receive drone inspections?',
        answer: 'We recommend biannual roof drone surveys—ideally in autumn before heavy winter rains and in spring following storm season. High-risk estates with dense surrounding trees or aged membranes benefit from quarterly gutter and drainage sweeps.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Roof & Gutter Inspections', url: '/services/drone-services/roof-inspections' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/building-envelope-inspections',
      '/services/drone-services/thermal-imaging',
      '/building-maintenance',
      '/working-at-height-rope-access-bmu',
      '/ppm',
    ],
    conversionGoal: 'Request a commercial roof and gutter drone survey specification and repair quotation.',
    verificationRequirements: ['Accurate commercial FM roofing scope', 'Cross-links to fabric and rope access'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. FACADE & BUILDING ENVELOPE INSPECTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/building-envelope-inspections': {
    path: '/services/drone-services/building-envelope-inspections',
    title: 'Façade & Building Envelope Drone Inspections | High-Rise Surveys | EntireFM',
    metaDescription: 'Commercial drone façade inspections for cladding, curtain walling, masonry, and high-rise building envelopes. Safe, accurate defect mapping across the UK.',
    h1: 'Façade & Building Envelope Drone Inspections',
    eyebrow: 'EXTERNAL ENVELOPE INTEGRITY',
    heroIntro: 'Systematic vertical envelope surveys covering architectural cladding panels, curtain wall glazing, rain-screen systems, expansion joints, and high-rise masonry.',
    heroDescription: 'Surveying multi-storey facades with suspended cradles or mobile elevated platforms is slow, costly, and causes extensive ground disruption. EntireFM drone envelope surveys capture comprehensive vertical imagery at millimeter resolution, cataloguing panel alignment, mastic seal decay, and spalling risks.',
    heroImage: '/images/editorial/entirefm-hero-headquarters-2560w.webp',
    historicIntent: 'Commercial facade drone inspection, cladding surveys and building envelope defect audits',
    primaryIntent: 'drone facade inspection',
    secondaryIntents: [
      'building envelope drone survey',
      'commercial cladding drone inspection',
      'curtain walling drone survey',
      'high rise facade survey UK',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Cladding and rain-screen surveys',
      'Curtain wall glazing and gasket audits',
      'Mastic expansion joint degradation',
      'Masonry spalling and crack monitoring',
      'Rope access and BMU remediation',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Cladding & Rain-Screen Panels', description: 'Detection of loose composite panels, corroded fixings, distorted trim brackets, and wind-loading deflection.', tag: 'CLADDING SYSTEMS' },
      { name: 'Curtain Walling & Glazing', description: 'Inspection of pressure plates, capping strips, perished EPDM gaskets, broken double-glazed seals, and drainage weep holes.', tag: 'GLAZING CARE' },
      { name: 'Mastic & Sealant Integrity', description: 'Auditing high-level silicone and polyurethane expansion joints for cracking, debonding, and weatherproofing failure.', tag: 'SEALANT JOINTS' },
      { name: 'Masonry & Concrete Spalling', description: 'High-resolution identification of spalling concrete, exposed rebar, efflorescence, structural fractures, and brick ties.', tag: 'MASONRY & CONCRETE' },
    ],
    faqs: [
      {
        question: 'How do you map defects across multi-storey vertical facades?',
        answer: 'We employ systematic vertical column flight grids where every photograph is georeferenced and indexed by elevation (North, South, East, West), floor level, and bay number. This produces an interactive digital façade elevation map where every defect pin links directly to its high-resolution photographic evidence.',
      },
      {
        question: 'Can drone façade surveys replace mandatory tactile physical inspections?',
        answer: 'Drone surveys serve as the ideal first-tier screening tool. They inspect 100% of the elevation rapidly and safely, identifying exact locations that exhibit anomalies. If a close-contact tactile survey or material sampling is required, EntireFM IRATA rope access technicians are dispatched directly to the pinpointed locations.',
      },
      {
        question: 'How do you handle flights in busy city centres or pedestrianized areas?',
        answer: 'Our flight planning includes detailed pedestrian traffic assessments, ground safety marshals, cordon barriers, and out-of-hours scheduling (dawn / weekend flights) to eliminate ground risks in high-density urban environments.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Façade & Building Envelope', url: '/services/drone-services/building-envelope-inspections' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/drone-inspections',
      '/services/drone-services/roof-inspections',
      '/working-at-height-rope-access-bmu',
      '/building-maintenance',
      '/hard-services',
    ],
    conversionGoal: 'Book a commercial building envelope drone inspection and defect appraisal.',
    verificationRequirements: ['Technical facade terminology', 'Cross-links to rope access and BMU'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. THERMAL DRONE SURVEYS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/thermal-imaging': {
    path: '/services/drone-services/thermal-imaging',
    title: 'Commercial Thermal Drone Surveys | Radiometric Heat Loss Audits | EntireFM',
    metaDescription: 'Radiometric thermal drone surveys across the UK. Detect flat roof moisture entrapment, building envelope heat loss, insulation voids, and solar array hotspots.',
    h1: 'Thermal Drone Surveys & Radiometric Heat Loss Audits',
    eyebrow: 'RADIOMETRIC ASSET INTELLIGENCE',
    heroIntro: 'Calibrated aerial thermography for commercial building envelopes, flat roofs, mechanical plant, and electrical distribution infrastructure.',
    heroDescription: 'Thermal radiation reveals critical hidden defects that the human eye and standard cameras cannot see. EntireFM deploys calibrated radiometric FLIR thermal imaging drones to identify wet flat roof insulation, severe building envelope thermal bridging, HVAC heat dissipation, and electrical sub-system anomalies.',
    heroImage: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
    historicIntent: 'Commercial thermal drone surveys, heat loss audits and flat roof moisture detection',
    primaryIntent: 'thermal drone survey',
    secondaryIntents: [
      'drone thermal imaging UK',
      'radiometric roof survey drone',
      'building heat loss drone audit',
      'commercial thermal inspection facilities management',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Radiometric thermal imaging',
      'Flat roof moisture entrapment detection',
      'Building envelope heat loss and insulation voids',
      'HVAC and mechanical thermal signatures',
      'Responsible diagnostic interpretation',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Flat Roof Moisture Entrapment', description: 'Exploiting the higher thermal mass of water to detect wet, saturated insulation beneath intact waterproofing membranes.', tag: 'ROOF MOISTURE' },
      { name: 'Building Envelope Heat Loss', description: 'Quantifying thermal bridging, missing insulation slabs, and air leakage around curtain wall joints and roof interfaces.', tag: 'ENERGY EFFICIENCY' },
      { name: 'Mechanical & Pipework Diagnostics', description: 'Thermal profiling of rooftop steam lines, chilled water risers, condenser banks, and AHU coil performance.', tag: 'HVAC ASSETS' },
      { name: 'Electrical Switchgear & Solar Arrays', description: 'Non-contact temperature measurement identifying overheated busbars, defective PV bypass diodes, and localized cell hotspots.', tag: 'ELECTRICAL INFRASTRUCTURE' },
    ],
    faqs: [
      {
        question: 'How does thermal drone imaging detect water trapped under a flat roof membrane?',
        answer: 'Water has a much higher specific heat capacity than dry insulation material. During sunny or mild daylight, saturated insulation absorbs heat. After sunset as the roof cools, wet zones retain heat significantly longer than dry areas. Radiometric thermal drone cameras flown during this cooling transition clearly capture these warm thermal footprints, accurately outlining moisture pockets.',
      },
      {
        question: 'Does a thermal anomaly alone confirm structural failure?',
        answer: 'No. We operate with strict technical responsibility: thermal imagery identifies temperature differentials (anomalies) that indicate suspected moisture, heat loss, or electrical resistance. EntireFM uses thermal data to pinpoint specific target areas, followed by non-destructive impedance testing, core sampling, or physical electrical investigation before commissioning major capital repairs.',
      },
      {
        question: 'What environmental conditions are required for an accurate thermal drone survey?',
        answer: 'Surveys require dry roof and wall surfaces (no surface rainwater), low wind speeds (<15 knots), and a sufficient indoor-to-outdoor temperature differential (minimum Delta-T of 10°C for building envelope heat loss). For roof moisture surveys, flights are conducted at dusk or night following daytime solar loading.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Thermal Drone Surveys', url: '/services/drone-services/thermal-imaging' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/roof-inspections',
      '/services/drone-services/solar-pv-inspections',
      '/hvac-contractor',
      '/mechanical-electrical',
      '/compliance',
    ],
    conversionGoal: 'Schedule an aerial radiometric thermal survey and heat loss evaluation.',
    verificationRequirements: ['Responsible technical wording', 'No exaggerated claims of definitive single-source diagnosis'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. SOLAR PV INSPECTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/solar-pv-inspections': {
    path: '/services/drone-services/solar-pv-inspections',
    title: 'Commercial Solar PV Drone Inspections | Thermal Anomaly Audits | EntireFM',
    metaDescription: 'Commercial rooftop and ground-mount solar PV drone inspections across the UK. Thermographic hotspot detection, string fault tracing, and yield optimization.',
    h1: 'Commercial Solar PV Aerial Drone Inspections',
    eyebrow: 'RENEWABLE ASSET PERFORMANCE',
    heroIntro: 'Automated radiometric thermal and high-resolution optical surveys for commercial rooftop and utility-scale solar photovoltaic arrays.',
    heroDescription: 'Degraded solar modules and undetected electrical faults reduce solar generation yields and present severe fire risks. EntireFM drone inspections scan thousands of panels per hour, combining high-resolution visual defect detection with calibrated infrared thermography to identify hotspots, cracked cells, soiling, and string disconnects.',
    heroImage: '/images/editorial/entirefm-ev-charging-2000w.webp',
    historicIntent: 'Commercial solar panel drone inspection, thermographic PV survey and yield auditing',
    primaryIntent: 'solar panel drone inspection',
    secondaryIntents: [
      'commercial solar PV drone survey UK',
      'thermographic solar inspection',
      'solar array hotspot detection drone',
      'PV string performance drone audit',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Solar array thermography',
      'Hotspot and bypass diode fault detection',
      'Optical panel damage and soiling',
      'IEC 62446-3 thermographic standards',
      'Electrical remediation and inverter servicing',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Radiometric Hotspot Detection', description: 'Thermal identification of localized cell hotspots, PID degradation, and internal semiconductor short circuits.', tag: 'HOTSPOT AUDIT' },
      { name: 'Bypass Diode & Sub-String Faults', description: 'Detection of failed bypass diodes causing one-third, two-thirds, or full module de-energization.', tag: 'STRING TRACING' },
      { name: 'Physical Damage & Microcracks', description: 'High-resolution visual mapping of hail impact, snail trail delamination, burn marks, and shattered glass.', tag: 'OPTICAL INSPECTION' },
      { name: 'Soiling, Shading & Vegetation', description: 'Quantifying dirt accumulation, bird droppings, and vegetation encroachment degrading generation yield.', tag: 'YIELD OPTIMIZATION' },
    ],
    faqs: [
      {
        question: 'How quickly can a drone survey a large commercial solar rooftop?',
        answer: 'A drone can inspect up to 5,000–10,000 solar panels (several megawatts of capacity) in a single day, compared to manual handheld thermal imaging which can take weeks of hazardous roof walking.',
      },
      {
        question: 'Are your solar PV thermal inspections compliant with international standards?',
        answer: 'Yes. Our flight profiles and thermographic reporting adhere to IEC TS 62446-3 standards for outdoor infrared thermography of photovoltaic modules, ensuring irradiance levels exceed 600 W/m² for valid radiometric comparisons.',
      },
      {
        question: 'Can EntireFM replace defective modules and rectify electrical string faults?',
        answer: 'Yes. Our in-house commercial electrical engineers and NICEIC-approved teams can isolate DC arrays, replace defective bypass diodes and modules, clean soiled arrays, and recommission systems for maximum energy yield.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Solar PV Inspections', url: '/services/drone-services/solar-pv-inspections' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/thermal-imaging',
      '/services/drone-services/roof-inspections',
      '/mechanical-electrical',
      '/ppm',
      '/hard-services',
    ],
    conversionGoal: 'Request a commercial solar PV drone inspection and generation yield assessment.',
    verificationRequirements: ['Adherence to IEC 62446-3 principles', 'Cross-links to electrical and PPM'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. SURVEYING & MAPPING
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/surveying-mapping': {
    path: '/services/drone-services/surveying-mapping',
    title: 'Commercial Drone Surveying & Mapping | 2D Orthomosaics & GIS | EntireFM',
    metaDescription: 'High-accuracy aerial surveying, photogrammetry, 2D orthomosaic mapping, and topographic surface modeling for commercial estates, construction, and infrastructure.',
    h1: 'Drone Surveying, Photogrammetry & Orthomosaic Mapping',
    eyebrow: 'GEOSPATIAL ASSET INTELLIGENCE',
    heroIntro: 'Precision aerial photogrammetry delivering georeferenced orthomosaic maps, digital elevation models (DEM), and CAD/GIS data layers across complex estates.',
    heroDescription: 'From estate masterplanning and boundary validation to civil infrastructure and drainage topography, EntireFM delivers survey-grade aerial geospatial outputs. Utilizing RTK/PPK GNSS positioning and ground control points (GCPs), we provide millimeter-calibrated data ready for CAD, GIS, and engineering workflows.',
    heroImage: '/images/editorial/entirefm-totem-headquarters-2000w.webp',
    historicIntent: 'Commercial drone surveying, photogrammetry mapping, topographic DEMs and orthomosaics',
    primaryIntent: 'drone surveying and mapping',
    secondaryIntents: [
      'commercial drone photogrammetry UK',
      'aerial orthomosaic survey',
      'topographic drone survey estate',
      'CAD GIS drone mapping contractor',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      '2D georeferenced orthomosaics',
      'Photogrammetry and digital elevation models',
      'RTK and ground control point workflows',
      'CAD and GIS compatibility',
      'Realistic accuracy parameters',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'High-Resolution 2D Orthomosaics', description: 'Georeferenced, distortion-free composite aerial maps with sub-centimetre ground sampling distance (GSD).', tag: 'ORTHOMOSAICS' },
      { name: 'Digital Surface & Elevation Models', description: 'DSM and DTM elevation rasters for drainage slope profiling, flood risk modeling, and terrain analysis.', tag: 'ELEVATION DATA' },
      { name: 'CAD & GIS Vector Integration', description: 'Export directly to DXF, DWG, SHP, GeoJSON, and LandXML for civil engineers, architects, and estate planners.', tag: 'CAD / GIS EXPORTS' },
      { name: 'Boundary & Estate As-Built Records', description: 'Verified spatial documentation of site layouts, access roads, boundary fencing, and utility corridors.', tag: 'ESTATE AS-BUILTS' },
    ],
    faqs: [
      {
        question: 'What level of positional accuracy can drone surveying achieve?',
        answer: 'Positional accuracy depends on survey methodology, equipment, and site conditions. When utilizing on-board Real-Time Kinematic (RTK) positioning integrated with surveyed Ground Control Points (GCPs), horizontal and vertical accuracies of 10–25mm are achievable. For non-geodetic planning and visual mapping, standard GNSS provides 1–2m absolute spatial alignment.',
      },
      {
        question: 'In what file formats do you deliver survey datasets?',
        answer: 'We deliver industry-standard geospatial formats including GeoTIFF and ECW (orthomosaics), LAS and LAZ (dense point clouds), DXF and DWG (contours and CAD vectors), GeoJSON and SHP (GIS shapefiles), and high-resolution PDF site map sheets.',
      },
      {
        question: 'Can drone mapping data be integrated into client GIS or CAFM software?',
        answer: 'Yes. Orthomosaics and spatial vector layers can be ingested into ArcGIS, QGIS, Autodesk Civil 3D, and digital asset management systems including EntireCAFM to maintain verified spatial site baselines.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Surveying & Mapping', url: '/services/drone-services/surveying-mapping' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/digital-twin-3d-capture',
      '/services/drone-services/volumetric-surveys',
      '/services/drone-services/construction-monitoring',
      '/building-maintenance',
      '/hard-services',
    ],
    conversionGoal: 'Request an aerial photogrammetry survey specification and quote.',
    verificationRequirements: ['Responsible accuracy statements', 'No blanket survey-grade guarantees without GCP/RTK context'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. CONSTRUCTION PROGRESS MONITORING
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/construction-monitoring': {
    path: '/services/drone-services/construction-monitoring',
    title: 'Construction Progress Drone Monitoring | Milestone Tracking | EntireFM',
    metaDescription: 'Scheduled repeat drone capture for UK construction and development sites. Repeat camera angles, orthomosaic tracking, dispute protection, and stakeholder reporting.',
    h1: 'Construction Progress Drone Monitoring & Milestone Tracking',
    eyebrow: 'DEVELOPMENT & PROJECT INTELLIGENCE',
    heroIntro: 'Automated, scheduled repeat aerial photography, orthomosaics, and 3D scans tracking construction milestones from groundworks to handover.',
    heroDescription: 'Manage construction risk, verify subcontractor milestones, and provide indisputable progress records for investors, clients, and project directors. EntireFM provides weekly, fortnightly, or monthly drone flights utilizing precise repeatable camera waypoints for exact chronological comparison.',
    heroImage: '/images/editorial/entirefm-site-arrival-2000w.webp',
    historicIntent: 'Construction progress drone monitoring, scheduled development photography and dispute evidence',
    primaryIntent: 'drone construction monitoring',
    secondaryIntents: [
      'construction drone survey UK',
      'repeat aerial progress photography',
      'site development drone monitoring',
      'construction milestone drone reporting',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Scheduled recurring flight capture',
      'Repeat waypoint camera angles',
      'Orthomosaic overlay comparisons',
      'Stakeholder progress reports',
      'EntireFM Projects integration',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Repeat Waypoint Photography', description: 'Automated GPS-locked flight paths ensuring exact frame-matched photography across every construction phase.', tag: 'TIME-SERIES CAPTURE' },
      { name: 'Periodic Orthomosaic Overlays', description: 'Layering current site orthomosaics directly over architectural masterplans and previous monthly baselines.', tag: 'PLAN COMPARISON' },
      { name: 'Groundworks & Earthworks Tracking', description: 'Monitoring excavation progress, foundation pours, drainage installation, and material movements.', tag: 'EARTHWORKS' },
      { name: 'Dispute Mitigation & Handover Proof', description: 'Indisputable timestamped visual archives protecting main contractors and developers against delay claims.', tag: 'GOVERNANCE' },
    ],
    faqs: [
      {
        question: 'How do you ensure photography matches exact angles across different months?',
        answer: 'We utilize automated waypoint mission software that locks flight coordinates, drone altitude, gimbal pitch, and camera focal length. Every flight executes the exact same spatial path, producing perfectly aligned time-lapse comparisons.',
      },
      {
        question: 'How is construction monitoring packaged—per flight or on retainer?',
        answer: 'We offer structured monthly monitoring retainer packages (e.g. fortnightly or monthly flights) tailored to project duration, with dedicated cloud reporting portal access and rapid 24–48 hour turnaround on deliverables.',
      },
      {
        question: 'Can monitoring data assist with site logistics and health & safety compliance?',
        answer: 'Yes. High-resolution orthomosaic overviews enable site managers to audit traffic routing, material storage footprints, PPE compliance zones, perimeter hoarding integrity, and environmental silt runoff.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Construction Monitoring', url: '/services/drone-services/construction-monitoring' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/surveying-mapping',
      '/services/drone-services/volumetric-surveys',
      '/building-maintenance',
      '/hard-services',
      '/compliance',
    ],
    conversionGoal: 'Set up a recurring construction progress monitoring programme.',
    verificationRequirements: ['Clear retainer positioning', 'No fake case studies'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. EMERGENCY & INSURANCE DRONE SURVEYS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/emergency-insurance-surveys': {
    path: '/services/drone-services/emergency-insurance-surveys',
    title: 'Emergency & Insurance Drone Surveys | Rapid Damage Assessment | EntireFM',
    metaDescription: 'Rapid aerial drone surveys for storm damage, roof failures, fires, and insurance loss adjusters across the UK. Safe evidence capture and fast remediation scoping.',
    h1: 'Emergency & Insurance Loss Drone Surveys',
    eyebrow: 'INCIDENT RESPONSE & LOSS ADJUSTING',
    heroIntro: 'Rapid aerial assessment and evidentiary visual capture following severe storms, structural failures, fire incidents, or high-level impact damage.',
    heroDescription: 'Following a structural incident, entering an unstable building or walking a storm-damaged roof is unsafe. EntireFM deploys commercial inspection drones to safely survey dangerous structures, record geotagged high-resolution insurance claim evidence, and formulate an immediate physical remediation plan.',
    heroImage: '/images/editorial/entirefm-manchester-castlefield-night-2560w.webp',
    historicIntent: 'Emergency drone surveys, storm damage roof inspection and insurance claim loss adjustment evidence',
    primaryIntent: 'emergency drone survey',
    secondaryIntents: [
      'storm damage drone roof survey',
      'insurance claim drone inspection UK',
      'urgent building damage survey drone',
      'fire damage structural drone survey',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Rapid storm damage visual capture',
      'Unsafe structure inspection',
      'Insurance claim loss adjuster evidence',
      'Emergency remediation scoping',
      'Incident-to-remediation workflow',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Storm Damage Assessment', description: 'Rapid identification of dislodged roof sheets, shattered glazing, fallen parapets, and compromised gutters.', tag: 'STORM RESPONSE' },
      { name: 'Unstable Structure Triage', description: 'Safe visual access into fire-damaged properties, partial collapse zones, and structurally compromised plant rooms.', tag: 'SAFETY TRIAGE' },
      { name: 'Loss Adjuster Evidence Packs', description: 'Comprehensive georeferenced photographic and video records formatted specifically for commercial insurers.', tag: 'INSURANCE PROOF' },
      { name: 'Immediate Remediation Scoping', description: 'Converting damage findings directly into urgent weatherproofing, temporary propping, and permanent repair quotes.', tag: 'MAKE-SAFE WORKS' },
    ],
    faqs: [
      {
        question: 'How quickly can EntireFM mobilize for an emergency storm damage inspection?',
        answer: 'We prioritize urgent incident response across our regional operational hubs. Mobilisation depends on current weather conditions, local airspace authorizations, and on-site flight safety parameters, with standard emergency attendance within 24–48 hours once safe flying conditions permit.',
      },
      {
        question: 'Are drone survey reports accepted by major UK commercial insurance loss adjusters?',
        answer: 'Yes. Our reports include high-resolution metadata-tagged imagery, exact timestamps, GPS coordinates, wide-angle context shots, and close-up damage details that fully satisfy insurer and loss adjuster evidentiary standards.',
      },
      {
        question: 'Can EntireFM carry out the required make-safe and permanent repairs?',
        answer: 'Yes. EntireFM operates a 24/7 reactive maintenance desk and dedicated trade teams. We provide immediate emergency make-safe works (tarpaulin installation, board-up, loose debris removal) followed by full permanent structural repair.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Emergency & Insurance Surveys', url: '/services/drone-services/emergency-insurance-surveys' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/roof-inspections',
      '/services/drone-services/drone-inspections',
      '/building-maintenance',
      '/working-at-height-rope-access-bmu',
      '/contact-us',
    ],
    conversionGoal: 'Request urgent emergency drone assessment and insurance loss survey.',
    verificationRequirements: ['Responsible mobilisation wording', 'Cross-links to 24/7 reactive and building fabric'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. DIGITAL TWIN & 3D REALITY CAPTURE
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/digital-twin-3d-capture': {
    path: '/services/drone-services/digital-twin-3d-capture',
    title: 'Digital Twin & 3D Reality Capture | Photogrammetric Asset Models | EntireFM',
    metaDescription: 'Photogrammetric 3D reality capture and digital twins for commercial buildings and estates across the UK. Millimeter-level 3D point clouds and interactive models.',
    h1: 'Digital Twin & 3D Reality Capture for Commercial Assets',
    eyebrow: 'SPATIAL ASSET INTELLIGENCE',
    heroIntro: 'High-detail photogrammetric 3D mesh models, dense point clouds, and interactive digital twins providing an enduring spatial record of commercial properties.',
    heroDescription: 'A digital twin provides facilities managers, asset owners, and design teams with a persistent, measurable 3D representation of an entire building and surrounding site. EntireFM captures millions of photogrammetric data points to create interactive models that support remote inspection, space planning, and refurbishment.',
    heroImage: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    historicIntent: 'Digital twin 3D capture, photogrammetric reality mesh and point cloud building modeling',
    primaryIntent: 'digital twin drone capture',
    secondaryIntents: [
      '3D building reality capture UK',
      'drone point cloud survey',
      'photogrammetry 3D model commercial building',
      'digital twin facilities management',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Photogrammetric 3D mesh modeling',
      'Dense point cloud generation',
      'Persistent visual asset baseline',
      'Remote stakeholder inspection',
      'BIM and CAD interoperability',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Photogrammetric Reality Meshes', description: 'Textured 3D triangular surface meshes with photo-realistic resolution for visual inspection and marketing.', tag: 'REALITY MESH' },
      { name: 'Dense LiDAR & Optical Point Clouds', description: 'Millions of georeferenced spatial points (LAS/LAZ) suitable for CAD modeling, clash detection, and BIM authoring.', tag: 'POINT CLOUDS' },
      { name: 'Web-Based 3D Model Viewers', description: 'Browser-based interactive portals allowing asset managers to measure heights, distances, and areas from their desks.', tag: 'VIRTUAL INSPECTION' },
      { name: 'Historic Visual Baseline', description: 'Persistent 3D asset snapshots preserved in EntireCAFM for dilapidation claims and long-term capital planning.', tag: 'ASSET BASELINES' },
    ],
    faqs: [
      {
        question: 'What is the practical business benefit of a 3D digital twin for facilities management?',
        answer: 'Digital twins allow facilities directors, insurers, and engineers to inspect complex roofs, facades, and plant decks remotely without travelling to site or hiring access equipment. Precise virtual measurements (distances, areas, volumes) can be taken directly within the browser, dramatically streamlining contractor scoping and tender packages.',
      },
      {
        question: 'Can digital twin 3D models be imported into Autodesk Revit or BIM systems?',
        answer: 'Yes. We export dense georeferenced point clouds in LAS, LAZ, RCP, and E57 formats that import directly into Revit, AutoCAD, Navisworks, ArchiCAD, and BIM 360 environments as accurate as-built references.',
      },
      {
        question: 'How do you protect data security and building confidentiality?',
        answer: 'All visual datasets and 3D point cloud assets are processed and stored on secure, encrypted UK/EU servers in compliance with UK GDPR and strict client NDA covenants.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Digital Twin & 3D Capture', url: '/services/drone-services/digital-twin-3d-capture' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/surveying-mapping',
      '/services/drone-services/building-envelope-inspections',
      '/building-maintenance',
      '/client-portal/site-360',
      '/hard-services',
    ],
    conversionGoal: 'Commission a 3D digital twin reality capture project for your estate.',
    verificationRequirements: ['Responsible technology positioning', 'Clear operational business value'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. VOLUMETRIC SURVEYS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/volumetric-surveys': {
    path: '/services/drone-services/volumetric-surveys',
    title: 'Commercial Volumetric Drone Surveys | Stockpile & Cut/Fill Calculations | EntireFM',
    metaDescription: 'Accurate aerial volumetric surveys for material stockpiles, aggregates, earthworks, and quarries across the UK. Safe, fast, and repeatable measurement.',
    h1: 'Volumetric Drone Surveys & Stockpile Calculations',
    eyebrow: 'MATERIAL & EARTHWORKS QUANTIFICATION',
    heroIntro: 'Fast, safe, and precise 3D volumetric measurement of aggregate stockpiles, bulk materials, landfill capacities, and earthworks cut/fill balances.',
    heroDescription: 'Manual stockpile auditing using walking GPS poles is dangerous, slow, and mathematically imprecise. EntireFM drone volumetric surveys scan entire bulk storage yards and earthworks sites in minutes, computing exact cubic meter volumes and cut/fill differentials with verified mathematical precision.',
    heroImage: '/images/editorial/entirefm-industrial-unit-1600w.webp',
    historicIntent: 'Volumetric drone surveys, stockpile measurement and cut fill earthwork calculations',
    primaryIntent: 'drone volumetric survey',
    secondaryIntents: [
      'stockpile measurement drone UK',
      'cut and fill drone survey',
      'aggregate volume calculation drone',
      'quarry earthworks drone surveying',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Stockpile volume calculation',
      'Cut and fill earthworks analysis',
      'High-precision surface mesh generation',
      'Quarry and bulk logistics audits',
      'Financial inventory valuation',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Aggregate & Material Stockpiles', description: 'Precise volume computation (m³) of gravel, sand, asphalt, biomass, scrap metals, and mineral stockpiles.', tag: 'STOCKPILE AUDITING' },
      { name: 'Earthworks Cut / Fill Balances', description: 'Comparing pre- and post-excavation surface meshes to calculate exact net earthwork movement volumes.', tag: 'CUT / FILL ANALYSIS' },
      { name: 'Quarry & Landfill Void Capacity', description: 'Measuring remaining void space, extraction rates, and bench stability across heavy industrial sites.', tag: 'VOID MEASUREMENT' },
      { name: 'Inventory & Financial Reconciliation', description: 'Providing certified volumetric survey reports for financial auditing, asset valuation, and stock control.', tag: 'AUDIT COMPLIANCE' },
    ],
    faqs: [
      {
        question: 'How does drone volumetric measurement calculate irregular stockpile shapes?',
        answer: 'Drones capture thousands of overlapping photographs from multiple angles. Photogrammetry software generates a continuous 3D digital surface mesh (DSM) matching every contour, slope, and crest of the pile. The software then integrates the volume between the custom base plane and the top surface mesh, providing far higher precision than manual geometric estimations.',
      },
      {
        question: 'How accurate are drone volumetric calculations?',
        answer: 'When deployed with ground control points (GCPs) or RTK GNSS, volumetric accuracy is typically within 1–3% of actual volume, far surpassing manual surveyor rod measurements while keeping operators completely off hazardous shifting stockpiles.',
      },
      {
        question: 'Can you convert volume measurements into total material tonnage?',
        answer: 'Yes. By inputting material bulk density metrics (e.g. tonnes per cubic metre for crushed limestone, sand, or topsoil), our reports provide both gross volume (m³) and computed total tonnage for inventory balance sheets.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Volumetric Surveys', url: '/services/drone-services/volumetric-surveys' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/surveying-mapping',
      '/services/drone-services/construction-monitoring',
      '/building-maintenance',
      '/hard-services',
    ],
    conversionGoal: 'Request a commercial stockpile or earthworks volumetric drone survey quote.',
    verificationRequirements: ['Credible engineering and surveying calculations', 'No unrealistic density assumptions'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. AERIAL PHOTOGRAPHY & VIDEO
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/aerial-photography-video': {
    path: '/services/drone-services/aerial-photography-video',
    title: 'Commercial Aerial Photography & Drone Video | Property & Estates | EntireFM',
    metaDescription: 'High-end commercial aerial photography and 4K/6K drone videography for property managers, corporate estates, completed projects, and investor reporting.',
    h1: 'Commercial Aerial Photography & Drone Videography',
    eyebrow: 'ESTATE MEDIA & MARKETING ASSETS',
    heroIntro: 'Cinematic 4K/6K aerial photography and video showcasing commercial property developments, logistics parks, corporate headquarters, and completed FM projects.',
    heroDescription: 'Support your property marketing, investor updates, ESG reports, and annual stakeholder presentations with stunning, professional aerial media. EntireFM combines artistic composition with commercial aviation discipline, operating safely in complex airspaces across the UK.',
    heroImage: '/images/editorial/entirefm-london-aerial-poster-2560w.webp',
    historicIntent: 'Commercial aerial photography, drone video production and property marketing media',
    primaryIntent: 'commercial aerial photography',
    secondaryIntents: [
      'drone video commercial property UK',
      'aerial estate marketing photography',
      'corporate headquarters drone video',
      'construction handover aerial photography',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Commercial property marketing photography',
      '4K / 6K cinematic drone videography',
      'Investor and stakeholder reporting media',
      'Completed project portfolio showcases',
      'Safe urban flight operations',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: '4K / 6K Cinematic Drone Video', description: 'Smooth, broadcast-quality stabilised video footage capturing architectural grandeur and surrounding transport links.', tag: 'CINEMATIC VIDEO' },
      { name: 'Ultra-High-Res Stills Photography', description: '48MP/100MP RAW photographic suites captured during golden hour and blue hour for brochures and websites.', tag: 'PRINT & DIGITAL' },
      { name: 'Completed Project Showcases', description: 'Documenting major FM refurbishments, M&E plant installations, and solar panel upgrades for case studies.', tag: 'PROJECT HANDOVER' },
      { name: 'Estate Context & Masterplanning', description: 'Wide-angle landscape captures highlighting highway access, neighbouring commercial hubs, and green spaces.', tag: 'ESTATE PROFILES' },
    ],
    faqs: [
      {
        question: 'What image and video quality can we expect from your commercial flights?',
        answer: 'We capture ultra-high-resolution RAW photographic stills (up to 48–100 megapixels) and 4K/6K ProRes or D-Log video with high dynamic range, colour-graded and ready for high-resolution print, web, and corporate video production.',
      },
      {
        question: 'Do you provide raw footage or fully edited promotional videos?',
        answer: 'We offer flexible deliverables: we can supply uncompressed raw media directly to your marketing agency, or provide fully edited, colour-graded showcase videos complete with licensed music, motion graphics, and corporate branding.',
      },
      {
        question: 'Can you fly in restricted airspace near airports or city centres for property marketing?',
        answer: 'Yes. We coordinate with local Air Traffic Control (ATC), submit Non-Standard Flight (NSF) applications through NATS/Airspace, and obtain required Flight Restriction Zone (FRZ) permissions for commercial property shoots in controlled airspace.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'Aerial Photography & Video', url: '/services/drone-services/aerial-photography-video' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/construction-monitoring',
      '/services/drone-services/digital-twin-3d-capture',
      '/about-entire-facilities-management',
      '/case-studies',
      '/contact-us',
    ],
    conversionGoal: 'Book commercial aerial photography and drone videography for your property.',
    verificationRequirements: ['Artistic yet operationally grounded tone', 'Cross-links to case studies and corporate pages'],
    contentStatus: 'CONTENT_COMPLETE',
  },
};
