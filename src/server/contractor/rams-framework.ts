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
