/**
 * SLA & RESPONSE BENCHMARK TAXONOMY & DATA ENGINE
 * ================================================
 * Defines standard UK commercial FM Helpdesk SLA benchmarks across 7 critical disciplines.
 *
 * FACTUAL DISTINCTION ARCHITECTURE:
 * - "Typical UK Commercial Response Band": Industry commercial practice and Helpdesk SLAs
 *   (e.g. 2–4 hour attendance), explicitly NOT represented as a statutory mandate.
 * - "Why It Matters / Context": Precise description of real statutory requirements where they
 *   genuinely exist (e.g. BS 5839-1 Cl. 45.1 4-hour fire watch threshold; BS EN 81-28 entrapment)
 *   versus general duty of care / loss prevention context (e.g. EAWR 1989, Workplace Regs 1992,
 *   insurable risk).
 */

export type SlaStatus = 'FASTER' | 'WITHIN_BAND' | 'SLOWER';

export interface SlaOption {
  value: number; // hours
  label: string;
}

export const SLA_RESPONSE_OPTIONS: SlaOption[] = [
  { value: 0.5, label: '< 30 mins' },
  { value: 1, label: '1 hour' },
  { value: 2, label: '2 hours' },
  { value: 4, label: '4 hours' },
  { value: 8, label: '8 hours (Same Day)' },
  { value: 24, label: '24 hours (Next Day)' },
  { value: 48, label: '48 hours (2 Days)' },
  { value: 72, label: '3–5 Days' },
];

export interface SlaDisciplineBenchmark {
  id: string;
  name: string;
  category: 'Mechanical' | 'Electrical' | 'Life Safety' | 'Water' | 'Security' | 'Vertical' | 'Fabric';
  metricLabel: string;
  description: string;
  iconName: string;
  defaultResponseHours: number;
  benchmark: {
    fasterMaxHours: number; // e.g. < 2 hrs
    typicalMinHours: number; // e.g. 2 hrs
    typicalMaxHours: number; // e.g. 4 hrs
    bandDisplay: string; // "2 – 4 hours (Emergency Attendance)"
    fasterDisplay: string; // "< 2 hours (Upper Quartile)"
    slowerDisplay: string; // "> 4 hours (Lagging Commercial SLA)"
  };
  regulatoryType: 'SPECIFIC_THRESHOLD' | 'GENERAL_DUTY' | 'COMMERCIAL_PRACTICE';
  regulatoryCitation: string;
  whyItMatters: string;
  riskIfDelayed: string;
}

export const SLA_DISCIPLINES: SlaDisciplineBenchmark[] = [
  {
    id: 'fire-systems',
    name: 'Fire Alarm & Life Safety Systems',
    category: 'Life Safety',
    metricLabel: 'Critical Fault / System Defect Attendance',
    description: 'Attendance to investigate critical panel faults, circuit ground faults, or un-resettable call points.',
    iconName: 'ShieldAlert',
    defaultResponseHours: 4,
    benchmark: {
      fasterMaxHours: 2,
      typicalMinHours: 2,
      typicalMaxHours: 4,
      bandDisplay: '2 – 4 hours',
      fasterDisplay: '< 2 hours',
      slowerDisplay: '> 4 hours',
    },
    regulatoryType: 'SPECIFIC_THRESHOLD',
    regulatoryCitation: 'BS 5839-1 (Clause 45.1) & RRO (Fire Safety) Order 2005',
    whyItMatters:
      'BS 5839-1 specifically recommends engineer attendance within 4 hours. Under RRO 2005, if impairment cannot be rectified within 4 hours, the Responsible Person must enforce compensatory measures (e.g. physical fire watch patrols) to maintain legal occupancy.',
    riskIfDelayed: 'Building closure notices, fire service enforcement orders, and personal liability for building duty holders.',
  },
  {
    id: 'passenger-lifts',
    name: 'Passenger Lifts & Vertical Transport',
    category: 'Vertical',
    metricLabel: 'Passenger Entrapment Attendance',
    description: 'Emergency attendance when passengers are trapped inside a lift car between floors.',
    iconName: 'ArrowUpDown',
    defaultResponseHours: 0.75, // ~45 mins
    benchmark: {
      fasterMaxHours: 0.5,
      typicalMinHours: 0.5,
      typicalMaxHours: 0.75, // 45 mins
      bandDisplay: '30 – 45 mins',
      fasterDisplay: '< 30 mins',
      slowerDisplay: '> 60 mins',
    },
    regulatoryType: 'SPECIFIC_THRESHOLD',
    regulatoryCitation: 'BS EN 81-28 (Clause 4.1.1) & BS 7255',
    whyItMatters:
      'BS EN 81-28 establishes remote alarm communication and urgent rescue service initiation. Typical UK commercial Helpdesk SLA is 30–45 minutes. (Note: Statutory LOLER Reg 9 mandates 6-monthly thorough examinations — an inspection requirement, distinct from emergency entrapment response).',
    riskIfDelayed: 'Severe passenger medical/psychological distress, emergency fire service callouts with forced door damage, and breach of duty of care.',
  },
  {
    id: 'hvac-critical',
    name: 'HVAC & Comfort Cooling / Heating',
    category: 'Mechanical',
    metricLabel: 'Emergency Callout (Total Plant Failure)',
    description: 'Catastrophic failure of primary chillers, boilers, or air handling units serving occupied tenancies or comms rooms.',
    iconName: 'ThermometerSnowflake',
    defaultResponseHours: 4,
    benchmark: {
      fasterMaxHours: 2,
      typicalMinHours: 2,
      typicalMaxHours: 4,
      bandDisplay: '2 – 4 hours',
      fasterDisplay: '< 2 hours',
      slowerDisplay: '> 4 hours',
    },
    regulatoryType: 'GENERAL_DUTY',
    regulatoryCitation: 'Workplace (Health, Safety and Welfare) Regulations 1992 (Reg 7)',
    whyItMatters:
      'Regulation 7 mandates reasonable indoor working temperatures (normally min 16°C). The 2–4 hour response band is standard commercial FM practice to prevent building evacuation, tenant rent withholding, or server thermal shutdowns.',
    riskIfDelayed: 'Tenant business interruption claims, server rack overheating, and loss of commercial productive hours.',
  },
  {
    id: 'electrical-power',
    name: 'Electrical Distribution & Power Failure',
    category: 'Electrical',
    metricLabel: 'Emergency Response (Blackout / Live Fault)',
    description: 'Complete or sectional loss of power, main switchboard trip, or dangerous exposed electrical faults.',
    iconName: 'Zap',
    defaultResponseHours: 2,
    benchmark: {
      fasterMaxHours: 2,
      typicalMinHours: 2,
      typicalMaxHours: 4,
      bandDisplay: '2 – 4 hours',
      fasterDisplay: '< 2 hours',
      slowerDisplay: '> 4 hours',
    },
    regulatoryType: 'GENERAL_DUTY',
    regulatoryCitation: 'Electricity at Work Regulations 1989 (Reg 4) & BS 7671',
    whyItMatters:
      'EAWR 1989 requires electrical systems to be constructed and maintained to prevent danger. While the law does not specify arrival hours, standard commercial practice demands 2–4 hour attendance to safely isolate hazards and restore critical supplies.',
    riskIfDelayed: 'Catastrophic electrical fire hazard, total operations shutdown, and secondary loss of refrigeration/security.',
  },
  {
    id: 'plumbing-leaks',
    name: 'Plumbing & Water Ingress',
    category: 'Water',
    metricLabel: 'Emergency Leak Isolation & Make-Safe',
    description: 'Mains water pipe bursts, overflowing plant room header tanks, or blackwater drainage backups.',
    iconName: 'Droplets',
    defaultResponseHours: 4,
    benchmark: {
      fasterMaxHours: 2,
      typicalMinHours: 2,
      typicalMaxHours: 4,
      bandDisplay: '2 – 4 hours',
      fasterDisplay: '< 2 hours',
      slowerDisplay: '> 4 hours',
    },
    regulatoryType: 'COMMERCIAL_PRACTICE',
    regulatoryCitation: 'Duty of Care & Commercial Property Loss Prevention',
    whyItMatters:
      'Neither HSE ACOP L8 nor Water Supply Regs set reactive arrival hours. The 2–4 hour benchmark is standard commercial practice to stop cascading water damage into ceilings, electrical risers, and tenancies below.',
    riskIfDelayed: 'Extensive structural ceiling collapse, electrical riser short-circuits, mould remediation costs, and disputed insurance claims.',
  },
  {
    id: 'security-access',
    name: 'Security, Access Control & Shutters',
    category: 'Security',
    metricLabel: 'Access Failure / Broken Shutter or Gate',
    description: 'Vehicle barrier failure, broken roller shutter on goods loading bay, or compromised magnetic access control.',
    iconName: 'Lock',
    defaultResponseHours: 4,
    benchmark: {
      fasterMaxHours: 2,
      typicalMinHours: 2,
      typicalMaxHours: 4,
      bandDisplay: '2 – 4 hours',
      fasterDisplay: '< 2 hours',
      slowerDisplay: '> 4 hours',
    },
    regulatoryType: 'COMMERCIAL_PRACTICE',
    regulatoryCitation: 'Commercial Insurance Warranty & Premises Security Protocols',
    whyItMatters:
      'Alarm monitoring standards (NSI/SSAIB) govern signal dispatch, not on-site trade attendance. The 2–4 hour commercial SLA ensures vulnerable building envelopes are physically secured or manually manned before close of business.',
    riskIfDelayed: 'Premises burglary exposure, voided building insurance conditions, and delivery logistics bottlenecks.',
  },
  {
    id: 'fabric-glazing',
    name: 'Building Fabric & External Glazing',
    category: 'Fabric',
    metricLabel: 'Emergency Board-Up & Glazing Make-Safe',
    description: 'Shattered external curtain walling, broken entrance glazing, or wind-damaged roofing panels.',
    iconName: 'Building',
    defaultResponseHours: 8,
    benchmark: {
      fasterMaxHours: 2,
      typicalMinHours: 4,
      typicalMaxHours: 8,
      bandDisplay: '4 – 8 hours (Same Day)',
      fasterDisplay: '< 2 hours',
      slowerDisplay: '> 8 hours / Next Day',
    },
    regulatoryType: 'GENERAL_DUTY',
    regulatoryCitation: 'Health and Safety at Work etc. Act 1974 (s.2 & s.3) & Highways Act',
    whyItMatters:
      'Sections 2 and 3 require duty holders to protect employees and members of the public from physical hazards like falling shards. Same-day attendance (4–8 hours) is standard industry practice to board up and eliminate public liability.',
    riskIfDelayed: 'Severe public injury liability, external weather ingress damage, and opportunistic intruder entry.',
  },
];

export interface ContractPitfall {
  title: string;
  subtitle: string;
  body: string;
  takeaway: string;
}

export const CONTRACT_PITFALLS: ContractPitfall[] = [
  {
    title: 'The "Attendance" vs. "First-Time Fix" Illusion',
    subtitle: 'Arriving on site is not the same as solving the problem',
    body: 'Many commercial FM contracts advertise aggressive 2-hour or 4-hour response SLAs. However, standard contract wording defines "Response" solely as engineer arrival to assess and make safe. Without adequate first-fix vehicle stocking or CAFM-led parts triage, critical plant often remains out of service for days waiting for specialist quotations.',
    takeaway: 'Negotiate dual SLAs: measure both "Attendance / Make-Safe" and "First-Visit Resolution Rate".',
  },
  {
    title: 'Clock-Stopping Loopholes',
    subtitle: 'How suppliers manipulate CAFM completion percentages',
    body: 'Helpdesks frequently pause the SLA timer under contractual provisions such as "Awaiting Client Authorisation", "Parts On Order", or "Access Permitted Window Closed". A job logged at 09:00 with a 4-hour SLA may effectively take 72 hours while remaining technically marked as "100% SLA Compliant" in monthly board reports.',
    takeaway: 'Demand raw end-to-end downtime reporting alongside contractual SLA compliance metrics.',
  },
  {
    title: 'Toothless Service Credit Caps',
    subtitle: 'Why low penalty deductions fail to drive contractor urgency',
    body: 'Where service credits exist for SLA breaches, they are commonly capped at 5% to 10% of monthly maintenance fees. In severe disruption cases (such as chillers failing in summer), the cost of the contractor dispatching an emergency specialist out-of-hours exceeds the small contractual credit deduction, disincentivising urgency.',
    takeaway: 'Combine service credits with explicit step-in rights allowing you to dispatch third-party specialists at the contractor’s expense.',
  },
];

export interface PortfolioPreset {
  id: string;
  name: string;
  description: string;
  values: Record<string, number>; // disciplineId -> hours
}

export const PORTFOLIO_PRESETS: PortfolioPreset[] = [
  {
    id: 'typical-commercial',
    name: 'Typical UK Commercial FM Contract',
    description: 'Standard multi-trade Helpdesk contract across commercial offices or retail parks.',
    values: {
      'fire-systems': 4,
      'passenger-lifts': 0.75, // 45m
      'hvac-critical': 4,
      'electrical-power': 4,
      'plumbing-leaks': 4,
      'security-access': 4,
      'fabric-glazing': 8,
    },
  },
  {
    id: 'critical-prime',
    name: 'Prime Estate / Mission-Critical',
    description: 'Premium SLA package with dedicated mobile engineers and rapid-response coverage.',
    values: {
      'fire-systems': 2,
      'passenger-lifts': 0.5, // 30m
      'hvac-critical': 2,
      'electrical-power': 2,
      'plumbing-leaks': 2,
      'security-access': 2,
      'fabric-glazing': 2,
    },
  },
  {
    id: 'lagging-fragmented',
    name: 'Fragmented / Rural / At Risk',
    description: 'Disparate independent trades with no unified 24/7 Helpdesk or guaranteed response.',
    values: {
      'fire-systems': 8,
      'passenger-lifts': 2, // 2 hrs
      'hvac-critical': 24,
      'electrical-power': 8,
      'plumbing-leaks': 24,
      'security-access': 24,
      'fabric-glazing': 24,
    },
  },
];

/**
 * Calculates whether a user's response time is faster, within typical commercial band, or slower.
 */
export function evaluateSlaPerformance(discipline: SlaDisciplineBenchmark, userHours: number): {
  status: SlaStatus;
  statusLabel: string;
  badgeClass: string;
  summaryText: string;
  relativeVariancePct: number;
} {
  const { fasterMaxHours, typicalMinHours, typicalMaxHours } = discipline.benchmark;

  if (userHours <= fasterMaxHours) {
    return {
      status: 'FASTER',
      statusLabel: 'Faster than Typical',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      summaryText: `Your ${userHours < 1 ? `${userHours * 60}m` : `${userHours}h`} response is in the upper quartile of UK commercial FM agreements.`,
      relativeVariancePct: Math.round(((typicalMinHours - userHours) / typicalMinHours) * 100),
    };
  }

  if (userHours <= typicalMaxHours) {
    return {
      status: 'WITHIN_BAND',
      statusLabel: 'Within Typical Band',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      summaryText: `Your ${userHours < 1 ? `${userHours * 60}m` : `${userHours}h`} response aligns directly with standard UK commercial Helpdesk practice (${discipline.benchmark.bandDisplay}).`,
      relativeVariancePct: 0,
    };
  }

  return {
    status: 'SLOWER',
    statusLabel: 'Slower than Typical',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    summaryText: `Your ${userHours < 1 ? `${userHours * 60}m` : `${userHours}h`} response lags the standard UK commercial market standard (${discipline.benchmark.bandDisplay}).`,
    relativeVariancePct: Math.round(((userHours - typicalMaxHours) / typicalMaxHours) * 100),
  };
}
