/**
 * ENTIREFM OPENAI PROVIDER INTEGRATION
 * ====================================
 * Connects to OpenAI API using native fetch.
 * Reads OPENAI_API_KEY from server environment.
 */

import { ModelRequest, ModelResponse, ModelToolCall } from '../types';

export function getOpenAIApiKey(): string | null {
  return process.env.OPENAI_API_KEY || null;
}

export async function callOpenAI<T = Record<string, any>>(
  request: ModelRequest,
  defaultModel = 'gpt-4o-mini'
): Promise<ModelResponse<T>> {
  const apiKey = getOpenAIApiKey();
  const modelName = request.preferredModel || defaultModel;
  const startMs = Date.now();

  if (!apiKey) {
    return {
      provider: 'OPENAI',
      modelName,
      status: 'NOT_CONFIGURED',
      structuredOutput: (request.deterministicFallbackOutput || {}) as T,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs: 0 },
      errorMessage: 'OPENAI_API_KEY not configured in environment',
    };
  }

  try {
    const messages: Array<{ role: string; content: string }> = [];

    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }

    if (request.messages && request.messages.length > 0) {
      for (const m of request.messages) {
        messages.push({ role: m.role, content: m.content });
      }
    } else if (request.prompt) {
      messages.push({ role: 'user', content: request.prompt });
    }

    const payload: Record<string, any> = {
      model: modelName,
      messages,
      temperature: request.temperature ?? 0.1,
      max_tokens: request.maxTokens ?? 2000,
    };

    if (request.responseJsonSchema) {
      payload.response_format = {
        type: 'json_schema',
        json_schema: {
          name: 'structured_output',
          strict: true,
          schema: request.responseJsonSchema,
        },
      };
    } else {
      payload.response_format = { type: 'json_object' };
    }

    if (request.tools && request.tools.length > 0) {
      payload.tools = request.tools.map((t) => ({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      }));
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const latencyMs = Date.now() - startMs;

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return {
        provider: 'OPENAI',
        modelName,
        status: 'FAILED',
        structuredOutput: (request.deterministicFallbackOutput || {}) as T,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs },
        errorMessage: `OpenAI API returned HTTP ${res.status}: ${errText}`,
      };
    }

    const data = (await res.json()) as any;
    const choice = data?.choices?.[0];
    const rawText = choice?.message?.content || '{}';

    const promptTokens = data?.usage?.prompt_tokens ?? 0;
    const completionTokens = data?.usage?.completion_tokens ?? 0;
    const totalTokens = data?.usage?.total_tokens ?? promptTokens + completionTokens;

    // Pricing estimates for gpt-4o-mini (approx $0.15/1M in, $0.60/1M out -> GBP)
    const costUsd = (promptTokens * 0.15 + completionTokens * 0.6) / 1_000_000;
    const costGbp = Math.round(costUsd * 0.79 * 1_000_000) / 1_000_000;

    let parsed: any = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = request.deterministicFallbackOutput || {};
    }

    const toolCalls: ModelToolCall[] = [];
    if (choice?.message?.tool_calls) {
      for (const tc of choice.message.tool_calls) {
        let args = {};
        try {
          args = JSON.parse(tc.function.arguments || '{}');
        } catch {}
        toolCalls.push({
          id: tc.id,
          name: tc.function.name,
          arguments: args,
        });
      }
    }

    return {
      provider: 'OPENAI',
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
      provider: 'OPENAI',
      modelName,
      status: 'FAILED',
      structuredOutput: (request.deterministicFallbackOutput || {}) as T,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, costGbp: 0, latencyMs },
      errorMessage: `OpenAI fetch exception: ${err.message}`,
    };
  }
}
