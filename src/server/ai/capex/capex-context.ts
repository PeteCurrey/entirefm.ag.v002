/**
 * ASSET LIFECYCLE & CAPEX PLANNER — "WHY LIFECYCLE PLANNING MATTERS"
 * ====================================================================
 * Grounded AI commentary pipeline:
 * 1. Primary Research: Google Gemini 2.5 Flash with Google Search Grounding.
 * 2. Primary Synthesis: Anthropic Claude 3.5 Haiku (strict formatting & negative constraint adherence).
 * 3. Validation Gate: Deterministic regex and word count cross-check (verifying zero fabricated figures/percentages/numbers).
 * 4. Unified Fallback: OpenAI GPT-4o-mini (single-pass directional drafting).
 * 5. Deterministic Baseline: Pre-compiled UK commercial lifecycle FM engineering knowledge base.
 *
 * NOTE ON CITATIONS:
 * In accordance with brand governance, NO specific named guides, editions, or table numbers
 * may be output. Output must frame benchmarks generally:
 * "EntireFM indicative lifecycle benchmark, informed by industry-standard UK commercial maintenance guidance."
 *
 * Caching:
 * - 24-hour server-side cache keyed by `riskProfile:YYYY-MM-DD`.
 * - Fixed profiles: high_risk, imminent_risk, balanced_estate, modern_estate.
 */

export interface CapexContextResult {
  content: string;
  source: 'GROUNDED_GEMINI_CLAUDE' | 'OPENAI_FALLBACK' | 'DETERMINISTIC' | 'CACHE_HIT';
  cachedAt: string;
  expiresAt: string;
  latencyMs?: number;
}

// In-memory server-side cache
const cache = new Map<string, { data: CapexContextResult; expiresAtTimestamp: number }>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---------------------------------------------------------------------------
// DETERMINISTIC BASELINES (Guaranteed fallback, 100-130 words, zero numbers)
// ---------------------------------------------------------------------------
const DETERMINISTIC_KNOWLEDGE: Record<string, string> = {
  high_risk:
    'Operating critical commercial building assets beyond their recognized economic service life drastically compounds operational vulnerability, energy inefficiency, and sudden emergency disruption. When aging boilers, chillers, or lifting plant operate past expected thresholds, component obsolescence forces facilities managers into unbudgeted emergency replacements, protracted lead times for specialist plant, and severe operational interruption. Implementing a structured capital expenditure replacement plan replaces reactionary crisis management with orderly forward budgeting. Forward procurement enables competitive engineering tendering, prevents catastrophic mid-season breakdown, and ensures replacement equipment delivers modern seasonal efficiency standards. Proactive lifecycle forecasting transforms unpredictable capital emergencies into controlled, board-approved estate modernization programs.',
  imminent_risk:
    'Commercial building plant approaching the final years of typical service life requires disciplined strategic intervention before mechanical degradation triggers unexpected failure. Approaching end-of-life plant incurs escalating maintenance callout costs, declining thermal efficiency, and diminishing manufacturer parts availability. Anticipating major plant renewals across a multi-year rolling capital horizon allows asset managers to synchronise engineering switchovers during planned seasonal shutdowns rather than enduring emergency tenant disruption. Strategic capital forecasting enables estate teams to evaluate heat pump decarbonisation opportunities, explore modern intelligent building controls, and secure competitive mechanical installation rates, protecting operational continuity and commercial asset valuation.',
  balanced_estate:
    'A balanced commercial property portfolio demands continuous lifecycle visibility to smooth capital volatility across rolling financial horizons. Without forward visibility, clustered plant retirements generate abrupt, unmanageable capital calls that destabilise estate operational budgets and compromise statutory compliance. Structuring asset renewals across a rolling forecast enables facilities directors to balance expenditure between immediate plant renewals, ongoing component overhauls, and long-term fabric integrity. Regular condition appraisals validate actual equipment performance against standard maintenance benchmarks, ensuring capital is deployed strictly where mechanical necessity dictates while extending reliable service lives through proactive planned maintenance.',
  modern_estate:
    'For modern commercial estates with recently commissioned mechanical and electrical services, proactive lifecycle planning establishes the strategic foundation for long-term capital preservation. Even newly installed infrastructure requires rigorous maintenance alignment to achieve its full projected service life and avoid premature degradation. Tracking asset age profiles and warranty milestones from initial handover enables facilities teams to budget for mid-life component refurbishments and planned controller upgrades decades in advance. Integrating forward lifecycle forecasting into routine facilities governance prevents future backlog accumulation, safeguards corporate sustainability commitments, and delivers predictable financial stewardship across the entire building lifecycle.',
};

// ---------------------------------------------------------------------------
// 1. GEMINI GROUNDED RESEARCH
// ---------------------------------------------------------------------------
async function fetchGeminiGroundedResearch(profileName: string, apiKey: string): Promise<string | null> {
  const prompt = `Conduct focused research on UK commercial building asset lifecycle planning and forward capital expenditure (CAPEX) forecasting, specifically for:
- Portfolio Profile: ${profileName}
- Focus: Why commercial property owners, landlords, and FM directors must forecast rolling capital replacements rather than running mechanical and electrical plant to catastrophic failure.
- Core themes: avoiding crisis procurement surcharges, lead-time risk on heavy plant (chillers, boilers, switchgear, lifts), operational uptime, and energy efficiency.

Search UK commercial property and FM industry guidance.
Return concise factual notes focusing on qualitative and operational governance drivers.
ABSOLUTELY CRITICAL: Do NOT invent, cite, or output specific numbers, percentages, pound figures, table numbers, or specific guide editions.`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 600,
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text && text.trim().length > 50 ? text.trim() : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 2. CLAUDE DRAFTING STEP (Claude 3.5 Haiku)
// ---------------------------------------------------------------------------
async function fetchClaudeDrafting(
  researchNotes: string,
  profileName: string,
  apiKey: string
): Promise<string | null> {
  const systemPrompt = `You are the Principal Asset Advisory Surveyor for EntireFM, an authoritative UK commercial facilities engineering consultancy.
Write a concise, authoritative "Why Lifecycle Planning Matters" commentary explaining WHY commercial building operators must forecast plant replacement proactively across rolling capital horizons rather than allowing assets to run to catastrophic failure.

Strict Rules:
1. Target Length: 100–130 words.
2. Structure: Exactly ONE well-developed, authoritative paragraph.
3. NEGATIVE CONSTRAINT (CRITICAL): Do NOT include ANY specific numbers, percentages, digits (0-9), pound amounts (£), dollar signs ($), or specific multiplier figures.
4. CITATION CONSTRAINT: Do NOT name specific guide titles, standard codes, edition years, or table numbers. Frame benchmarks generally (e.g., industry-standard UK commercial maintenance guidance).
5. Ground explanations in engineering governance: lead times on heavy plant, avoiding emergency hire premiums, planned seasonal shutdowns, tenant lease continuity, and modern seasonal energy efficiency.`;

  const userPrompt = `Research Notes from UK FM Sector:
${researchNotes}

Estate Profile: ${profileName}

Draft the single-paragraph commentary adhering strictly to all negative constraints.`;

  const payload = {
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 350,
    temperature: 0.2,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return text && text.trim().length > 50 ? text.trim() : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 3. OPENAI UNIFIED FALLBACK (GPT-4o-mini)
// ---------------------------------------------------------------------------
async function fetchOpenAiFallback(profileName: string, apiKey: string): Promise<string | null> {
  const systemPrompt = `You are the Principal Asset Advisory Surveyor for EntireFM, an authoritative UK facilities engineering consultancy.
Write a concise, authoritative "Why Lifecycle Planning Matters" commentary explaining why forward capital planning for commercial building plant is superior to running to failure.

Rules:
- Exactly one paragraph of plain text (100–130 words).
- ABSOLUTELY NO numbers, percentages, digits (0-9), currency symbols (£/$), or specific savings figures.
- Do NOT name specific guide editions or table numbers.
- Ground explanations in engineering reality: plant lead times, emergency hire costs, planned seasonal switchovers, tenant comfort, and long-term asset value.`;

  const payload = {
    model: 'gpt-4o-mini',
    temperature: 0.2,
    max_tokens: 300,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Explain asset lifecycle planning benefits for estate profile: ${profileName}` },
    ],
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return text && text.trim().length > 50 ? text.trim() : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 4. DETERMINISTIC CROSS-CHECK GATE
// ---------------------------------------------------------------------------
function validateDraft(draft: string): { isValid: boolean; reason?: string } {
  const words = draft.trim().split(/\s+/).filter(Boolean);
  if (words.length < 85 || words.length > 145) {
    return { isValid: false, reason: `Word count out of range: ${words.length}` };
  }

  // Strictly forbid numbers, percentages, pound symbols, currency mentions, or digits
  const forbiddenNumberPattern = /(\d+%\s*|\d+\s*percent|£\s*\d+|\d+\s*pounds|\$\s*\d+|\b\d+\b|\d)/i;
  if (forbiddenNumberPattern.test(draft)) {
    return { isValid: false, reason: 'Contains forbidden numbers, digits or statistical figures' };
  }

  return { isValid: true };
}

// ---------------------------------------------------------------------------
// MAIN PIPELINE CONTROLLER
// ---------------------------------------------------------------------------
export async function getCapexLifecycleContext(riskProfile: string): Promise<CapexContextResult> {
  const normalizedProfile = ['high_risk', 'imminent_risk', 'balanced_estate', 'modern_estate'].includes(riskProfile)
    ? riskProfile
    : 'balanced_estate';

  const todayStr = new Date().toISOString().split('T')[0];
  const cacheKey = `${normalizedProfile}:${todayStr}`;

  // Check in-memory cache
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expiresAtTimestamp > now) {
    return {
      ...cached.data,
      source: 'CACHE_HIT',
    };
  }

  const startTime = Date.now();
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const profileLabels: Record<string, string> = {
    high_risk: 'High-Risk Estate with Aging Plant Operating Past Indicative Service Life',
    imminent_risk: 'Commercial Estate with Major Plant Nearing End-of-Life Renewal Window',
    balanced_estate: 'Balanced Commercial Portfolio with Distributed Asset Lifecycles',
    modern_estate: 'Modern Commercial Facility Focused on Long-Term Capital Preservation',
  };
  const profileName = profileLabels[normalizedProfile] || profileLabels.balanced_estate;

  // Path 1: Gemini Grounded Research -> Claude 3.5 Haiku Drafting
  if (geminiKey && anthropicKey) {
    try {
      const researchNotes = await fetchGeminiGroundedResearch(profileName, geminiKey);
      if (researchNotes) {
        const draft = await fetchClaudeDrafting(researchNotes, profileName, anthropicKey);
        if (draft) {
          const check = validateDraft(draft);
          if (check.isValid) {
            const result: CapexContextResult = {
              content: draft,
              source: 'GROUNDED_GEMINI_CLAUDE',
              cachedAt: new Date().toISOString(),
              expiresAt: new Date(now + TTL_MS).toISOString(),
              latencyMs: Date.now() - startTime,
            };
            cache.set(cacheKey, { data: result, expiresAtTimestamp: now + TTL_MS });
            return result;
          }
        }
      }
    } catch (err) {
      console.warn('[CAPEX AI Pipeline: Gemini-Claude path warning]', err);
    }
  }

  // Path 2: OpenAI Unified Fallback
  if (openAiKey) {
    try {
      const openAiDraft = await fetchOpenAiFallback(profileName, openAiKey);
      if (openAiDraft) {
        const check = validateDraft(openAiDraft);
        if (check.isValid) {
          const result: CapexContextResult = {
            content: openAiDraft,
            source: 'OPENAI_FALLBACK',
            cachedAt: new Date().toISOString(),
            expiresAt: new Date(now + TTL_MS).toISOString(),
            latencyMs: Date.now() - startTime,
          };
          cache.set(cacheKey, { data: result, expiresAtTimestamp: now + TTL_MS });
          return result;
        }
      }
    } catch (err) {
      console.warn('[CAPEX AI Pipeline: OpenAI fallback warning]', err);
    }
  }

  // Path 3: Deterministic Knowledge Baseline (Always 100% compliant)
  const baseline = DETERMINISTIC_KNOWLEDGE[normalizedProfile] || DETERMINISTIC_KNOWLEDGE.balanced_estate;
  const result: CapexContextResult = {
    content: baseline,
    source: 'DETERMINISTIC',
    cachedAt: new Date().toISOString(),
    expiresAt: new Date(now + TTL_MS).toISOString(),
    latencyMs: Date.now() - startTime,
  };
  cache.set(cacheKey, { data: result, expiresAtTimestamp: now + TTL_MS });
  return result;
}
