/**
 * ENTIREFM GOOGLE GEMINI PROVIDER INTEGRATION
 * ===========================================
 * Connects to Google Generative Language API using native fetch.
 * Reads GEMINI_API_KEY from server environment.
 */

import { ModelRequest, ModelResponse } from '../types';

export function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

export async function callGemini<T = Record<string, any>>(
  request: ModelRequest,
  defaultModel = 'gemini-2.5-flash'
): Promise<ModelResponse<T>> {
  const apiKey = getGeminiApiKey();
  const modelName = request.preferredModel || defaultModel;
  const startMs = Date.now();

  if (!apiKey) {
    return {
      provider: 'GEMINI',
      modelName,
      status: 'NOT_CONFIGURED',
      structuredOutput: (request.deterministicFallbackOutput || {}) as T,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs: 0 },
      errorMessage: 'GEMINI_API_KEY not configured in environment',
    };
  }

  try {
    let promptText = '';
    if (request.messages && request.messages.length > 0) {
      promptText = request.messages.map((m) => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');
    } else if (request.prompt) {
      promptText = request.prompt;
    }

    const payload: Record<string, any> = {
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig: {
        maxOutputTokens: request.maxTokens ?? 2000,
        temperature: request.temperature ?? 0.1,
        responseMimeType: 'application/json',
      },
    };

    if (request.systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: request.systemPrompt }],
      };
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const latencyMs = Date.now() - startMs;

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return {
        provider: 'GEMINI',
        modelName,
        status: 'FAILED',
        structuredOutput: (request.deterministicFallbackOutput || {}) as T,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs },
        errorMessage: `Gemini API returned HTTP ${res.status}: ${errText}`,
      };
    }

    const data = (await res.json()) as any;
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    const promptTokens = data?.usageMetadata?.promptTokenCount ?? 0;
    const completionTokens = data?.usageMetadata?.candidatesTokenCount ?? 0;
    const totalTokens = data?.usageMetadata?.totalTokenCount ?? promptTokens + completionTokens;

    const costUsd = (promptTokens * 0.075 + completionTokens * 0.3) / 1_000_000;
    const costGbp = Math.round(costUsd * 0.79 * 1_000_000) / 1_000_000;

    let parsed: any = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = request.deterministicFallbackOutput || {};
    }

    return {
      provider: 'GEMINI',
      modelName,
      status: 'LIVE',
      rawText,
      structuredOutput: parsed as T,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        costGbp,
        latencyMs,
      },
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startMs;
    return {
      provider: 'GEMINI',
      modelName,
      status: 'FAILED',
      structuredOutput: (request.deterministicFallbackOutput || {}) as T,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs },
      errorMessage: `Gemini fetch exception: ${err.message}`,
    };
  }
}
