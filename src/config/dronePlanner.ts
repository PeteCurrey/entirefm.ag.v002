/**
 * ENTIREFM DRONE INSPECTION PLANNER CONFIGURATION & RULE ENGINE
 * =============================================================
 * Deterministic recommendation engine and lead qualification configuration
 * for commercial drone asset surveys, roof inspections, and PPM programmes.
 */

export interface PlannerSiteInput {
  siteType: string;
  siteTypeOther?: string;
  siteName?: string;
  address?: string;
  city?: string;
  postcode?: string;
  siteScale: 'Single Building' | 'Multiple Buildings' | 'Estate / Campus' | 'Large External Site';
  environment?: string;
}

export interface PlannerInspectionInput {
  assetsToInspect: string[];
  roofType?: 'Flat' | 'Pitched' | 'Mixed' | 'Unknown';
  solarCapacity?: 'Small commercial' | 'Medium commercial' | 'Large commercial' | 'Utility-scale' | 'Unknown';
  inspectionReasons: string[];
  waterLeakStatus?: 'active leak' | 'intermittent leak' | 'historic issue' | 'unknown';
  stormStatus?: 'recent' | 'active safety concern' | 'insurance claim involved';
  ppmType?: 'one-off baseline' | 'recurring programme' | 'unknown';
  urgency: 'Emergency / Immediate Concern' | 'Within 24–48 Hours' | 'Within 7 Days' | 'Within 30 Days' | 'Planned / No Immediate Urgency' | 'Not Sure';
  heightBand: '1–2 Storeys' | '3–5 Storeys' | '6–10 Storeys' | '11+ Storeys' | 'Industrial / Variable Height' | 'Unknown';
  accessDifficult: 'Yes' | 'No' | 'Unsure';
  accessConstraints: string[];
  requestedOutputs: string[];
  remediationInterest: 'Yes — inspection and remedial works' | 'Inspection only' | 'Possibly — advise me after the survey' | 'Not sure';
  frequency: 'One-Off Inspection' | 'Quarterly' | 'Every 6 Months' | 'Annually' | 'Construction Milestones' | 'Ongoing Programme' | 'Not Sure';
  notes?: string;
}

export interface PlannerContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle?: string;
  preferredContactMethod?: 'Email' | 'Phone' | 'Either';
}

export interface PlannerState {
  step: number;
  site: PlannerSiteInput;
  inspection: PlannerInspectionInput;
  contact: PlannerContactInput;
}

export interface DroneRecommendationResult {
  primaryService: {
    title: string;
    href: string;
    badge: string;
    description: string;
  };
  inspectionPack: {
    title: string;
    badge: string;
    description: string;
  } | null;
  additionalServices: Array<{
    title: string;
    href: string;
    reason: string;
  }>;
  suggestedOutputs: string[];
  remedialServices: Array<{
    name: string;
    desc: string;
  }>;
  operationalCaveats: string[];
  scopeCategory: 'Focused inspection' | 'Standard commercial inspection' | 'Multi-asset survey' | 'Estate-scale programme' | 'Recurring programme';
  leadPriority: 'HIGH' | 'MEDIUM' | 'STANDARD';
  summaryRationale: string;
}

// -----------------------------------------------------------------------------
// STEP OPTIONS CONFIGURATION
// -----------------------------------------------------------------------------

export const SITE_TYPES = [
  { id: 'Office / Commercial Building', label: 'Office / Commercial Building' },
  { id: 'Industrial / Manufacturing', label: 'Industrial / Manufacturing' },
  { id: 'Warehouse / Logistics', label: 'Warehouse / Logistics' },
  { id: 'Retail / Shopping Centre', label: 'Retail / Shopping Centre' },
  { id: 'Residential Block / Build-to-Rent', label: 'Residential Block / Build-to-Rent' },
  { id: 'Education', label: 'Education / University Campus' },
  { id: 'Healthcare', label: 'Healthcare / NHS Trust' },
  { id: 'Hotel / Leisure', label: 'Hotel / Leisure Complex' },
  { id: 'Construction Site', label: 'Construction Site' },
  { id: 'Solar Installation', label: 'Solar Installation / PV Farm' },
  { id: 'Infrastructure', label: 'Infrastructure / Transport' },
  { id: 'Estate / Multi-Building Portfolio', label: 'Estate / Multi-Building Portfolio' },
  { id: 'Land / Development Site', label: 'Land / Development Site' },
  { id: 'Other', label: 'Other — Describe property' },
];

export const SITE_SCALES = [
  { id: 'Single Building', label: 'Single Building', desc: 'Stand-alone commercial or industrial property' },
  { id: 'Multiple Buildings', label: 'Multiple Buildings', desc: '2 to 5 buildings on a single property' },
  { id: 'Estate / Campus', label: 'Estate / Campus', desc: 'Large multi-asset business park, retail park or campus' },
  { id: 'Large External Site', label: 'Large External Site', desc: 'Vast land parcel, civil site or development acreage' },
] as const;

export const ASSETS_TO_INSPECT = [
  { id: 'Roof', label: 'Roof (Flat or Pitched)' },
  { id: 'Gutters / Roof Drainage', label: 'Gutters & Rainwater Drainage' },
  { id: 'Facade', label: 'Façade Elevations' },
  { id: 'Cladding', label: 'External Cladding Panels' },
  { id: 'Glazing', label: 'High-Level Glazing & Curtain Walling' },
  { id: 'Building Envelope', label: 'Whole Building Envelope' },
  { id: 'Chimney / Flue', label: 'Chimney, Stack or Industrial Flue' },
  { id: 'Roof-Mounted Plant', label: 'Roof-Mounted Plant (HVAC/Chillers)' },
  { id: 'Solar PV Array', label: 'Solar PV Array' },
  { id: 'External M&E Equipment', label: 'External M&E & Pipe Bridges' },
  { id: 'Structure / Tower', label: 'Tower, Mast or Structural Frame' },
  { id: 'Construction Site', label: 'Active Construction Site' },
  { id: 'Stockpile / Earthworks', label: 'Material Stockpile / Earthworks' },
  { id: 'Land / Site', label: 'Land / Topography' },
  { id: 'Whole Building', label: 'Entire Building 360°' },
  { id: 'Multiple Buildings', label: 'Multiple Buildings' },
  { id: 'Other', label: 'Other Asset Area' },
];

export const INSPECTION_REASONS = [
  { id: 'Water ingress / leak', label: 'Water ingress / active leak' },
  { id: 'Storm damage', label: 'Storm damage / severe weather impact' },
  { id: 'Visible deterioration', label: 'Visible fabric deterioration' },
  { id: 'Cracking', label: 'Masonry cracking / movement' },
  { id: 'Loose / damaged cladding', label: 'Loose or damaged cladding' },
  { id: 'Gutter or drainage issue', label: 'Gutter overflowing or blocked' },
  { id: 'Roof condition', label: 'General roof condition assessment' },
  { id: 'Heat loss / insulation concern', label: 'Heat loss / insulation failure' },
  { id: 'Damp / moisture concern', label: 'Damp / trapped moisture' },
  { id: 'Solar performance issue', label: 'Solar PV yield loss / hotspot issue' },
  { id: 'Electrical / thermal anomaly', label: 'Electrical / thermal hotspot' },
  { id: 'Planned condition survey', label: 'Planned condition survey / PPM' },
  { id: 'Pre-acquisition / due diligence', label: 'Pre-acquisition / due diligence' },
  { id: 'Insurance evidence', label: 'Insurance claim documentation' },
  { id: 'Construction progress', label: 'Construction progress tracking' },
  { id: 'Completion / handover evidence', label: 'Completion / handover signoff' },
  { id: 'Asset record / digital twin', label: 'Asset record / 3D digital twin' },
  { id: 'Measurement / mapping', label: 'Topographic mapping / 2D orthomosaic' },
  { id: 'Stockpile volume', label: 'Stockpile volume calculation' },
  { id: 'Routine PPM inspection', label: 'Routine planned preventative maintenance' },
  { id: 'Unknown — I need advice', label: 'Unknown — I need technical advice' },
  { id: 'Other', label: 'Other requirement' },
];

export const URGENCY_OPTIONS = [
  { id: 'Emergency / Immediate Concern', label: 'Emergency / Immediate Concern', desc: 'Active safety hazard, severe leak, or structural danger' },
  { id: 'Within 24–48 Hours', label: 'Within 24–48 Hours', desc: 'Urgent operational impact or active claim' },
  { id: 'Within 7 Days', label: 'Within 7 Days', desc: 'High priority commercial assessment' },
  { id: 'Within 30 Days', label: 'Within 30 Days', desc: 'Standard project or scheduled investigation' },
  { id: 'Planned / No Immediate Urgency', label: 'Planned / No Immediate Urgency', desc: 'Forward maintenance planning or strategic review' },
  { id: 'Not Sure', label: 'Not Sure', desc: 'Advise on standard lead times' },
] as const;

export const HEIGHT_BANDS = [
  { id: '1–2 Storeys', label: '1–2 Storeys (Up to 8m)' },
  { id: '3–5 Storeys', label: '3–5 Storeys (8m–18m)' },
  { id: '6–10 Storeys', label: '6–10 Storeys (18m–35m)' },
  { id: '11+ Storeys', label: '11+ Storeys (35m+ High-Rise)' },
  { id: 'Industrial / Variable Height', label: 'Industrial / Variable Complex' },
  { id: 'Unknown', label: 'Unknown / Unsure' },
] as const;

export const ACCESS_CONSTRAINTS = [
  { id: 'busy public area', label: 'Busy public or pedestrian area' },
  { id: 'active construction site', label: 'Active construction site' },
  { id: 'restricted site', label: 'High-security / restricted site' },
  { id: 'city centre', label: 'Dense city centre location' },
  { id: 'airport / controlled airspace nearby', label: 'Airport or Flight Restriction Zone (FRZ) nearby' },
  { id: 'rail / infrastructure', label: 'Railway or major highway boundary' },
  { id: 'confined external space', label: 'Tight courtyards or confined launch zone' },
  { id: 'neighbouring properties', label: 'Close neighbouring residential properties' },
  { id: 'unknown', label: 'None known / Standard access' },
];

export const ENVIRONMENTS = [
  { id: 'Dense city centre', label: 'Dense City Centre' },
  { id: 'Urban', label: 'Urban Commercial' },
  { id: 'Suburban', label: 'Suburban / Retail Park' },
  { id: 'Industrial estate', label: 'Industrial Estate / Logistics Park' },
  { id: 'Rural', label: 'Rural / Open Countryside' },
  { id: 'Construction environment', label: 'Active Construction Site' },
  { id: 'Infrastructure corridor', label: 'Infrastructure / Transport Corridor' },
  { id: 'Unknown', label: 'Standard UK Location' },
];

export const OUTPUT_OPTIONS = [
  { id: 'High-Resolution Imagery', label: 'High-Resolution 48MP/8K Visual Imagery' },
  { id: 'Annotated Defect Images', label: 'Annotated Defect Matrix & Schedule' },
  { id: 'Condition Report', label: 'Executive Condition Report (PDF)' },
  { id: 'Maintenance Recommendations', label: 'Actionable Remedial Maintenance Scopes' },
  { id: 'Thermal Imagery', label: 'Radiometric Thermal Infrared Imagery' },
  { id: 'Thermal Anomaly Report', label: 'Thermal Anomaly & Moisture Analysis' },
  { id: 'Orthomosaic / Site Map', label: '2D Georeferenced Orthomosaic Map' },
  { id: '3D Model', label: '3D Reality Mesh Model' },
  { id: 'Point Cloud', label: 'Dense Point Cloud (LAS/RCP/BIM)' },
  { id: 'Measurement Data', label: 'Volumetric / Dimensional Measurements' },
  { id: 'Construction Progress Report', label: 'Milestone Progress Comparison' },
  { id: 'Before / After Comparison', label: 'Before & After Repair Signoff' },
  { id: 'Insurance Evidence', label: 'Loss Adjuster Evidence Bundle' },
  { id: 'CAFM / Asset Record Evidence', label: 'EntireCAFM Digital Logbook Sync' },
  { id: 'Not Sure — Recommend for Me', label: 'Not Sure — Recommend suitable outputs' },
];

export const REMEDIATION_OPTIONS = [
  { id: 'Yes — inspection and remedial works', label: 'Yes — Provide survey and quote for required physical repairs' },
  { id: 'Inspection only', label: 'Inspection only — purely diagnostic data required' },
  { id: 'Possibly — advise me after the survey', label: 'Possibly — advise me once defects and priorities are identified' },
  { id: 'Not sure', label: 'Not sure at this stage' },
] as const;

export const FREQUENCY_OPTIONS = [
  { id: 'One-Off Inspection', label: 'One-Off Diagnostic Survey' },
  { id: 'Quarterly', label: 'Quarterly (Every 3 Months) Drone PPM' },
  { id: 'Every 6 Months', label: 'Biannual (Spring & Autumn) Drone PPM' },
  { id: 'Annually', label: 'Annual Strategic Condition & Thermal Review' },
  { id: 'Construction Milestones', label: 'Construction Milestone Programme (Monthly)' },
  { id: 'Ongoing Programme', label: 'Ongoing Multi-Site Framework' },
  { id: 'Not Sure', label: 'Not Sure — advise on recommended cadence' },
] as const;

// -----------------------------------------------------------------------------
// DETERMINISTIC RECOMMENDATION ENGINE
// -----------------------------------------------------------------------------

export function generateDroneRecommendation(
  site: PlannerSiteInput,
  insp: PlannerInspectionInput
): DroneRecommendationResult {
  const assets = new Set(insp.assetsToInspect || []);
  const reasons = new Set(insp.inspectionReasons || []);
  const outputs = new Set(insp.requestedOutputs || []);
  const scale = site.siteScale || 'Single Building';
  const freq = insp.frequency || 'One-Off Inspection';
  const urgency = insp.urgency || 'Planned / No Immediate Urgency';
  const height = insp.heightBand || '3–5 Storeys';
  const remediation = insp.remediationInterest;

  // Flags for matching
  const hasRoof = assets.has('Roof') || assets.has('Gutters / Roof Drainage');
  const hasFacade = assets.has('Facade') || assets.has('Cladding') || assets.has('Glazing') || assets.has('Building Envelope');
  const hasSolar = assets.has('Solar PV Array') || site.siteType === 'Solar Installation' || reasons.has('Solar performance issue');
  const hasConstruction = assets.has('Construction Site') || site.siteType === 'Construction Site' || reasons.has('Construction progress') || freq === 'Construction Milestones';
  const hasStockpile = assets.has('Stockpile / Earthworks') || reasons.has('Stockpile volume');
  const hasMapping = assets.has('Land / Site') || reasons.has('Measurement / mapping') || outputs.has('Orthomosaic / Site Map');
  const hasDigitalTwin = assets.has('Whole Building') || outputs.has('3D Model') || outputs.has('Point Cloud') || reasons.has('Asset record / digital twin');
  const hasThermalNeed = reasons.has('Heat loss / insulation concern') || reasons.has('Damp / moisture concern') || reasons.has('Electrical / thermal anomaly') || outputs.has('Thermal Imagery') || outputs.has('Thermal Anomaly Report');
  const hasWaterIngress = reasons.has('Water ingress / leak') || reasons.has('Damp / moisture concern');
  const hasStormEmergency = reasons.has('Storm damage') || urgency === 'Emergency / Immediate Concern' || reasons.has('Insurance evidence');
  const isMultiAsset = scale === 'Estate / Campus' || scale === 'Multiple Buildings' || assets.has('Multiple Buildings') || site.siteType === 'Estate / Multi-Building Portfolio';
  const isRecurring = freq === 'Quarterly' || freq === 'Every 6 Months' || freq === 'Annually' || freq === 'Ongoing Programme';

  // SCENARIO 6: Emergency Storm Damage / Urgent Insurance
  if (hasStormEmergency && (urgency === 'Emergency / Immediate Concern' || urgency === 'Within 24–48 Hours' || reasons.has('Storm damage'))) {
    return {
      primaryService: {
        title: 'Emergency & Insurance Drone Survey',
        href: '/services/drone-services/emergency-insurance-surveys',
        badge: 'URGENT RESPONSE',
        description: 'Rapid aerial damage appraisal to safely evaluate structural integrity, dislodged roof materials, and water ingress pathways without hazardous working at height.',
      },
      inspectionPack: {
        title: 'Storm Response Pack',
        badge: 'RAPID TRIAGE',
        description: 'Geotagged damage photo bundle, loss adjuster evidence pack, and rapid make-safe quotation.',
      },
      additionalServices: [
        {
          title: 'Roof & Gutter Inspections',
          href: '/services/drone-services/roof-inspections',
          reason: 'To inspect surrounding roof flashings, valley gutters, and membrane seams for consequential water entry.',
        },
      ],
      suggestedOutputs: [
        'Urgent damage photographic log (48MP high-resolution)',
        'Geotagged loss adjuster evidence pack',
        'Immediate make-safe scope & temporary repair plan',
        'EntireFM rapid trade dispatch quotation',
      ],
      remedialServices: [
        { name: '24/7 Emergency Make-Safe Works', desc: 'Securing loose cladding sheets, temporary boarding, and industrial tarpaulin weatherproofing.' },
        { name: 'Working at Height & Rope Access', desc: 'Rapid technician deployment to remove high-level loose masonry or dislodged coping stones.' },
        { name: 'Commercial Roofing Reinstatement', desc: 'Permanent replacement of torn waterproofing membranes, flashings, and broken skylights.' },
      ],
      operationalCaveats: [
        'If there is an immediate danger to life or property, establish a secure ground exclusion cordon first.',
        'High wind gusts (>22–25 knots) or active deluge may require tactical flight timing to ensure safe aircraft control.',
        'Operations within controlled airspace or near railways are subject to rapid emergency ATC notifications.',
      ],
      scopeCategory: 'Focused inspection',
      leadPriority: 'HIGH',
      summaryRationale: 'A rapid emergency aerial survey provides safe, immediate damage documentation for insurance underwriters and enables prompt temporary make-safe works.',
    };
  }

  // SCENARIO 2: Solar PV Fault & Thermography
  if (hasSolar) {
    return {
      primaryService: {
        title: 'Solar PV Drone Inspections & Thermography',
        href: '/services/drone-services/solar-pv-inspections',
        badge: 'RENEWABLES AUDIT',
        description: 'Comprehensive optical and radiometric infrared aerial scanning to detect hotspot cells, defective bypass diodes, string dropouts, and micro-cracks under IEC 62446-3 guidelines.',
      },
      inspectionPack: {
        title: 'Energy Intelligence Pack',
        badge: 'YIELD & THERMOGRAPHY',
        description: 'High-speed thermographic scanning, hotspot defect register, and financial kWh generation yield recovery analysis.',
      },
      additionalServices: [
        {
          title: 'Roof & Gutter Inspections',
          href: '/services/drone-services/roof-inspections',
          reason: 'To verify mounting plinths, cable conduit roof penetrations, and ballast integrity across the host roof deck.',
        },
      ],
      suggestedOutputs: [
        'Radiometric thermal infrared string scan (IEC 62446-3)',
        'Hotspot & bypass diode anomaly defect register',
        'High-resolution visual condition log of panel glass & frames',
        'Estimated kWh yield impact and inverter alignment check',
        'NICEIC commercial electrical remedial scope',
      ],
      remedialServices: [
        { name: 'Commercial Electrical (NICEIC)', desc: 'Safe string isolation, bypass diode replacement, and electrical connection retightening.' },
        { name: 'Solar PV Module Replacement', desc: 'Direct trade replacement of cracked, delaminated, or non-performing photovoltaic modules.' },
        { name: 'Array De-energisation & Cleaning', desc: 'Specialist demineralised water wash to eliminate heavy soiling and restore full generation output.' },
      ],
      operationalCaveats: [
        'Thermographic solar scans require minimum solar irradiance (>600 W/m²) and clear skies to produce accurate Delta-T anomaly readings.',
        'Site access and inverter room access are required for electrical string correlation.',
        'Flights conducted strictly within UK CAA operational safety guidelines.',
      ],
      scopeCategory: scale === 'Large External Site' ? 'Estate-scale programme' : 'Standard commercial inspection',
      leadPriority: 'HIGH',
      summaryRationale: 'Radiometric aerial thermography allows rapid identification of defective modules across hundreds of panels without hazardous manual contact.',
    };
  }

  // SCENARIO 3: Construction Progress Monitoring
  if (hasConstruction) {
    return {
      primaryService: {
        title: 'Drone Construction Progress Monitoring',
        href: '/services/drone-services/construction-monitoring',
        badge: 'DEVELOPMENT MONITORING',
        description: 'Scheduled repeat aerial capture from GPS-locked waypoints tracking groundworks, steel frames, envelope enclosure, and contractor milestones.',
      },
      inspectionPack: {
        title: 'Construction Monitoring Pack',
        badge: 'MILESTONE ARCHIVE',
        description: 'Recurring flight schedules, monthly executive progress dashboards, cloud orthomosaics, and investor time-lapse records.',
      },
      additionalServices: [
        {
          title: 'Surveying & Topographic Mapping',
          href: '/services/drone-services/surveying-mapping',
          reason: 'To produce 2D orthomosaics and digital terrain models for CAD site layout overlays.',
        },
        {
          title: 'Volumetric Drone Surveys',
          href: '/services/drone-services/volumetric-surveys',
          reason: 'To calculate cut and fill earthwork movements and bulk material stockpile volumes.',
        },
      ],
      suggestedOutputs: [
        'Monthly progress executive report (PDF)',
        'Repeat GPS-locked milestone comparison stills (48MP)',
        'Georeferenced orthomosaic web viewer overlay',
        '4K milestone video reel for project stakeholders & board',
        'Subcontractor handover & defect verification records',
      ],
      remedialServices: [
        { name: 'EntireFM Projects Mobilisation', desc: 'Seamless transition from construction monitoring into building handover and asset tagging.' },
        { name: 'PPM Matrix Creation', desc: 'Establishing initial SFG20 planned maintenance schedules from the verified as-built condition.' },
      ],
      operationalCaveats: [
        'Flights on active construction sites require integration with Principal Contractor site RAMS and PPE protocols.',
        'Crane activity and site vehicle movement are mapped prior to every flight mission.',
        'Flight paths programmed via automated waypoint navigation for centimetre-level photographic alignment.',
      ],
      scopeCategory: 'Recurring programme',
      leadPriority: 'HIGH',
      summaryRationale: 'Repeat waypoint aerial monitoring delivers an indisputable chronological visual archive that protects developers and main contractors against delay claims.',
    };
  }

  // SCENARIO 5: Estate-Scale Multi-Building PPM Programme
  if (isMultiAsset && (isRecurring || reasons.has('Planned condition survey') || reasons.has('Routine PPM inspection'))) {
    return {
      primaryService: {
        title: 'Drone PPM & Estate Asset Inspections',
        href: '/services/drone-services',
        badge: 'ESTATE PPM',
        description: 'Coordinated multi-asset condition surveys capturing roofs, high-level façades, and external grounds across your commercial portfolio.',
      },
      inspectionPack: {
        title: 'Estate Condition Pack + Drone PPM Programme',
        badge: 'PORTFOLIO GOVERNANCE',
        description: 'Standardized condition RAG scoring across all buildings, master GIS orthomosaic, and synchronized EntireCAFM asset history.',
      },
      additionalServices: [
        {
          title: 'Roof & Gutter Inspections',
          href: '/services/drone-services/roof-inspections',
          reason: 'For quarterly valley gutter sweeps and pre-winter drainage clearance audits.',
        },
        {
          title: 'Thermal Drone Surveys',
          href: '/services/drone-services/thermal-imaging',
          reason: 'For annual evening thermal scans detecting roof moisture and envelope heat loss.',
        },
      ],
      suggestedOutputs: [
        'Estate-wide master condition matrix (RAG graded)',
        'Georeferenced 2D orthomosaic of the full property boundary',
        'High-resolution roof & facade defect registers per building',
        '5-Year Capital Expenditure (CapEx) maintenance forecast',
        'Direct synchronization with EntireCAFM asset logbooks',
      ],
      remedialServices: [
        { name: 'Planned Preventative Maintenance (PPM)', desc: 'Scheduled quarterly and biannual maintenance contracts across all estate building fabric.' },
        { name: 'Rope Access & BMU Services', desc: 'Direct trade delivery for high-rise facade sealant renewal, window maintenance, and concrete repairs.' },
        { name: 'Commercial Roofing & Gutter Care', desc: 'Annual box gutter relining, vacuum cleaning, and membrane repairs.' },
      ],
      operationalCaveats: [
        'Multi-building estate surveys are phased to minimize disruption to tenants and active business operations.',
        'Airspace and neighbour notifications are pre-planned across the entire estate perimeter.',
        'Survey methodology is tailored to each building archetype within the portfolio.',
      ],
      scopeCategory: 'Estate-scale programme',
      leadPriority: 'HIGH',
      summaryRationale: 'A centralized estate drone inspection programme gives property directors consistent portfolio-wide condition data while cutting access costs by up to 70%.',
    };
  }

  // SCENARIO 4: High-Rise Façade / Building Envelope
  if (hasFacade && (height === '6–10 Storeys' || height === '11+ Storeys' || reasons.has('Loose / damaged cladding') || reasons.has('Visible deterioration') || reasons.has('Cracking'))) {
    return {
      primaryService: {
        title: 'Building Envelope & Façade Drone Inspection',
        href: '/services/drone-services/building-envelope-inspections',
        badge: 'FACADE AUDIT',
        description: 'Close-proximity vertical envelope surveys inspecting multi-storey cladding panels, curtain walling seals, mastic expansion joints, and high-level architectural trims.',
      },
      inspectionPack: {
        title: 'Building Envelope Pack',
        badge: 'VERTICAL FABRIC',
        description: 'Zoned elevation anomaly maps (N/S/E/W), high-definition zoom stills of fixings, and prioritized remedial scopes.',
      },
      additionalServices: [
        {
          title: 'Thermal Drone Surveys',
          href: '/services/drone-services/thermal-imaging',
          reason: 'To detect cavity insulation voids, missing thermal breaks, and window gasket drafts.',
        },
        {
          title: 'Digital Twin 3D Reality Capture',
          href: '/services/drone-services/digital-twin-3d-capture',
          reason: 'To generate a persistent 3D textured mesh model for remote facade inspection and CAD drafting.',
        },
      ],
      suggestedOutputs: [
        'Zoned elevation defect map (North, South, East, West elevations)',
        'Millimetre-scale optical zoom imagery of cladding fixings & joints',
        'Mastic sealant degradation & expansion joint condition log',
        'Spalling masonry & concrete defect schedule',
        'EntireFM rope access / cradle remedial execution quotation',
      ],
      remedialServices: [
        { name: 'Industrial Rope Access (IRATA)', desc: 'Abseil technicians deployed directly to defect coordinates for mastic renewal and panel refixing.' },
        { name: 'BMU & Cradle Operations', desc: 'Integrated facade maintenance using permanent building maintenance units.' },
        { name: 'Building Fabric Maintenance', desc: 'Specialist cladding replacement, glass unit swaps, and concrete spall patching.' },
      ],
      operationalCaveats: [
        'High-rise flights in dense urban centres or near public footpaths require strict ground exclusion zones and safety marshals.',
        'Turbulent wind shear around tall structures is factored into automated flight control limits (<20 knots).',
        'Privacy protocols ensure flight paths avoid residential internal window views.',
      ],
      scopeCategory: height === '11+ Storeys' ? 'Standard commercial inspection' : 'Focused inspection',
      leadPriority: remediation === 'Yes — inspection and remedial works' ? 'HIGH' : 'MEDIUM',
      summaryRationale: 'High-rise drone facade surveys eliminate the immense cost and disruption of full scaffolding, identifying exact repair points before rope access teams drop.',
    };
  }

  // SCENARIO 1: Commercial Roof Leak / Water Ingress + Thermal
  if (hasRoof || hasWaterIngress || reasons.has('Roof condition') || reasons.has('Gutter or drainage issue')) {
    const isThermalCombined = hasThermalNeed || hasWaterIngress || outputs.has('Thermal Imagery');
    return {
      primaryService: {
        title: 'Roof & Gutter Drone Inspection',
        href: '/services/drone-services/roof-inspections',
        badge: 'WATERPROOFING AUDIT',
        description: 'Comprehensive high-resolution visual condition survey of commercial flat and pitched roofs, single-ply membranes, box gutters, parapets, and plant plinths.',
      },
      inspectionPack: {
        title: isThermalCombined ? 'Roof Condition Pack + Thermal Drone Survey' : 'Roof Condition Pack',
        badge: isThermalCombined ? 'DUAL-SPECTRUM AUDIT' : 'WATERPROOFING & DRAINAGE',
        description: isThermalCombined
          ? 'Combined ultra-high-resolution optical and FLIR radiometric thermal survey to pinpoint water ingress pathways and hidden insulation saturation.'
          : 'High-resolution roof orthomosaic, annotated defect schedule, and valley gutter drainage condition log.',
      },
      additionalServices: isThermalCombined ? [
        {
          title: 'Thermal Drone Surveys',
          href: '/services/drone-services/thermal-imaging',
          reason: 'Radiometric evening thermography to isolate saturated insulation cores beneath the membrane.',
        },
      ] : [
        {
          title: 'Building Envelope Inspections',
          href: '/services/drone-services/building-envelope-inspections',
          reason: 'To inspect high-level parapet copings, clerestory glazing, and cladding interfaces above the roof line.',
        },
      ],
      suggestedOutputs: [
        'Full high-resolution roof orthomosaic (sub-centimetre GSD)',
        'Annotated visible defect schedule (membrane laps, flashings, punctures)',
        'Valley gutter siltation & drainage hopper condition register',
        ...(isThermalCombined ? ['FLIR radiometric thermal anomaly map (Delta-T moisture analysis)'] : []),
        'Structured maintenance priorities (RAG graded)',
        'Actionable EntireFM roofing & drainage remedial proposal',
      ],
      remedialServices: [
        { name: 'Commercial Roofing Maintenance', desc: 'Single-ply membrane hot-air welding, asphalt patch repairs, and lead flashing dressing.' },
        { name: 'Valley Gutter Clearance & Relining', desc: 'Commercial gutter vacuum clearance, downpipe flushing, and elastomeric relining.' },
        { name: 'Targeted Core Replacement', desc: 'Stripping and replacing only the isolated saturated insulation core identified by thermography.' },
      ],
      operationalCaveats: [
        'Thermal moisture mapping is conducted post-sunset during ambient cooldown for optimal thermal emissivity contrast.',
        'Roof surveys require safe line-of-sight and suitable weather (dry conditions, wind <22 knots).',
        'All flights conducted under UK CAA operational frameworks with site-specific RAMS.',
      ],
      scopeCategory: scale === 'Multiple Buildings' ? 'Multi-asset survey' : 'Standard commercial inspection',
      leadPriority: remediation === 'Yes — inspection and remedial works' || hasWaterIngress ? 'HIGH' : 'MEDIUM',
      summaryRationale: isThermalCombined
        ? 'A combined high-resolution optical and thermal inspection is the most cost-effective way to locate elusive leak origins and verify whether roof insulation is waterlogged.'
        : 'A detailed aerial roof inspection safely captures fragile roof areas, identifying minor defects before they cause catastrophic internal water damage.',
    };
  }

  // Fallback: General Commercial Drone Asset Survey
  return {
    primaryService: {
      title: 'Commercial Drone Inspection & Asset Survey',
      href: '/services/drone-services/drone-inspections',
      badge: 'AERIAL ASSET AUDIT',
      description: 'High-resolution optical and diagnostic inspection of high-level building fabric, inaccessible structures, and external commercial assets.',
    },
    inspectionPack: {
      title: 'Estate Condition Pack',
      badge: 'COMMERCIAL SURVEY',
      description: 'Standardized defect schedule, high-resolution visual log, and maintenance action plan.',
    },
    additionalServices: [
      {
        title: 'Roof & Gutter Inspections',
        href: '/services/drone-services/roof-inspections',
        reason: 'To inspect all high-level roof waterproofings and rainwater goods.',
      },
    ],
    suggestedOutputs: [
      'High-resolution 48MP/8K visual photo log',
      'Classified defect schedule with high-resolution crops',
      'Executive summary report (PDF)',
      'Actionable EntireFM maintenance recommendations',
    ],
    remedialServices: [
      { name: 'Self-Delivered FM Remedials', desc: 'Direct trade coordination for rope access, roofing, fabric, and mechanical repairs.' },
      { name: 'EntireCAFM Asset Sync', desc: 'Incorporating survey findings into your property digital logbook.' },
    ],
    operationalCaveats: [
      'Final flight methodology is subject to site risk assessment, airspace authorization, and weather planning.',
      'Flights conducted strictly within UK Civil Aviation Authority guidelines.',
    ],
    scopeCategory: 'Standard commercial inspection',
    leadPriority: 'STANDARD',
    summaryRationale: 'A commercial drone inspection provides safe, rapid visual evidence of building condition without costly access equipment.',
  };
}

// -----------------------------------------------------------------------------
// LEAD SCORING & UTILITIES
// -----------------------------------------------------------------------------

export function calculateLeadPriority(
  site: PlannerSiteInput,
  insp: PlannerInspectionInput,
  contact?: PlannerContactInput
): 'HIGH' | 'MEDIUM' | 'STANDARD' {
  let score = 0;

  // Commercial scale
  if (site.siteScale === 'Estate / Campus' || site.siteScale === 'Multiple Buildings') score += 2;
  if (site.siteType === 'Industrial / Manufacturing' || site.siteType === 'Warehouse / Logistics' || site.siteType === 'Construction Site') score += 1;

  // Urgency & Criticality
  if (insp.urgency === 'Emergency / Immediate Concern' || insp.urgency === 'Within 24–48 Hours') score += 2;
  if (insp.urgency === 'Within 7 Days') score += 1;

  // Commercial intent (Remediation & PPM)
  if (insp.remediationInterest === 'Yes — inspection and remedial works') score += 3;
  if (insp.remediationInterest === 'Possibly — advise me after the survey') score += 1;
  if (insp.frequency === 'Quarterly' || insp.frequency === 'Every 6 Months' || insp.frequency === 'Annually' || insp.frequency === 'Ongoing Programme') score += 3;
  if (insp.frequency === 'Construction Milestones') score += 2;

  // Asset complexity
  if (insp.assetsToInspect?.length >= 3) score += 1;
  if (insp.heightBand === '11+ Storeys' || insp.heightBand === '6–10 Storeys') score += 1;

  // Corporate email check
  if (contact?.email) {
    const isFreeEmail = /@(gmail|yahoo|hotmail|outlook|live|icloud|aol)\./i.test(contact.email);
    if (!isFreeEmail) score += 1;
  }

  if (score >= 5) return 'HIGH';
  if (score >= 3) return 'MEDIUM';
  return 'STANDARD';
}

export function generateDroneReference(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DRN-${yy}${mm}${dd}-${rand}`;
}
