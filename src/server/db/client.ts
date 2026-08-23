/**
 * ENTIREFM DATABASE CLIENT
 * ========================
 * High-performance, fail-safe database client using PostgREST HTTP interface.
 * Connects to Supabase via SERVICE ROLE key server-side.
 * Provides typed query helpers for all canonical domains.
 */

export interface DbConfig {
  url: string;
  key: string;
}

export function getDbConfig(): DbConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

export function isDbConfigured(): boolean {
  return getDbConfig() !== null;
}

function getHeaders(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

/**
 * Execute a typed PostgREST query against the Supabase database.
 */
export async function dbQuery<T = any>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
    cache?: RequestCache;
  } = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const cfg = getDbConfig();
  if (!cfg) {
    return { data: null, error: 'Database credentials not configured', status: 503 };
  }

  const method = options.method || 'GET';
  const url = `${cfg.url}/rest/v1/${endpoint.replace(/^\//, '')}`;

  try {
    const res = await fetch(url, {
      method,
      headers: getHeaders(cfg.key, {
        ...(options.body ? { Prefer: 'return=representation' } : {}),
        ...options.headers,
      }),
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: options.cache || 'no-store',
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[DB_ERROR] ${method} ${endpoint} failed (${res.status}):`, errText);
      return { data: null, error: errText || `DB Error ${res.status}`, status: res.status };
    }

    if (res.status === 204) {
      return { data: null, error: null, status: res.status };
    }

    const data = await res.json().catch(() => null);
    return { data, error: null, status: res.status };
  } catch (err: any) {
    console.error(`[DB_EXCEPTION] ${method} ${endpoint}:`, err);
    return { data: null, error: err?.message || 'Database network error', status: 500 };
  }
}
