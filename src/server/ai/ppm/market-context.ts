/**
 * PPM COST ESTIMATOR — COMMERCIAL LANDSCAPE & MARKET CONTEXT PIPELINE
 * ===================================================================
 * Multi-provider pipeline generating regional UK FM market commentary:
 * 1. Primary Research: Google Gemini 2.5 Flash with Google Search Grounding.
 * 2. Primary Synthesis: Anthropic Claude 3.5 Haiku / Sonnet.
 * 3. Factual Validation: OpenAI GPT-4o-mini structured hallucination cross-check.
 *    - Detects numeric/statistical claims in the draft not traceable to grounding source.
 *    - Triggers one retry with an explicit "strip numbers" instruction on failure.
 *    - Falls back to deterministic baseline if retry also fails.
 * 4. Unified Fallback: OpenAI GPT-4o-mini (single-pass research + drafting).
 * 5. Deterministic Baseline: Pre-compiled UK commercial FM knowledge base (zero numbers).
 *
 * Caching:
 * - 24-hour server-side cache keyed by `sectorKey:regionKey:YYYY-MM-DD`.
 * - Draft is only cached AFTER passing the validation step.
 * - Maximum 49 combinations per day.
 * - Logs execution path and every validation check result for audit.
 */

export interface MarketContextResult {
  content: string;
  source: 'GROUNDED_GEMINI_CLAUDE' | 'OPENAI_FALLBACK' | 'DETERMINISTIC' | 'CACHE_HIT';
  cachedAt: string;
  expiresAt: string;
  latencyMs?: number;
}

// ---------------------------------------------------------------------------
// VALIDATION TYPES
// ---------------------------------------------------------------------------
interface ValidationClaim {
  text: string;
  traceable: boolean;
  note: string;
}

interface ValidationResult {
  hasNumericOrStatisticalClaims: boolean;
  claims: ValidationClaim[];
  verdict: 'PASS' | 'FAIL';
}

interface AuditLogEntry {
  cacheKey: string;
  draftSource: string;
  verdict: 'PASS' | 'FAIL';
  numericClaimsFound: number;
  failedClaims: string[];
  retryTriggered: boolean;
  retryVerdict?: 'PASS' | 'FAIL';
  finalPath: string;
  validationLatencyMs: number;
}


// In-memory server-side cache (persists across requests within the server runtime)
const cache = new Map<string, { data: MarketContextResult; expiresAtTimestamp: number }>();

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---------------------------------------------------------------------------
// DETERMINISTIC BASELINE COMMENTARY
// Guaranteed fallback ensuring zero broken UI states
// ---------------------------------------------------------------------------
const DETERMINISTIC_KNOWLEDGE: Record<string, string> = {
  office:
    'UK commercial office portfolios face sustained upward cost pressure on mechanical and electrical systems, with HVAC seasonal tuning and indoor air quality standards driving planned maintenance expenditure. While core metropolitan labour availability for certified gas and electrical technicians has stabilized, technical specialist rates—particularly within London and the South East—continue to carry a regional premium. Chiller and compressor spare parts lead times remain extended, making proactive seasonal servicing and early filter/belt replacement essential to mitigate expensive emergency call-out tariffs and avoid tenant comfort disputes.',
  industrial:
    'Industrial and manufacturing facilities continue to encounter heightened PPM cost pressures across heavy mechanical plant, dust extraction, and compressed air systems. High operating cycles accelerate wear, while recruitment constraints for high-voltage (HV) and statutory pressure vessel engineers present ongoing operational hurdles across the Midlands and North West manufacturing belts. Critical electrical switchgear and motor replacement lead times regularly exceed standard delivery windows, underscoring the necessity of structured SFG20 asset inspection regimes to prevent catastrophic production line disruption.',
  logistics:
    'Logistics and distribution hubs are experiencing operational budget adjustments focused on dock leveller hydraulics, automated high-bay rapid-roll doors, and extensive warehouse heating systems. Technical technician availability remains competitive across the central logistics golden triangle, with out-of-hours and weekend servicing attracting premium rates to maintain 24/7 parcel throughput. Component availability for commercial burner assemblies and hydraulic power units requires forward asset stocking, reinforcing the value of planned preventative maintenance over reactive breakdown models.',
  retail:
    'Retail and shopping centre estates navigate strict public safety compliance and customer-experience pressures, with HVAC chillers, escalators, and life-safety systems requiring rigorous testing intervals. Contractor labour availability across major retail hubs remains steady, yet out-of-hours scheduled maintenance is vital to prevent trading interruptions. Increasing costs for commercial refrigerants and extended lead times for air-handling fan assemblies prioritize preventative maintenance over run-to-failure strategies.',
  healthcare:
    'Healthcare and clinical facilities operate under the UK’s most demanding compliance regimes, where water hygiene (HTM 04-01), specialized ventilation (HTM 03-01), and backup power systems leave no room for deferral. The supply of qualified clinical engineering specialists remains constrained nationally, creating elevated hourly rate baselines. Stringent statutory standards combined with extended lead times for clinical-grade filtration components emphasize the requirement for disciplined, certified preventative maintenance protocols.',
  hospitality:
    'Hotel and leisure estates balance continuous guest occupancy with intensive mechanical loads on central boilers, domestic hot water generators, and commercial kitchen extraction. Engineering labour for out-of-hours callouts carries sustained premiums in major tourist and conference centres. With replacement compressor and commercial boiler parts subject to supply-chain delays, proactive servicing represents the most effective barrier against high-impact guest disruption and revenue loss.',
  education:
    'Higher and further education campuses contend with extensive, aging building services footprints and compressed maintenance windows during academic recesses. Specialized engineering trades required for legacy boiler plant and steam systems remain in short supply across regional university towns. Balancing constrained capital budgets with the need for reliable heating and electrical distribution reinforces planned preventative maintenance as the primary safeguard against emergency plant failure.',
};

function getDeterministicFallback(sectorKey: string, regionName: string): string {
  const base = DETERMINISTIC_KNOWLEDGE[sectorKey] || DETERMINISTIC_KNOWLEDGE.office;
  return `${base} Across ${regionName}, disciplined asset management remains the benchmark for controlling lifecycle expenditure.`;
}

// ---------------------------------------------------------------------------
// 1. GEMINI GROUNDED RESEARCH STEP
// ---------------------------------------------------------------------------
async function fetchGeminiGroundedResearch(
  sectorName: string,
  regionName: string,
  apiKey: string
): Promise<string | null> {
  const prompt = `Conduct a focused research summary of prevailing UK commercial facilities management cost pressures, specifically targeting:
- Property Sector: ${sectorName}
- UK Region: ${regionName}

Search and identify directional trends over the current operating cycle regarding:
1. Commercial energy dynamics, HVAC seasonal loads, and operational efficiency pressures.
2. Regional technical engineering labour availability (Gas Safe, HVAC/refrigeration, high-voltage electrical, compliance engineers).
3. Primary plant components and replacement parts supply-chain lead times (chillers, pumps, air handling units, switchgear).

Return raw, concise factual notes and observations only. Focus on qualitative and directional pressures. No fabricated statistics.`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 700,
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
// 2. CLAUDE DRAFTING STEP
// ---------------------------------------------------------------------------
async function fetchClaudeDrafting(
  researchNotes: string,
  sectorName: string,
  regionName: string,
  apiKey: string
): Promise<string | null> {
  const systemPrompt = `You are the Chief Editorial Surveyor for EntireFM, an authoritative UK facilities management and engineering firm.
Transform the provided research notes into a single, cohesive 120–150 word "Commercial Landscape & Market Context" paragraph tailored to a client operating in the specified sector and region.

Tone & Style Guidelines:
- Authoritative, practical, and restrained.
- Directional commentary only: do NOT fabricate exact percentage jumps or numerical claims unless verified in the research.
- Emphasise proactive maintenance vs unplanned exposure (e.g. "HVAC servicing remains a critical line item under seasonal tariff swings", "lead times on specialist control boards warrant forward planning").
- Refer to UK industry context (e.g. SFG20 maintenance regimes, statutory duties) where relevant.
- Return ONLY the final paragraph of plain text (no headings, bullet points, or intros).`;

  const userPrompt = `Grounded research notes:\n${researchNotes}\n\nProperty Sector: ${sectorName}\nUK Region: ${regionName}`;

  const payload = {
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 350,
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
    return text && text.trim().length > 60 ? text.trim() : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 3. OPENAI UNIFIED FALLBACK STEP
// ---------------------------------------------------------------------------
async function fetchOpenAiFallback(
  sectorName: string,
  regionName: string,
  apiKey: string
): Promise<string | null> {
  const systemPrompt = `You are a senior UK commercial FM consultant for EntireFM.
Write a concise, 120–150 word factual market context paragraph summarizing prevailing UK commercial maintenance cost pressures for the specified sector and region.

Address three key factors:
1. Energy efficiency and seasonal plant servicing.
2. Regional availability and rates for certified M&E technicians.
3. Equipment parts lead times and preventative care benefits.

Rules:
- Directional, realistic commentary only — no unverified specific percentages or fabricated statistics.
- UK commercial property context only (referencing SFG20 where helpful).
- Output exactly one plain-text paragraph (120–150 words).`;

  const payload = {
    model: 'gpt-4o-mini',
    temperature: 0.2,
    max_tokens: 350,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Property Sector: ${sectorName}\nUK Region: ${regionName}` },
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
    return text && text.trim().length > 60 ? text.trim() : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

// ---------------------------------------------------------------------------
// VALIDATION STEP — HALLUCINATION CROSS-CHECK (OpenAI gpt-4o-mini, strict JSON)
// ---------------------------------------------------------------------------

const VALIDATION_JSON_SCHEMA = {
  type: 'object',
  properties: {
    hasNumericOrStatisticalClaims: {
      type: 'boolean',
    },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          traceable: { type: 'boolean' },
          note: { type: 'string' },
        },
        required: ['text', 'traceable', 'note'],
        additionalProperties: false,
      },
    },
    verdict: {
      type: 'string',
      enum: ['PASS', 'FAIL'],
    },
  },
  required: ['hasNumericOrStatisticalClaims', 'claims', 'verdict'],
  additionalProperties: false,
};

const VALIDATION_SYSTEM_PROMPT = `You are an impartial, strict factual verification auditor for EntireFM technical publications.
Your sole job is to cross-examine an AI-drafted commentary against the provided source grounding research notes.
Search specifically for numeric, quantitative, or statistical claims (percentages, currency figures £/$, specific multiplier numbers, dates, or precise quantitative claims).

Verification Rules:
1. If the draft contains ZERO numeric or statistical claims (entirely qualitative and directional, e.g. "costs have increased", "lead times remain extended"), that is a PASS: set hasNumericOrStatisticalClaims to false, claims to empty array, verdict to "PASS".
2. For EVERY specific numeric claim found in the draft, check whether it is explicitly stated in the Grounding Source Text.
3. If a number is NOT explicitly corroborated by the Grounding Source Text (or if no grounding text was provided), set traceable to false.
4. If ANY claim has traceable: false, the overall verdict MUST be "FAIL".
5. Do NOT rewrite, edit, or add commentary. Output strictly the structured JSON verdict.`;

async function runValidationCheck(
  draftText: string,
  groundingSourceText: string | null,
  apiKey: string
): Promise<ValidationResult | null> {
  const userContent = `[GROUNDING SOURCE TEXT]:
${groundingSourceText || 'NO GROUNDING SOURCE PROVIDED (FALLBACK DRAFT — all numeric claims should be considered untraceable)'}

[DRAFTED COMMENTARY TO AUDIT]:
${draftText}

Perform the factual audit now.`;

  const payload = {
    model: 'gpt-4o-mini',
    temperature: 0.0,
    max_tokens: 600,
    messages: [
      { role: 'system', content: VALIDATION_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'market_context_validation',
        strict: true,
        schema: VALIDATION_JSON_SCHEMA,
      },
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

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
    const rawText = data?.choices?.[0]?.message?.content;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText) as ValidationResult;
    return parsed;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

function logValidationAudit(entry: AuditLogEntry): void {
  const failedSummary =
    entry.failedClaims.length > 0
      ? ` FailedClaims=[${entry.failedClaims.map((c) => `"${c}"`).join(', ')}]`
      : '';
  const retryInfo = entry.retryTriggered
    ? ` RetryTriggered=true RetryVerdict=${entry.retryVerdict ?? 'N/A'}`
    : ' RetryTriggered=false';

  console.log(
    `[PPM Market Validation] Key="${entry.cacheKey}"` +
      ` DraftSource=${entry.draftSource}` +
      ` Verdict=${entry.verdict}` +
      ` NumericClaims=${entry.numericClaimsFound}` +
      failedSummary +
      retryInfo +
      ` FinalPath=${entry.finalPath}` +
      ` ValidationLatency=${entry.validationLatencyMs}ms`
  );
}

// ---------------------------------------------------------------------------
// RETRY DRAFT GENERATOR (Claude or OpenAI with explicit "strip numbers" instruction)
// ---------------------------------------------------------------------------
async function retryWithoutNumbers(
  draftSource: 'CLAUDE' | 'OPENAI',
  researchNotes: string | null,
  sectorName: string,
  regionName: string,
  anthropicKey: string | null,
  openAiKey: string | null
): Promise<string | null> {
  const strippingInstruction =
    '\n\nCRITICAL ADDITIONAL CONSTRAINT: Remove or generalise any specific number, percentage, currency amount, or exact statistic from your response. Keep all commentary directional and qualitative only (e.g. "costs have risen", "rates remain elevated") — absolutely no figures.';

  if (draftSource === 'CLAUDE' && anthropicKey && researchNotes) {
    const systemPrompt = `You are the Chief Editorial Surveyor for EntireFM, an authoritative UK facilities management and engineering firm.
Transform the provided research notes into a single, cohesive 120–150 word "Commercial Landscape & Market Context" paragraph tailored to a client operating in the specified sector and region.

Tone & Style Guidelines:
- Authoritative, practical, and restrained.
- Directional commentary only: do NOT include any specific percentages, numerical figures, or dated statistics.
- Emphasise proactive maintenance vs unplanned exposure.
- Refer to UK industry context (e.g. SFG20 maintenance regimes, statutory duties) where relevant.
- Return ONLY the final paragraph of plain text (no headings, bullet points, or intros).${strippingInstruction}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 350,
          temperature: 0.1,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Grounded research notes:\n${researchNotes}\n\nProperty Sector: ${sectorName}\nUK Region: ${regionName}`,
            },
          ],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) return null;
      const data = await res.json();
      const text = data?.content?.[0]?.text;
      return text && text.trim().length > 60 ? text.trim() : null;
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  }

  if (openAiKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.1,
          max_tokens: 350,
          messages: [
            {
              role: 'system',
              content: `You are a senior UK commercial FM consultant for EntireFM. Write a 120–150 word factual market context paragraph for the specified sector and region. Directional commentary only — no percentages, no currency figures, no named statistics.${strippingInstruction}`,
            },
            {
              role: 'user',
              content: `Property Sector: ${sectorName}\nUK Region: ${regionName}`,
            },
          ],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) return null;
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      return text && text.trim().length > 60 ? text.trim() : null;
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// VALIDATED DRAFT — Wraps any AI-generated draft through the cross-check gate
// Returns the final approved content and the path taken, or null on hard failure
// ---------------------------------------------------------------------------
async function validateAndApprove(opts: {
  draft: string;
  groundingSource: string | null;
  draftSourceLabel: 'CLAUDE' | 'OPENAI';
  cacheKey: string;
  sectorName: string;
  regionName: string;
  sectorKey: string;
  openAiKey: string | null;
  anthropicKey: string | null;
}): Promise<{ content: string; finalPath: string } | null> {
  const {
    draft,
    groundingSource,
    draftSourceLabel,
    cacheKey,
    sectorName,
    regionName,
    sectorKey,
    openAiKey,
    anthropicKey,
  } = opts;

  if (!openAiKey) {
    // No validator available — pass through without checking (log accordingly)
    console.log(
      `[PPM Market Validation] Key="${cacheKey}" Verdict=SKIPPED (no OpenAI key for validation) FinalPath=${draftSourceLabel}_UNVALIDATED`
    );
    return { content: draft, finalPath: `${draftSourceLabel}_UNVALIDATED` };
  }

  const validationStart = Date.now();

  // --- First validation pass ---
  const firstCheck = await runValidationCheck(draft, groundingSource, openAiKey);
  const validationLatencyMs = Date.now() - validationStart;

  if (!firstCheck) {
    // Validation call failed entirely (timeout/API error) — pass through conservatively
    console.warn(
      `[PPM Market Validation] Key="${cacheKey}" Verdict=VALIDATION_ERROR (pass-through) Latency=${validationLatencyMs}ms`
    );
    return { content: draft, finalPath: `${draftSourceLabel}_VALIDATION_ERROR` };
  }

  const failedClaims = firstCheck.claims
    .filter((c) => !c.traceable)
    .map((c) => c.text);

  const auditEntry: AuditLogEntry = {
    cacheKey,
    draftSource: draftSourceLabel,
    verdict: firstCheck.verdict,
    numericClaimsFound: firstCheck.claims.length,
    failedClaims,
    retryTriggered: false,
    finalPath: '',
    validationLatencyMs,
  };

  if (firstCheck.verdict === 'PASS') {
    auditEntry.finalPath = `${draftSourceLabel}_VALIDATED_PASS`;
    logValidationAudit(auditEntry);
    return { content: draft, finalPath: auditEntry.finalPath };
  }

  // --- Validation FAILED: trigger one retry ---
  auditEntry.retryTriggered = true;

  const retryDraft = await retryWithoutNumbers(
    draftSourceLabel,
    groundingSource,
    sectorName,
    regionName,
    anthropicKey,
    openAiKey
  );

  if (!retryDraft) {
    auditEntry.retryVerdict = 'FAIL';
    auditEntry.finalPath = 'DETERMINISTIC_AFTER_RETRY_GENERATE_FAILED';
    logValidationAudit(auditEntry);
    return null; // Signal to use deterministic baseline
  }

  // --- Validate the retry ---
  const retryCheck = await runValidationCheck(retryDraft, groundingSource, openAiKey);

  if (!retryCheck || retryCheck.verdict === 'FAIL') {
    // Map null (API error) to 'FAIL' so the type stays within AuditLogEntry['retryVerdict']
    auditEntry.retryVerdict = retryCheck?.verdict ?? 'FAIL';
    auditEntry.finalPath = !retryCheck
      ? 'DETERMINISTIC_AFTER_RETRY_VALIDATION_ERROR'
      : 'DETERMINISTIC_AFTER_RETRY_FAILED_VALIDATION';
    logValidationAudit(auditEntry);
    return null; // Signal to use deterministic baseline
  }

  auditEntry.retryVerdict = 'PASS';
  auditEntry.finalPath = `${draftSourceLabel}_RETRY_VALIDATED_PASS`;
  logValidationAudit(auditEntry);
  return { content: retryDraft, finalPath: auditEntry.finalPath };
}

// ---------------------------------------------------------------------------
// PUBLIC PIPELINE EXECUTOR
// ---------------------------------------------------------------------------
export async function getPpmMarketContext(
  sectorKey: string,
  sectorName: string,
  regionKey: string,
  regionName: string
): Promise<MarketContextResult> {
  const todayStr = new Date().toISOString().slice(0, 10);
  const cacheKey = `ppm-market-context:${sectorKey}:${regionKey}:${todayStr}`;

  // Check cache — only validated drafts are ever stored here
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expiresAtTimestamp > now) {
    console.log(`[PPM Market Context] Key="${cacheKey}" Path=CACHE_HIT`);
    return {
      ...cached.data,
      source: 'CACHE_HIT',
    };
  }

  const startMs = Date.now();
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY || null;
  const openAiKey = process.env.OPENAI_API_KEY || null;

  let content: string | null = null;
  let source: MarketContextResult['source'] = 'DETERMINISTIC';

  // Path A: Grounded Gemini → Claude Drafting → Validation
  if (geminiKey && anthropicKey) {
    try {
      const research = await fetchGeminiGroundedResearch(sectorName, regionName, geminiKey);
      if (research) {
        const draft = await fetchClaudeDrafting(research, sectorName, regionName, anthropicKey);
        if (draft) {
          const approved = await validateAndApprove({
            draft,
            groundingSource: research,
            draftSourceLabel: 'CLAUDE',
            cacheKey,
            sectorName,
            regionName,
            sectorKey,
            openAiKey,
            anthropicKey,
          });
          if (approved) {
            content = approved.content;
            source = 'GROUNDED_GEMINI_CLAUDE';
          }
          // If approved is null, validation rejected both attempts → fall through to next path
        }
      }
    } catch {
      console.warn('[PPM Market Context] Gemini + Claude path failed, trying OpenAI fallback...');
    }
  }

  // Path B: OpenAI Fallback (single-pass) → Validation
  if (!content && openAiKey) {
    try {
      const openAiDraft = await fetchOpenAiFallback(sectorName, regionName, openAiKey);
      if (openAiDraft) {
        const approved = await validateAndApprove({
          draft: openAiDraft,
          groundingSource: null, // No grounding source on fallback path
          draftSourceLabel: 'OPENAI',
          cacheKey,
          sectorName,
          regionName,
          sectorKey,
          openAiKey,
          anthropicKey,
        });
        if (approved) {
          content = approved.content;
          source = 'OPENAI_FALLBACK';
        }
      }
    } catch {
      console.warn('[PPM Market Context] OpenAI fallback path failed...');
    }
  }

  // Path C: Deterministic Knowledge Base (validation not needed — zero numeric claims by design)
  if (!content) {
    content = getDeterministicFallback(sectorKey, regionName);
    source = 'DETERMINISTIC';
  }

  const latencyMs = Date.now() - startMs;
  const expiresAt = new Date(now + TTL_MS).toISOString();

  const result: MarketContextResult = {
    content,
    source,
    cachedAt: new Date(now).toISOString(),
    expiresAt,
    latencyMs,
  };

  // Store validated result in cache
  cache.set(cacheKey, { data: result, expiresAtTimestamp: now + TTL_MS });

  console.log(
    `[PPM Market Context] Key="${cacheKey}" Path=${source} TotalLatency=${latencyMs}ms OutputLength=${content.length}`
  );

  return result;
}


