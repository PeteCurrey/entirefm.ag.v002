/**
 * GOOGLE ANALYTICS 4 & SEARCH CONSOLE SERVER CONNECTOR
 * ====================================================
 * Secure server-side interface for Google Analytics Data API v1beta
 * and Google Search Console API.
 * Uses service account credentials or OAuth2 tokens.
 * Fail-safe: Returns explicit configuration requirements when credentials are not configured.
 */

interface GoogleCredentials {
  clientEmail: string;
  privateKey: string;
}

function getGoogleCredentials(): GoogleCredentials | null {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      if (parsed.client_email && parsed.private_key) {
        return {
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key,
        };
      }
    } catch {
      // ignore
    }
  }

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Handle escaped newlines in environment variable
  privateKey = privateKey.replace(/\\n/g, '\n');

  return { clientEmail, privateKey };
}

/**
 * Generate Google OAuth2 Service Account Access Token using Web Crypto API
 */
async function getServiceAccountAccessToken(scope: string): Promise<string | null> {
  const creds = getGoogleCredentials();
  if (!creds) return null;

  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: creds.clientEmail,
      scope,
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedClaimSet = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
    const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

    // Sign with Node.js crypto
    const crypto = await import('crypto');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(creds.privateKey, 'base64url');
    const jwt = `${signatureInput}.${signature}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
      cache: 'no-store',
    });

    if (!tokenRes.ok) {
      console.warn('[GOOGLE_AUTH_WARN] Token request failed:', tokenRes.status, await tokenRes.text().catch(() => ''));
      return null;
    }

    const tokenData = await tokenRes.json();
    return tokenData.access_token || null;
  } catch (err) {
    console.warn('[GOOGLE_AUTH_EXCEPTION]', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. GOOGLE ANALYTICS 4 DATA API
// ─────────────────────────────────────────────────────────────

export interface Ga4ReportResult {
  connected: boolean;
  propertyId?: string;
  error?: string;
  rows?: any[];
  totals?: any[];
}

export async function runGa4Report(params: {
  startDate: string;
  endDate: string;
  dimensions?: Array<{ name: string }>;
  metrics: Array<{ name: string }>;
  dimensionFilter?: any;
  metricFilter?: any;
  orderBys?: any[];
  limit?: number;
}): Promise<Ga4ReportResult> {
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  if (!propertyId) {
    return {
      connected: false,
      error: 'GOOGLE_ANALYTICS_PROPERTY_ID environment variable is not configured.',
    };
  }

  const token = await getServiceAccountAccessToken('https://www.googleapis.com/auth/analytics.readonly');
  if (!token) {
    return {
      connected: false,
      propertyId,
      error: 'Google Service Account credentials (GOOGLE_CLIENT_EMAIL & GOOGLE_PRIVATE_KEY) not configured or unauthorized.',
    };
  }

  try {
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: params.startDate, endDate: params.endDate }],
        dimensions: params.dimensions || [],
        metrics: params.metrics,
        dimensionFilter: params.dimensionFilter,
        metricFilter: params.metricFilter,
        orderBys: params.orderBys,
        limit: params.limit || 100,
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return {
        connected: false,
        propertyId,
        error: `GA4 API error (${res.status}): ${errText}`,
      };
    }

    const data = await res.json();
    return {
      connected: true,
      propertyId,
      rows: data.rows || [],
      totals: data.totals || [],
    };
  } catch (err: any) {
    return {
      connected: false,
      propertyId,
      error: err?.message || 'Failed to query GA4 Data API',
    };
  }
}

// ─────────────────────────────────────────────────────────────
// 2. GOOGLE SEARCH CONSOLE API
// ─────────────────────────────────────────────────────────────

export interface SearchConsoleResult {
  connected: boolean;
  siteUrl?: string;
  error?: string;
  rows?: Array<{
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

export async function runSearchConsoleQuery(params: {
  startDate: string;
  endDate: string;
  dimensions: Array<'query' | 'page' | 'country' | 'device' | 'date'>;
  rowLimit?: number;
}): Promise<SearchConsoleResult> {
  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL;
  if (!siteUrl) {
    return {
      connected: false,
      error: 'SEARCH_CONSOLE_SITE_URL environment variable is not configured.',
    };
  }

  const token = await getServiceAccountAccessToken('https://www.googleapis.com/auth/webmasters.readonly');
  if (!token) {
    return {
      connected: false,
      siteUrl,
      error: 'Google Service Account credentials (GOOGLE_CLIENT_EMAIL & GOOGLE_PRIVATE_KEY) not configured or unauthorized for Search Console.',
    };
  }

  try {
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: params.startDate,
        endDate: params.endDate,
        dimensions: params.dimensions,
        rowLimit: params.rowLimit || 100,
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return {
        connected: false,
        siteUrl,
        error: `Search Console API error (${res.status}): ${errText}`,
      };
    }

    const data = await res.json();
    return {
      connected: true,
      siteUrl,
      rows: data.rows || [],
    };
  } catch (err: any) {
    return {
      connected: false,
      siteUrl,
      error: err?.message || 'Failed to query Search Console API',
    };
  }
}
