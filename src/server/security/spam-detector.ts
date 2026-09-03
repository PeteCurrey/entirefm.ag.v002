/**
 * ENTIREFM COMMERCIAL & LEAD SECURITY — SPAM CONTENT DETECTOR
 * ==========================================================
 * High-precision, deterministic rules engine to identify automated spam,
 * promotional abuse, malicious payloads, and link abuse in enquiries.
 *
 * Designed specifically for B2B Commercial Facilities Management:
 * - Does NOT flag genuine FM industry terminology (HVAC, PPM, compliance, SFG20,
 *   subcontractor, quote, commercial estate, tender, etc.).
 * - Detects casino/gambling, crypto/forex, adult, pharmacy, SEO spam, and
 *   generic bulk prospecting templates.
 * - Enforces link density controls (max links, suspicious TLDs).
 * - Sanitizes raw text to eliminate script tags and HTML injection.
 */

export interface SpamAnalysisResult {
  score: number; // 0 to 100
  level: 'CLEAN' | 'NEEDS_REVIEW' | 'SPAM_SUSPECTED';
  flags: string[];
  sanitizedMessage: string;
}

// Suspicious URL patterns & high-abuse Top Level Domains (TLDs)
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s<>"]+/gi;
const SUSPICIOUS_TLDS = /\.(?:xyz|top|ru|cn|click|work|fit|link|gq|ml|cf|ga|tk|stream|bid|racing|party|date|faith|review)\b/i;

// Categorized spam phrases & patterns (weighted)
const SPAM_CATEGORIES: { category: string; weight: number; patterns: RegExp[] }[] = [
  {
    category: 'CRYPTO_AND_FOREX',
    weight: 45,
    patterns: [
      /\b(?:crypto|bitcoin|btc|ethereum|forex trading|binary options|usdt|token presale|wallet connect)\b/i,
      /\b(?:investment return|guaranteed profit|passive income|daily payout|roi of \d+%)\b/i,
    ],
  },
  {
    category: 'SEO_AND_MARKETING_SPAM',
    weight: 35,
    patterns: [
      /\b(?:seo service|rank #?1 on google|backlink|first page of google|guest post|increase your traffic)\b/i,
      /\b(?:domain authority|dofollow|web traffic|leads generation for your website)\b/i,
      /\b(?:dear webmaster|noticed some errors on your website|free audit report)\b/i,
    ],
  },
  {
    category: 'GAMBLING_AND_CASINO',
    weight: 60,
    patterns: [
      /\b(?:casino|slot machine|betting|poker online|free spins|jackpot|baccarat|sportsbook)\b/i,
    ],
  },
  {
    category: 'PHARMA_AND_ADULT',
    weight: 60,
    patterns: [
      /\b(?:viagra|cialis|pharmacy online|weight loss pill|escort|dating service|hookup)\b/i,
    ],
  },
  {
    category: 'FINANCIAL_SCAM',
    weight: 45,
    patterns: [
      /\b(?:wire transfer|funds ready for release|claim your prize|inheritance fund|western union)\b/i,
      /\b(?:urgent business proposal|confidential partnership proposal|million dollars)\b/i,
    ],
  },
  {
    category: 'HTML_AND_SCRIPT_INJECTION',
    weight: 70,
    patterns: [
      /<script\b/i,
      /javascript:/i,
      /<iframe\b/i,
      /<object\b/i,
      /on(?:load|error|click|mouseover)=/i,
      /data:text\/html/i,
    ],
  },
];

/**
 * Strips dangerous HTML tags and converts special characters into safe representations.
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\r\n/g, '\n')
    .trim();
}

/**
 * Analyzes an inbound message, company, and email for spam characteristics.
 */
export function analyzeEnquirySpam(options: {
  name: string;
  email: string;
  message: string;
  company?: string;
}): SpamAnalysisResult {
  const { name, email, message, company = '' } = options;
  let score = 0;
  const flags: string[] = [];

  const combinedText = `${name} ${company} ${message}`.toLowerCase();

  // 1. Link & URL Analysis
  const foundUrls = message.match(URL_REGEX) || [];
  if (foundUrls.length >= 3) {
    score += 45;
    flags.push(`EXCESSIVE_LINKS_${foundUrls.length}`);
  } else if (foundUrls.length >= 1) {
    score += 15;
    flags.push('CONTAINS_LINKS');
  }

  for (const url of foundUrls) {
    if (SUSPICIOUS_TLDS.test(url)) {
      score += 40;
      flags.push('SUSPICIOUS_DOMAIN_TLD');
      break;
    }
  }

  // 2. Keyword & Pattern Matching across Spam Categories
  for (const group of SPAM_CATEGORIES) {
    for (const pattern of group.patterns) {
      if (pattern.test(combinedText)) {
        score += group.weight;
        flags.push(group.category);
        break; // Count once per category
      }
    }
  }

  // 3. Repeated Characters / Text Flood
  if (/(.)\1{9,}/.test(message)) {
    score += 35;
    flags.push('REPEATED_CHARACTER_FLOOD');
  }

  // 4. Excessive Cyrillic / Non-Latin Scripts in English commercial context
  // If message is mostly Cyrillic in a UK FM context, flag as foreign spam
  const cyrillicMatch = message.match(/[\u0400-\u04FF]/g) || [];
  if (cyrillicMatch.length > 10 && cyrillicMatch.length / message.length > 0.3) {
    score += 55;
    flags.push('HIGH_CYRILLIC_DENSITY');
  }

  // 5. Check if Name contains URLs
  if (URL_REGEX.test(name)) {
    score += 50;
    flags.push('URL_IN_NAME_FIELD');
  }

  // 6. Very short or meaningless message with links
  if (message.length < 30 && foundUrls.length > 0) {
    score += 30;
    flags.push('SHORT_MESSAGE_WITH_LINK');
  }

  // Cap max score at 100
  score = Math.min(100, score);

  let level: 'CLEAN' | 'NEEDS_REVIEW' | 'SPAM_SUSPECTED' = 'CLEAN';
  if (score >= 65) {
    level = 'SPAM_SUSPECTED';
  } else if (score >= 30) {
    level = 'NEEDS_REVIEW';
  }

  return {
    score,
    level,
    flags,
    sanitizedMessage: sanitizeText(message),
  };
}
