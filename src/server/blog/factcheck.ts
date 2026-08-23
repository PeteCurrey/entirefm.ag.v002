export interface FactCheckRule {
  term: RegExp;
  category: 'LEGAL_STATUTE' | 'STANDARDS_CODE' | 'TESTING_INTERVAL' | 'CLAIM_VERIFICATION';
  severity: 'BLOCKER' | 'WARNING';
  ruleDescription: string;
  verifiedFact: string;
}

export interface FactCheckResult {
  passed: boolean;
  blockers: string[];
  warnings: string[];
  claimsIdentified: number;
}

/**
 * Hardcoded rules reflecting UK statutory requirements and standards
 */
export const FACT_CHECK_RULES: FactCheckRule[] = [
  {
    term: /emergency lighting.*must be tested annually/i,
    category: 'STANDARDS_CODE',
    severity: 'WARNING',
    ruleDescription: 'Annual test is a standard (BS 5266-1), not an explicit primary statute.',
    verifiedFact: 'BS 5266-1 recommends a full 3-hour annual duration test; monthly function tests are also required under the Regulatory Reform (Fire Safety) Order 2005.',
  },
  {
    term: /pat testing.*every year.*legal requirement/i,
    category: 'LEGAL_STATUTE',
    severity: 'BLOCKER',
    ruleDescription: 'PAT testing annually is NOT a statutory legal mandate.',
    verifiedFact: 'The Electricity at Work Regulations 1989 require electrical equipment to be maintained safely. Frequency is risk-assessed, not universally mandated as annual.',
  },
  {
    term: /eicr.*every year/i,
    category: 'TESTING_INTERVAL',
    severity: 'BLOCKER',
    ruleDescription: 'Commercial fixed wire testing is typically every 5 years (or 3 years for higher-risk premises), not annual.',
    verifiedFact: 'BS 7671 recommends commercial EICR maximum intervals of 5 years (commercial offices/retail) or 3 years (industrial/manufacturing).',
  },
  {
    term: /guaranteed (\d+)% reduction in costs/i,
    category: 'CLAIM_VERIFICATION',
    severity: 'BLOCKER',
    ruleDescription: 'Unsubstantiated commercial percentage financial guarantees are strictly prohibited.',
    verifiedFact: 'Remove unverified percentage savings guarantees or attribute as estimated savings based on historical case studies.',
  },
  {
    term: /entirefm is the only.*in the uk/i,
    category: 'CLAIM_VERIFICATION',
    severity: 'BLOCKER',
    ruleDescription: 'Unverified exclusivity claims are not permitted in editorial articles.',
    verifiedFact: 'State EntireFM specialist capabilities without unsupported absolute exclusivity assertions.',
  },
];

/**
 * Scan content for prohibited claims or inaccurate statutory statements
 */
export function runFactCheck(text: string): FactCheckResult {
  const blockers: string[] = [];
  const warnings: string[] = [];
  let claimsIdentified = 0;

  for (const rule of FACT_CHECK_RULES) {
    if (rule.term.test(text)) {
      claimsIdentified++;
      const msg = `[${rule.category}] ${rule.ruleDescription} Correction: ${rule.verifiedFact}`;
      if (rule.severity === 'BLOCKER') {
        blockers.push(msg);
      } else {
        warnings.push(msg);
      }
    }
  }

  // Check for generic AI clichés and banned filler phrases
  const BANNED_AI_PHRASES = [
    "in today's rapidly evolving facilities management landscape",
    "facilities management is undergoing a transformation",
    "at entirefm, we understand",
    "game-changing",
    "revolutionary breakthrough",
    "unlock the true power of",
    "delve into the world of",
    "testament to our commitment",
  ];

  for (const phrase of BANNED_AI_PHRASES) {
    if (text.toLowerCase().includes(phrase)) {
      warnings.push(`Contains prohibited AI filler phrase: "${phrase}". Rewrite with professional FM trade vocabulary.`);
    }
  }

  return {
    passed: blockers.length === 0,
    blockers,
    warnings,
    claimsIdentified,
  };
}
