/**
 * ASSET LIFECYCLE & CAPEX TAXONOMY
 * =================================
 * Industry benchmarks for UK commercial building plant equipment lifespans
 * and baseline capital replacement costs.
 *
 * NOTE ON CITATIONS:
 * In accordance with brand governance, client-facing outputs (UI, PDF, exports)
 * MUST NEVER display specific third-party guide editions or table numbers.
 * All client-facing copy references:
 * "EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance."
 *
 * Internal engineering references (retained for developer provenance):
 * - CIBSE Guide M (Indicative Economic Life Expectancy Tables)
 * - RICS NRM3 (Order of Cost Estimating and Cost Planning for Building Maintenance Works)
 * - BSRIA BG 47 & BG 67 (Building services life cycle costing)
 * - BESA SFG20 standard commercial maintenance tasks
 */

export interface CapexAssetDefinition {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  shortDescription: string;
  minYears: number;
  maxYears: number;
  nominalYears: number;
  defaultCost: number; // Base UK indicative replacement cost in GBP
  unitLabel: string;
  governanceNote: string;
}

export interface CapexCategoryDefinition {
  id: string;
  name: string;
  description: string;
  iconName: string;
  assets: CapexAssetDefinition[];
}

export interface RegionMultiplier {
  name: string;
  multiplier: number;
  badge?: string;
}

export const CAPEX_REGIONS: Record<string, RegionMultiplier> = {
  national: { name: 'UK Nationwide / Standard Commercial Index', multiplier: 1.0 },
  london: { name: 'Greater London (Zones 1–6 & M25)', multiplier: 1.15, badge: '+15% London Index' },
  south_east: { name: 'South East & Home Counties', multiplier: 1.08, badge: '+8% Regional Index' },
  midlands: { name: 'Midlands (Birmingham, Nottingham, Derby)', multiplier: 1.0 },
  north_west: { name: 'North West (Manchester, Liverpool)', multiplier: 1.0 },
  yorkshire: { name: 'Yorkshire & Humber (Leeds, Sheffield)', multiplier: 1.0 },
  north_east: { name: 'North East & Scotland Corridor', multiplier: 1.0 },
};

export type AssetCondition = 'Good' | 'Fair' | 'Poor';

export const CONDITION_FACTORS: Record<AssetCondition, { factor: number; label: string; description: string }> = {
  Good: {
    factor: 1.1, // +10% expected life
    label: 'Good (Well-Maintained)',
    description: 'Compliant PPM history, optimal operating environment, clean condition logs.',
  },
  Fair: {
    factor: 1.0, // Baseline nominal life
    label: 'Fair (Normal Wear)',
    description: 'Routine operational wear, standard commercial duty cycle, minor cosmetic defects.',
  },
  Poor: {
    factor: 0.8, // -20% expected life (accelerated renewal)
    label: 'Poor (Accelerated Degradation)',
    description: 'Noticeable wear, deferred maintenance history, recurrent faults or harsh environment.',
  },
};

export const CAPEX_ASSET_CATEGORIES: CapexCategoryDefinition[] = [
  {
    id: 'hvac',
    name: 'HVAC & Climate Control',
    description: 'Air handling units, chillers, boilers, heat pumps, fan coils, cooling towers, and building management systems.',
    iconName: 'Wind',
    assets: [
      {
        id: 'hvac-ahu',
        categoryId: 'hvac',
        categoryName: 'HVAC & Climate Control',
        name: 'Packaged Air Handling Unit (AHU)',
        shortDescription: 'Supply and extract air handling units, filtration stages, coils, and fans.',
        minYears: 15,
        maxYears: 20,
        nominalYears: 20,
        defaultCost: 25000,
        unitLabel: 'per AHU',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'hvac-chiller-water',
        categoryId: 'hvac',
        categoryName: 'HVAC & Climate Control',
        name: 'Central Water-Cooled Chiller',
        shortDescription: 'Central indoor water-cooled chillers connected to cooling towers or condensers.',
        minYears: 20,
        maxYears: 25,
        nominalYears: 20,
        defaultCost: 55000,
        unitLabel: 'per chiller',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'hvac-chiller-air',
        categoryId: 'hvac',
        categoryName: 'HVAC & Climate Control',
        name: 'Central Air-Cooled Chiller',
        shortDescription: 'Rooftop or external packaged air-cooled chillers with integral condensers.',
        minYears: 15,
        maxYears: 18,
        nominalYears: 15,
        defaultCost: 45000,
        unitLabel: 'per chiller',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'hvac-boiler',
        categoryId: 'hvac',
        categoryName: 'HVAC & Climate Control',
        name: 'Commercial Condensing Gas Boiler',
        shortDescription: 'Commercial condensing gas heating boilers, burner assemblies, and flues.',
        minYears: 15,
        maxYears: 20,
        nominalYears: 18,
        defaultCost: 22000,
        unitLabel: 'per boiler',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'hvac-vrf',
        categoryId: 'hvac',
        categoryName: 'HVAC & Climate Control',
        name: 'VRF / VRV Heat Recovery System',
        shortDescription: 'Variable refrigerant flow outdoor master condensing units and branch selectors.',
        minYears: 12,
        maxYears: 15,
        nominalYears: 15,
        defaultCost: 18000,
        unitLabel: 'per system',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'hvac-fcu',
        categoryId: 'hvac',
        categoryName: 'HVAC & Climate Control',
        name: 'Fan Coil Units (FCU Bank)',
        shortDescription: 'Terminal 2-pipe and 4-pipe fan coil units serving floor plates (batch of 10).',
        minYears: 15,
        maxYears: 20,
        nominalYears: 18,
        defaultCost: 15000,
        unitLabel: 'per bank (10 units)',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'hvac-cooling-tower',
        categoryId: 'hvac',
        categoryName: 'HVAC & Climate Control',
        name: 'Cooling Tower / Evaporative Condenser',
        shortDescription: 'Open or closed-circuit evaporative cooling towers serving central refrigeration.',
        minYears: 15,
        maxYears: 20,
        nominalYears: 18,
        defaultCost: 35000,
        unitLabel: 'per tower',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'hvac-bms',
        categoryId: 'hvac',
        categoryName: 'HVAC & Climate Control',
        name: 'BMS Headend & Outstations',
        shortDescription: 'Central BMS server, network controllers, DDC outstations, and field sensors.',
        minYears: 10,
        maxYears: 15,
        nominalYears: 12,
        defaultCost: 25000,
        unitLabel: 'per system',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
    ],
  },
  {
    id: 'vertical',
    name: 'Lifting & Vertical Transport',
    description: 'Passenger lifts, goods lifts, platform lifts, and building maintenance access units.',
    iconName: 'Layers',
    assets: [
      {
        id: 'lift-passenger',
        categoryId: 'vertical',
        categoryName: 'Lifting & Vertical Transport',
        name: 'Passenger Lift (Traction / Hydraulic)',
        shortDescription: 'Commercial passenger lift installation, car, traction machine, and controller.',
        minYears: 20,
        maxYears: 25,
        nominalYears: 25,
        defaultCost: 65000,
        unitLabel: 'per lift car',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'lift-goods',
        categoryId: 'vertical',
        categoryName: 'Lifting & Vertical Transport',
        name: 'Goods Lift / Dock Leveller',
        shortDescription: 'Heavy-duty freight lifts, scissor lifts, and loading bay dock levellers.',
        minYears: 15,
        maxYears: 20,
        nominalYears: 20,
        defaultCost: 35000,
        unitLabel: 'per unit',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'lift-platform',
        categoryId: 'vertical',
        categoryName: 'Lifting & Vertical Transport',
        name: 'Platform Lift / DDA Access Lift',
        shortDescription: 'Vertical screw or hydraulic platform lifts providing split-level accessibility.',
        minYears: 12,
        maxYears: 18,
        nominalYears: 15,
        defaultCost: 22000,
        unitLabel: 'per lift',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
    ],
  },
  {
    id: 'fabric',
    name: 'Building Fabric & Roofing',
    description: 'Roof coverings, façade curtain walling, mastic weather seals, and rainwater management.',
    iconName: 'Home',
    assets: [
      {
        id: 'fab-roof-felt',
        categoryId: 'fabric',
        categoryName: 'Building Fabric & Roofing',
        name: 'Flat Roof - Bituminous / Felt Covering',
        shortDescription: 'Multi-layer built-up bituminous reinforced roofing membrane with cap sheet.',
        minYears: 15,
        maxYears: 20,
        nominalYears: 18,
        defaultCost: 45000,
        unitLabel: 'per roof section (~300m²)',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'fab-roof-single-ply',
        categoryId: 'fabric',
        categoryName: 'Building Fabric & Roofing',
        name: 'Flat Roof - Single Ply / GRP / EPDM',
        shortDescription: 'Single-ply polymeric membrane, liquid-applied coating, or GRP fibreglass roof.',
        minYears: 20,
        maxYears: 30,
        nominalYears: 25,
        defaultCost: 55000,
        unitLabel: 'per roof section (~300m²)',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'fab-roof-pitched',
        categoryId: 'fabric',
        categoryName: 'Building Fabric & Roofing',
        name: 'Pitched Roof Covering (Tiles / Slate)',
        shortDescription: 'Concrete tiles, clay tiles, or natural slate covering with breathable membrane.',
        minYears: 40,
        maxYears: 60,
        nominalYears: 50,
        defaultCost: 60000,
        unitLabel: 'per roof pitch',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'fab-cladding',
        categoryId: 'fabric',
        categoryName: 'Building Fabric & Roofing',
        name: 'Façade Curtain Walling & Glazing Seals',
        shortDescription: 'Composite cladding panels, curtain wall pressure plates, and structural silicone seals.',
        minYears: 20,
        maxYears: 25,
        nominalYears: 25,
        defaultCost: 40000,
        unitLabel: 'per elevation',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
    ],
  },
  {
    id: 'electrical',
    name: 'Electrical Infrastructure',
    description: 'Main low-voltage switchboards, standby generators, UPS systems, and renewable solar arrays.',
    iconName: 'Zap',
    assets: [
      {
        id: 'elec-switchgear',
        categoryId: 'electrical',
        categoryName: 'Electrical Infrastructure',
        name: 'Main LV Switchgear & Panel Boards',
        shortDescription: 'Main low-voltage switchboards, busbars, and primary incoming distribution panels.',
        minYears: 25,
        maxYears: 35,
        nominalYears: 30,
        defaultCost: 35000,
        unitLabel: 'per main board',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'elec-generator',
        categoryId: 'electrical',
        categoryName: 'Electrical Infrastructure',
        name: 'Standby Diesel Generator & ATS',
        shortDescription: 'Emergency standby diesel generator, automatic transfer switch, and bulk fuel tank.',
        minYears: 20,
        maxYears: 25,
        nominalYears: 25,
        defaultCost: 45000,
        unitLabel: 'per generator set',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'elec-ups',
        categoryId: 'electrical',
        categoryName: 'Electrical Infrastructure',
        name: 'Central UPS Inverter (Excl. Batteries)',
        shortDescription: 'Central static UPS module, bypass switch, and power electronics (batteries replaced separately).',
        minYears: 10,
        maxYears: 15,
        nominalYears: 12,
        defaultCost: 18000,
        unitLabel: 'per UPS system',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'elec-solar',
        categoryId: 'electrical',
        categoryName: 'Electrical Infrastructure',
        name: 'Solar PV Inverters & Panels',
        shortDescription: 'Roof-mounted commercial solar PV array, string inverters, and grid-tie generation metering.',
        minYears: 15,
        maxYears: 20,
        nominalYears: 20,
        defaultCost: 20000,
        unitLabel: 'per 25kWp array',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
    ],
  },
  {
    id: 'fire',
    name: 'Fire & Life Safety',
    description: 'Fire alarm panels, gas suppression systems, sprinklers, fire doors, and extinguisher suites.',
    iconName: 'Flame',
    assets: [
      {
        id: 'fire-alarm',
        categoryId: 'fire',
        categoryName: 'Fire & Life Safety',
        name: 'Fire Alarm Control Panel & Detection',
        shortDescription: 'Addressable commercial fire alarm control panel, repeaters, loop interfaces, and sounders.',
        minYears: 12,
        maxYears: 15,
        nominalYears: 15,
        defaultCost: 15000,
        unitLabel: 'per system',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'fire-gas-suppression',
        categoryId: 'fire',
        categoryName: 'Fire & Life Safety',
        name: 'Server Room Gas Suppression System',
        shortDescription: 'Clean agent fire suppression cylinders, pneumatic release, and abort controls (10-yr cylinder hydro-test).',
        minYears: 10,
        maxYears: 15,
        nominalYears: 10,
        defaultCost: 16000,
        unitLabel: 'per protected room',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'fire-sprinklers',
        categoryId: 'fire',
        categoryName: 'Fire & Life Safety',
        name: 'Fire Sprinkler Pumps & Control Valves',
        shortDescription: 'Electric or diesel fire booster pumps, jockey pumps, alarm check valves, and flow switches.',
        minYears: 20,
        maxYears: 25,
        nominalYears: 25,
        defaultCost: 30000,
        unitLabel: 'per pump set',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'fire-extinguisher-suite',
        categoryId: 'fire',
        categoryName: 'Fire & Life Safety',
        name: 'Site Fire Extinguisher Suite (Complete)',
        shortDescription: 'Building-wide inventory of CO2, water, foam, and powder extinguishers requiring 10-year overhaul/refurbishment.',
        minYears: 10,
        maxYears: 12,
        nominalYears: 10,
        defaultCost: 3500,
        unitLabel: 'site suite (batch of 25)',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'fire-doors',
        categoryId: 'fire',
        categoryName: 'Fire & Life Safety',
        name: 'Fire Doors & Automated Smoke Shutters',
        shortDescription: 'High-traffic commercial fire doorsets (FD30/FD60), intumescent seals, and motorised smoke curtains.',
        minYears: 20,
        maxYears: 25,
        nominalYears: 20,
        defaultCost: 18000,
        unitLabel: 'batch of 10 doorsets',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
    ],
  },
  {
    id: 'water',
    name: 'Water Hygiene & Plumbing',
    description: 'Cold water storage, commercial calorifiers, water booster sets, TMVs, and treatment plants.',
    iconName: 'Droplets',
    assets: [
      {
        id: 'water-tanks',
        categoryId: 'water',
        categoryName: 'Water Hygiene & Plumbing',
        name: 'Cold Water Storage Tanks (CWST)',
        shortDescription: 'Sectional or one-piece GRP potable cold water cisterns and distribution pipework.',
        minYears: 20,
        maxYears: 25,
        nominalYears: 22,
        defaultCost: 12000,
        unitLabel: 'per tank set',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'water-calorifier',
        categoryId: 'water',
        categoryName: 'Water Hygiene & Plumbing',
        name: 'Commercial Calorifier / Water Heater',
        shortDescription: 'Indirect heating calorifier vessels or commercial direct-fired gas water heaters.',
        minYears: 15,
        maxYears: 20,
        nominalYears: 18,
        defaultCost: 14000,
        unitLabel: 'per vessel',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'water-booster',
        categoryId: 'water',
        categoryName: 'Water Hygiene & Plumbing',
        name: 'Water Booster Set & Pressurisation',
        shortDescription: 'Variable-speed booster pump skid, expansion vessels, and system pressurisation units.',
        minYears: 10,
        maxYears: 15,
        nominalYears: 12,
        defaultCost: 8500,
        unitLabel: 'per pump set',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'water-dosing',
        categoryId: 'water',
        categoryName: 'Water Hygiene & Plumbing',
        name: 'Water Treatment & Dosing Plant',
        shortDescription: 'Automated chemical biocide dosing, water softeners, filtration, and chlorine dioxide generation.',
        minYears: 10,
        maxYears: 15,
        nominalYears: 12,
        defaultCost: 9500,
        unitLabel: 'per dosing unit',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'water-tmv-bank',
        categoryId: 'water',
        categoryName: 'Water Hygiene & Plumbing',
        name: 'TMV Blending Stations (Estate Bank)',
        shortDescription: 'Thermostatic mixing valves (TMV2 / TMV3) serving building washrooms and sanitary facilities.',
        minYears: 8,
        maxYears: 12,
        nominalYears: 10,
        defaultCost: 4500,
        unitLabel: 'bank of 15 valves',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
    ],
  },
  {
    id: 'security',
    name: 'Security & Access Control',
    description: 'CCTV surveillance networks, electronic access control, turnstiles, and automated barriers.',
    iconName: 'Shield',
    assets: [
      {
        id: 'sec-cctv',
        categoryId: 'security',
        categoryName: 'Security & Access Control',
        name: 'Commercial CCTV Surveillance System',
        shortDescription: 'Network video recorder (NVR), switch infrastructure, and high-definition IP cameras.',
        minYears: 7,
        maxYears: 10,
        nominalYears: 8,
        defaultCost: 8000,
        unitLabel: 'per system (16 cameras)',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'sec-access',
        categoryId: 'security',
        categoryName: 'Security & Access Control',
        name: 'Electronic Access Control System',
        shortDescription: 'Access control headend server, door controllers, proximity readers, and magnetic locks.',
        minYears: 10,
        maxYears: 12,
        nominalYears: 10,
        defaultCost: 9000,
        unitLabel: 'per 8-door system',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
      {
        id: 'sec-gates',
        categoryId: 'security',
        categoryName: 'Security & Access Control',
        name: 'Automated Vehicle Barrier / Gates',
        shortDescription: 'Powered sliding security gates, rising arm car park barriers, and safety sensing loops.',
        minYears: 10,
        maxYears: 15,
        nominalYears: 12,
        defaultCost: 10000,
        unitLabel: 'per barrier / gate',
        governanceNote: 'EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance.',
      },
    ],
  },
];

export function getAllCapexAssets(): CapexAssetDefinition[] {
  return CAPEX_ASSET_CATEGORIES.flatMap((c) => c.assets);
}

export function getCapexAssetById(id: string): CapexAssetDefinition | undefined {
  return getAllCapexAssets().find((a) => a.id === id);
}
