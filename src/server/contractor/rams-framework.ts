/**
 * ENTIREFM RAMS & RISK ASSESSMENT CANONICAL FRAMEWORK (CP-05)
 * ==========================================================
 * Canonical FM-specific Activity Catalogue, Hazard & Control Library,
 * 5x5 Risk Matrix, Standard Method Sequences, PPE, Plant, and Permits.
 */

import { TradeScope } from './competency-framework';

export type RiskLikelihood = 1 | 2 | 3 | 4 | 5; // 1: Rare, 2: Unlikely, 3: Possible, 4: Likely, 5: Almost Certain
export type RiskSeverity = 1 | 2 | 3 | 4 | 5;   // 1: Minor, 2: Moderate, 3: Serious, 4: Major, 5: Catastrophic
export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskScoreCalculation {
  likelihood: RiskLikelihood;
  severity: RiskSeverity;
  score: number;
  band: RiskBand;
}

export function calculateRiskScore(likelihood: RiskLikelihood, severity: RiskSeverity): RiskScoreCalculation {
  const score = likelihood * severity;
  let band: RiskBand = 'LOW';
  if (score >= 16) band = 'CRITICAL';
  else if (score >= 10) band = 'HIGH';
  else if (score >= 5) band = 'MEDIUM';

  return { likelihood, severity, score, band };
}

export interface CanonicalHazardItem {
  id: string;
  hazard: string;
  category: string;
  trade: TradeScope | 'ALL';
  personsAtRisk: string[];
  initialLikelihood: RiskLikelihood;
  initialSeverity: RiskSeverity;
  standardControls: string[];
  residualLikelihood: RiskLikelihood;
  residualSeverity: RiskSeverity;
  entirefmMandatoryControl?: string;
  applicableEnvironments?: string[];
}

export interface CanonicalMethodStep {
  sequence: number;
  title: string;
  description: string;
  responsibleRole: string;
  mandatoryPpe?: string[];
  safetyWarnings?: string[];
  permitRequired?: string;
}

export interface FmActivityTemplate {
  id: string;
  title: string;
  trade: TradeScope;
  subCategory: string;
  description: string;
  defaultHazards: CanonicalHazardItem[];
  defaultMethodSteps: CanonicalMethodStep[];
  recommendedPpe: string[];
  recommendedPlant: string[];
  potentialPermits: string[];
  requiresCoshh: boolean;
  requiresWorkingAtHeight: boolean;
  requiresElectricalIsolation: boolean;
  requiresGasIsolation: boolean;
  requiresHotWorks: boolean;
}

// ─────────────────────────────────────────────────────────────
// 1. CANONICAL HAZARD & CONTROL LIBRARY
// ─────────────────────────────────────────────────────────────
export const CANONICAL_HAZARDS: CanonicalHazardItem[] = [
  // Electrical
  {
    id: 'HAZ_ELEC_LIVE_CONDUCTORS',
    hazard: 'Contact with live electrical conductors / Electric shock / Electrocution',
    category: 'ELECTRICAL',
    trade: 'ELECTRICAL',
    personsAtRisk: ['Operatives', 'Site occupants', 'Visitors'],
    initialLikelihood: 3,
    initialSeverity: 5,
    standardControls: [
      'Isolate electrical circuit at the local distribution board or main switch prior to commencing invasive work.',
      'Apply unique padlock to lock-off device (LOTO) and retain key on operative person.',
      'Attach prominent danger warning tag with engineer details and contact number.',
      'Prove test equipment (approved GS38 voltage indicator) against a known proving unit before and after testing.',
      'Prove circuit dead on all phase, neutral, and earth conductors before touching components.',
      'Never perform live working unless specifically authorised under an approved live working permit.',
    ],
    residualLikelihood: 1,
    residualSeverity: 3,
    entirefmMandatoryControl: 'Safe electrical isolation (LOTO) must be verified dead with GS38 voltage indicator and proving unit before touching any electrical terminal.',
  },
  {
    id: 'HAZ_ELEC_STORED_ENERGY',
    hazard: 'Residual / Stored electrical energy in capacitors or UPS inverter systems',
    category: 'ELECTRICAL',
    trade: 'ELECTRICAL',
    personsAtRisk: ['Operatives'],
    initialLikelihood: 2,
    initialSeverity: 4,
    standardControls: [
      'Allow minimum 10-minute discharge period after main isolation as per manufacturer specification.',
      'Measure DC bus voltage across capacitor terminals before contact.',
      'Ensure secondary UPS bypass is engaged and confirmed isolated.',
    ],
    residualLikelihood: 1,
    residualSeverity: 2,
  },

  // Working at Height
  {
    id: 'HAZ_HEIGHT_FALL_FROM_EQUIPMENT',
    hazard: 'Fall from height from stepladders, podiums, or access towers',
    category: 'WORKING_AT_HEIGHT',
    trade: 'ALL',
    personsAtRisk: ['Operatives'],
    initialLikelihood: 3,
    initialSeverity: 4,
    standardControls: [
      'Select podium steps or enclosed platform with 360-degree guardrails in preference to leaning ladders.',
      'Pre-use inspection of access equipment before deployment; check feet, rungs, locking mechanisms, and SWL.',
      'Ensure work area is level, stable, and clear of debris.',
      'Maintain 3 points of contact when ascending and descending ladders.',
      'Never overreach; reposition equipment rather than stretching beyond safe working envelope.',
    ],
    residualLikelihood: 1,
    residualSeverity: 2,
    entirefmMandatoryControl: 'Enclosed podiums with guardrails are required for all working at height >2 metres in EntireFM facilities.',
  },
  {
    id: 'HAZ_HEIGHT_DROPPED_OBJECTS',
    hazard: 'Dropped tools or materials falling onto pedestrians or operatives below',
    category: 'WORKING_AT_HEIGHT',
    trade: 'ALL',
    personsAtRisk: ['Site occupants', 'Pedestrians', 'Operatives'],
    initialLikelihood: 3,
    initialSeverity: 4,
    standardControls: [
      'Establish an exclusion zone directly beneath the work area using safety cones and expanding barrier tape.',
      'Position warning signage: "DANGER - OVERHEAD WORK IN PROGRESS - NO ENTRY".',
      'Use tool lanyards and wrist tethers for hand tools used at height.',
      'Keep loose fasteners and screws in secured pouches or magnetic trays.',
    ],
    residualLikelihood: 1,
    residualSeverity: 2,
    entirefmMandatoryControl: 'Physical ground-level exclusion barriers must be erected beneath any elevated work position in occupied areas.',
  },

  // HVAC & Pressure
  {
    id: 'HAZ_HVAC_REFRIGERANT_ESCAPE',
    hazard: 'Release of pressurised fluorinated refrigerant gas / Asphyxiation / Cold burns',
    category: 'HVAC_AND_REFRIGERATION',
    trade: 'HVAC_AND_REFRIGERATION',
    personsAtRisk: ['Operatives', 'Plant room occupants'],
    initialLikelihood: 3,
    initialSeverity: 4,
    standardControls: [
      'Connect calibrated digital manifold gauges with quick-release anti-blowback ball valves.',
      'Wear cryogenic/chemical-resistant gloves and safety goggles when connecting or disconnecting service hoses.',
      'Ensure mechanical plant room ventilation is running prior to opening refrigerant circuits.',
      'Recover all refrigerant gas into dedicated certified recovery cylinders; never vent to atmosphere.',
      'Perform nitrogen pressure leak decay test at 1.1x design pressure before recharging system.',
    ],
    residualLikelihood: 1,
    residualSeverity: 2,
    entirefmMandatoryControl: 'All F-Gas recovery must be logged with cylinder tare weight and refrigerant mass recovered in service report.',
  },
  {
    id: 'HAZ_HVAC_ROTATING_PARTS',
    hazard: 'Entanglement or impact from rotating belts, pulleys, and fan impellers',
    category: 'HVAC_AND_REFRIGERATION',
    trade: 'HVAC_AND_REFRIGERATION',
    personsAtRisk: ['Operatives'],
    initialLikelihood: 3,
    initialSeverity: 4,
    standardControls: [
      'Isolate AHU electrical supply and lock off local isolator before opening drive access doors.',
      'Wait for all fan rotation and belt motion to come to a complete standstill.',
      'Reinstall and secure all belt drive safety guards before running test commissioning.',
    ],
    residualLikelihood: 1,
    residualSeverity: 2,
  },

  // Gas & Heating
  {
    id: 'HAZ_GAS_UNCONTROLLED_ESCAPE',
    hazard: 'Uncontrolled release of natural gas / Explosion / Fire risk',
    category: 'GAS_AND_HEATING',
    trade: 'GAS_AND_HEATING',
    personsAtRisk: ['Operatives', 'Building occupants'],
    initialLikelihood: 3,
    initialSeverity: 5,
    standardControls: [
      'Isolate gas supply at the appliance gas cock or plant room Emergency Isolation Valve (EIV).',
      'Perform statutory tightness testing on gas pipework before and after breaking any joint.',
      'Use calibrated electronic gas leak detector and approved leak detection fluid (LDF).',
      'Ensure adequate natural or mechanical ventilation is active throughout plant area.',
      'Ensure dry powder or CO2 fire extinguisher is positioned adjacent to work area.',
    ],
    residualLikelihood: 1,
    residualSeverity: 3,
    entirefmMandatoryControl: 'Gas tightness testing must be documented on Gas Safe digital certificate with zero allowable drop.',
  },

  // Public / Occupied Building
  {
    id: 'HAZ_OCCUPIED_PUBLIC_INTERFACE',
    hazard: 'Slips, trips, or collisions with building occupants / Trailing cables / Work tools',
    category: 'ENVIRONMENT',
    trade: 'ALL',
    personsAtRisk: ['Office staff', 'Public', 'Visitors'],
    initialLikelihood: 4,
    initialSeverity: 2,
    standardControls: [
      'Segregate the work zone with weighted retractable barriers or safety cones.',
      'Elevate power extension leads with cable hooks or use heavy-duty hi-vis cable ramps across walkways.',
      'Store toolboxes, parts, and materials neatly inside the barrier zone; never leave items unattended in corridors.',
      'Coordinate disruptive or noisy work with site building management for low-occupancy windows.',
    ],
    residualLikelihood: 1,
    residualSeverity: 1,
  },

  // Confined Space
  {
    id: 'HAZ_CONFINED_SPACE_ATMOSPHERE',
    hazard: 'Atmospheric hazards in confined space / Toxic gases (H2S, CO) / Oxygen depletion / Asphyxiation',
    category: 'CONFINED_SPACE',
    trade: 'ALL',
    personsAtRisk: ['Operatives inside chamber', 'Standby sentry'],
    initialLikelihood: 3,
    initialSeverity: 5,
    standardControls: [
      'Pre-entry atmospheric testing using bump-tested, calibrated 4-gas monitor (O2, H2S, CO, LEL).',
      'Continuous forced mechanical air ventilation positioned at intake point throughout entry.',
      'Dedicated top-man sentry stationed outside opening at all times with intrinsically safe ATEX radio.',
      'Operatives equipped with full body harness connected to man-riding retrieval winch & tripod.',
      'Emergency Escape Breathing Apparatus (EEBA 10/15 min sets) verified and positioned at opening.',
    ],
    residualLikelihood: 1,
    residualSeverity: 3,
    entirefmMandatoryControl: 'A dedicated top-man sentry must maintain continuous line of sight or voice contact and never leave the chamber opening.',
  },

  // Manual Handling
  {
    id: 'HAZ_MANUAL_HANDLING_INJURY',
    hazard: 'Musculoskeletal injury / Lumbar strain from lifting, carrying or positioning heavy plant/materials',
    category: 'MANUAL_HANDLING',
    trade: 'ALL',
    personsAtRisk: ['Operatives'],
    initialLikelihood: 4,
    initialSeverity: 3,
    standardControls: [
      'Assess weight, shape, and center of gravity of load prior to lifting; maximum individual lift <20kg.',
      'Deploy mechanical handling aids (pallet trucks, sack barrows, stair walkers, portable hoists).',
      'Coordinate team lifts with clear verbal commands for loads exceeding 20kg.',
      'Maintain clear, unobstructed walkway free from slip and trip hazards along transport route.',
    ],
    residualLikelihood: 1,
    residualSeverity: 2,
  },

  // COSHH / Chemicals
  {
    id: 'HAZ_COSHH_CHEMICAL_EXPOSURE',
    hazard: 'Exposure to hazardous substances / Chemical burns / Inhalation of volatile fumes / Eye contact',
    category: 'COSHH',
    trade: 'ALL',
    personsAtRisk: ['Operatives', 'Building occupants'],
    initialLikelihood: 3,
    initialSeverity: 4,
    standardControls: [
      'Review manufacturer Safety Data Sheet (SDS) and COSHH assessment prior to product application.',
      'Wear chemical-resistant nitrile/butyl gloves, splash goggles (EN 166), and FFP3 respirator.',
      'Ensure adequate natural or forced mechanical ventilation in work area.',
      'Keep portable emergency eye wash bottles and spill containment kit immediately accessible.',
      'Store chemicals in locked COSHH transport boxes when unattended.',
    ],
    residualLikelihood: 1,
    residualSeverity: 2,
    entirefmMandatoryControl: 'Active SDS sheets must be physically present and verified before opening hazardous chemical containers on site.',
  },

  // Asbestos
  {
    id: 'HAZ_ASBESTOS_DISTURBANCE',
    hazard: 'Inadvertent disturbance of Asbestos Containing Materials (ACMs) / Inhalation of airborne fibres',
    category: 'ENVIRONMENT',
    trade: 'ALL',
    personsAtRisk: ['Operatives', 'Site occupants'],
    initialLikelihood: 2,
    initialSeverity: 5,
    standardControls: [
      'Inspect site Asbestos Register and location survey with building manager prior to drilling or intrusive work.',
      'Confirm work location is marked clear of known ACMs (insulation boards, pipe lagging, artex).',
      'If unexpected fibrous materials or damaged lagging are discovered, initiate immediate STOP WORK protocol.',
      'Evacuate and demarcate area with warning tape; notify EntireFM Operations and building manager immediately.',
    ],
    residualLikelihood: 1,
    residualSeverity: 2,
    entirefmMandatoryControl: 'Intrusive drilling or fixing into unverified building fabric is strictly prohibited without prior Asbestos Register sign-off.',
  },

  // Lone Working
  {
    id: 'HAZ_LONE_WORKING_INCAPACITATION',
    hazard: 'Operative sudden illness or injury while working alone / Delayed emergency medical response',
    category: 'LONE_WORKING',
    trade: 'ALL',
    personsAtRisk: ['Operatives'],
    initialLikelihood: 3,
    initialSeverity: 4,
    standardControls: [
      'Establish mandatory hourly automated SMS/app check-in schedule with central control room.',
      'High-hazard tasks (live electrical work, confined space entry, hot works) strictly prohibited while working alone.',
      'Ensure mobile phone / satellite communicator is fully charged and maintains reliable reception.',
      'Provide site security and central monitoring with operative vehicle registration and expected finish time.',
    ],
    residualLikelihood: 1,
    residualSeverity: 2,
  },

  // Slips & Trips
  {
    id: 'HAZ_SLIPS_TRIPS_FALLS',
    hazard: 'Slips, trips and same-level falls due to wet surfaces, trailing cables, debris, or poor lighting',
    category: 'ENVIRONMENT',
    trade: 'ALL',
    personsAtRisk: ['Operatives', 'Building occupants', 'Visitors'],
    initialLikelihood: 3,
    initialSeverity: 2,
    standardControls: [
      'Maintain continuous clean-as-you-go housekeeping throughout work shift.',
      'Route power leads overhead with cable hooks or enclose in heavy-duty rubber cable ramps.',
      'Position yellow "WET FLOOR / SLIP HAZARD" warning signs around mop or wet zones.',
      'Ensure work area is illuminated with minimum 200 lux task lighting.',
    ],
    residualLikelihood: 1,
    residualSeverity: 1,
  },

  // Hot Works
  {
    id: 'HAZ_HOT_WORKS_FIRE',
    hazard: 'Ignition of combustible materials from blowtorch, brazing, or grinding sparks',
    category: 'HOT_WORKS',
    trade: 'ALL',
    personsAtRisk: ['Operatives', 'Building occupants'],
    initialLikelihood: 3,
    initialSeverity: 5,
    standardControls: [
      'Obtain and activate an authorized Site Hot Works Permit prior to lighting any flame or strike.',
      'Clear all combustible materials within a 10-metre radius of the hot work area.',
      'Install fire blankets / heat-resistant spark shields behind pipework and adjacent walls.',
      'Keep 2x verified fire extinguishers (Dry Powder and Foam/Water) within 3 metres of work position.',
      'Maintain continuous 60-minute post-work fire watch with thermal imaging check before closing permit.',
    ],
    residualLikelihood: 1,
    residualSeverity: 3,
    entirefmMandatoryControl: 'Mandatory 60-minute post-hot-works fire watch must be physically manned and signed off on permit.',
  },
];

// ─────────────────────────────────────────────────────────────
// 2. CANONICAL FM ACTIVITY TEMPLATES
// ─────────────────────────────────────────────────────────────
export const CANONICAL_FM_ACTIVITIES: FmActivityTemplate[] = [
  // 1. Electrical: Lighting Replacement
  {
    id: 'ACT_ELEC_LIGHTING_REPLACEMENT',
    title: 'LED Luminaire & Emergency Lighting Replacement',
    trade: 'ELECTRICAL',
    subCategory: 'Lighting & Containment',
    description: 'De-energising, removing existing fluorescent fittings, installing LED panels/downlights, and testing emergency battery duration.',
    recommendedPpe: ['SAFETY_BOOTS', 'EYE_PROTECTION', 'GLOVES', 'HI_VIS'],
    recommendedPlant: ['ENCLOSED_PODIUM', 'APPROVED_VOLTAGE_TESTER_GS38', 'STEP_LADDER'],
    potentialPermits: ['PERMIT_TO_WORK'],
    requiresCoshh: false,
    requiresWorkingAtHeight: true,
    requiresElectricalIsolation: true,
    requiresGasIsolation: false,
    requiresHotWorks: false,
    defaultHazards: [
      CANONICAL_HAZARDS.find((h) => h.id === 'HAZ_ELEC_LIVE_CONDUCTORS')!,
      CANONICAL_HAZARDS.find((h) => h.id === 'HAZ_HEIGHT_FALL_FROM_EQUIPMENT')!,
      CANONICAL_HAZARDS.find((h) => h.id === 'HAZ_HEIGHT_DROPPED_OBJECTS')!,
      CANONICAL_HAZARDS.find((h) => h.id === 'HAZ_OCCUPIED_PUBLIC_INTERFACE')!,
    ],
    defaultMethodSteps: [
      {
        sequence: 1,
        title: 'Arrival, Site Induction & Sign-In',
        description: 'Report to site security / building reception. Sign in visitors book, present EntireFM contractor credentials, review site safety rules, and obtain necessary access keys.',
        responsibleRole: 'Lead Operative',
      },
      {
        sequence: 2,
        title: 'Work Area Setup & Pedestrian Segregation',
        description: 'Position warning signage and erect retractable safety barriers around the work zone. Ensure corridors and emergency escape routes remain unobstructed.',
        responsibleRole: 'Operatives',
      },
      {
        sequence: 3,
        title: 'Safe Electrical Isolation (LOTO)',
        description: 'Locate distribution board. Identify lighting sub-circuit breaker. Switch off, lock-off with unique padlock, attach danger tag. Prove dead at fitting with GS38 tester.',
        responsibleRole: 'Qualified Electrician',
        safetyWarnings: ['Proving dead must be conducted against a known voltage proving unit before and after verification.'],
      },
      {
        sequence: 4,
        title: 'Podium Setup & Fitting Removal',
        description: 'Erect podium steps on level floor. Disconnect wiring from old luminaire, remove mounting brackets, and lower fitting safely to floor level.',
        responsibleRole: 'Operatives',
      },
      {
        sequence: 5,
        title: 'Install New LED Luminaire & Connect Control Gear',
        description: 'Fix new luminaire mounting framework securely to ceiling structure. Connect phase, neutral, and earth terminals with correct polarity. Connect emergency battery lead.',
        responsibleRole: 'Qualified Electrician',
      },
      {
        sequence: 6,
        title: 'De-isolation, Functional & Emergency Testing',
        description: 'Remove lock-off padlock. Energise circuit breaker. Verify normal lighting operation. Simulate mains failure with test key to confirm emergency LED illumination.',
        responsibleRole: 'Qualified Electrician',
      },
      {
        sequence: 7,
        title: 'Housekeeping, Waste Packaging Removal & Departure',
        description: 'Clean work area, vacuum any dust, pack old luminaires for WEEE recycling. Dismantle barriers, report completion to client, capture digital sign-off, and sign out.',
        responsibleRole: 'Lead Operative',
      },
    ],
  },

  // 2. HVAC: AHU Servicing & Filter Replacement
  {
    id: 'ACT_HVAC_AHU_MAINTENANCE',
    title: 'Air Handling Unit (AHU) Servicing & Filter Replacement',
    trade: 'HVAC_AND_REFRIGERATION',
    subCategory: 'Mechanical Ventilation',
    description: 'Inspection of supply/extract AHUs, drive belt tensioning, coil cleaning, and replacement of pre/bag air filters.',
    recommendedPpe: ['SAFETY_BOOTS', 'FFP3_RESPIRATOR', 'EYE_PROTECTION', 'GLOVES', 'HI_VIS'],
    recommendedPlant: ['PORTABLE_HEPA_VACUUM', 'BELT_TENSION_GAUGE', 'VOLTAGE_TESTER'],
    potentialPermits: ['PLANT_ROOM_ACCESS_PERMIT'],
    requiresCoshh: true,
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: true,
    requiresGasIsolation: false,
    requiresHotWorks: false,
    defaultHazards: [
      CANONICAL_HAZARDS.find((h) => h.id === 'HAZ_ELEC_LIVE_CONDUCTORS')!,
      CANONICAL_HAZARDS.find((h) => h.id === 'HAZ_HVAC_ROTATING_PARTS')!,
      CANONICAL_HAZARDS.find((h) => h.id === 'HAZ_OCCUPIED_PUBLIC_INTERFACE')!,
    ],
    defaultMethodSteps: [
      {
        sequence: 1,
        title: 'Site Arrival & Plant Room Access',
        description: 'Sign in with site management. Confirm AHU unit identification number (e.g. AHU-01) with work order schedule.',
        responsibleRole: 'Lead Engineer',
      },
      {
        sequence: 2,
        title: 'Electrical Isolation & LOTO',
        description: 'Switch off AHU at local motor control panel (MCP) and lock off main rotary isolator. Wait for all fan momentum to halt.',
        responsibleRole: 'HVAC Engineer',
      },
      {
        sequence: 3,
        title: 'Filter Extraction & Bagging',
        description: 'Don FFP3 dust mask. Open filter access doors. Slide out old panel and bag filters directly into heavy-duty polythene disposal bags to avoid particulate spread.',
        responsibleRole: 'HVAC Engineer',
      },
      {
        sequence: 4,
        title: 'Coil Inspection, Cleaning & Belt Check',
        description: 'Inspect cooling/heating coils. Vacuum loose debris with HEPA vacuum. Check fan drive belt for cracks, wear, and correct deflection tension.',
        responsibleRole: 'HVAC Engineer',
      },
      {
        sequence: 5,
        title: 'Install Fresh Certified Filters',
        description: 'Insert new G4/F7 filter sets observing correct airflow direction arrows. Check seals for zero bypass gaps. Fasten access doors securely.',
        responsibleRole: 'HVAC Engineer',
      },
      {
        sequence: 6,
        title: 'De-isolation, Airflow Commissioning & Sign-Off',
        description: 'Remove lock-off padlock. Restart AHU. Check for smooth fan running and normal differential pressure across filter bank. Record readings on service report.',
        responsibleRole: 'Lead Engineer',
      },
    ],
  },

  // 3. Commercial Gas & Heating: Boiler PPM
  {
    id: 'ACT_GAS_COMMERCIAL_BOILER_PPM',
    title: 'Commercial Gas Boiler Service & Flue Gas Analysis',
    trade: 'GAS_AND_HEATING',
    subCategory: 'Commercial Boilers',
    description: 'Annual statutory servicing of commercial condensing gas boiler plant, burner inspection, safety interlock tests, and combustion analysis.',
    recommendedPpe: ['SAFETY_BOOTS', 'GLOVES', 'EYE_PROTECTION', 'HI_VIS'],
    recommendedPlant: ['CALIBRATED_FLUE_GAS_ANALYSER', 'GAS_LEAK_DETECTOR', 'PRESSURE_MANOMETER'],
    potentialPermits: ['GAS_SAFE_PERMIT', 'PLANT_ROOM_PERMIT'],
    requiresCoshh: false,
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: true,
    requiresGasIsolation: true,
    requiresHotWorks: false,
    defaultHazards: [
      CANONICAL_HAZARDS.find((h) => h.id === 'HAZ_GAS_UNCONTROLLED_ESCAPE')!,
      CANONICAL_HAZARDS.find((h) => h.id === 'HAZ_ELEC_LIVE_CONDUCTORS')!,
    ],
    defaultMethodSteps: [
      {
        sequence: 1,
        title: 'Arrival & Plant Room Risk Assessment',
        description: 'Report to site, sign in, inspect plant room ventilation louvres and emergency gas shut-off valve locations.',
        responsibleRole: 'Commercial Gas Engineer',
      },
      {
        sequence: 2,
        title: 'Initial Flue Gas & Combustion Benchmark',
        description: 'Connect calibrated flue gas analyser probe to sampling point. Run boiler on high fire and record initial CO, CO2, O2 and ratio readings.',
        responsibleRole: 'Commercial Gas Engineer',
      },
      {
        sequence: 3,
        title: 'Isolation & Burner Strip-Down',
        description: 'Isolate gas supply and electrical power. Remove burner door. Clean heat exchanger waterways, electrodes, and condensate trap.',
        responsibleRole: 'Commercial Gas Engineer',
      },
      {
        sequence: 4,
        title: 'Reassembly, Gas Tightness Test & Safety Checks',
        description: 'Reassemble with new manufacturer gaskets. Carry out 2-minute gas tightness test with digital manometer. Test high limit thermostat and low water cutoff.',
        responsibleRole: 'Commercial Gas Engineer',
      },
      {
        sequence: 5,
        title: 'Final Flue Gas Analysis & Digital Certificate',
        description: 'Operate on low and high fire. Record final combustion efficiency and print/save digital Gas Safe commercial inspection report.',
        responsibleRole: 'Commercial Gas Engineer',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 3. BUSINESS TEMPLATE -> RAMS RECORD PRESET MAPPING ENGINE
// ─────────────────────────────────────────────────────────────

export interface RamsHazardInit {
  id: string;
  hazard: string;
  category: string;
  personsAtRisk: string[];
  initialLikelihood: RiskLikelihood;
  initialSeverity: RiskSeverity;
  initialRiskScore: number;
  controls: string[];
  residualLikelihood: RiskLikelihood;
  residualSeverity: RiskSeverity;
  residualRiskScore: number;
  entirefmMandatoryControl?: string;
}

export interface TemplateRamsPreset {
  templateId: string;
  templateTitle: string;
  templateDescription: string;
  trade: TradeScope;
  defaultTitle: string;
  workScopeDescription: string;
  requiresWorkingAtHeight: boolean;
  requiresElectricalIsolation: boolean;
  requiresHotWorks: boolean;
  requiresGasIsolation: boolean;
  hazards: RamsHazardInit[];
  methodSteps: CanonicalMethodStep[];
  selectedPpe: string[];
  selectedPlant: string[];
  requiredPermits: string[];
  checklistSections: Array<{
    title: string;
    items: string[];
  }>;
}

function hazardFromCanonical(id: string, customControls?: string[]): RamsHazardInit {
  const c = CANONICAL_HAZARDS.find((h) => h.id === id);
  if (!c) {
    return {
      id,
      hazard: id,
      category: 'GENERAL',
      personsAtRisk: ['Operatives'],
      initialLikelihood: 3,
      initialSeverity: 3,
      initialRiskScore: 9,
      controls: customControls || ['Standard FM safety controls applied.'],
      residualLikelihood: 1,
      residualSeverity: 2,
      residualRiskScore: 2,
    };
  }
  const init = calculateRiskScore(c.initialLikelihood, c.initialSeverity);
  const res = calculateRiskScore(c.residualLikelihood, c.residualSeverity);
  return {
    id: c.id,
    hazard: c.hazard,
    category: c.category,
    personsAtRisk: c.personsAtRisk,
    initialLikelihood: c.initialLikelihood,
    initialSeverity: c.initialSeverity,
    initialRiskScore: init.score,
    controls: customControls || c.standardControls,
    residualLikelihood: c.residualLikelihood,
    residualSeverity: c.residualSeverity,
    residualRiskScore: res.score,
    entirefmMandatoryControl: c.entirefmMandatoryControl,
  };
}

export const RAMS_TEMPLATE_PRESETS: Record<string, TemplateRamsPreset> = {
  'hs-rams-unified': {
    templateId: 'hs-rams-unified',
    templateTitle: 'Unified RAMS Document',
    templateDescription: 'Combined Risk Assessment & Method Statement pack with operative sign-off briefing.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Facilities Management Unified RAMS Pack',
    workScopeDescription: 'Comprehensive planned maintenance and reactive engineering scope adhering to EntireFM safety management systems.',
    requiresWorkingAtHeight: true,
    requiresElectricalIsolation: true,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_SLIPS_TRIPS_FALLS'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
      hazardFromCanonical('HAZ_HEIGHT_FALL_FROM_EQUIPMENT'),
      hazardFromCanonical('HAZ_ELEC_LIVE_CONDUCTORS'),
      hazardFromCanonical('HAZ_MANUAL_HANDLING_INJURY'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Arrival, Site Induction & Work Order Confirmation', description: 'Report to site reception, sign visitor register, confirm work scope and inspect site hazards.', responsibleRole: 'Lead Operative' },
      { sequence: 2, title: 'Work Area Segregation & Warning Signage', description: 'Erect physical barriers around the work zone and deploy safety warning signs to protect occupants.', responsibleRole: 'Operatives' },
      { sequence: 3, title: 'Safe Isolation & Pre-Use Plant Checks', description: 'Verify all isolation locks and tags, inspect access equipment tags and personal protective gear.', responsibleRole: 'Lead Operative' },
      { sequence: 4, title: 'Execution of Scheduled Technical Works', description: 'Carry out planned works in accordance with manufacturer guidelines and EntireFM standard operating procedures.', responsibleRole: 'Qualified Engineer' },
      { sequence: 5, title: 'Functional Commissioning & Quality Verification', description: 'Test newly installed or serviced plant, restore isolations safely, and benchmark operational metrics.', responsibleRole: 'Qualified Engineer' },
      { sequence: 6, title: 'Housekeeping, Recycling & Handover Sign-Off', description: 'Clear work area, remove packaging and waste, demonstrate system operation to client, capture digital sign-off.', responsibleRole: 'Lead Operative' },
    ],
    selectedPpe: ['Safety Boots', 'High Visibility Vest', 'Safety Glasses', 'General Work Gloves'],
    selectedPlant: ['Enclosed Podium Steps', 'GS38 Approved Voltage Tester', 'First Aid Kit'],
    requiredPermits: ['Permit to Work', 'Plant Room Access Permit'],
    checklistSections: [
      { title: 'RAMS Header & Scope', items: ['Project / Client Name', 'Prepared By (Competent Person)', 'Emergency Contact & Phone', 'Detailed Scope of Works', 'Operative Briefing Acknowledgement'] },
    ],
  },

  'hs-risk-assessment': {
    templateId: 'hs-risk-assessment',
    templateTitle: 'General Risk Assessment',
    templateDescription: 'Hazard identification, severity scoring, control measures, and residual risk evaluation.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Job-Specific 5x5 Matrix Risk Assessment',
    workScopeDescription: 'Task-level hazard identification and risk control evaluation across site environment, public interfaces, and mechanical tools.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_SLIPS_TRIPS_FALLS'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
      hazardFromCanonical('HAZ_MANUAL_HANDLING_INJURY'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Dynamic Site Assessment & Point-of-Work Hazard Scan', description: 'Inspect immediate work environment for newly introduced hazards, wet surfaces, or occupant traffic.', responsibleRole: 'Lead Operative' },
      { sequence: 2, title: 'Control Measure Implementation', description: 'Deploy barrier demarcations, safety signage, and verify all control measures are active prior to starting.', responsibleRole: 'Operatives' },
      { sequence: 3, title: 'Safe Task Execution', description: 'Perform tasks strictly within the boundaries of the assessed risk envelope.', responsibleRole: 'Operatives' },
      { sequence: 4, title: 'Continuous Risk Monitoring', description: 'Review site conditions periodically; pause work if external conditions alter safety profile.', responsibleRole: 'Lead Operative' },
    ],
    selectedPpe: ['Safety Boots', 'High Visibility Vest', 'Safety Glasses', 'Cut Resistant Gloves'],
    selectedPlant: ['Safety Barriers / Cones', 'First Aid Kit'],
    requiredPermits: ['Permit to Work'],
    checklistSections: [
      { title: 'Project & Site Information', items: ['Site Location / Address', 'Competent Assessor Name', 'Date of Assessment', 'Task / Activity Description'] },
      { title: 'Identified Hazards & Controls', items: ['Applicable Hazards (Electrical, Height, Manual Handling, Slips/Trips, Hot Works)', 'Persons at Risk verified', 'Specific Control Measures Applied', 'Mandatory PPE checked', 'Residual Risk Level confirmed'] },
    ],
  },

  'hs-method-statement': {
    templateId: 'hs-method-statement',
    templateTitle: 'Method Statement',
    templateDescription: 'Step-by-step safe sequence of works, plant requirements, and operative supervision.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Safe Sequence of Works Method Statement',
    workScopeDescription: 'Detailed step-by-step sequential method of execution, logistics, access arrangements, and handover verification.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_SLIPS_TRIPS_FALLS'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Site Logistics & Access Arrangements', description: 'Confirm loading bay access, deliver plant and materials safely to plant room, and brief team on access/egress routes.', responsibleRole: 'Site Supervisor' },
      { sequence: 2, title: 'Tool & Equipment Pre-Start Verification', description: 'Check calibration tags, test emergency stops, and confirm all required plant is on site.', responsibleRole: 'Lead Engineer' },
      { sequence: 3, title: 'Sequential Task Execution (Phase 1: Disassembly / Preparation)', description: 'Commence initial phase of work under direct supervisor coordination.', responsibleRole: 'Operatives' },
      { sequence: 4, title: 'Sequential Task Execution (Phase 2: Installation / Servicing)', description: 'Complete main mechanical/electrical/fabric components according to specification.', responsibleRole: 'Operatives' },
      { sequence: 5, title: 'Inspection, Commissioning & Handover', description: 'Verify safe operation, conduct quality checks, clean site, and present handover paperwork to client.', responsibleRole: 'Site Supervisor' },
    ],
    selectedPpe: ['Safety Boots', 'High Visibility Vest', 'Safety Glasses', 'General Work Gloves'],
    selectedPlant: ['Toolbox & Hand Tools', 'Safety Signage'],
    requiredPermits: ['Permit to Work'],
    checklistSections: [
      { title: 'Method Overview & Logistics', items: ['Activity Name & Objective', 'Site Supervisor / Lead Name', 'Access & Egress Plan', 'Plant, Machinery & Tools Required', 'Sequential Step Sequence Briefed'] },
    ],
  },

  'hs-dynamic-ra': {
    templateId: 'hs-dynamic-ra',
    templateTitle: 'Dynamic Risk Assessment (DRA)',
    templateDescription: 'Real-time on-site risk evaluation for unexpected or changing field conditions.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Dynamic Risk Assessment (DRA) — Field Evaluation',
    workScopeDescription: 'Immediate point-of-work risk evaluation triggered by unexpected site conditions, adverse weather, or live environmental hazards.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_SLIPS_TRIPS_FALLS'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Identify Dynamic Trigger / Site Change', description: 'Observe unexpected change in site environment (e.g. water leak, tenant presence, structural damage, weather deterioration).', responsibleRole: 'Operatives' },
      { sequence: 2, title: 'Immediate Work Pause & Point-of-Work Evaluation', description: 'Pause active work. Evaluate whether existing RAMS controls remain sufficient or if additional safeguards are required.', responsibleRole: 'Lead Operative' },
      { sequence: 3, title: 'Apply Adapted Controls or Escalate Stop Work', description: 'Deploy secondary barriers, upgrade PPE, or initiate STOP WORK escalation if risk cannot be mitigated locally.', responsibleRole: 'Lead Operative' },
      { sequence: 4, title: 'Re-authorisation & Safe Resumption', description: 'Confirm with EntireFM Operations / building management that adapted controls make it safe to proceed.', responsibleRole: 'Lead Operative' },
    ],
    selectedPpe: ['Safety Boots', 'High Visibility Vest', 'Safety Glasses', 'Gloves'],
    selectedPlant: ['Demarcation Tape', 'Task Lighting'],
    requiredPermits: ['Permit to Work'],
    checklistSections: [
      { title: 'Dynamic Field Evaluation', items: ['Trigger Reason for Dynamic Assessment', 'Immediate Action Taken / Work Paused', 'Adapted Controls Implemented', 'Safe to Proceed Confirmation'] },
    ],
  },

  'hs-working-at-height': {
    templateId: 'hs-working-at-height',
    templateTitle: 'Working at Height Assessment',
    templateDescription: 'Ladder, podium, tower scaffold, MEWP selection, and fall arrest verification.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Working at Height Safety Assessment & Access Plan',
    workScopeDescription: 'Elevated works utilising podium steps, mobile access towers (PASMA), or MEWPs with 360-degree guardrails and ground-level exclusion.',
    requiresWorkingAtHeight: true,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_HEIGHT_FALL_FROM_EQUIPMENT'),
      hazardFromCanonical('HAZ_HEIGHT_DROPPED_OBJECTS'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Ground Inspection & Exclusion Zone Setup', description: 'Check ground is level, firm, and capable of supporting access plant. Erect physical barriers beneath work position with overhead warning signs.', responsibleRole: 'Operatives' },
      { sequence: 2, title: 'Access Equipment Pre-Use Inspection', description: 'Inspect podium steps / tower components. Verify Scafftag is current, outriggers locked, brakes applied, and guardrails secure.', responsibleRole: 'PASMA / Competent Operative' },
      { sequence: 3, title: 'Tool Tethering & Safe Ascent', description: 'Attach wrist lanyards / tool tethers to hand tools. Ascend maintaining 3 points of contact. Never carry loose tools while climbing.', responsibleRole: 'Operative at Height' },
      { sequence: 4, title: 'Execution of Elevated Works', description: 'Work strictly within the guarded platform envelope. Never lean over guardrails or stand on intermediate toe boards.', responsibleRole: 'Operative at Height' },
      { sequence: 5, title: 'Platform Clearance & Dismantling', description: 'Lower tools and materials safely before descending. Dismantle or fold access equipment, clear exclusion barriers, and complete sign-off.', responsibleRole: 'Operatives' },
    ],
    selectedPpe: ['Safety Boots', 'Safety Helmet with Chin Strap (EN 397)', 'High Visibility Vest', 'Safety Glasses', 'Gloves'],
    selectedPlant: ['Enclosed Podium Steps (PIRANHA / Youngman)', 'Mobile Access Tower (PASMA)', 'Tool Lanyards', 'Exclusion Barriers'],
    requiredPermits: ['Working at Height Permit', 'Permit to Work'],
    checklistSections: [
      { title: 'Height Access Protocol', items: ['Equipment Used (Podium Steps / PASMA Tower / MEWP)', 'Maximum Working Height recorded', 'Inspection Tag / Scafftag Valid', 'Ground Condition Level & Firm', 'Exclusion Zone Created Below'] },
    ],
  },

  'hs-electrical-safety': {
    templateId: 'hs-electrical-safety',
    templateTitle: 'Electrical Isolation & LOTO Checklist',
    templateDescription: 'Safe isolation procedure, GS38 testing, warning notices, and multi-padlock verification.',
    trade: 'ELECTRICAL',
    defaultTitle: 'Safe Electrical Isolation & LOTO Procedure RAMS',
    workScopeDescription: 'Invasive electrical servicing, component replacement, and circuit modification requiring safe lock-out/tag-out (LOTO) and GS38 dead-test verification.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: true,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_ELEC_LIVE_CONDUCTORS'),
      hazardFromCanonical('HAZ_ELEC_STORED_ENERGY'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Circuit Identification & Client Permission', description: 'Locate local distribution board. Identify exact sub-circuit reference. Notify client before isolation.', responsibleRole: 'Qualified Electrician' },
      { sequence: 2, title: 'Switch Off & Lock-Out / Tag-Out (LOTO)', description: 'Switch off MCB/MCCB or isolator. Fit approved lock-off device and personal unique padlock. Attach danger warning tag.', responsibleRole: 'Qualified Electrician' },
      { sequence: 3, title: 'GS38 Proving Unit Dead Test Verification', description: 'Test approved voltage indicator against proving unit. Test circuit dead across Phase-Neutral, Phase-Earth, and Neutral-Earth. Re-prove tester.', responsibleRole: 'Qualified Electrician' },
      { sequence: 4, title: 'Carry Out Electrical Works', description: 'Perform repairs or cable connections with circuit proven dead. Keep padlock key on operative person at all times.', responsibleRole: 'Qualified Electrician' },
      { sequence: 5, title: 'Inspection, De-Isolation & Testing', description: 'Inspect connections, replace DB cover plates, remove lock-off padlock, energise circuit and verify operational voltage.', responsibleRole: 'Qualified Electrician' },
    ],
    selectedPpe: ['Safety Boots (Dielectric / Composite)', 'Safety Glasses (EN 166)', 'Flame Retardant Workwear', 'Insulated Gloves (1000V rated)'],
    selectedPlant: ['Approved Voltage Indicator (GS38 compliant)', 'Dedicated Voltage Proving Unit', 'Unique LOTO Padlocks & Lock-Off Hasp', 'Danger Warning Tags'],
    requiredPermits: ['Electrical Isolation Permit', 'Permit to Work'],
    checklistSections: [
      { title: 'Safe Isolation Procedure', items: ['Circuit / DB Reference Isolated', 'Tested Dead with Approved Voltage Indicator & Proving Unit', 'Padlock and Danger Warning Tag Attached', 'Key Retained by Competent Electrician'] },
    ],
  },

  'hs-confined-space': {
    templateId: 'hs-confined-space',
    templateTitle: 'Confined Space Entry Assessment',
    templateDescription: 'Atmospheric testing, ventilation, top-man standby, and rescue equipment.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Confined Space Entry & Atmospheric Safety RAMS',
    workScopeDescription: 'Entry into restricted chambers, drainage sumps, service ducts, or plant voids under Confined Spaces Regulations 1997.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_CONFINED_SPACE_ATMOSPHERE'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Atmospheric Pre-Entry Testing', description: 'Lower calibrated 4-gas detector probe into space. Sample atmosphere at top, middle, and bottom for O2 (20.9%), H2S (0ppm), CO (0ppm), and LEL (0%).', responsibleRole: 'Competent Entrant' },
      { sequence: 2, title: 'Forced Air Ventilation & Standby Setup', description: 'Position mechanical blower unit to provide continuous fresh air exchange. Position man-riding tripod and rescue winch over opening.', responsibleRole: 'Top-Man / Sentry' },
      { sequence: 3, title: 'Chamber Entry under Top-Man Supervision', description: 'Entrant dons full body harness connected to winch line and wears continuous personal gas monitor. Top-man logs entry time.', responsibleRole: 'Competent Entrant' },
      { sequence: 4, title: 'Execution of Confined Space Task', description: 'Perform work while maintaining constant 2-way voice communication with top-man sentry.', responsibleRole: 'Competent Entrant' },
      { sequence: 5, title: 'Chamber Egress & Secure Opening', description: 'Entrant exits chamber. Disconnect winch line. Replace and lock manhole/access cover. Log departure with site security.', responsibleRole: 'Top-Man / Sentry' },
    ],
    selectedPpe: ['Safety Boots', 'Full Body Confined Space Harness (EN 361)', 'Safety Helmet with Lamp', 'Eye Protection', 'Chemical / Nitrile Gloves'],
    selectedPlant: ['Calibrated 4-Gas Monitor (O2, H2S, CO, LEL)', 'Continuous Forced Air Ventilation Blower', 'Man-Riding Rescue Tripod & Winch', 'Emergency Escape BA (EEBA 15-min set)'],
    requiredPermits: ['Confined Space Entry Permit', 'Permit to Work'],
    checklistSections: [
      { title: 'Confined Space Controls', items: ['Space Identifier / Chamber Location', 'Gas Detector Serial / Calibration Date verified', 'Oxygen Level Checked (20.9%)', 'Dedicated Top-Man / Sentry confirmed', 'Tripod, Winch & Escape BA Ready'] },
    ],
  },

  'trade-confined-space-assessment': {
    templateId: 'trade-confined-space-assessment',
    templateTitle: 'Confined Space Entry Risk Assessment',
    templateDescription: 'Confined Spaces Regulations 1997 atmospheric hazard scoring, continuous gas monitor calibration, and ventilation plan.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Specialist Confined Space Entry & Atmospheric Plan',
    workScopeDescription: 'Specialist confined space access, atmospheric logging, bump testing, forced mechanical air, and extraction sentry.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_CONFINED_SPACE_ATMOSPHERE'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Bump Test & Calibration Check', description: 'Perform bump test on 4-gas detector against calibration gas cylinder before arriving at entry point.', responsibleRole: 'Top-Man Sentry' },
      { sequence: 2, title: 'Atmospheric Sampling & Forced Air Deployment', description: 'Sample atmosphere through probe. Verify zero toxic gases and normal 20.9% oxygen. Turn on continuous forced air blower.', responsibleRole: 'Lead Operative' },
      { sequence: 3, title: 'Chamber Entry with Winch Connection', description: 'Connect operative harness to certified rescue winch. Top-man remains at entry aperture at all times.', responsibleRole: 'Top-Man Sentry' },
      { sequence: 4, title: 'Carry Out Internal Servicing / Inspection', description: 'Perform required internal works with continuous gas monitor clipped in breathing zone.', responsibleRole: 'Entrant' },
      { sequence: 5, title: 'Extraction, Cover Securing & Permit Closeout', description: 'Entrant exits chamber. Fasten manhole cover. Complete gas log readings and sign off permit with client.', responsibleRole: 'Lead Operative' },
    ],
    selectedPpe: ['Safety Boots', 'Full Body Harness', 'Hard Hat with Headlamp', 'Safety Glasses', 'Nitrile Gloves'],
    selectedPlant: ['4-Gas Monitor Bump Tested', 'Forced Air Blower & Ducting', 'Man-Riding Tripod & Fall Arrest Winch', 'EEBA Escape Breathing Apparatus'],
    requiredPermits: ['Confined Space Entry Permit'],
    checklistSections: [
      { title: 'Atmospheric & Ingress Hazards', items: ['Confined Space Category classified', '4-Gas Monitor Bump Tested & Calibrated Today (O2, H2S, CO, LEL)', 'Continuous Forced Air Ventilation Unit Positioned', 'Dedicated Top-Man / Sentry Named (Never leaves opening)'] },
    ],
  },

  'trade-confined-space-rescue': {
    templateId: 'trade-confined-space-rescue',
    templateTitle: 'Confined Space Rescue & Evacuation Plan',
    templateDescription: 'Tripod, winch, emergency escape breathing apparatus (EEBA 10/15 min), and rescue protocol.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Confined Space Rescue & Emergency Retrieval Protocol',
    workScopeDescription: 'Emergency retrieval and extraction protocol for confined space operatives, standby rescue equipment, and trauma evacuation.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_CONFINED_SPACE_ATMOSPHERE'),
      hazardFromCanonical('HAZ_LONE_WORKING_INCAPACITATION'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Pre-Work Rescue Equipment Benchmark', description: 'Verify man-riding rescue tripod anchor points, winch brake clutch, and check pressure gauge on EEBA 15-minute sets.', responsibleRole: 'Designated Rescuer' },
      { sequence: 2, title: 'Emergency Communication Briefing', description: 'Brief entrant and top-man on radio call signs, emergency whistle signals, and designated 999 egress point.', responsibleRole: 'Designated Rescuer' },
      { sequence: 3, title: 'Emergency Retrieval Protocol (No-Entry Retrieval)', description: 'If entrant becomes unresponsive, top-man immediately operates winch to extract casualty without entering space.', responsibleRole: 'Top-Man Sentry' },
      { sequence: 4, title: 'Emergency Services Liaison & Trauma Care', description: 'Dial 999. Administer first aid / oxygen at surface level, meet paramedics at designated site gate.', responsibleRole: 'Lead Operative' },
    ],
    selectedPpe: ['Safety Boots', 'Rescue Harness', 'Helmet', 'Gloves'],
    selectedPlant: ['Man-Riding Tripod & Winch (LOLER certified)', 'EEBA 15-Min Escape Sets', 'ATEX Emergency Radios', 'First Aid Trauma Kit & Defibrillator'],
    requiredPermits: ['Confined Space Entry Permit'],
    checklistSections: [
      { title: 'Extraction & Emergency Equipment', items: ['Man-Riding Tripod & Fall Arrest Winch Inspected Today', 'Emergency Escape Breathing Apparatus (EEBA) Checked (10-15 min sets)', 'Top-Man to Entrant Communication Method verified', 'Designated Nearest Hospital with Trauma Facility confirmed'] },
    ],
  },

  'hs-hot-works': {
    templateId: 'hs-hot-works',
    templateTitle: 'Hot Works Permit & Fire Watch Log',
    templateDescription: 'Brazing, cutting, welding authorization with mandatory 60-min post-work fire watch.',
    trade: 'HVAC_AND_REFRIGERATION',
    defaultTitle: 'Hot Works Safety & Fire Watch Protocol RAMS',
    workScopeDescription: 'Brazing, flame cutting, welding, or abrasive grinding with spark mitigation, fire blankets, and mandatory 60-minute post-work fire watch.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: true,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_HOT_WORKS_FIRE'),
      hazardFromCanonical('HAZ_COSHH_CHEMICAL_EXPOSURE'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Hot Works Area Clearance & Isolation', description: 'Clear all combustible materials within 10m radius. Install fire blankets / spark shields behind pipework. Verify building fire alarm isolation if applicable.', responsibleRole: 'Qualified Engineer' },
      { sequence: 2, title: 'Fire Extinguisher & Equipment Inspection', description: 'Position 2x verified fire extinguishers (CO2 and Foam/Water) within 3 metres of flame position. Inspect oxy-acetylene flashback arrestors.', responsibleRole: 'Qualified Engineer' },
      { sequence: 3, title: 'Execute Hot Works Operations', description: 'Light torch / strike arc. Complete brazing or cutting keeping spark spread contained within shielded zone.', responsibleRole: 'Qualified Engineer' },
      { sequence: 4, title: 'Mandatory 60-Minute Fire Watch', description: 'Maintain continuous physically manned fire watch for 60 minutes after extinguishing flame. Conduct thermal imaging scan of adjacent surfaces.', responsibleRole: 'Fire Watch Operative' },
      { sequence: 5, title: 'Permit Sign-Off & Alarm Reinstatement', description: 'Verify zero smouldering or heat spots. Reinstate fire alarm zone. Sign off hot works permit with building manager.', responsibleRole: 'Qualified Engineer' },
    ],
    selectedPpe: ['Safety Boots', 'Welding / Brazing Goggles (Shade 5)', 'Flame Retardant Leather Gauntlets', 'Flame Retardant Overalls'],
    selectedPlant: ['Flashback Arrestors (EN 730)', 'Fire Retardant Blankets / Spark Shields', '2x Fire Extinguishers (CO2 / Foam)', 'Thermal Imaging Camera'],
    requiredPermits: ['Hot Works Permit', 'Permit to Work'],
    checklistSections: [
      { title: 'Hot Works Authorisation', items: ['Hot Work Type classified', 'Combustibles Cleared 10m Radius', 'Extinguisher Next to Operative (CO2 / Foam)', '60-Minute Post-Work Fire Watch Completed', 'Permit Expiry Time logged'] },
    ],
  },

  'hs-coshh': {
    templateId: 'hs-coshh',
    templateTitle: 'COSHH Substance Assessment',
    templateDescription: 'Control of Substances Hazardous to Health evaluation, storage, and spill response.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'COSHH Chemical & Hazardous Substance Assessment RAMS',
    workScopeDescription: 'Application and handling of chemicals, biocides, refrigerant oils, degreasers, or solvent adhesives under COSHH Regulations.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_COSHH_CHEMICAL_EXPOSURE'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Safety Data Sheet (SDS) & Exposure Check', description: 'Review product SDS. Identify hazard symbols (corrosive, irritant, toxic) and required personal protection.', responsibleRole: 'Lead Operative' },
      { sequence: 2, title: 'Ventilation & Spill Kit Preparation', description: 'Ensure work area has adequate mechanical or natural cross-ventilation. Position chemical absorbent spill kit and eyewash bottles.', responsibleRole: 'Operatives' },
      { sequence: 3, title: 'Safe Application of Substance', description: 'Apply product using designated applicators while wearing nitrile/chemical gauntlets and eye protection.', responsibleRole: 'Operatives' },
      { sequence: 4, title: 'Waste Container Sealing & COSHH Storage', description: 'Seal chemical containers immediately after use. Bag empty canisters and contaminated wipes for hazardous waste disposal.', responsibleRole: 'Operatives' },
    ],
    selectedPpe: ['Chemical Resistant Nitrile/Butyl Gloves', 'Chemical Splash Goggles (EN 166)', 'FFP3 Organic Vapour Respirator', 'Safety Boots'],
    selectedPlant: ['Chemical Spill Containment Kit', 'Emergency Eyewash Bottles', 'Locked COSHH Storage Box'],
    requiredPermits: ['Permit to Work'],
    checklistSections: [
      { title: 'Substance Details & Containment', items: ['Product / Chemical Name identified', 'Hazard Classification checked', 'Route of Exposure evaluated', 'First Aid Measures reviewed', 'Spill Containment Procedure in place'] },
    ],
  },

  'hs-lone-working': {
    templateId: 'hs-lone-working',
    templateTitle: 'Lone Working Assessment',
    templateDescription: 'Check-in schedule, communication protocols, and emergency escalation.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Lone Worker Safety & Monitoring Protocol RAMS',
    workScopeDescription: 'Single-operative attendance on unoccupied or remote facility sites with automated check-in and emergency escalation.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_LONE_WORKING_INCAPACITATION'),
      hazardFromCanonical('HAZ_SLIPS_TRIPS_FALLS'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Pre-Shift Check-In & Schedule Notification', description: 'Log start of lone working shift with central monitoring / operations supervisor. Confirm hourly check-in frequency.', responsibleRole: 'Lone Operative' },
      { sequence: 2, title: 'Site Orientation & Emergency Exit Check', description: 'Verify all emergency exit doors open freely from inside. Confirm mobile phone signal strength in all plant rooms.', responsibleRole: 'Lone Operative' },
      { sequence: 3, title: 'Execution of Low/Medium Hazard Tasks', description: 'Perform scheduled inspection and maintenance. Strictly avoid prohibited high-hazard tasks while alone.', responsibleRole: 'Lone Operative' },
      { sequence: 4, title: 'End of Shift Check-Out', description: 'Confirm completion of work, lock site gates/doors, and send final check-out confirmation to operations control.', responsibleRole: 'Lone Operative' },
    ],
    selectedPpe: ['Safety Boots', 'High Visibility Vest', 'Safety Glasses', 'Gloves'],
    selectedPlant: ['Lone Worker App / GPS Device', 'Fully Charged Mobile Phone', 'Portable First Aid Kit'],
    requiredPermits: ['Permit to Work'],
    checklistSections: [
      { title: 'Lone Worker Controls', items: ['Lone Worker Name confirmed', 'Check-in Interval scheduled (e.g. hourly)', 'Designated Check-In Monitor assigned', 'High Hazard Work Prohibited acknowledged'] },
    ],
  },

  'hs-manual-handling': {
    templateId: 'hs-manual-handling',
    templateTitle: 'Manual Handling Assessment',
    templateDescription: 'Heavy lifting assessment, mechanical lifting aids, and route clearance.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Manual Handling & Mechanical Lifting Assessment RAMS',
    workScopeDescription: 'Safe lifting, moving, and positioning of heavy plant components (motors, pumps, compressor blocks) using mechanical aids and team lifts.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_MANUAL_HANDLING_INJURY'),
      hazardFromCanonical('HAZ_SLIPS_TRIPS_FALLS'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Load Evaluation & Route Survey', description: 'Assess component weight (>20kg triggers mechanical aid or team lift). Walk transport path to confirm doorway widths and ramp clearances.', responsibleRole: 'Lead Operative' },
      { sequence: 2, title: 'Deploy Mechanical Lifting Equipment', description: 'Position pallet truck, sack barrow, or portable A-frame hoist. Check equipment SWL (Safe Working Load) exceeds component weight.', responsibleRole: 'Operatives' },
      { sequence: 3, title: 'Secured Component Movement', description: 'Strap component to handling trolley. Move load keeping center of gravity low and stable.', responsibleRole: 'Operatives' },
      { sequence: 4, title: 'Final Positioning & Securing', description: 'Lower component onto plinth or mounting bracket using controlled kinetic lifting principles.', responsibleRole: 'Operatives' },
    ],
    selectedPpe: ['Safety Boots with Metatarsal Protection', 'Heavy Duty Grip Gloves', 'High Visibility Vest'],
    selectedPlant: ['Hydraulic Pallet Truck', 'Heavy-Duty Sack Barrow', 'Ratchet Tie-Down Straps'],
    requiredPermits: ['Permit to Work'],
    checklistSections: [
      { title: 'Lifting Task Assessment', items: ['Description of Load / Plant Component', 'Estimated Weight (kg) logged', 'Team Lift or Mechanical Aid Required confirmed', 'Transport Route Clear of Obstructions verified'] },
    ],
  },

  'hs-asbestos-awareness': {
    templateId: 'hs-asbestos-awareness',
    templateTitle: 'Asbestos Demarcation Checklist',
    templateDescription: 'Demarcation confirmation, register inspection, and emergency stop protocol.',
    trade: 'BUILDING_FABRIC',
    defaultTitle: 'Asbestos Register Review & Avoidance RAMS',
    workScopeDescription: 'Pre-work inspection of building asbestos management plan to ensure zero drilling or disturbance of known ACM zones.',
    requiresWorkingAtHeight: false,
    requiresElectricalIsolation: false,
    requiresHotWorks: false,
    requiresGasIsolation: false,
    hazards: [
      hazardFromCanonical('HAZ_ASBESTOS_DISTURBANCE'),
      hazardFromCanonical('HAZ_OCCUPIED_PUBLIC_INTERFACE'),
    ],
    methodSteps: [
      { sequence: 1, title: 'Asbestos Register Review with Building Manager', description: 'Inspect site Asbestos Register drawings. Confirm target work room/ceiling void is documented clear of ACMs.', responsibleRole: 'Lead Operative' },
      { sequence: 2, title: 'Visual Demarcation & Briefing', description: 'Brief all operatives on any adjacent ACM locations (e.g. labelled risers or boiler flues) that must not be touched.', responsibleRole: 'Lead Operative' },
      { sequence: 3, title: 'Non-Intrusive Task Execution', description: 'Carry out works using surface mount fixings or existing containment routes without cutting into suspicious materials.', responsibleRole: 'Operatives' },
      { sequence: 4, title: 'Emergency Discovery Protocol (If ACM Suspected)', description: 'If unlabelled fibrous material is found, halt work immediately, evacuate area, tape off room, and notify EntireFM.', responsibleRole: 'Lead Operative' },
    ],
    selectedPpe: ['Safety Boots', 'High Visibility Vest', 'FFP3 Respirator (Emergency Standby)', 'Disposable Type 5/6 Coveralls (Emergency Standby)'],
    selectedPlant: ['Asbestos Register Copy', 'Warning Barrier Tape', 'STOP WORK Protocol Card'],
    requiredPermits: ['Permit to Work'],
    checklistSections: [
      { title: 'Asbestos Register Review', items: ['Site Asbestos Register Inspected', 'Known or Presumed ACM in Work Zone checked', 'Operatives Briefed on Emergency Stop Protocol'] },
    ],
  },
};

export function getRamsPresetFromTemplate(templateId: string): TemplateRamsPreset | null {
  const normalizedId = templateId.replace('hs-rams', 'hs-rams-unified').replace('hs-dra', 'hs-dynamic-ra');
  if (RAMS_TEMPLATE_PRESETS[normalizedId]) {
    return RAMS_TEMPLATE_PRESETS[normalizedId];
  }
  // Fallback check
  return RAMS_TEMPLATE_PRESETS[templateId] || null;
}

