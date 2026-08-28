/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — FM TAXONOMY CLASSIFIER & RELEVANCE GATE
 * ==============================================================================
 * Evaluates candidate statutory updates, regulatory notices, procurement awards,
 * and news items against a multi-dimensional FM Relevance Gate.
 * Prevents non-FM consumer recalls, medical device maintenance, and unrelated
 * IT purchases from polluting the executive Daily FM Briefing.
 */

import type { FMTradeCategory, LegalStatus, UKJurisdiction } from './types';

/** Common CPV Codes in Facilities Management Procurement */
export const FM_CPV_TAXONOMY: Record<string, { category: FMTradeCategory; label: string }> = {
  // Hard FM & Building Services
  '50700000': { category: 'mechanical', label: 'Repair and maintenance services of building installations' },
  '50710000': { category: 'electrical', label: 'Repair and maintenance services of electrical and mechanical building installations' },
  '50711000': { category: 'electrical', label: 'Repair and maintenance services of electrical building installations' },
  '50712000': { category: 'mechanical', label: 'Repair and maintenance services of mechanical building installations' },
  '50720000': { category: 'hvac', label: 'Repair and maintenance services of central heating' },
  '50730000': { category: 'hvac', label: 'Repair and maintenance services of cooler groups' },
  '45331000': { category: 'hvac', label: 'Heating, ventilation and air-conditioning installation work' },
  '45331200': { category: 'hvac', label: 'Ventilation and air-conditioning installation work' },
  '45310000': { category: 'electrical', label: 'Electrical installation work' },
  '45315100': { category: 'electrical', label: 'Electrical engineering installation works' },
  '45317000': { category: 'electrical', label: 'Other electrical installation work' },
  '50750000': { category: 'lifts-access', label: 'Lift-maintenance services' },
  '42416100': { category: 'lifts-access', label: 'Lifts' },
  
  // Life Safety & Compliance
  '45343000': { category: 'fire-safety', label: 'Fire-prevention installation works' },
  '50413200': { category: 'fire-safety', label: 'Repair and maintenance services of firefighting equipment' },
  '71317100': { category: 'fire-safety', label: 'Fire and explosion protection and control consultancy services' },
  '71317210': { category: 'compliance', label: 'Health and safety consultancy services' },
  '71631000': { category: 'compliance', label: 'Technical inspection services' },
  '71631300': { category: 'building-safety', label: 'Technical building-inspection services' },
  '90650000': { category: 'asbestos', label: 'Asbestos removal services' },
  '90733000': { category: 'water-hygiene', label: 'Services related to water pollution (Legionella & sampling)' },

  // Soft FM & Estates
  '79993000': { category: 'procurement-contracts', label: 'Building management services (Total Facilities Management)' },
  '79993100': { category: 'procurement-contracts', label: 'Facilities management services' },
  '90910000': { category: 'cleaning-soft-fm', label: 'Cleaning services' },
  '90911200': { category: 'cleaning-soft-fm', label: 'Building-cleaning services' },
  '79710000': { category: 'security', label: 'Security services' },
  '77314000': { category: 'cleaning-soft-fm', label: 'Grounds maintenance services' },
  '71314000': { category: 'energy-sustainability', label: 'Energy and related services' },
  '71314300': { category: 'energy-sustainability', label: 'Energy-efficiency consultancy services' },
  '72260000': { category: 'cafm-technology', label: 'Software-related services (CAFM / IWMS / BIM)' },
};

/** Keyword Mapping Heuristics */
const TRADE_KEYWORD_MAP: Record<FMTradeCategory, string[]> = {
  'building-safety': [
    'building safety act',
    'golden thread',
    'higher-risk building',
    'building safety regulator',
    'accountable person',
    'safety case report',
    'mandatory occurrence',
    'cladding',
    'facade inspection',
    'approved document b',
    'second staircase',
    'gateway 2',
    'gateway 3',
  ],
  'compliance': [
    'statutory compliance',
    'duty holder',
    'responsible person',
    'eicr',
    'acop l8',
    'loler',
    'puwer',
    'rro 2005',
    'bs 7671',
    'sfg20',
    'prosecution',
    'improvement notice',
    'prohibition notice',
    'enforcement notice',
  ],
  'fire-safety': [
    'fire risk assessment',
    'fire alarm',
    'bs 5839',
    'fire damper',
    'dry riser',
    'wet riser',
    'sprinkler',
    'firas',
    'compartmentation',
    'fire door',
    'smoke extract',
    'smoke ventilation',
  ],
  'electrical': [
    'fixed wire testing',
    'distribution board',
    'switchgear',
    'iet wiring regulations',
    'thermal imaging',
    'ev charging',
    'emergency lighting',
    'bs 5266',
    'transformer',
    'substation',
    'minor works certificate',
  ],
  'hvac': [
    'f-gas',
    'refrigerant',
    'r410a',
    'r32',
    'chiller',
    'vrf',
    'air handling unit',
    'ahu',
    'heat pump',
    'condenser',
    'ductwork',
    'ventilation hygiene',
    'tr19',
    'cooling tower',
  ],
  'mechanical': [
    'calorifier',
    'boiler',
    'pressurisation unit',
    'circulating pump',
    'pipework',
    'gas safety',
    'bms',
    'building management system',
  ],
  'water-hygiene': [
    'legionella',
    'acop l8',
    'hsg274',
    'water sampling',
    'cold water storage',
    'booster set',
    'tmv',
    'calorifier inspection',
    'chlorination',
    'sentinel tap',
  ],
  'lifts-access': [
    'loler',
    'passenger lift',
    'goods lift',
    'cradle access',
    'bmu',
    'eyebolt testing',
    'fall arrest',
    'rope access',
    'safed',
  ],
  'asbestos': [
    'asbestos management plan',
    'asbestos survey',
    'acm',
    'control of asbestos regulations',
    'licensed removal',
  ],
  'energy-sustainability': [
    'decarbonisation',
    'heat pump retrofit',
    'net zero',
    'mees',
    'epc rating',
    'secr',
    'solar pv',
    'nabers uk',
    'breeam in-use',
  ],
  'cafm-technology': [
    'cafm',
    'computer aided facilities management',
    'iwms',
    'asset tagging',
    'qr code maintenance',
    'iot sensor',
    'smart building',
    'digital twin',
    'bim',
  ],
  'procurement-contracts': [
    'total facilities management',
    'hard fm framework',
    'soft fm framework',
    'crown commercial service',
    'tupe',
    'estates maintenance contract',
    'planned preventative maintenance contract',
  ],
  'people-appointments': [
    'appointed director of estates',
    'head of facilities',
    'chief operating officer',
    'named as director of property',
    'leadership team appointment',
  ],
  'workplace-property': [
    'commercial office',
    'grade a office',
    'hybrid working workplace',
    'lease expiry',
    'space planning',
    'tenant satisfaction',
    'commercial estate occupancy',
  ],
  'cleaning-soft-fm': [
    'commercial cleaning contract',
    'janitorial services',
    'commercial waste management',
    'grounds maintenance',
    'commercial pest control',
  ],
  'security': [
    'commercial cctv',
    'access control install',
    'security guarding contract',
    'commercial intruder alarm',
    'turnstiles',
  ],
  'waste-environment': [
    'trade effluent permit',
    'waste transfer note',
    'commercial spill response',
  ],
};

/** Explicit Negative Keywords for Non-FM Content Disqualification */
const NEGATIVE_EXCLUSION_KEYWORDS = [
  // Consumer Products & Electronics
  'bluetooth speaker',
  'portable speaker',
  'wireless earbuds',
  'headphones',
  'smart watch',
  'phone case',
  'usb cable',
  'baby toy',
  'pram',
  'stroller',
  'cot',
  'doll',
  'cosmetic',
  'shampoo',
  'face cream',
  'clothing',
  'sneakers',
  'jacket',
  'trousers',
  'bicycle helmet',
  'vape',
  'e-cigarette',
  'toaster',
  'hairdryer',
  'electric blanket',

  // Medical / Clinical / Hospital Specialty Equipment
  'endoscopy',
  'endoscope',
  'surgical instrument',
  'syringe',
  'pharmaceutical',
  'dialysis machine',
  'mri scanner',
  'ct scanner',
  'ultrasound probe',
  'hospital bed mattress',
  'ambulance chassis',
  'dentistry',
  'medical implant',

  // Generic Non-FM IT Software
  'ultraprep',
  'payroll software license',
  'hr cloud subscription',
  'curriculum software',
  'school textbooks',
  'library book lending',
  'council tax billing system',

  // Non-FM Municipal Services
  'school bus transport',
  'taxi passenger transport',
  'foster care services',
  'legal aid representation',
  'advertising agency retainer',
  'foreign language translation',
  'radio broadcasting equipment',
];

export interface FMRelevanceAssessment {
  score: number; // 0 to 100
  reason: string;
  isEligible: boolean;
  publicationEligibility: 'homepage_lead' | 'daily_briefing' | 'discipline_feed' | 'excluded';
  primaryCategory: FMTradeCategory;
  secondaryCategories: FMTradeCategory[];
  relevantRoles: string[];
  relevantSectors: string[];
}

export class FMTaxonomyClassifier {
  /**
   * FM RELEVANCE GATE
   * Evaluates text, source, CPV, and category to determine whether an item belongs
   * on the executive /lobby/today Daily Briefing.
   */
  public static evaluateFMRelevance(input: {
    title: string;
    description?: string;
    cpvCode?: string;
    sourceName?: string;
    isRecall?: boolean;
    sourceId?: string;
  }): FMRelevanceAssessment {
    const text = `${input.title} ${input.description || ''}`.toLowerCase();

    // 1. Check explicit negative disqualifications
    for (const neg of NEGATIVE_EXCLUSION_KEYWORDS) {
      if (text.includes(neg)) {
        return {
          score: 0,
          reason: `Disqualified: Matches non-FM consumer or clinical keyword '${neg}'`,
          isEligible: false,
          publicationEligibility: 'excluded',
          primaryCategory: 'compliance',
          secondaryCategories: [],
          relevantRoles: [],
          relevantSectors: [],
        };
      }
    }

    // 2. OPSS Product Recall Gate: only permit building plant / electrical / fire life-safety items
    if (input.isRecall || input.sourceId === 'src-opss-recalls') {
      const allowedRecallKeywords = [
        'fire alarm',
        'smoke detector',
        'heat detector',
        'circuit breaker',
        'distribution board',
        'fuse box',
        'isolator',
        'luminaire',
        'emergency light',
        'chiller',
        'heat pump',
        'boiler',
        'calorifier',
        'commercial heater',
        'pressure vessel',
        'lift control',
        'access control',
      ];

      const matchesEstateRecall = allowedRecallKeywords.some((kw) => text.includes(kw));
      if (!matchesEstateRecall) {
        return {
          score: 5,
          reason: 'Excluded OPSS Recall: Consumer personal product not relevant to commercial estate operations',
          isEligible: false,
          publicationEligibility: 'excluded',
          primaryCategory: 'compliance',
          secondaryCategories: [],
          relevantRoles: [],
          relevantSectors: [],
        };
      }
    }

    // 3. Score against positive FM Trade taxonomy
    const classification = this.classifyText(text);
    let score = 0;
    let matchReasons: string[] = [];

    // CPV Code Evaluation
    if (input.cpvCode) {
      const cleanCPV = input.cpvCode.replace(/[^0-9]/g, '').substring(0, 8);
      if (FM_CPV_TAXONOMY[cleanCPV]) {
        score += 40;
        matchReasons.push(`CPV match (${cleanCPV})`);
      }
    }

    // Keyword density scoring
    if (classification.confidence >= 0.95) {
      score += 50;
      matchReasons.push('Strong FM discipline keyword match');
    } else if (classification.confidence >= 0.75) {
      score += 35;
      matchReasons.push('Moderate FM discipline keyword match');
    } else if (classification.confidence >= 0.45) {
      score += 15;
      matchReasons.push('Weak keyword match');
    }

    // Statutory / Legal high-impact keywords
    const highImpactKeywords = [
      'building safety act',
      'bsr',
      'golden thread',
      'higher-risk building',
      'mandatory occurrence',
      'acop l8',
      'legionella',
      'bs 7671',
      'eicr',
      'fire door',
      'rro 2005',
      'loler',
      'mees',
      'f-gas',
      'total facilities management',
    ];

    for (const hik of highImpactKeywords) {
      if (text.includes(hik)) {
        score += 20;
        matchReasons.push(`High-impact statutory keyword: '${hik}'`);
        break;
      }
    }

    // Cap score at 100
    score = Math.min(100, Math.max(0, score));

    // Determine Publication Eligibility
    let publicationEligibility: FMRelevanceAssessment['publicationEligibility'] = 'excluded';
    if (score >= 80) {
      publicationEligibility = 'homepage_lead';
    } else if (score >= 50) {
      publicationEligibility = 'daily_briefing';
    } else if (score >= 30) {
      publicationEligibility = 'discipline_feed';
    }

    const relevantRoles = ['Facilities Director', 'Estates Manager', 'Hard FM Lead'];
    if (['building-safety', 'fire-safety', 'compliance'].includes(classification.primaryCategory)) {
      relevantRoles.push('Accountable Person', 'Responsible Person');
    }

    const relevantSectors = ['Commercial Offices', 'Higher Education', 'Healthcare Estates', 'Retail Portfolios'];

    return {
      score,
      reason: matchReasons.length > 0 ? matchReasons.join(', ') : 'Default general FM assessment',
      isEligible: score >= 50,
      publicationEligibility,
      primaryCategory: classification.primaryCategory,
      secondaryCategories: classification.secondaryCategories,
      relevantRoles,
      relevantSectors,
    };
  }

  /** Classify text (title + body) into primary & secondary trade tags */
  public static classifyText(text: string): {
    primaryCategory: FMTradeCategory;
    secondaryCategories: FMTradeCategory[];
    confidence: number;
  } {
    const normalised = text.toLowerCase();
    const scores: Record<FMTradeCategory, number> = {} as Record<FMTradeCategory, number>;

    for (const [category, keywords] of Object.entries(TRADE_KEYWORD_MAP) as [FMTradeCategory, string[]][]) {
      let score = 0;
      for (const kw of keywords) {
        if (normalised.includes(kw)) {
          score += kw.length > 10 ? 3 : 1;
        }
      }
      scores[category] = score;
    }

    const sorted = (Object.entries(scores) as [FMTradeCategory, number][]).sort(
      (a, b) => b[1] - a[1]
    );

    const hasMatch = sorted[0][1] > 0;
    const primaryCategory = hasMatch ? sorted[0][0] : 'compliance';
    const secondaryCategories = sorted
      .slice(1, 4)
      .filter((s) => s[1] > 0)
      .map((s) => s[0]);

    const confidence = sorted[0][1] >= 4 ? 0.95 : sorted[0][1] >= 2 ? 0.75 : hasMatch ? 0.45 : 0.1;

    return { primaryCategory, secondaryCategories, confidence };
  }

  /** Classify procurement CPV code into FM Trade */
  public static classifyCPV(cpvCode: string): FMTradeCategory {
    const clean = cpvCode.replace(/[^0-9]/g, '').substring(0, 8);
    const direct = FM_CPV_TAXONOMY[clean];
    if (direct) return direct.category;

    const prefix4 = clean.substring(0, 4);
    if (prefix4 === '5070' || prefix4 === '5071' || prefix4 === '5072') return 'mechanical';
    if (prefix4 === '4531') return 'electrical';
    if (prefix4 === '4533') return 'hvac';
    if (prefix4 === '9091') return 'cleaning-soft-fm';
    if (prefix4 === '7971') return 'security';

    return 'procurement-contracts';
  }

  /** Determine Legal Status from publication authority & wording */
  public static determineLegalStatus(title: string, sourceSlug: string): LegalStatus {
    const lower = title.toLowerCase();
    if (lower.includes('statutory instrument') || lower.includes(' si ') || sourceSlug.includes('legislation')) {
      return 'STATUTORY_INSTRUMENT';
    }
    if (lower.includes('act 20') || lower.includes('act 19')) {
      return 'LAW';
    }
    if (lower.includes('approved document')) {
      return 'APPROVED_DOCUMENT';
    }
    if (lower.includes('acop') || lower.includes('approved code of practice')) {
      return 'ACOP_GUIDANCE';
    }
    if (lower.includes('consultation') || lower.includes('call for evidence')) {
      return 'CONSULTATION';
    }
    if (lower.includes('bill') || sourceSlug.includes('parliament')) {
      return 'PROPOSED_LEGISLATION';
    }
    if (lower.includes('standard') || lower.includes('bs ') || lower.includes('bs en') || lower.includes('iso ')) {
      return 'STANDARD';
    }
    if (lower.includes('guidance') || lower.includes('guidelines') || lower.includes('advisory')) {
      return 'INDUSTRY_GUIDANCE';
    }
    return 'NEWS';
  }

  /** Infer UK Devolved Jurisdiction from text */
  public static inferJurisdictions(text: string): UKJurisdiction[] {
    const lower = text.toLowerCase();
    const jurisdictions: UKJurisdiction[] = [];

    const mentionsEngland = lower.includes('england') || lower.includes('english');
    const mentionsWales = lower.includes('wales') || lower.includes('welsh');
    const mentionsScotland = lower.includes('scotland') || lower.includes('scottish');
    const mentionsNI = lower.includes('northern ireland') || lower.includes('irish') || lower.includes('ni ');

    if (mentionsScotland && !mentionsEngland && !mentionsWales) {
      jurisdictions.push('Scotland');
    } else if (mentionsNI && !mentionsEngland && !mentionsScotland) {
      jurisdictions.push('Northern Ireland');
    } else if (mentionsEngland && !mentionsWales && !mentionsScotland && !mentionsNI) {
      jurisdictions.push('England');
    } else if (mentionsEngland && mentionsWales) {
      jurisdictions.push('England', 'Wales');
    } else {
      jurisdictions.push('United Kingdom');
    }

    return jurisdictions;
  }
}

export function classifyFMTrades(text: string): FMTradeCategory[] {
  const res = FMTaxonomyClassifier.classifyText(text);
  return Array.from(new Set([res.primaryCategory, ...res.secondaryCategories]));
}
