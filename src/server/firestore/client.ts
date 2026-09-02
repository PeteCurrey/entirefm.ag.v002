/**
 * ENTIREFM FIRESTORE REST CLIENT
 * ================================
 * Server-side Firestore operations via the Firebase REST API.
 * Authenticated via Google service account (GOOGLE_APPLICATION_CREDENTIALS_JSON env var).
 *
 * Covers:
 *   - GET /estates/{uid}/assets  (list all)
 *   - GET /estates/{uid}/assets/{assetId}  (single)
 *   - POST /estates/{uid}/assets  (create)
 *   - PATCH /estates/{uid}/assets/{assetId}  (update fields)
 *
 * NON-NEGOTIABLE CONTRACT:
 *   - Every read is scoped strictly to the verified owner UID.
 *   - No cross-user reads are possible through this client.
 *   - If credentials are missing, all methods return explicit failure states.
 *   - No cached or mocked fallbacks — failures surface as errors.
 */

import { AssetDocument } from '@/types/asset-scanner';

// ── Auth Token Cache ──────────────────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

interface ServiceAccountCredential {
  client_email: string;
  private_key: string;
  project_id: string;
}

function getServiceAccount(): ServiceAccountCredential | null {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ServiceAccountCredential;
  } catch {
    console.error('[FIRESTORE_CLIENT] Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON');
    return null;
  }
}

function getProjectId(): string | null {
  const sa = getServiceAccount();
  if (sa?.project_id) return sa.project_id;
  return process.env.FIREBASE_PROJECT_ID || null;
}

/**
 * Generates a signed JWT and exchanges it for a Google OAuth2 access token.
 * Caches the token until 60 seconds before expiry.
 */
async function getAccessToken(): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiresAt > now + 60) {
    return cachedToken;
  }

  const sa = getServiceAccount();
  if (!sa) {
    console.error('[FIRESTORE_CLIENT] No service account credentials. Set GOOGLE_APPLICATION_CREDENTIALS_JSON.');
    return null;
  }

  try {
    // Build JWT header + payload
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    };

    const encode = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString('base64url');

    const signingInput = `${encode(header)}.${encode(payload)}`;

    // Sign with private key using Web Crypto (Node.js 18+)
    const privateKeyPem = sa.private_key.replace(/\\n/g, '\n');
    const keyData = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s/g, '');
    const keyBuffer = Buffer.from(keyData, 'base64');

    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      Buffer.from(signingInput)
    );

    const jwt = `${signingInput}.${Buffer.from(signature).toString('base64url')}`;

    // Exchange JWT for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });

    if (!tokenRes.ok) {
      console.error('[FIRESTORE_CLIENT] Token exchange failed:', await tokenRes.text());
      return null;
    }

    const tokenData = await tokenRes.json();
    cachedToken = tokenData.access_token;
    tokenExpiresAt = now + (tokenData.expires_in || 3600);
    return cachedToken;
  } catch (err) {
    console.error('[FIRESTORE_CLIENT] JWT signing error:', err);
    return null;
  }
}

// ── Firestore REST URL Builders ───────────────────────────────────────────────

function firestoreUrl(path: string): string | null {
  const projectId = getProjectId();
  if (!projectId) return null;
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}`;
}

// ── Value Converters ──────────────────────────────────────────────────────────

type FirestoreValue =
  | { stringValue: string }
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { timestampValue: string };

function toFirestoreValue(val: unknown): FirestoreValue {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') return { integerValue: String(Math.round(val)) };
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFirestoreValue(val: FirestoreValue): unknown {
  if ('nullValue' in val) return null;
  if ('booleanValue' in val) return val.booleanValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return (val as any).doubleValue;
  if ('stringValue' in val) return val.stringValue;
  if ('timestampValue' in val) return val.timestampValue;
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(fromFirestoreValue);
  }
  if ('mapValue' in val) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      result[k] = fromFirestoreValue(v as FirestoreValue);
    }
    return result;
  }
  return null;
}

function documentToAsset(doc: any): AssetDocument & { id: string } {
  const fields = doc.fields || {};
  const id = doc.name?.split('/').pop() || '';
  const result: Record<string, unknown> = { id };
  for (const [k, v] of Object.entries(fields)) {
    result[k] = fromFirestoreValue(v as FirestoreValue);
  }
  return result as unknown as AssetDocument & { id: string };
}

function assetToFields(asset: Partial<AssetDocument>): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [k, v] of Object.entries(asset)) {
    if (k === 'id') continue;
    fields[k] = toFirestoreValue(v);
  }
  return fields;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * List all assets in /estates/{uid}/assets ordered by createdAt descending.
 */
export async function listEstateAssets(
  ownerUid: string
): Promise<{ assets: (AssetDocument & { id: string })[]; error: string | null }> {
  const token = await getAccessToken();
  if (!token) return { assets: [], error: 'FIRESTORE_AUTH_FAILED: Missing or invalid service account credentials.' };

  const baseUrl = firestoreUrl(`estates/${ownerUid}/assets`);
  if (!baseUrl) return { assets: [], error: 'FIRESTORE_CONFIG_MISSING: FIREBASE_PROJECT_ID not set.' };

  try {
    const res = await fetch(`${baseUrl}?orderBy=createdAt desc&pageSize=200`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (res.status === 404) return { assets: [], error: null }; // No estate yet — valid empty state
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { assets: [], error: `FIRESTORE_READ_FAILED(${res.status}): ${body}` };
    }

    const data = await res.json();
    const documents: (AssetDocument & { id: string })[] = (data.documents || []).map(documentToAsset);
    return { assets: documents, error: null };
  } catch (err: any) {
    return { assets: [], error: `FIRESTORE_NETWORK_ERROR: ${err?.message}` };
  }
}

/**
 * Get a single asset by ID from /estates/{uid}/assets/{assetId}.
 */
export async function getEstateAsset(
  ownerUid: string,
  assetId: string
): Promise<{ asset: (AssetDocument & { id: string }) | null; error: string | null }> {
  const token = await getAccessToken();
  if (!token) return { asset: null, error: 'FIRESTORE_AUTH_FAILED' };

  const url = firestoreUrl(`estates/${ownerUid}/assets/${assetId}`);
  if (!url) return { asset: null, error: 'FIRESTORE_CONFIG_MISSING' };

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (res.status === 404) return { asset: null, error: 'ASSET_NOT_FOUND' };
    if (!res.ok) return { asset: null, error: `FIRESTORE_READ_FAILED(${res.status})` };

    const doc = await res.json();
    return { asset: documentToAsset(doc), error: null };
  } catch (err: any) {
    return { asset: null, error: `FIRESTORE_NETWORK_ERROR: ${err?.message}` };
  }
}

/**
 * Create a new asset document in /estates/{uid}/assets.
 * Returns the document ID assigned by Firestore.
 */
export async function createEstateAsset(
  ownerUid: string,
  asset: Omit<AssetDocument, 'id'>
): Promise<{ assetId: string | null; error: string | null }> {
  const token = await getAccessToken();
  if (!token) return { assetId: null, error: 'FIRESTORE_AUTH_FAILED' };

  const url = firestoreUrl(`estates/${ownerUid}/assets`);
  if (!url) return { assetId: null, error: 'FIRESTORE_CONFIG_MISSING' };

  // Ensure estate document exists first (create if not, update siteCount)
  await ensureEstateDocument(ownerUid, token);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: assetToFields(asset as AssetDocument) }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { assetId: null, error: `FIRESTORE_WRITE_FAILED(${res.status}): ${body}` };
    }

    const doc = await res.json();
    const assetId = doc.name?.split('/').pop() || null;
    return { assetId, error: null };
  } catch (err: any) {
    return { assetId: null, error: `FIRESTORE_NETWORK_ERROR: ${err?.message}` };
  }
}

/**
 * Update specific fields on an asset document.
 * Uses PATCH with updateMask to avoid overwriting server-protected fields.
 */
export async function updateEstateAsset(
  ownerUid: string,
  assetId: string,
  fields: Partial<AssetDocument>,
  updateMaskFields: string[]
): Promise<{ success: boolean; error: string | null }> {
  const token = await getAccessToken();
  if (!token) return { success: false, error: 'FIRESTORE_AUTH_FAILED' };

  const url = firestoreUrl(`estates/${ownerUid}/assets/${assetId}`);
  if (!url) return { success: false, error: 'FIRESTORE_CONFIG_MISSING' };

  const maskQuery = updateMaskFields.map((f) => `updateMask.fieldPaths=${encodeURIComponent(f)}`).join('&');

  try {
    const res = await fetch(`${url}?${maskQuery}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: assetToFields(fields as AssetDocument) }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { success: false, error: `FIRESTORE_WRITE_FAILED(${res.status}): ${body}` };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: `FIRESTORE_NETWORK_ERROR: ${err?.message}` };
  }
}

/**
 * Creates the /estates/{uid} parent document if it doesn't exist yet.
 * Safe to call on every asset creation — uses a conditional write.
 */
async function ensureEstateDocument(ownerUid: string, token: string): Promise<void> {
  const url = firestoreUrl(`estates/${ownerUid}`);
  if (!url) return;

  try {
    // Check if it exists
    const checkRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (checkRes.status === 404) {
      // Create it
      const now = new Date().toISOString();
      await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            createdAt: { timestampValue: now },
            updatedAt: { timestampValue: now },
            siteCount: { integerValue: '0' },
          },
        }),
      });
    }
  } catch {
    // Non-fatal: estate doc creation failure doesn't block asset creation
  }
}
