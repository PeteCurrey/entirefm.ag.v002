/**
 * FM ROI & TCO CALCULATOR — "WHY THIS WORKS" COMMENTARY PIPELINE
 * ===============================================================
 * Three-provider pipeline generating high-level operational FM reasoning:
 * 1. Primary Research: Google Gemini 2.5 Flash with Google Search Grounding.
 * 2. Primary Synthesis: Anthropic Claude 3.5 Haiku (strict formatting & negative constraint adherence).
 * 3. Validation Gate: Deterministic regex and word count cross-check (verifying zero fabricated figures/percentages).
 * 4. Unified Fallback: OpenAI GPT-4o-mini (single-pass directional drafting).
 * 5. Deterministic Baseline: Pre-compiled UK commercial FM consolidation knowledge base.
 *
 * Caching:
 * - 24-hour server-side cache keyed by `portfolioBand:YYYY-MM-DD`.
 * - Fixed bands: single (1 site), multi (2–5 sites), estate (6–15 sites), nationwide (16+ sites).
 */

export interface RoiContextResult {
  content: string;
  source: 'GROUNDED_GEMINI_CLAUDE' | 'OPENAI_FALLBACK' | 'DETERMINISTIC' | 'CACHE_HIT';
  cachedAt: string;
  expiresAt: string;
  latencyMs?: number;
}

// In-memory server-side cache
const cache = new Map<string, { data: RoiContextResult; expiresAtTimestamp: number }>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---------------------------------------------------------------------------
// DETERMINISTIC BASELINES (Guaranteed fallback, 100-130 words, zero numbers)
// ---------------------------------------------------------------------------
const DETERMINISTIC_KNOWLEDGE: Record<string, string> = {
  single:
    'Consolidating fragmented maintenance contractors under a single planned delivery model replaces disconnected callouts with structured, multidisciplinary engineering visits. When independent HVAC, electrical, and water compliance suppliers operate in isolation, organisations incur duplicate call-out surcharges, conflicting fault assessments, and repeated administrative friction. Integrating mechanical, electrical, and statutory obligations within one planned maintenance schedule allows coordinated attendance, eliminates overlapping management fees, and enables technicians to diagnose secondary plant faults during routine servicing before they escalate into disruptive downtime. Rather than managing multiple emergency invoices and chasing individual service reports, property managers gain unified accountability, predictable operational budgeting, and auditable compliance continuity across all critical primary assets.',
  multi:
    'For multi-site commercial portfolios, managing fragmented local contractors inevitably leads to administrative bloat, inconsistent service-level agreements, and escalating emergency expenditure. Consolidating multi-property estates under an integrated planned maintenance provider unlocks route-clustering efficiencies, harmonised compliance schedules, and pooled engineering resources across neighbouring facilities. Instead of internal facilities teams processing disparate contractor invoices, chasing individual job sheets, and arbitrating conflicting warranties, a unified facilities partnership centralises statutory compliance reporting and job dispatch. Routine servicing synchronises plant inspections, dampening avoidable reactive breakdowns and extending mechanical asset lifespans. This strategic transition converts unpredictable emergency call-out costs into controlled, scheduled operational expenditure across the entire regional estate.',
  estate:
    'Managing extensive commercial property estates through separate regional contractors generates compounded operational drag, compliance vulnerability, and substantial administrative overhead. Fragmented procurement forces facilities directors to oversee dozens of independent specialist agreements, each carrying isolated travel charges, divergent reporting formats, and conflicting service commitments. Transitioning to a consolidated planned maintenance framework standardises statutory compliance registers, synchronises engineering routines, and establishes clear accountability for uptime across every facility. Multi-skilled technical teams identify emerging plant wear during statutory checks, reducing emergency breakdown callouts and preventing disruptive business closures. Centralising contract administration into single-source monthly accounts eliminates duplicate management overhead and delivers robust, auditable governance across all properties.',
  nationwide:
    'Operating nationwide property portfolios with fragmented local contractors creates operational blind spots, severe compliance variance, and excessive administrative burden. Disparate trade suppliers lack mutual coordination, resulting in redundant site attendances, overlapping call-out tariffs, and fractured asset documentation. Adopting a consolidated planned preventative maintenance model standardises national statutory compliance registers while leveraging regional engineering density for swift emergency response. Coordinated asset servicing systematically identifies mechanical degradation before catastrophic plant failure occurs, significantly reducing unbudgeted emergency callouts and critical operational downtime. Consolidating all specialist trades into an integrated framework delivers uniform service delivery standards, streamlined account administration, and transparent portfolio-wide lifecycle asset stewardship.',
};

// ---------------------------------------------------------------------------
// 1. GEMINI GROUNDED RESEARCH
// ---------------------------------------------------------------------------
async function fetchGeminiGroundedResearch(bandName: string, apiKey: string): Promise<string | null> {
  const prompt = `Conduct focused research on UK commercial facilities management estate consolidation, specifically for:
- Portfolio Scale: ${bandName}
- Focus: Why consolidating fragmented independent trade contractors (M&E, HVAC, fire safety, water hygiene) into an integrated planned preventative maintenance (PPM) model reduces reactive spend, administrative overhead, and business outage risk.

Search UK FM industry publications (e.g. IWFM, RICS, commercial property FM case studies).
Return concise factual notes focusing on qualitative and operational efficiency drivers. Do NOT invent or output specific percentages or monetary savings figures.`;

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
  bandName: string,
  apiKey: string
): Promise<string | null> {
  const systemPrompt = `You are the Lead Commercial Surveyor for EntireFM, an authoritative UK facilities management and engineering consultancy.
Write a concise, authoritative "Why This Works" commentary explaining WHY consolidating fragmented multi-contractor FM into an integrated planned delivery model reduces reactive spend, administrative overhead, and unplanned outage risk.

Strict Rules:
1. Target Length: 100–130 words.
2. Structure: Exactly one cohesive paragraph of plain text.
3. NEGATIVE CONSTRAINT (CRITICAL): Do NOT include ANY specific numbers, percentages, pound amounts (£), dollar signs ($), or specific multiplier figures. Focus purely on operational, commercial, and engineering mechanisms (e.g. unified dispatch, coordinated attendance, early defect detection, single-point invoice processing, statutory continuity).
4. Tone: Restrained, professional, authoritative UK commercial property advisory.
5. Output ONLY the paragraph text. No headings, markdown formatting, or preamble.`;

  const userPrompt = `Portfolio Scale: ${bandName}\nResearch Context:\n${researchNotes}\n\nDraft the 100–130 word operational commentary now obeying all negative constraints.`;

  const payload = {
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 300,
    temperature: 0.25,
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
// 3. OPENAI UNIFIED FALLBACK STEP (gpt-4o-mini)
// ---------------------------------------------------------------------------
async function fetchOpenAiFallback(bandName: string, apiKey: string): Promise<string | null> {
  const systemPrompt = `You are a senior UK commercial facilities management consultant for EntireFM.
Write a concise 100–130 word explanation of why consolidating fragmented trade contractors into an integrated planned maintenance model reduces reactive callouts, contractor administration, and equipment outage risks for a ${bandName} portfolio.

Rules:
- Exactly one paragraph of plain text (100–130 words).
- ABSOLUTELY NO numbers, percentages, currency symbols (£/$), or specific savings figures.
- Ground explanations in operational mechanics: route clustering, scheduled preventative servicing, single-point helpdesk, and auditable compliance registers.`;

  const payload = {
    model: 'gpt-4o-mini',
    temperature: 0.2,
    max_tokens: 300,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Explain operational consolidation benefits for portfolio scale: ${bandName}` },
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

  // Strictly forbid numbers, percentages, pound symbols, currency mentions
  const forbiddenNumberPattern = /(\d+%\s*|\d+\s*percent|£\s*\d+|\d+\s*pounds|\$\s*\d+|\b\d+\b)/i;
  if (forbiddenNumberPattern.test(draft)) {
    return { isValid: false, reason: 'Contains forbidden numbers or statistical figures' };
  }

  return { isValid: true };
}

// ---------------------------------------------------------------------------
// MAIN PIPELINE CONTROLLER
// ---------------------------------------------------------------------------
export async function getRoiWhyThisWorksContext(portfolioBand: string): Promise<RoiContextResult> {
  const normalizedBand = ['single', 'multi', 'estate', 'nationwide'].includes(portfolioBand)
    ? portfolioBand
    : 'multi';

  const todayStr = new Date().toISOString().split('T')[0];
  const cacheKey = `${normalizedBand}:${todayStr}`;

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

  const bandLabels: Record<string, string> = {
    single: 'Single Commercial Facility',
    multi: 'Regional Multi-Site Commercial Estate (2–5 properties)',
    estate: 'Medium Commercial Property Portfolio (6–15 properties)',
    nationwide: 'Large Multi-Regional / Nationwide Commercial Estate (16+ properties)',
  };
  const bandName = bandLabels[normalizedBand] || bandLabels.multi;

  // Path 1: Gemini Grounded Research -> Claude 3.5 Haiku Drafting
  if (geminiKey && anthropicKey) {
    try {
      const researchNotes = await fetchGeminiGroundedResearch(bandName, geminiKey);
      if (researchNotes) {
        const draft = await fetchClaudeDrafting(researchNotes, bandName, anthropicKey);
        if (draft) {
          const check = validateDraft(draft);
          if (check.isValid) {
            const result: RoiContextResult = {
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
      console.warn('[ROI Pipeline: Gemini-Claude path warning]', err);
    }
  }

  // Path 2: OpenAI Unified Fallback
  if (openAiKey) {
    try {
      const openAiDraft = await fetchOpenAiFallback(bandName, openAiKey);
      if (openAiDraft) {
        const check = validateDraft(openAiDraft);
        if (check.isValid) {
          const result: RoiContextResult = {
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
      console.warn('[ROI Pipeline: OpenAI fallback warning]', err);
    }
  }

  // Path 3: Deterministic Knowledge Baseline (Always 100% compliant)
  const baseline = DETERMINISTIC_KNOWLEDGE[normalizedBand] || DETERMINISTIC_KNOWLEDGE.multi;
  const result: RoiContextResult = {
    content: baseline,
    source: 'DETERMINISTIC',
    cachedAt: new Date().toISOString(),
    expiresAt: new Date(now + TTL_MS).toISOString(),
    latencyMs: Date.now() - startTime,
  };
  cache.set(cacheKey, { data: result, expiresAtTimestamp: now + TTL_MS });
  return result;
}
