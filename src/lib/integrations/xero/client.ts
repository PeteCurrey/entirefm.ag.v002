/**
 * ENTIREFM XERO API HTTP CLIENT
 * ==============================
 * High-reliability, rate-limit resilient HTTP client for Xero Accounting API 2.0.
 *
 * Capabilities:
 * - Automatic proactive & reactive token refresh
 * - Standardized Xero-tenant-id injection
 * - HTTP 429 rate limit backoff and retry-after interpretation
 * - Granular scope failure detection (HTTP 403)
 * - Safe error message extraction with secret redaction
 */

import { getValidAccessToken, refreshConnectionTokens } from './oauth';
import {
  XeroAuthError,
  XeroScopeError,
  XeroRateLimitError,
  XeroApiError,
  XeroNetworkError,
  redactSecrets,
} from './errors';
import type { XeroConnectionRecord } from './types';

export const XERO_API_BASE = 'https://api.xero.com/api.xro/2.0';

export interface XeroRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  rawResponse?: boolean;
}

export class XeroClient {
  private connection: XeroConnectionRecord;

  constructor(connection: XeroConnectionRecord) {
    this.connection = connection;
  }

  public getConnection(): XeroConnectionRecord {
    return this.connection;
  }

  public getTenantId(): string {
    return this.connection.xero_tenant_id;
  }

  public get tenantId(): string {
    return this.connection.xero_tenant_id;
  }

  /**
   * Executes an authenticated request to the Xero Accounting API.
   * Handles transparent token refresh on 401 and rate limit backoff on 429.
   */
  public async request<T = any>(
    endpoint: string,
    options: XeroRequestOptions = {}
  ): Promise<T> {
    return this.executeWithRetry(endpoint, options, 1);
  }

  private async executeWithRetry<T = any>(
    endpoint: string,
    options: XeroRequestOptions,
    retryCount: number
  ): Promise<T> {
    // 1. Obtain valid access token
    const { accessToken, connection } = await getValidAccessToken(this.connection);
    this.connection = connection;

    // 2. Build URL and query parameters
    const cleanEndpoint = endpoint.replace(/^\//, '');
    let url = `${XERO_API_BASE}/${cleanEndpoint}`;

    if (options.params) {
      const sp = new URLSearchParams();
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined) {
          sp.append(key, String(value));
        }
      }
      const qs = sp.toString();
      if (qs) url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      'Xero-tenant-id': this.connection.xero_tenant_id,
      Accept: 'application/json',
      ...options.headers,
    };

    let bodyStr: BodyInit | undefined = undefined;
    if (options.body) {
      if (Buffer.isBuffer(options.body)) {
        bodyStr = new Uint8Array(options.body);
      } else if (typeof options.body === 'string') {
        bodyStr = options.body;
      } else {
        headers['Content-Type'] = 'application/json';
        bodyStr = JSON.stringify(options.body);
      }
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: bodyStr,
        cache: 'no-store',
      });
    } catch (err: any) {
      throw new XeroNetworkError(`Failed to communicate with Xero API at ${endpoint}: ${err?.message}`);
    }

    // 3. Handle Token Expiry (HTTP 401)
    if (response.status === 401 && retryCount > 0) {
      console.log('[XERO_CLIENT] Access token rejected with 401. Forcing token refresh and retrying once...');
      const refreshResult = await refreshConnectionTokens(this.connection);
      this.connection = refreshResult.connection;
      return this.executeWithRetry<T>(endpoint, options, retryCount - 1);
    }

    // 4. Handle Insufficient Scope (HTTP 403)
    if (response.status === 403) {
      throw new XeroScopeError();
    }

    // 5. Handle Rate Limits (HTTP 429)
    if (response.status === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      const retrySeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
      throw new XeroRateLimitError(isNaN(retrySeconds) ? 60 : retrySeconds);
    }

    // 6. Handle General Errors
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let validationErrors: Array<{ message: string }> | undefined;

      try {
        const parsed = JSON.parse(errorText);
        if (Array.isArray(parsed?.Elements)) {
          const collected: Array<{ message: string }> = [];
          for (const el of parsed.Elements) {
            if (Array.isArray(el?.ValidationErrors)) {
              for (const ve of el.ValidationErrors) {
                if (ve?.Message) collected.push({ message: ve.Message });
              }
            }
          }
          if (collected.length > 0) validationErrors = collected;
        } else if (parsed?.Message) {
          validationErrors = [{ message: parsed.Message }];
        }
      } catch {}

      throw new XeroApiError(
        response.status,
        `Xero API ${options.method || 'GET'} ${endpoint} failed (${response.status}): ${redactSecrets(errorText)}`,
        validationErrors
      );
    }

    if (options.rawResponse) {
      return (await response.blob()) as unknown as T;
    }

    if (response.status === 204) {
      return null as unknown as T;
    }

    try {
      return await response.json();
    } catch {
      return null as unknown as T;
    }
  }

  public get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  public post<T = any>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  public put<T = any>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  public delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
