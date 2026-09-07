/**
 * ENTIREFM MULTIMODAL AI — SERVER-SIDE CLIENT
 * ============================================
 * Calls the Google Generative Language API directly using the GEMINI_API_KEY.
 *
 * WHY NOT firebase/ai SDK:
 *   The firebase/ai GoogleAIBackend routes requests to firebasevertexai.googleapis.com
 *   which only accepts OAuth2 credentials, not API keys. This caused a 401 Unauthorized
 *   error: "API keys are not supported by this API". The correct endpoint for API-key
 *   based access is generativelanguage.googleapis.com (Gemini Developer API).
 *
 * Architecture & Security Model:
 *   - Calls generativelanguage.googleapis.com directly (Gemini Developer API).
 *   - Server-Mediated Invocation: Browsers never call this directly.
 *     All requests route through Next.js Route Handlers.
 *   - Credentials: GEMINI_API_KEY held strictly in server environment variables.
 *   - Model Pinned for Production: Defaults to 'gemini-2.0-flash'.
 *     Can be overridden at runtime via MULTIMODAL_AI_MODEL env var.
 *   - Returns null if the service is not configured (enables graceful fallback).
 *
 * Exports the same interface (GenerativeModel, Part, getFirebaseAIModel,
 * getMultimodalModelName) so callers (extractor.ts, service.ts) need no changes.
 */

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface InlineDataPart {
  inlineData: { mimeType: string; data: string };
}

export interface TextPart {
  text: string;
}

export type Part = TextPart | InlineDataPart;

export interface GenerateContentRequest {
  contents: Array<{
    role: 'user' | 'model';
    parts: Part[];
  }>;
}

export interface GenerateContentResponse {
  text(): string;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

export interface GenerateContentResult {
  response: GenerateContentResponse;
}

/**
 * Minimal GenerativeModel interface matching what extractor.ts and service.ts
 * consume (generateContent only).
 */
export interface GenerativeModel {
  generateContent(request: GenerateContentRequest): Promise<GenerateContentResult>;
}

// ─── PINNED PRODUCTION MODEL ──────────────────────────────────────────────────
// Pinned to 'gemini-2.5-flash'. Override via MULTIMODAL_AI_MODEL env var.
const DEFAULT_MODEL = 'gemini-2.5-flash';

const GOOGLE_AI_BASE = 'https://generativelanguage.googleapis.com';
const GOOGLE_AI_API_VERSION = 'v1beta';

// ─── DIRECT GOOGLE AI CLIENT ──────────────────────────────────────────────────

/**
 * Returns a GenerativeModel-compatible object that calls the
 * generativelanguage.googleapis.com API directly with an API key.
 * Returns null if no API key is configured (triggers deterministic fallback).
 */
export function getFirebaseAIModel(systemInstruction?: string): GenerativeModel | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || null;

  if (!apiKey) {
    return null;
  }

  const modelName = process.env.MULTIMODAL_AI_MODEL || DEFAULT_MODEL;

  return {
    async generateContent(request: GenerateContentRequest): Promise<GenerateContentResult> {
      const url = `${GOOGLE_AI_BASE}/${GOOGLE_AI_API_VERSION}/models/${modelName}:generateContent?key=${apiKey}`;

      const payload: Record<string, any> = {
        contents: request.contents,
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2500,
          responseMimeType: 'application/json',
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
      const usageMetadata = data?.usageMetadata;

      return {
        response: {
          text(): string {
            return rawText;
          },
          usageMetadata: usageMetadata
            ? {
                promptTokenCount: usageMetadata.promptTokenCount,
                candidatesTokenCount: usageMetadata.candidatesTokenCount,
                totalTokenCount: usageMetadata.totalTokenCount,
              }
            : undefined,
        },
      };
    },
  };
}

/**
 * Returns the model name that will be used for inference.
 * Reads from MULTIMODAL_AI_MODEL env var, falls back to DEFAULT_MODEL.
 */
export function getMultimodalModelName(): string {
  return process.env.MULTIMODAL_AI_MODEL || DEFAULT_MODEL;
}

