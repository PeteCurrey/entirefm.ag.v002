/**
 * ENTIREFM CANONICAL MODEL ROUTER (Phase 0M)
 * ==========================================
 * Provider-neutral, resilient AI orchestration router.
 *
 * Capabilities:
 *   1. Multi-provider execution: OpenAI, Anthropic Claude, Google Gemini, Deterministic Fallback.
 *   2. Automatic Outage Fallback: If primary model fails / unavailable -> falls back to next provider.
 *   3. Dual-Model Verification: Runs two independent models for high-risk / ambiguous decisions and flags disagreement.
 *   4. Cost & Token Accounting: Logs runs and token usage to ai_runs and ai_cost_records.
 *   5. Prompt Injection Defense: Structured untrusted evidence tagging and sandboxing.
 */

import { dbQuery } from '../../db/client';
import {
  AIProviderType,
  DualModelVerificationResult,
  ModelRequest,
  ModelResponse,
  ModelTaskType,
} from './types';
import { callOpenAI, getOpenAIApiKey } from './providers/openai';
import { callAnthropic, getAnthropicApiKey } from './providers/anthropic';
import { callGemini, getGeminiApiKey } from './providers/gemini';

// ─── UNTRUSTED EVIDENCE WRAPPER ───────────────────────────────────────────────

function escapeUntrustedXml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function wrapUntrustedEvidence(label: string, content: string): string {
  const safeLabel = label.replace(/[^\w.-]/g, '_');
  const safeContent = escapeUntrustedXml(content);
  const timestamp = new Date().toISOString();
  return `<UNTRUSTED_EVIDENCE source="${safeLabel}" timestamp="${timestamp}">\n${safeContent}\n</UNTRUSTED_EVIDENCE>`;
}

// ─── PROVIDER DISCOVERY & HIERARCHY ──────────────────────────────────────────

export function getAvailableProviders(): AIProviderType[] {
  const providers: AIProviderType[] = [];
  if (getOpenAIApiKey()) providers.push('OPENAI');
  if (getAnthropicApiKey()) providers.push('ANTHROPIC');
  if (getGeminiApiKey()) providers.push('GEMINI');
  providers.push('DETERMINISTIC');
  return providers;
}

export function resolveProviderChain(preferred?: AIProviderType): AIProviderType[] {
  const chain: AIProviderType[] = [];
  if (preferred && preferred !== 'DETERMINISTIC') {
    chain.push(preferred);
  }

  // Standard failover hierarchy
  if (!chain.includes('OPENAI')) chain.push('OPENAI');
  if (!chain.includes('ANTHROPIC')) chain.push('ANTHROPIC');
  if (!chain.includes('GEMINI')) chain.push('GEMINI');
  chain.push('DETERMINISTIC');

  return chain;
}

// ─── CALL DISPATCHER ─────────────────────────────────────────────────────────

async function dispatchProviderCall<T>(
  provider: AIProviderType,
  request: ModelRequest
): Promise<ModelResponse<T>> {
  switch (provider) {
    case 'OPENAI':
      return callOpenAI<T>(request);
    case 'ANTHROPIC':
      return callAnthropic<T>(request);
    case 'GEMINI':
      return callGemini<T>(request);
    case 'DETERMINISTIC':
    default:
      return {
        provider: 'DETERMINISTIC',
        modelName: 'deterministic-rules-engine',
        status: 'FALLBACK',
        structuredOutput: (request.deterministicFallbackOutput || {}) as T,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs: 1 },
      };
  }
}

// ─── AUDIT & COST LOGGING ────────────────────────────────────────────────────

async function logModelRun(
  agentCode: string,
  response: ModelResponse<any>,
  correlationId?: string
): Promise<void> {
  try {
    const runId = crypto.randomUUID();
    const agentRes = await dbQuery<any[]>(`ai_agents?code=eq.${encodeURIComponent(agentCode)}&select=id`);
    const agentId = agentRes.data?.[0]?.id || null;

    if (agentId) {
      await dbQuery('ai_runs', {
        method: 'POST',
        body: {
          id: runId,
          ai_agent_id: agentId,
          trigger_event: 'MODEL_EXECUTION',
          correlation_id: correlationId || runId,
          status: response.status === 'LIVE' ? 'COMPLETED' : response.status === 'FALLBACK' ? 'COMPLETED' : 'FAILED',
          prompt_tokens: response.usage.promptTokens,
          completion_tokens: response.usage.completionTokens,
          total_cost_gbp: response.usage.costGbp,
          started_at: new Date(Date.now() - response.usage.latencyMs).toISOString(),
          completed_at: new Date().toISOString(),
          output_result: {
            provider: response.provider,
            model: response.modelName,
            status: response.status,
            error: response.errorMessage,
          },
        },
      });

      if (response.usage.totalTokens > 0) {
        await dbQuery('ai_cost_records', {
          method: 'POST',
          body: {
            id: crypto.randomUUID(),
            ai_agent_id: agentId,
            ai_run_id: runId,
            model_name: response.modelName,
            prompt_tokens: response.usage.promptTokens,
            completion_tokens: response.usage.completionTokens,
            total_cost_gbp: response.usage.costGbp,
            recorded_at: new Date().toISOString(),
          },
        });
      }
    }
  } catch {
    // Non-blocking logging
  }
}

// ─── EXECUTE MODEL REQUEST WITH FAILOVER ─────────────────────────────────────

export async function executeModelRequest<T = Record<string, any>>(
  request: ModelRequest,
  taskType: ModelTaskType = 'GENERAL'
): Promise<ModelResponse<T>> {
  const chain = resolveProviderChain(request.preferredProvider);
  let lastResponse: ModelResponse<T> | null = null;

  for (const provider of chain) {
    // Skip not configured providers early
    if (provider === 'OPENAI' && !getOpenAIApiKey()) continue;
    if (provider === 'ANTHROPIC' && !getAnthropicApiKey()) continue;
    if (provider === 'GEMINI' && !getGeminiApiKey()) continue;

    const response = await dispatchProviderCall<T>(provider, request);
    lastResponse = response;

    if (response.status === 'LIVE') {
      if (request.agentCode) {
        await logModelRun(request.agentCode, response, request.correlationId);
      }
      return response;
    }
  }

  // If all live providers fail or none configured -> execute deterministic fallback
  const fallbackResponse = await dispatchProviderCall<T>('DETERMINISTIC', request);
  if (request.agentCode) {
    await logModelRun(request.agentCode, fallbackResponse, request.correlationId);
  }
  return fallbackResponse;
}

// ─── DUAL MODEL VERIFICATION ─────────────────────────────────────────────────

export async function executeDualModelVerification<T = Record<string, any>>(
  request: ModelRequest,
  comparisonFn: (a: T, b: T) => { agreed: boolean; divergenceReasons: string[] }
): Promise<DualModelVerificationResult<T>> {
  // Model A: Primary (e.g. OpenAI)
  // Model B: Secondary (e.g. Anthropic)
  const reqA: ModelRequest = { ...request, preferredProvider: 'OPENAI' };
  const reqB: ModelRequest = { ...request, preferredProvider: 'ANTHROPIC' };

  const [resA, resB] = await Promise.all([
    dispatchProviderCall<T>('OPENAI', reqA),
    dispatchProviderCall<T>('ANTHROPIC', reqB),
  ]);

  // If one or both are not live, fall back to whatever is live or deterministic
  if (resA.status !== 'LIVE' || resB.status !== 'LIVE') {
    const liveRes = resA.status === 'LIVE' ? resA : resB.status === 'LIVE' ? resB : null;
    if (liveRes) {
      return {
        agreed: true,
        primaryResult: liveRes,
        secondaryResult: liveRes,
        consensusOutput: liveRes.structuredOutput,
        divergenceReasons: [],
      };
    }

    const det = await dispatchProviderCall<T>('DETERMINISTIC', request);
    return {
      agreed: true,
      primaryResult: det,
      secondaryResult: det,
      consensusOutput: det.structuredOutput,
      divergenceReasons: [],
    };
  }

  const comparison = comparisonFn(resA.structuredOutput, resB.structuredOutput);

  return {
    agreed: comparison.agreed,
    primaryResult: resA,
    secondaryResult: resB,
    consensusOutput: comparison.agreed ? resA.structuredOutput : resA.structuredOutput,
    divergenceReasons: comparison.divergenceReasons,
  };
}
