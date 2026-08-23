#!/usr/bin/env node
/**
 * CLAIM GUARD
 * ===========
 * Fails the build when language the claims registry forbids reaches a
 * rendered page.
 *
 * WHY THIS EXISTS
 * ---------------
 * /config/verified-claims.json marks three claims DO_NOT_USE and nine
 * TO_VERIFY, but nothing enforced it — the templates asserted regional
 * depots, "100% Audit-Ready", "Guaranteed Compliance", universal
 * self-delivery and unqualified 24/7 availability across 54 pages. A registry
 * that nothing checks is a document, not a control.
 *
 * Tested against rendered HTML rather than source, because source comments
 * legitimately discuss the forbidden wording while explaining why it was
 * removed. What matters is what a visitor and a search engine actually see.
 *
 * Run after `npm run build`.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BUILD_DIR = path.join(ROOT, '.next', 'server', 'app');

/**
 * Each pattern maps to the registry entry that forbids it.
 * Keep the `why` short — it is printed as the failure explanation.
 */
const FORBIDDEN = [
  {
    claim: 'GEO_REGIONAL_CENTRES',
    status: 'DO_NOT_USE',
    why: 'Asserts physical premises in a city. EntireFM has no verified regional depots or offices.',
    patterns: [
      /\bregional (?:engineering )?depots?\b/i,
      /\boperations centre\b/i,
      /\bregional operating centres?\b/i,
      /\b(?:fm|regional|operational|city|local)\s+(?:operational\s+)?hubs?\b/i,
      /\bhubs? in [A-Z]/,
      /\b[A-Z][a-z]+ FM Centre\b/,
      /\bregional centre\b/i,
      /\bour (?:office|depot|branch) in\b/i,
    ],
  },
  {
    claim: 'LEGAL_COMPLIANCE_GUARANTEE',
    status: 'DO_NOT_USE',
    why: 'Guarantees a compliance outcome that cannot be underwritten.',
    patterns: [
      /\bguaranteed compliance\b/i,
      /\bcompliance guarantee\b/i,
      /\b100% (?:audit-ready|compliant|compliance)\b/i,
      /\bfully guaranteed\b/i,
    ],
  },
  {
    claim: 'STATS_PORTFOLIO_METRICS',
    status: 'DO_NOT_USE',
    why: 'Portfolio statistics and savings percentages are unevidenced.',
    patterns: [/\b\d+% (?:savings?|reduction|cost saving)\b/i, /\bsaved clients?\b/i],
  },
  {
    claim: 'OPS_SELF_DELIVERY',
    status: 'TO_VERIFY',
    why: 'Universal self-delivery is unverified. State the model per service line at proposal stage instead.',
    patterns: [/\bself-deliver(?:y|ed)\b/i, /\b100% self[- ]deliver/i, /\bno subcontract/i],
  },
  {
    claim: 'OPS_247_EMERGENCY',
    status: 'TO_VERIFY',
    why: 'Unqualified 24/7 availability is unverified. "Out-of-hours cover for contracted sites" is supportable.',
    patterns: [
      /\b24\/7\/365\b/,
      /\b24\/7 (?:national|central|reactive|helpdesk|support|cover|dedicated)\b/i,
      /\bdedicated 24\/7\b/i,
      /\bround[- ]the[- ]clock\b/i,
    ],
  },
];

/** Accreditations may only render once the registry marks them VERIFIED. */
const claimsRegistry = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'config', 'verified-claims.json'), 'utf8')
);

/**
 * Distinctive scheme names, so a claim is caught however it is phrased.
 * Matching only the registry's full wording missed "NICEIC electrical certs"
 * and "Gas Safe records", which assert the same unverified certification.
 */
const SCHEME_ALIASES = {
  ACCRED_NICEIC: [/\bNICEIC\b/i],
  ACCRED_GAS_SAFE: [/\bGas Safe\b/i],
  ACCRED_CHAS: [/\bCHAS\b/],
  ACCRED_SAFECONTRACTOR: [/\bSafe ?Contractor\b/i],
  ACCRED_BESA: [/\bBESA\b/],
  ACCRED_ISO_9001: [/\bISO ?9001\b/i],
  ACCRED_FGAS_REFCOM: [/\bREFCOM\b/i, /\bF-Gas (?:certified|registered|accredited)\b/i],
};
for (const claim of claimsRegistry.claims) {
  if (claim.status === 'VERIFIED') continue;
  if (!claim.category || claim.category !== 'Accreditation') continue;
  FORBIDDEN.push({
    claim: claim.id,
    status: claim.status,
    why: `Accreditation "${claim.claim}" is not verified and may not be rendered.`,
    patterns: [
      new RegExp(`\\b${claim.claim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
      ...(SCHEME_ALIASES[claim.id] ?? []),
    ],
  });
}

/**
 * Documented exemptions.
 *
 * A regex cannot tell "we self-deliver" from "we do not claim to
 * self-deliver", and a glossary must be able to define the industry terms its
 * readers will meet in other providers' proposals. Each exemption names the
 * route, the claim, and why the usage is editorial rather than assertive.
 *
 * Exemptions are per route AND per claim, never blanket — a page excused for
 * one claim is still checked for every other.
 */
const EXEMPTIONS = [
  {
    route: '/facilities-management-glossary',
    claim: 'OPS_SELF_DELIVERY',
    reason:
      'Defines "self-delivery" as an industry term so buyers can read other providers\' proposals. Definitional, not a claim about EntireFM.',
  },
  {
    route: '/fm-support-n-contact/facilities-management-glossary',
    claim: 'OPS_SELF_DELIVERY',
    reason: 'Nested form of the same glossary page.',
  },
  // Careers pages list certifications EntireFM *funds for its engineers*.
  // That is a staff benefit, not a claim that the company holds them.
  ...['/job-board', '/employment-portal', '/careers'].flatMap((route) =>
    ['ACCRED_GAS_SAFE', 'ACCRED_NICEIC', 'ACCRED_FGAS_REFCOM'].map((claim) => ({
      route,
      claim,
      reason: 'Lists certifications funded for engineers as a benefit — not a claim EntireFM holds them.',
    }))
  ),
  // Supply-chain pages state what EntireFM *requires of subcontractors*.
  // Again a requirement placed on others, not a claim about EntireFM.
  ...['/fm-supply-chain', '/fm-supply-form', '/marketplace'].flatMap((route) =>
    ['ACCRED_CHAS', 'ACCRED_SAFECONTRACTOR', 'ACCRED_ISO_9001'].map((claim) => ({
      route,
      claim,
      reason: 'States accreditations required of subcontractors, not held by EntireFM.',
    }))
  ),
];

const isExempt = (route, claim) =>
  EXEMPTIONS.some((e) => e.route === route && e.claim === claim);

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, ' ');
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

if (!fs.existsSync(BUILD_DIR)) {
  console.error('No build output found. Run `npm run build` first.');
  process.exit(1);
}

const files = walk(BUILD_DIR);
const violations = new Map();

for (const file of files) {
  const text = visibleText(fs.readFileSync(file, 'utf8'));
  const route = file.replace(BUILD_DIR, '').replace(/\.html$/, '').replace(/^\/index$/, '/') || '/';
  for (const rule of FORBIDDEN) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (!match) continue;
      if (isExempt(route, rule.claim)) break;
      if (!violations.has(rule.claim)) violations.set(rule.claim, { rule, hits: [] });
      violations.get(rule.claim).hits.push({ route, phrase: match[0].trim() });
      break;
    }
  }
}

console.log(`Claim guard — ${files.length} rendered pages checked\n`);

if (EXEMPTIONS.length) {
  console.log(`  ${EXEMPTIONS.length} documented exemption(s) applied:`);
  for (const e of EXEMPTIONS) console.log(`    ${e.route} · ${e.claim} — ${e.reason}`);
  console.log('');
}

if (!violations.size) {
  console.log('PASS: no forbidden claim language reaches a rendered page.');
  process.exit(0);
}

let total = 0;
for (const { rule, hits } of violations.values()) {
  total += hits.length;
  console.log(`  ${rule.claim}  [${rule.status}]  — ${hits.length} page(s)`);
  console.log(`    ${rule.why}`);
  const sample = [...new Set(hits.map((h) => h.phrase))].slice(0, 4);
  console.log(`    phrases: ${sample.map((p) => `"${p}"`).join(', ')}`);
  console.log(`    e.g. ${hits.slice(0, 4).map((h) => h.route).join(', ')}\n`);
}

console.error(`FAIL: ${total} page(s) render claim language the registry forbids.`);
process.exit(1);
