/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — FM TAXONOMY CLASSIFIER
 * =============================================================
 * Classifies ingested statutory, regulatory, news, and tender data into
 * structured FM service disciplines, CPV classifications, and risk levels.
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
    'facade',
    'approved document b',
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
    'enforcement',
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
    'tender',
    'contract award',
    'crown commercial service',
    'total facilities management',
    'hard fm framework',
    'tupe',
    'procurement notice',
    'contract notice',
  ],
  'people-appointments': [
    'appointed',
    'director of estates',
    'head of facilities',
    'chief operating officer',
    'joined',
    'named as director',
    'leadership team',
    'promotion',
  ],
  'workplace-property': [
    'commercial office',
    'grade a',
    'hybrid working',
    'lease expiry',
    'space planning',
    'tenant satisfaction',
    'occupancy',
  ],
  'cleaning-soft-fm': [
    'commercial cleaning',
    'janitorial',
    'waste management',
    'grounds maintenance',
    'pest control',
  ],
  'security': [
    'cctv',
    'access control',
    'security guarding',
    'intruder alarm',
    'bsia',
    'nass',
    'turnstiles',
  ],
  'waste-environment': [
    'environmental permit',
    'trade effluent',
    'waste transfer note',
    'spill response',
    'circular economy',
  ],
};

export class FMTaxonomyClassifier {
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

    const primaryCategory = sorted[0][1] > 0 ? sorted[0][0] : 'compliance';
    const secondaryCategories = sorted
      .slice(1, 4)
      .filter((s) => s[1] > 0)
      .map((s) => s[0]);

    const confidence = sorted[0][1] >= 4 ? 0.95 : sorted[0][1] >= 2 ? 0.75 : 0.45;

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

