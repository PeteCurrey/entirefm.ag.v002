/**
 * EntireFM CEO Command — Live Query Runner
 * =========================================
 * Fires a real Gemini API call using GEMINI_API_KEY from .env.local.
 * Does NOT require dotenv — parses .env.local manually using Node fs.
 *
 * Usage:  npx tsx scripts/run-live-query.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Manual .env.local parser ──────────────────────────────────────────────────
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠  .env.local not found');
    return;
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
  console.log('✓  Loaded .env.local');
}

loadEnvLocal();

// ── Configuration ─────────────────────────────────────────────────────────────
const apiKey       = process.env.GEMINI_API_KEY;
const keyPresent   = !!apiKey && apiKey.length > 8;
const MODEL_NAME   = 'gemini-2.5-flash';
const MAX_TOKENS   = 2048;
const MAX_TOOLS    = 8;
const BUDGET_GBP   = 2.00;

console.log(`\n  GEMINI_API_KEY present: ${keyPresent ? 'YES (' + apiKey!.slice(0, 4) + '...' + apiKey!.slice(-4) + ')' : 'NO — will run FALLBACK'}`);

// ── Evidence bundle (zero-data state) ─────────────────────────────────────────
const computedAt = new Date().toISOString();
const evidence = [
  { label: 'Client Accounts',  value: 0, data_status: 'ZERO',    source_service: 'client_accounts' },
  { label: 'Managed Sites',    value: 0, data_status: 'ZERO',    source_service: 'sites' },
  { label: 'Open Work Orders', value: 0, data_status: 'ZERO',    source_service: 'work_orders' },
  { label: 'Managed Assets',   value: 0, data_status: 'ZERO',    source_service: 'assets' },
  { label: 'Compliance',       value: 0, data_status: 'NO_DATA', source_service: 'compliance' },
  { label: 'Finance KPIs',     value: 0, data_status: 'NO_DATA', source_service: 'finance' },
];

const question = 'What should I know about EntireFM today?';

const SYSTEM_PROMPT = `You are CEO Command, the executive intelligence layer of EntireCAFM.

ABSOLUTE RULES:
1. Answer ONLY from the canonical evidence provided.
2. Do NOT fabricate metrics, records, or performance claims.
3. If evidence shows zero records or NO_DATA, state the platform has no operational data.
4. Do NOT say "everything is healthy", "platform is performing well", or similar.
5. READ-ONLY / ASSIST mode only.

OUTPUT: Valid JSON only.`;

const userPrompt = `Executive Question: "${question}"

Evidence from canonical platform services:
${evidence.map(e => `- ${e.label}: ${e.value} [${e.data_status}] (source: ${e.source_service})`).join('\n')}

Tool execution: No tools executed (zero data state).

Return ONLY valid JSON:
{
  "direct_answer": "clear executive answer in 1-3 sentences",
  "key_drivers": ["driver 1"],
  "facts": ["FACT: statement from evidence"],
  "calculations": [],
  "recommendations": ["REC: actionable recommendation"]
}`;

// ── Main ───────────────────────────────────────────────────────────────────────
async function runLiveQuery() {
  const runId  = `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const startMs = Date.now();

  console.log('\n' + '='.repeat(68));
  console.log('  EntireFM CEO Command — LIVE Execution Evidence');
  console.log('='.repeat(68));
  console.log(`  Run ID          : ${runId}`);
  console.log(`  Agent           : CEO_COMMAND_AGENT`);
  console.log(`  Model           : ${MODEL_NAME}`);
  console.log(`  Question        : "${question}"`);
  console.log(`  Budget Cap/day  : £${BUDGET_GBP.toFixed(2)}`);
  console.log(`  Max Tool Calls  : ${MAX_TOOLS}`);
  console.log(`  Max Out Tokens  : ${MAX_TOKENS}`);
  console.log(`  Computed At     : ${computedAt}`);
  console.log('-'.repeat(68));

  if (!keyPresent) {
    console.log('\n  Model Status    : FALLBACK');
    console.log('  Reason          : GEMINI_API_KEY not configured');
    console.log('\n  Fallback Answer:');
    console.log('  EntireCAFM has no operational data loaded yet. Please import');
    console.log('  your data using the Migration Centre.\n');
    console.log('='.repeat(68));
    console.log('  RESULT: FALLBACK\n');
    process.exit(0);
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: 0.2, responseMimeType: 'application/json' },
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        }),
      }
    );

    const latencyMs = Date.now() - startMs;

    if (!res.ok) {
      const errBody = await res.text();
      console.log(`\n  Model Status    : FAILED`);
      console.log(`  HTTP Status     : ${res.status}`);
      console.log(`  Error           : ${errBody.slice(0, 300)}\n`);
      process.exit(1);
    }

    const data = await res.json() as any;
    const inputTokens  = data?.usageMetadata?.promptTokenCount    ?? 0;
    const outputTokens = data?.usageMetadata?.candidatesTokenCount ?? 0;
    const totalTokens  = data?.usageMetadata?.totalTokenCount      ?? (inputTokens + outputTokens);
    const costUsd = (inputTokens * 0.075 + outputTokens * 0.30) / 1_000_000;
    const costGbp = Math.round(costUsd * 0.79 * 1_000_000) / 1_000_000;

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    let parsed: any = {};
    try { parsed = JSON.parse(rawText); } catch { parsed = {}; }

    console.log(`\n  Model Status    : LIVE`);
    console.log(`  HTTP Status     : ${res.status} OK`);
    console.log(`  Latency         : ${latencyMs} ms`);
    console.log(`  Input Tokens    : ${inputTokens}`);
    console.log(`  Output Tokens   : ${outputTokens}`);
    console.log(`  Total Tokens    : ${totalTokens}`);
    console.log(`  Cost (approx)   : £${costGbp.toFixed(6)} GBP`);
    console.log('-'.repeat(68));

    console.log('\n  Direct Answer:');
    console.log('  ' + (parsed.direct_answer || '(no answer)'));

    if (Array.isArray(parsed.key_drivers) && parsed.key_drivers.length > 0) {
      console.log('\n  Key Drivers:');
      parsed.key_drivers.forEach((d: string) => console.log(`    - ${d}`));
    }
    if (Array.isArray(parsed.facts) && parsed.facts.length > 0) {
      console.log('\n  Facts:');
      parsed.facts.forEach((f: string) => console.log(`    ${f}`));
    }
    if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
      console.log('\n  Recommendations:');
      parsed.recommendations.forEach((r: string) => console.log(`    ${r}`));
    }

    // ── Truth semantics verification ─────────────────────────────────────────
    console.log('\n' + '-'.repeat(68));
    console.log('  Truth Semantics Verification:');
    const ans = (parsed.direct_answer || '').toLowerCase();
    const fabricated = ['everything is healthy', 'performing well', 'all systems operational', 'high performance'].some(p => ans.includes(p));
    const honestNoData = ans.includes('no operational data') || ans.includes('no data') || ans.includes('import') || ans.includes('migration');
    console.log(`    No fabricated metrics     : ${fabricated   ? 'FAIL' : 'PASS'}`);
    console.log(`    Zero-data stated honestly : ${honestNoData ? 'PASS' : 'WARN'}`);

    console.log('\n' + '='.repeat(68));
    if (fabricated) {
      console.error('  RESULT: FAILED — fabricated metric detected\n');
      process.exit(1);
    }
    console.log('  RESULT: LIVE — CEO Command executed successfully\n');

  } catch (err) {
    console.log(`\n  Model Status    : FAILED`);
    console.log(`  Error           : ${(err as Error).message}\n`);
    process.exit(1);
  }
}

runLiveQuery();
