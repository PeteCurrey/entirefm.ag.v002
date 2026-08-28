/**
 * CONTENT RECORDS: DRONE SERVICES SUBSERVICES (11 ROUTES)
 * ========================================================
 * High-authority, technically literate records for each specialized aerial service.
 * Includes scope matrices, defect taxonomies, deliverables, EntireFM remediation bridges, and bespoke FAQs.
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
        question: 'What types of commercial buildings can be inspected by drone?',
        answer: 'EntireFM inspects a comprehensive spectrum of commercial property across the UK, including multi-storey office towers, distribution centers, logistics hubs, retail parks, manufacturing facilities, hospitals, and educational campuses. Inaccessible architectural spires, high-level plant decks, and industrial stacks are surveyed with zero operational downtime.',
      },
      {
        question: 'What defects can a visual drone inspection identify?',
        answer: 'Our high-resolution optical and zoom sensors identify concrete spalling, loose cladding fixings, failed curtain wall gaskets, perished roof membranes, gutter blockages, cracked lead flashing, lightning conductor detachment, and rooftop HVAC plant corrosion with millimeter-level clarity.',
      },
      {
        question: 'Can drone surveys replace scaffolding or MEWP access?',
        answer: 'Drone inspections replace the need for costly scaffolding or powered access during the diagnostic and appraisal stages. If physical repairs are subsequently required, drone data provides exact spatial coordinates so rope access technicians or cradles can be deployed directly to the defect location, minimizing total access expenditure.',
      },
      {
        question: 'What deliverables does the client receive after an inspection?',
        answer: 'Clients receive a structured, surveyor-annotated PDF inspection report featuring defect severity grading (RAG scoring), high-resolution geotagged stills, and direct import links into EntireCAFM to track maintenance work orders.',
      },
      {
        question: 'What happens if the survey identifies a critical defect?',
        answer: 'When a high-risk structural or weatherproofing failure is discovered, our flight team immediately alerts your facilities manager. As a Total FM provider, EntireFM can quickly formulate a repair scope, dispatch self-delivered trade teams, and verify completion within EntireCAFM.',
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
    title: 'Commercial Roof & Gutter Drone Inspections | EntireFM',
    metaDescription: 'Specialist commercial roof surveys and gutter condition audits via drone. Identify leaks, ponding, single-ply tears, and drainage blockages without scaffolding.',
    h1: 'Commercial Roof & Gutter Drone Surveys',
    eyebrow: 'WATERPROOFING & DRAINAGE AUDITS',
    heroIntro: 'Detailed aerial condition surveys of commercial flat roofs, industrial profile metal decking, internal valley gutters, and rooftop plant decks across the UK.',
    heroDescription: 'Commercial roofs and rainwater systems degrade silently. EntireFM provides safe, rapid aerial condition appraisals that locate split seams, failed flashings, and saturated valley gutters before internal water ingress disrupts business operations.',
    heroImage: '/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp',
    historicIntent: 'Commercial roof drone surveys and gutter inspection UK',
    primaryIntent: 'commercial roof drone inspection',
    secondaryIntents: [
      'drone roof survey contractor',
      'industrial gutter drone inspection',
      'flat roof leak detection drone',
      'commercial valley gutter survey',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Commercial flat roof inspection',
      'Valley gutter condition audits',
      'Single-ply membrane seam checks',
      'Parapet coping and flashing review',
      'Direct roofing repair mobilization',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Membrane & Seam Integrity', description: 'Auditing single-ply, felt, liquid, and asphalt roofs for blisters, tears, delamination, and lap joint failure.', tag: 'MEMBRANE AUDIT' },
      { name: 'Valley Gutter & Drainage Mapping', description: 'Inspecting internal valleys, parapet gutters, and rainwater sumps for standing silt, rust, and blockages.', tag: 'DRAINAGE AUDIT' },
      { name: 'Flashings & Penetration Checks', description: 'Close inspection of lead flashings, upstands, soil vent pipes, rooflights, and HVAC plant penetrations.', tag: 'PENETRATIONS' },
      { name: 'Orthomosaic Roof Mapping', description: 'Generating high-resolution composite 2D maps of complete roofscapes for spatial repair planning.', tag: '2D ORTHOMOSAIC' },
    ],
    faqs: [
      {
        question: 'Can flat and pitched commercial roofs both be surveyed?',
        answer: 'Yes. Our flight operations cover all commercial flat roof systems (single-ply membranes, felt, mastic asphalt, liquid-applied coatings) as well as pitched profile metal decking, standing seam roofs, and fragile asbestos-cement structures that cannot be walked on safely.',
      },
      {
        question: 'Can drones inspect internal valley gutters and roof drainage?',
        answer: 'Yes. Multi-angle drone cameras fly directly alongside internal valley gutters, parapet troughs, and rainwater sumps to inspect for silt accumulation, standing water ponding, corrosion, and blockages without requiring dangerous roof edge access.',
      },
      {
        question: 'Can roof defects be identified without erecting scaffolding?',
        answer: 'Yes. High-resolution optical sensors and calibrated digital zoom capture fine lap-seam tears, punctured membranes, and cracked lead dressings from a safe flight envelope, eliminating the disruption and expense of perimeter scaffolding.',
      },
      {
        question: 'Can the survey identify active waterproofing breaches?',
        answer: 'Visual surveys identify physical breaches, split seams, and degraded flashings. When combined with radiometric thermal imaging, we can also map sub-membrane moisture saturation where water has seeped into insulation cores beneath the surface.',
      },
      {
        question: 'What survey outputs are provided?',
        answer: 'Deliverables include a high-resolution 2D orthomosaic map of the entire roof deck, categorized photo defect schedules, and a prioritized remedial schedule with fixed pricing for EntireFM in-house roofing repairs.',
      },
      {
        question: 'Can EntireFM complete the identified roof repairs?',
        answer: 'Yes. EntireFM operates dedicated commercial roofing divisions. Our qualified roofers execute single-ply heat-welding, liquid coating patch repairs, gutter vacuum clearance, and lead replacement, with all work certified in EntireCAFM.',
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
      '/services/drone-services/drone-inspections',
      '/services/drone-services/thermal-imaging',
      '/roofing-repairs',
      '/gutter-cleaning',
      '/building-maintenance',
    ],
    conversionGoal: 'Request a commercial roof and gutter drone inspection proposal.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. FAÇADE & BUILDING ENVELOPE INSPECTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/building-envelope-inspections': {
    path: '/services/drone-services/building-envelope-inspections',
    title: 'Façade & Building Envelope Drone Inspections | EntireFM',
    metaDescription: 'Multi-storey commercial façade inspections, curtain wall audits, and cladding surveys via drone. Pinpoint gasket failures, loose fixings, and masonry spalling.',
    h1: 'Commercial Façade & Envelope Drone Surveys',
    eyebrow: 'VERTICAL FABRIC INTEGRITY',
    heroIntro: 'Comprehensive vertical elevation inspections of glazed curtain walling, rain-screen cladding panels, precast concrete, and high-rise masonry envelopes.',
    heroDescription: 'Inspecting tall building facades traditionally requires expensive BMU cradles, mast climbers, or disruptive scaffolding. EntireFM conducts rapid close-proximity UAV flights that inspect every joint, pressure plate, and panel fixing from ground floor to penthouse.',
    heroImage: '/images/editorial/building-safety-facade-inspection.jpg',
    historicIntent: 'Commercial facade drone inspection and building envelope surveys UK',
    primaryIntent: 'commercial facade drone inspection',
    secondaryIntents: [
      'cladding drone inspection contractor',
      'curtain wall drone survey',
      'high rise facade condition report',
      'building envelope defect survey',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Multi-storey curtain wall inspection',
      'Rain-screen cladding fixings audit',
      'Masonry spalling and mortar loss',
      'Glazing gasket and seal condition',
      'IRATA rope access repair coordination',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Curtain Wall & Glazing Audits', description: 'Inspecting pressure plates, capping strips, perimeter transoms, and EPDM rubber gasket shrinkage.', tag: 'GLAZING SYSTEMS' },
      { name: 'Rain-Screen Cladding Panels', description: 'Checking rivet and bolt fixings, panel flatness, expansion gaps, and wind-load deflection across all elevations.', tag: 'CLADDING INTEGRITY' },
      { name: 'Masonry & Concrete Spalling', description: 'Detecting delamination, rebar corrosion, efflorescence, and freeze-thaw masonry fractures.', tag: 'STRUCTURAL FABRIC' },
      { name: 'Zoned Elevation Defect Logs', description: 'Every defect indexed by compass elevation (N/S/E/W), bay coordinate, and floor level for easy navigation.', tag: 'ZONED DEFECT MAP' },
    ],
    faqs: [
      {
        question: 'Which façade types and cladding materials can be inspected?',
        answer: 'We survey glazed curtain walling, unitized systems, aluminum composite material (ACM/HPL) rain-screen panels, terracotta tile facades, precast concrete panels, brickwork masonry, and architectural louvres across low-rise and high-rise commercial developments.',
      },
      {
        question: 'Can drones safely inspect high-rise tower façades?',
        answer: 'Yes. Operating under UK Civil Aviation Authority (CAA) operational authorisations, our pilots conduct automated and manual vertical elevation grids with obstacle-sensing safety buffers, inspecting multi-storey towers without crane baskets or BMU cradles.',
      },
      {
        question: 'Can cladding joints, glazing gaskets, and sealants be assessed?',
        answer: 'Yes. Our optical zoom sensors document mastic sealant adhesion failure, perished EPDM rubber gaskets, loose panel rivets, corrosion around fixing rails, and broken glazing units with sub-millimeter image clarity.',
      },
      {
        question: 'How are façade defects recorded and indexed?',
        answer: 'Every defect is logged against a zoned elevation matrix—referencing compass elevation (North, South, East, West), structural bay numbers, and floor levels—enabling immediate navigation for surveying and maintenance teams.',
      },
      {
        question: 'When might physical rope access still be required?',
        answer: 'Drones perform the non-destructive inspection and diagnostic mapping. When physical tactile testing (e.g., torque checks or core sampling) or repair work is required, EntireFM deploys IRATA-certified rope access technicians directly to the mapped defect coordinates.',
      },
      {
        question: 'Can EntireFM complete subsequent façade repairs?',
        answer: 'Yes. EntireFM self-delivers high-level abseil mastic resealing, cladding panel refastening, glass replacement, and masonry repairs, eliminating third-party contractor markups.',
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
      '/building-fabric-maintenance',
      '/hard-services',
    ],
    conversionGoal: 'Request a commercial façade and building envelope drone inspection survey.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. THERMAL DRONE SURVEYS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/thermal-imaging': {
    path: '/services/drone-services/thermal-imaging',
    title: 'Radiometric Thermal Drone Surveys | Roof & Envelope Thermography | EntireFM',
    metaDescription: 'Calibrated FLIR radiometric thermal drone surveys across the UK. Detect sub-membrane roof moisture, insulation voids, and building heat loss non-destructively.',
    h1: 'Radiometric Thermal Drone Surveys',
    eyebrow: 'INFRARED DIAGNOSTICS',
    heroIntro: 'Calibrated aerial thermography pinpointing trapped moisture in flat roof insulation cores, building envelope heat loss, and electrical anomalies without invasive core sampling.',
    heroDescription: 'Water trapped beneath waterproof membranes degrades structural decks and destroys insulation R-values. EntireFM deploys calibrated radiometric thermal cameras during evening cooling windows to reveal exact moisture boundaries and energy loss patterns.',
    heroImage: '/images/editorial/entirefm-hvac-thermal-survey-2000w.webp',
    historicIntent: 'Thermal drone surveys and roof moisture thermography UK',
    primaryIntent: 'thermal drone survey',
    secondaryIntents: [
      'roof moisture thermal drone inspection',
      'building heat loss thermal survey',
      'radiometric aerial thermography contractor',
      'commercial infrared drone survey',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Flat roof trapped moisture mapping',
      'Building envelope heat loss analysis',
      'Radiometric pixel-level thermography',
      'BS EN 13187 compliance',
      'Targeted insulation core remediation',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Flat Roof Moisture Mapping', description: 'Detecting saturated insulation cores beneath single-ply, felt, and asphalt membranes during thermal transition.', tag: 'MOISTURE MAP' },
      { name: 'Building Heat Loss Audits', description: 'Locating thermal bridges, missing wall insulation, and air leakage pathways across curtain walling and cladding.', tag: 'ENERGY LOSS' },
      { name: 'Calibrated Radiometric Data', description: 'Pixel-by-pixel temperature measurements allowing post-flight analytical cross-sections and verification.', tag: 'RADIOMETRIC' },
      { name: 'RGB ↔ Thermal Comparison', description: 'Side-by-side optical and thermal defect mapping providing clear visual evidence for surveyors and insurers.', tag: 'DUAL SPECTRUM' },
    ],
    faqs: [
      {
        question: 'What can aerial radiometric thermography detect?',
        answer: 'Aerial infrared thermography detects temperature differentials across building envelopes, identifying trapped moisture within flat roof insulation, thermal bridging, missing cavity insulation, HVAC pipework heat loss, and electrical anomalies on solar arrays.',
      },
      {
        question: 'Can thermal drone surveys identify trapped moisture in roof insulation?',
        answer: 'Yes. Saturated insulation holds daytime solar energy longer than dry sections. Flown during the evening cooling window, our calibrated thermal cameras detect the resulting heat radiation contrast, accurately mapping wet insulation boundaries beneath intact waterproof membranes.',
      },
      {
        question: 'When should thermal drone surveys be undertaken?',
        answer: 'Thermal surveys require specific environmental conditions—typically clear, dry conditions after sunset with an established indoor-to-outdoor temperature differential (delta-T), compliant with BS EN 13187 building thermography standards.',
      },
      {
        question: 'Can thermal imaging identify building envelope heat loss?',
        answer: 'Yes. Façade thermal scans reveal defective window seals, uninsulated spandrel panels, thermal bridges across floor slab edges, and air leakage pathways, supporting ESG energy audits and decarbonisation plans.',
      },
      {
        question: 'What is radiometric thermal data?',
        answer: 'Unlike standard thermal video, radiometric files store calibrated temperature values in every single pixel. This allows surveyors to conduct post-flight analytical cross-sections and verify thermal profiles using specialist thermographic software.',
      },
      {
        question: 'What happens if an anomaly is identified?',
        answer: 'EntireFM compiles an anomaly report with thermal-to-optical overlays. Our roofing and mechanical engineers can perform targeted core sampling to verify findings and execute localized remedial repairs.',
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
      '/energy-management',
      '/building-maintenance',
      '/hard-services',
    ],
    conversionGoal: 'Book a commercial radiometric thermal drone survey for roof moisture or heat loss.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. SOLAR PV DRONE INSPECTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/solar-pv-inspections': {
    path: '/services/drone-services/solar-pv-inspections',
    title: 'Solar PV Drone Thermographic Inspections | EntireFM',
    metaDescription: 'IEC 62446-3 compliant solar PV drone thermal surveys across the UK. Detect cell hotspots, failed bypass diodes, and string faults on rooftop and ground-mount arrays.',
    h1: 'Commercial Solar PV Thermographic Surveys',
    eyebrow: 'RENEWABLE ASSET AUDITS',
    heroIntro: 'Rapid aerial thermography and optical scanning of commercial rooftop solar arrays and utility solar farms, identifying yield-degrading electrical faults in minutes.',
    heroDescription: 'Defective solar cells create resistive hotspots that reduce generation yield and pose serious fire hazards. EntireFM inspects thousands of modules per hour using high-resolution radiometric thermal cameras to pinpoint failing bypass diodes, hot cells, and string imbalances.',
    heroImage: '/images/drone/nav/thermal.png',
    historicIntent: 'Solar PV drone inspection and thermal thermography UK',
    primaryIntent: 'solar pv drone inspection',
    secondaryIntents: [
      'solar farm thermal drone survey',
      'commercial rooftop solar drone audit',
      'pv module hotspot detection drone',
      'iec 62446 solar inspection contractor',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'IEC 62446-3 thermographic solar standards',
      'Bypass diode failure detection',
      'Cell-level hotspot identification',
      'String yield loss calculation',
      'Direct electrical inverter and panel repair',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Cell-Level Hotspot Detection', description: 'Identifying localized resistive cell faults, micro-cracks, and semiconductor degradation.', tag: 'HOTSPOT AUDIT' },
      { name: 'Bypass Diode & String Failure', description: 'Detecting open-circuit bypass diodes causing one-third module loss and string disconnects.', tag: 'STRING DIAGNOSTICS' },
      { name: 'Soiling & Shading Impact', description: 'Quantifying generation losses caused by bird fouling, industrial dust, and vegetation overgrowth.', tag: 'SOILING AUDIT' },
      { name: 'IEC 62446-3 Reporting', description: 'Standardized defect classification meeting statutory warranty and insurance compliance standards.', tag: 'COMPLIANCE' },
    ],
    faqs: [
      {
        question: 'What faults can thermal drone inspection identify on PV arrays?',
        answer: 'Aerial thermography identifies defective bypass diodes, localized cell micro-cracks (hotspots), disconnected strings, internal short circuits, PID degradation, and surface soiling across commercial rooftop and ground-mounted solar installations.',
      },
      {
        question: 'Can large commercial solar arrays be inspected efficiently?',
        answer: 'Yes. A drone can survey thousands of solar panels in a fraction of the time required for manual hand-held thermal scanning, completing 1MWp+ installations in hours while the system remains fully energised.',
      },
      {
        question: 'What are thermal hotspots and why are they dangerous?',
        answer: 'Hotspots occur when damaged solar cells become resistive, dissipating energy as localized heat rather than generating electricity. If left unrectified, hotspots degrade surrounding cells, reduce total string yield, and present fire risks.',
      },
      {
        question: 'Can individual defective modules or strings be identified?',
        answer: 'Yes. High-resolution geotagged imagery maps every identified anomaly to its exact string reference, row index, and panel coordinate, allowing maintenance electricians to walk directly to the faulty unit.',
      },
      {
        question: 'What outputs does the solar survey provide?',
        answer: 'Deliverables include an IEC 62446-3 compliant thermographic defect schedule, visual-thermal comparison cards, string-by-string anomaly logs, and estimated yield loss recovery figures.',
      },
      {
        question: 'Can EntireFM complete electrical solar repairs?',
        answer: 'Yes. EntireFM’s commercial electrical engineering teams isolate strings, replace damaged modules and bypass diodes, and conduct full remedial testing to restore maximum generation capacity.',
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
      '/commercial-solar-pv',
      '/electrical-maintenance',
      '/ppm',
    ],
    conversionGoal: 'Book an IEC 62446-3 compliant solar PV thermographic drone survey.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. SURVEYING & MAPPING
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/surveying-mapping': {
    path: '/services/drone-services/surveying-mapping',
    title: 'Drone Surveying & Topographic Mapping | Orthomosaics | EntireFM',
    metaDescription: 'Survey-grade drone mapping, 2D orthomosaics, and digital terrain modeling across the UK. RTK positioning, CAD/GIS integration, and topographic datasets.',
    h1: 'Drone Surveying & Geospatial Mapping',
    eyebrow: 'GEOSPATIAL ORTHOMOSAICS & GIS',
    heroIntro: 'Millimeter-accurate 2D orthomosaic maps, Digital Elevation Models (DEM), and CAD/GIS vectors captured with RTK satellite precision for estate masterplanning.',
    heroDescription: 'Traditional land surveys are slow and labour-intensive. EntireFM flies automated photogrammetric grid missions to generate high-density spatial datasets aligned with the British National Grid (OSGB36), delivering ready-to-use layers for civil engineers and estate managers.',
    heroImage: '/images/drone/surveying_poster.png',
    historicIntent: 'Drone surveying topographic mapping and orthomosaic contractor UK',
    primaryIntent: 'drone surveying and mapping',
    secondaryIntents: [
      'drone orthomosaic mapping UK',
      'topographic drone survey contractor',
      'drone cad gis mapping',
      'digital elevation model drone survey',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'RTK satellite positioning',
      '2D georeferenced orthomosaics',
      'Digital Surface & Terrain Models',
      'CAD DXF / GIS Shapefile exports',
      'Estate masterplanning integration',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: '2D Georeferenced Orthomosaics', description: 'Distortion-free, high-resolution aerial maps georeferenced to OS National Grid coordinates.', tag: 'ORTHOMOSAIC' },
      { name: 'Digital Elevation Models (DEM/DTM)', description: 'Topographic contour layers, terrain slope gradients, and hydrology runoff mapping.', tag: 'TOPOGRAPHY' },
      { name: 'CAD & GIS Vector Integration', description: 'Layered DXF, DWG, and Shapefile exports ready for direct import into AutoCAD and GIS suites.', tag: 'CAD / GIS' },
      { name: 'Boundary & Estate As-Builts', description: 'Accurate spatial records of estate footprints, private roadways, utility covers, and fencing.', tag: 'AS-BUILT' },
    ],
    faqs: [
      {
        question: 'What is a drone orthomosaic map?',
        answer: 'An orthomosaic is a high-resolution 2D map created by stitching hundreds of overlapping aerial photos, geometrically corrected for camera tilt and terrain relief so that accurate distances, areas, and angles can be measured directly from the image.',
      },
      {
        question: 'What positional accuracy can drone surveying achieve?',
        answer: 'Achievable spatial accuracy depends on site terrain, flight altitude, Ground Control Point (GCP) network design, and onboard RTK satellite positioning. When survey-grade ground control is deployed, outputs achieve precision suitable for civil engineering and boundary validation.',
      },
      {
        question: 'When are Ground Control Points (GCPs) or RTK positioning used?',
        answer: 'RTK (Real-Time Kinematic) and surveyed ground control targets are utilized whenever millimetric georeferencing, British National Grid (OSGB36) alignment, or legal boundary verification is required.',
      },
      {
        question: 'What survey datasets and outputs can be delivered?',
        answer: 'Deliverables include georeferenced GeoTIFF orthomosaics, Digital Surface Models (DSM), Digital Terrain Models (DTM), 3D point clouds (LAS/LAZ), and 2D/3D contour CAD exports in DXF and DWG formats.',
      },
      {
        question: 'Can drone mapping data integrate directly with CAD and GIS software?',
        answer: 'Yes. All delivered spatial layers are formatted for direct import into Autodesk AutoCAD, Revit, ArcGIS, QGIS, and EntireCAFM estate management workspaces.',
      },
      {
        question: 'How do commercial clients use mapping data for estate planning?',
        answer: 'Facilities directors and civil engineers use orthomosaic datasets for masterplanning estate extensions, verifying drainage runoff routes, quantifying car park spaces, and maintaining accurate asset boundaries.',
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
      '/services/drone-services/volumetric-surveys',
      '/services/drone-services/construction-monitoring',
      '/services/drone-services/digital-twin-3d-capture',
      '/estate-management',
      '/grounds-maintenance',
    ],
    conversionGoal: 'Request a survey-grade drone mapping flight specification and quote.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. CONSTRUCTION MONITORING
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/construction-monitoring': {
    path: '/services/drone-services/construction-monitoring',
    title: 'Construction Progress Drone Monitoring | Milestone Tracking | EntireFM',
    metaDescription: 'Autonomous waypoint drone construction monitoring across the UK. Track earthworks, structural steel, envelope milestones, and subcontractor progress.',
    h1: 'Construction Progress Drone Monitoring',
    eyebrow: 'DEVELOPMENT MILESTONE TRACKING',
    heroIntro: 'Scheduled, GPS-locked repeat waypoint drone flights tracking construction progress, site logistics, contractor milestones, and quality snags from groundworks to handover.',
    heroDescription: 'Managing complex developments requires indisputable visual records. EntireFM programs automated repeat flights that capture identical aerial perspectives across weekly or monthly cadences, providing executive reporting packs and permanent as-built archives.',
    heroImage: '/images/drone/construction_poster.png',
    historicIntent: 'Construction progress drone monitoring and milestone photography UK',
    primaryIntent: 'construction progress drone monitoring',
    secondaryIntents: [
      'construction site drone survey contractor',
      'repeat waypoint drone photography',
      'development milestone tracking drone',
      'as-built construction aerial monitoring',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'GPS-locked waypoint repeat flight',
      'Subcontractor progress verification',
      'Milestone time-lapse compilation',
      'Funder and investor reporting packs',
      'Post-completion FM handover mobilization',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'GPS-Locked Repeat Waypoints', description: 'Automated flight paths capturing identical camera angles across weeks and months for time-lapse review.', tag: 'AUTONOMOUS FLIGHT' },
      { name: 'Subcontractor Milestone Proof', description: 'Timestamped aerial photography validating completed structural framing, glazing, and groundworks.', tag: 'MILESTONE PROOF' },
      { name: 'Orthomosaic Progress Overlays', description: 'Comparing monthly site orthophotos directly against architectural CAD site masterplans.', tag: 'CAD OVERLAY' },
      { name: 'Funder & Stakeholder Reports', description: 'Curated PDF progress summaries and 4K video reels for development board meetings and investors.', tag: 'EXECUTIVE PACKS' },
    ],
    faqs: [
      {
        question: 'How often can a construction site be captured?',
        answer: 'Capture frequencies are customized to project velocity—typically weekly, bi-weekly, or monthly—providing a continuous visual audit across groundworks, structural framing, envelope sealing, and fit-out phases.',
      },
      {
        question: 'Can flights repeat identical viewpoints over time?',
        answer: 'Yes. Our flight systems use GPS-locked autonomous waypoint missions to capture exact visual angles, altitudes, and camera orientations across successive months, ensuring flawless time-lapse comparison.',
      },
      {
        question: 'Can progress be compared between specific construction dates?',
        answer: 'Yes. Deliverables include side-by-side milestone overlays, interactive cloud map sliders, and chronological time-lapses that highlight structural progression and contractor milestones between target dates.',
      },
      {
        question: 'Can drone imagery support project reporting and stakeholder updates?',
        answer: 'Yes. High-resolution orthomosaics and 4K aerial video reels provide executive reporting assets for client board meetings, funder updates, marketing campaigns, and dispute mitigation.',
      },
      {
        question: 'Can earthworks cut/fill and material volumes also be monitored?',
        answer: 'Yes. Repeat 3D terrain scans quantify volumetric changes in soil excavation, foundation cut/fill balances, and bulk material stockpiles throughout the development lifecycle.',
      },
      {
        question: 'How are historic site captures retained and accessed?',
        answer: 'All raw data, processed orthomosaics, and video assets are securely archived and accessible through dedicated cloud links, creating an immutable permanent visual record of the building as-built.',
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
      '/services/drone-services/aerial-photography-video',
      '/project-management',
      '/entirefm-projects',
    ],
    conversionGoal: 'Set up scheduled repeat waypoint construction monitoring flights.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. DIGITAL TWIN & 3D REALITY CAPTURE
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/digital-twin-3d-capture': {
    path: '/services/drone-services/digital-twin-3d-capture',
    title: 'EntireFM 3D & Digital Twin Capture | BIM Point Clouds | EntireFM',
    metaDescription: 'Interactive EntireFM 3D digital twins and dense BIM point clouds. Reconstruct commercial property into navigable 3D models for remote inspection.',
    h1: 'EntireFM 3D & Digital Twin Spatial Capture',
    eyebrow: 'INTERACTIVE REALITY TWIN',
    heroIntro: 'Transform physical commercial buildings into immersive, navigable EntireFM 3D spatial models and dense point clouds for remote inspection and BIM integration.',
    heroDescription: 'Revisiting high-level assets in person is costly and dangerous. EntireFM combines dense multi-angle drone photogrammetry and radiance field synthesis to create photorealistic EntireFM 3D models that facilities teams can orbit, measure, and inspect from any browser.',
    heroImage: '/images/drone/gaussian-splat/casa-hotel.jpg',
    historicIntent: 'Digital twin drone capture 3D gaussian splat and BIM reality mesh UK',
    primaryIntent: 'entirefm 3d digital twin capture',
    secondaryIntents: [
      'drone 3d digital twin contractor',
      'point cloud drone photogrammetry',
      'bim reality mesh drone survey',
      'remote asset inspection 3d model',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'EntireFM 3D radiance fields',
      'Dense georeferenced point clouds',
      'Autodesk Revit and Navisworks import',
      'Remote stakeholder asset navigation',
      'EntireCAFM 3D workspace integration',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'EntireFM 3D Spatial Models', description: 'Photorealistic, directly navigable 3D models accessible in web browsers with orbital and zoom controls.', tag: 'ENTIREFM 3D' },
      { name: 'Dense BIM Point Clouds', description: 'Millions of georeferenced spatial coordinate points formatted for Autodesk Revit, AutoCAD, and Navisworks.', tag: 'POINT CLOUD' },
      { name: 'Virtual Measurement Tools', description: 'Accurately measuring facade heights, roof areas, plant footprints, and access clearances remotely.', tag: 'CAD MEASURE' },
      { name: 'Historic Baseline Archive', description: 'Creating immutable 3D visual baselines at lease inception, pre-refurbishment, or post-construction handover.', tag: 'ARCHIVE BASELINE' },
    ],
    faqs: [
      {
        question: 'What is EntireFM 3D?',
        answer: 'EntireFM 3D is a photorealistic, browser-accessible digital twin platform that transforms thousands of aerial drone images into an interactive 3D spatial model, allowing stakeholders to orbit, zoom, and inspect commercial assets remotely.',
      },
      {
        question: 'How is a navigable 3D model created?',
        answer: 'Industrial drones fly structured orbital and oblique flight paths around the building, capturing overlapping high-resolution imagery. Advanced photogrammetry and radiance field synthesis reconstruct the physical geometry and surface textures into a web-optimized 3D spatial asset.',
      },
      {
        question: 'What can the EntireFM 3D model be used for?',
        answer: 'Estate directors, surveyors, and project engineers use the model for remote asset inspection, virtual contractor inductions, dimensional measurement, space planning, plant replacement logistics, and dilapidations baselines.',
      },
      {
        question: 'Can spatial outputs support BIM and CAD workflows?',
        answer: 'Yes. In addition to the interactive web viewer, we deliver dense georeferenced point clouds (LAS, LAZ, RCP) and 3D textured mesh files (OBJ, FBX) formatted for direct import into Autodesk Revit and Navisworks.',
      },
      {
        question: 'How is sensitive building data protected?',
        answer: 'All 3D spatial assets are processed on secure UK/EU servers with strict enterprise access controls, encrypted streaming protocols, and options for private client portal hosting within EntireCAFM.',
      },
      {
        question: 'Can a building be recaptured later for condition comparison?',
        answer: 'Yes. Repeat spatial captures can be aligned against baseline models to track longitudinal asset degradation, verify completed construction alterations, or document changes between commercial tenancies.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Drone Services', url: '/services/drone-services' },
      { name: 'EntireFM 3D & Digital Twin', url: '/services/drone-services/digital-twin-3d-capture' },
    ],
    relatedRoutes: [
      '/services/drone-services',
      '/services/drone-services/building-envelope-inspections',
      '/services/drone-services/surveying-mapping',
      '/services/drone-services/drone-inspections',
      '/building-maintenance',
      '/entirecafm',
    ],
    conversionGoal: 'Commission a photorealistic EntireFM 3D digital twin of your commercial building.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. VOLUMETRIC & EARTHWORKS SURVEYS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/volumetric-surveys': {
    path: '/services/drone-services/volumetric-surveys',
    title: 'Volumetric & Earthworks Drone Surveys | Stockpile Calculations | EntireFM',
    metaDescription: 'Precise 3D stockpile volume calculations, quarry extraction audits, and civil earthworks cut/fill analysis via drone across the UK. Certified tonnage reporting.',
    h1: 'Volumetric & Earthworks Drone Surveys',
    eyebrow: 'CIVIL & STOCKPILE PRECISION',
    heroIntro: 'Millimeter-accurate 3D stockpile volume calculations, earthworks cut/fill differential mapping, and quarry void space auditing without hazardous manual walking.',
    heroDescription: 'Climbing shifting aggregate stockpiles or manual land surveying across active civil sites is slow and hazardous. EntireFM deploys photogrammetric UAVs to calculate certified cubic meter volumes (m³) and tonnages across vast material yards in hours.',
    heroImage: '/images/drone/nav/surveying.png',
    historicIntent: 'Volumetric drone survey stockpile measurement and cut fill analysis UK',
    primaryIntent: 'volumetric drone surveys',
    secondaryIntents: [
      'stockpile volume calculation drone',
      'earthworks cut and fill drone survey',
      'quarry volumetric survey contractor',
      'aggregate stock audit drone',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      '3D stockpile volume computation',
      'Earthworks cut and fill balancing',
      'Quarry void extraction tracking',
      'Financial inventory stock audits',
      'Civil engineering CAD LandXML exports',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Stockpile Volume & Tonnage', description: 'Laser-calibrated photogrammetry calculating exact cubic volumes (m³) and density-adjusted tonnages.', tag: 'STOCKPILE AUDIT' },
      { name: 'Cut / Fill Balance Mapping', description: 'Color-coded differential heatmaps quantifying earth movement between baseline and design levels.', tag: 'CUT & FILL' },
      { name: 'Quarry Void & Pit Analysis', description: 'Tracking monthly extraction rates, remaining void capacities, and bench stability metrics.', tag: 'QUARRY AUDIT' },
      { name: 'Civil Software Export', description: 'Delivering LandXML, DXF contours, and 3D surface meshes ready for civil design software.', tag: 'CAD EXPORTS' },
    ],
    faqs: [
      {
        question: 'What materials and environments can be volumetrically measured?',
        answer: 'We measure stockpiles of sand, gravel, crushed stone, coal, scrap metal, timber, biomass, and recycled aggregates across quarries, recycling centers, ports, and construction sites without requiring hazardous physical climbing.',
      },
      {
        question: 'How are stockpile volumes and tonnages calculated?',
        answer: 'Drones capture overlapping high-resolution imagery to generate a dense 3D Digital Surface Model (DSM). Survey software computes the exact cubic volume (m³) between the base surface and the material profile, which is multiplied by verified bulk density to compute certified tonnages.',
      },
      {
        question: 'Can cut-and-fill earthwork quantities be assessed?',
        answer: 'Yes. By comparing baseline elevation scans against current excavation levels or target CAD design models, we calculate net cut/fill balances to manage earthwork logistics and verify subcontractor billing.',
      },
      {
        question: 'How often can volumetric surveys be repeated?',
        answer: 'Surveys can be scheduled monthly, quarterly, or on demand for financial year-end inventory audits, providing rapid material valuation with zero interruption to active site plant operations.',
      },
      {
        question: 'What data formats and reporting outputs are delivered?',
        answer: 'Clients receive certified volumetric certificates (PDF), color-coded cut/fill differential heatmaps, 3D surface mesh files, and LandXML contour exports ready for civil engineering analysis.',
      },
      {
        question: 'What factors influence volumetric measurement accuracy?',
        answer: 'Accuracy is governed by ground control distribution, surface texture visibility, vegetation clearing, and material density verification. Our survey protocols follow rigorous RICS spatial measurement standards.',
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
      '/services/drone-services/drone-inspections',
      '/estate-management',
      '/hard-services',
    ],
    conversionGoal: 'Request a 3D volumetric stockpile calculation or earthworks survey quote.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. AERIAL PHOTOGRAPHY & 6K FILM
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/aerial-photography-video': {
    path: '/services/drone-services/aerial-photography-video',
    title: 'Commercial Aerial Photography & 6K Video Production | EntireFM',
    metaDescription: 'Broadcast-quality 6K aerial cinematography, commercial real estate marketing films, and high-resolution stills suites for portfolios across the UK.',
    h1: 'High-Level Aerial Photography & 6K Cinematography',
    eyebrow: 'ARCHITECTURAL MEDIA',
    heroIntro: 'Broadcast-standard 6K aerial cinematography, golden-hour architectural photography, and marketing media for commercial property portfolios and developers.',
    heroDescription: 'Showcasing commercial real estate requires cinematography-grade aerial production. EntireFM captures stabilized ProRes 4K/6K video reels and 48MP+ optical stills tailored for investment presentations, ESG reports, and commercial leasing brochures.',
    heroImage: '/images/drone/photography_poster.png',
    historicIntent: 'Commercial aerial photography and 6K video drone production UK',
    primaryIntent: 'commercial aerial photography video',
    secondaryIntents: [
      'architectural drone photography contractor',
      'commercial real estate video drone',
      '6k aerial cinematography UK',
      'property marketing drone video production',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      '6K ProRes aerial cinematography',
      'Commercial property marketing reels',
      'Golden hour and twilight stills',
      'Multi-asset portfolio campaigns',
      'Licensed commercial image rights',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: '6K Broadcast Cinematography', description: 'Stabilized ProRes video reels with smooth architectural orbits, tracking shots, and reveal sequences.', tag: 'CINEMATOGRAPHY' },
      { name: 'High-Resolution RAW Stills', description: '48MP/100MP retouched photography capturing estate architecture, landscaping, and transport links.', tag: 'OPTICAL STILLS' },
      { name: 'Multi-Site Portfolio Packages', description: 'Coordinated nationwide filming schedules providing consistent visual assets across property funds.', tag: 'PORTFOLIO REELS' },
      { name: 'Web & Social Cutdowns', description: 'Bespoke video edits formatted for investor pitch decks, corporate websites, and social campaigns.', tag: 'MARKETING EDITS' },
    ],
    faqs: [
      {
        question: 'What types of commercial property can be filmed?',
        answer: 'We film commercial office parks, landmark skyscrapers, industrial distribution centers, retail developments, infrastructure assets, and residential development schemes across the UK.',
      },
      {
        question: 'Can EntireFM produce footage for commercial portfolio marketing?',
        answer: 'Yes. We produce broadcast-ready 4K and 6K video reels, stabilized tracking shots, golden-hour stills, and branded motion graphics tailored for commercial real estate marketing, investor presentations, and leasing brochures.',
      },
      {
        question: 'Can aerial production cover multiple sites nationwide?',
        answer: 'Yes. With flight operations across the UK, EntireFM coordinates multi-asset filming campaigns for property funds, asset management portfolios, and national retail chains under unified corporate styling.',
      },
      {
        question: 'What video resolutions and camera payloads are available?',
        answer: 'We deploy professional cinema payloads capturing up to 6K RAW and 10-bit ProRes video alongside 48MP to 100MP optical stills, delivering exceptional dynamic range and color fidelity.',
      },
      {
        question: 'Can filming take place during active construction and after completion?',
        answer: 'Yes. We create milestone filming programmes documenting early groundworks, structural erection, envelope cladding, and final pristine handover for developer marketing archives.',
      },
      {
        question: 'What deliverables and license rights are supplied?',
        answer: 'Deliverables include graded 4K/6K master video files, web and social cutdowns, high-resolution RAW stills, and full commercial usage rights for digital, print, and broadcast distribution.',
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
      '/services/drone-services/digital-twin-3d-capture',
      '/services/drone-services/drone-inspections',
      '/services/drone-services/construction-monitoring',
      '/estate-management',
      '/entirefm-projects',
    ],
    conversionGoal: 'Book commercial 6K aerial cinematography or high-resolution architectural photography.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. EMERGENCY & INSURANCE SURVEYS
  // ─────────────────────────────────────────────────────────────────────────────
  '/services/drone-services/emergency-insurance-surveys': {
    path: '/services/drone-services/emergency-insurance-surveys',
    title: 'Emergency Storm Damage & Insurance Drone Surveys | EntireFM',
    metaDescription: 'Rapid emergency drone inspections following storm events, fires, and structural damage. Geotagged evidence bundles for loss adjusters and insurers.',
    h1: 'Emergency Storm & Insurance Claim Drone Surveys',
    eyebrow: 'RAPID INCIDENT RESPONSE',
    heroIntro: 'Rapid aerial damage assessment and geotagged evidence bundles following storm events, fire, impact, or structural failure—with direct 24/7 make-safe mobilization.',
    heroDescription: 'Following severe weather or structural incidents, inspecting damaged roofs on foot is life-threatening. EntireFM deploys rapid-response drone crews to survey unstable structures from a safe standoff distance, providing loss-adjuster evidence packs and dispatching make-safe trade teams.',
    heroImage: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    historicIntent: 'Emergency drone inspection storm damage and insurance loss adjuster survey UK',
    primaryIntent: 'emergency drone survey',
    secondaryIntents: [
      'storm damage drone survey contractor',
      'insurance loss adjuster drone inspection',
      'emergency roof damage drone assessment',
      'rapid post incident building survey',
    ],
    pageType: 'service',
    service: 'Drone Services',
    sector: null,
    location: null,
    historicTopics: [
      'Rapid storm damage aerial triage',
      'Safe remote structural assessment',
      'Timestamped insurer evidence packs',
      'Direct 24/7 emergency make-safe repairs',
      'Post-remedial verification flights',
    ],
    requiredSections: ['hero', 'scope', 'applications', 'defects', 'deliverables', 'remediation', 'visualizer', 'faq', 'conversion'],
    capabilities: [
      { name: 'Rapid Aerial Damage Triage', description: 'Inspecting dislodged roof sheets, shattered skylights, and collapsed masonry safely without scaffolding.', tag: 'INCIDENT TRIAGE' },
      { name: 'Loss Adjuster Evidence Packs', description: 'Metadata-verified, geotagged high-resolution photographs formatted specifically for commercial insurers.', tag: 'INSURER DOSSIER' },
      { name: '24/7 Make-Safe Mobilization', description: 'Direct dispatch of trade teams to secure temporary weatherproofing tarpaulins and remove dangerous debris.', tag: 'MAKE-SAFE TEAMS' },
      { name: 'Post-Remediation Verification', description: 'Conducting follow-up drone flights to verify and certify that all permanent repairs meet specifications.', tag: 'SIGN-OFF FLIGHT' },
    ],
    faqs: [
      {
        question: 'How quickly can an emergency drone survey be mobilised?',
        answer: 'EntireFM maintains rapid-response flight teams across the UK capable of deploying to commercial sites following storm events, fires, structural collapses, or severe impact damage, subject to local weather and airspace clearances.',
      },
      {
        question: 'Can unsafe or structurally compromised areas be inspected remotely?',
        answer: 'Yes. Drones provide immediate high-resolution visual access into structurally unstable roofs, collapsed trusses, and fire-damaged interiors without placing surveying personnel or contractors at physical risk.',
      },
      {
        question: 'What types of storm and building damage can be documented?',
        answer: 'We document dislodged cladding, ripped roof membranes, shattered rooflights, fallen parapets, impact breaches, chimney damage, and flooded plant decks with full timestamped metadata.',
      },
      {
        question: 'Can drone survey imagery support commercial insurance claims?',
        answer: 'Yes. We supply comprehensive photographic evidence dossiers with embedded GPS coordinates, flight timestamps, and surveyor condition notes formatted specifically for commercial insurers and loss adjusters.',
      },
      {
        question: 'Can EntireFM execute emergency make-safe works?',
        answer: 'Yes. EntireFM operates 24/7 helpdesks and mobile trade engineering teams to immediately deploy temporary weatherproofing tarpaulins, boarding, debris removal, and subsequent permanent structural repairs.',
      },
      {
        question: 'Can repaired areas be re-inspected by drone after work completion?',
        answer: 'Yes. A verification flight can be conducted post-remediation to provide photographic signoff proving that all repair scopes were completed to the required specification.',
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
      '/services/drone-services/thermal-imaging',
      '/emergency-repairs',
      '/building-maintenance',
    ],
    conversionGoal: 'Request urgent emergency drone inspection or insurance claim damage documentation.',
    verificationRequirements: ['Claims match commercial FM capabilities', 'Cross-links verified'],
    contentStatus: 'CONTENT_COMPLETE',
  },
};
