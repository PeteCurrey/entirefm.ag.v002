/**
 * ENTIREFM ANTHROPIC CLAUDE PROVIDER INTEGRATION
 * ===============================================
 * Connects to Anthropic Messages API using native fetch.
 * Reads ANTHROPIC_API_KEY from server environment.
 */

import { ModelRequest, ModelResponse, ModelToolCall } from '../types';

export function getAnthropicApiKey(): string | null {
  return process.env.ANTHROPIC_API_KEY || null;
}

export async function callAnthropic<T = Record<string, any>>(
  request: ModelRequest,
  defaultModel = 'claude-3-5-haiku-20241022'
): Promise<ModelResponse<T>> {
  const apiKey = getAnthropicApiKey();
  const modelName = request.preferredModel || defaultModel;
  const startMs = Date.now();

  if (!apiKey) {
    return {
      provider: 'ANTHROPIC',
      modelName,
      status: 'NOT_CONFIGURED',
      structuredOutput: (request.deterministicFallbackOutput || {}) as T,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs: 0 },
      errorMessage: 'ANTHROPIC_API_KEY not configured in environment',
    };
  }

  try {
    const messages: Array<{ role: string; content: string }> = [];

    if (request.messages && request.messages.length > 0) {
      for (const m of request.messages) {
        if (m.role === 'user' || m.role === 'assistant') {
          messages.push({ role: m.role, content: m.content });
        }
      }
    } else if (request.prompt) {
      messages.push({ role: 'user', content: request.prompt });
    }

    const payload: Record<string, any> = {
      model: modelName,
      max_tokens: request.maxTokens ?? 2000,
      temperature: request.temperature ?? 0.1,
      messages,
    };

    if (request.systemPrompt) {
      payload.system = request.systemPrompt;
    }

    if (request.tools && request.tools.length > 0) {
      payload.tools = request.tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.parameters,
      }));
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    const latencyMs = Date.now() - startMs;

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return {
        provider: 'ANTHROPIC',
        modelName,
        status: 'FAILED',
        structuredOutput: (request.deterministicFallbackOutput || {}) as T,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs },
        errorMessage: `Anthropic API returned HTTP ${res.status}: ${errText}`,
      };
    }

    const data = (await res.json()) as any;
    let rawText = '';
    const toolCalls: ModelToolCall[] = [];

    if (Array.isArray(data?.content)) {
      for (const block of data.content) {
        if (block.type === 'text') {
          rawText += block.text;
        } else if (block.type === 'tool_use') {
          toolCalls.push({
            id: block.id,
            name: block.name,
            arguments: block.input || {},
          });
        }
      }
    }

    const promptTokens = data?.usage?.input_tokens ?? 0;
    const completionTokens = data?.usage?.output_tokens ?? 0;
    const totalTokens = promptTokens + completionTokens;

    // Pricing estimates for claude-3-5-haiku ($1.00/1M in, $5.00/1M out -> GBP)
    const costUsd = (promptTokens * 1.0 + completionTokens * 5.0) / 1_000_000;
    const costGbp = Math.round(costUsd * 0.79 * 1_000_000) / 1_000_000;

    let parsed: any = {};
    try {
      // Find json in rawText
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(rawText);
      }
    } catch {
      parsed = request.deterministicFallbackOutput || {};
    }

    return {
      provider: 'ANTHROPIC',
      modelName,
      status: 'LIVE',
      rawText,
      structuredOutput: parsed as T,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
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
      provider: 'ANTHROPIC',
      modelName,
      status: 'FAILED',
      structuredOutput: (request.deterministicFallbackOutput || {}) as T,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs },
      errorMessage: `Anthropic fetch exception: ${err.message}`,
    };
  }
}
