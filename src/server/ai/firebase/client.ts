/**
 * ENTIREFM FIREBASE AI LOGIC — SERVER-SIDE CLIENT (Phase 01)
 * ===========================================================
 * Initialises the Firebase AI Logic SDK using the GoogleAIBackend.
 *
 * Architecture & Security Model:
 *   - Uses firebase/ai with GoogleAIBackend (Gemini Developer API via Firebase AI Logic)
 *   - Server-Mediated Invocation: Browsers never call Firebase AI Logic directly.
 *     All requests route through Next.js Route Handlers (/api/clients/jobs/analyze).
 *   - Why App Check is NOT required: App Check is designed to protect Firebase
 *     resources from unauthorized direct client SDK access. In EntireFM, all AI
 *     credentials (GEMINI_API_KEY / GOOGLE_AI_API_KEY) are held strictly in server
 *     environment variables. The browser authenticates via HMAC session cookies,
 *     RBAC, organisation isolation, and site-level scoping.
 *   - Model Pinned for Production: Defaults to explicit, immutable 'gemini-2.0-flash'.
 *     Can be overridden at runtime via MULTIMODAL_AI_MODEL env var.
 *   - Returns null if the service is not configured (enables graceful fallback).
 *
 * This module is the ONLY place that imports from 'firebase/ai'.
 * All multimodal inference must go through getFirebaseAIModel().
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import type { GenerativeModel, Part } from 'firebase/ai';

export type { GenerativeModel, Part };

// ─── PINNED PRODUCTION MODEL ──────────────────────────────────────────────────
// Pinned to explicit GA stable model 'gemini-2.0-flash' to ensure deterministic
// behavior. Override via MULTIMODAL_AI_MODEL env var when migrating versions.
const DEFAULT_MODEL = 'gemini-2.0-flash';

let firebaseApp: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || null;

  if (!apiKey) {
    return null;
  }

  // Reuse existing Firebase app if already initialised
  if (firebaseApp) return firebaseApp;
  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0];
    return firebaseApp;
  }

  // Firebase config — for AI Logic with GoogleAIBackend, apiKey, appId and projectId are configured.
  firebaseApp = initializeApp({
    apiKey,
    appId: process.env.FIREBASE_APP_ID || '1:100000000000:web:entirefm001',
    projectId: process.env.FIREBASE_PROJECT_ID || 'entirefm-ai',
  }, 'entirefm-multimodal');

  return firebaseApp;
}

/**
 * Returns a configured Firebase AI Logic GenerativeModel instance,
 * or null if the service is not configured (triggers deterministic fallback).
 */
export function getFirebaseAIModel(systemInstruction?: string): GenerativeModel | null {
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    const ai = getAI(app, { backend: new GoogleAIBackend() });
    const modelName = process.env.MULTIMODAL_AI_MODEL || DEFAULT_MODEL;

    return getGenerativeModel(ai, {
      model: modelName,
      systemInstruction: systemInstruction || undefined,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2500,
        responseMimeType: 'application/json',
      },
    });
  } catch (err) {
    console.warn('[FIREBASE_AI] Failed to initialise Firebase AI Logic model:', err);
    return null;
  }
}

/**
 * Returns the model name that will be used for inference.
 * Reads from MULTIMODAL_AI_MODEL env var, falls back to DEFAULT_MODEL.
 */
export function getMultimodalModelName(): string {
  return process.env.MULTIMODAL_AI_MODEL || DEFAULT_MODEL;
}
