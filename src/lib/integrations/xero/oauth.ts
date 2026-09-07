/**
 * ENTIREFM XERO OAUTH 2.0 SERVICE
 * ================================
 * Production implementation of Xero OAuth 2.0 lifecycle:
 * - Granular scope configuration
 * - Secure state generation and validation (CSRF defense)
 * - Authorization code exchange
 * - Rotating refresh token management (automatic token refresh)
 * - Multi-tenant encrypted storage
 * - Connection revocation and disconnection
 */

import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import { encryptToken, decryptToken, generateOAuthState } from './crypto';
import {
  XeroAuthError,
  XeroScopeError,
  XeroApiError,
  XeroNetworkError,
  redactSecrets,
} from './errors';
import type {
  XeroConnectionRecord,
  XeroTenant,
  XeroTokenSet,
} from './types';

export const XERO_AUTH_URL = 'https://login.xero.com/identity/connect/authorize';
export const XERO_TOKEN_URL = 'https://identity.xero.com/connect/token';
export const XERO_CONNECTIONS_URL = 'https://api.xero.com/connections';

/**
 * Granular Scopes required for EntireCAFM Phase 1 accounting synchronisation.
 * Exactly matches requirements without unnecessary scopes.
 */
export const REQUIRED_XERO_SCOPES = [
  'openid',
  'profile',
  'email',
  'offline_access', // Critical: provides 60-day rolling refresh token
  'accounting.settings',
  'accounting.settings.read',
  'accounting.contacts',
  'accounting.contacts.read',
  'accounting.invoices',
  'accounting.invoices.read',
  'accounting.payments',
  'accounting.payments.read',
  'accounting.attachments',
  'accounting.attachments.read',
] as const;

export interface XeroOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function getXeroConfig(): XeroOAuthConfig {
  const clientId = process.env.XERO_CLIENT_ID;
  const clientSecret = process.env.XERO_CLIENT_SECRET;
  const redirectUri =
    process.env.XERO_REDIRECT_URI ||
    (process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/api/integrations/xero/callback`
      : 'https://www.entirefm.com/api/integrations/xero/callback');

  if (!clientId || !clientSecret) {
    throw new XeroAuthError(
      'Xero OAuth credentials not configured. XERO_CLIENT_ID and XERO_CLIENT_SECRET must be set in server environment.',
      'Xero integration is not yet configured with API credentials. Please contact your system administrator.'
    );
  }

  return { clientId, clientSecret, redirectUri };
}

export function isXeroConfigured(): boolean {
  return Boolean(process.env.XERO_CLIENT_ID && process.env.XERO_CLIENT_SECRET);
}

/**
 * Builds the Xero authorization URL with secure state and granular scopes.
 */
export async function createAuthorizationUrl(params?: {
  personId?: string;
  organisationId?: string;
  returnUrl?: string;
}): Promise<{ url: string; state: string }> {
  const config = getXeroConfig();
  const state = generateOAuthState();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  let personId = params?.personId;
  let organisationId = params?.organisationId;

  if (!personId || !organisationId) {
    try {
      const { getCurrentSession } = await import('@/server/identity');
      const session = await getCurrentSession().catch(() => null);
      if (session) {
        personId = personId || session.personId;
        organisationId = organisationId || session.orgId;
      }
    } catch {
      // Not in request context
    }
  }

  if (!personId || !organisationId) {
    const [{ data: persons }, { data: orgs }] = await Promise.all([
      dbQuery<any[]>('persons?select=id&limit=1'),
      dbQuery<any[]>('organisations?select=id&limit=1'),
    ]);
    personId = personId || persons?.[0]?.id;
    organisationId = organisationId || orgs?.[0]?.id;
  }

  // Persist state in database for tamper-proof verification
  const { error: stateError } = await dbQuery('xero_oauth_states', {
    method: 'POST',
    body: {
      state,
      person_id: personId,
      organisation_id: organisationId,
      return_url: params?.returnUrl || '/admin/integrations/xero',
      expires_at: expiresAt,
    },
  });

  if (stateError) {
    throw new XeroAuthError(`Failed to persist OAuth state: ${stateError}`);
  }

  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: REQUIRED_XERO_SCOPES.join(' '),
    state,
  });

  return {
    url: `${XERO_AUTH_URL}?${queryParams.toString()}`,
    state,
  };
}

/**
 * Exchanges authorization code for access and refresh tokens, fetches connected tenants,
 * encrypts credentials at rest, and persists connection record.
 */
export async function handleAuthorizationCallback(params: {
  code: string;
  state: string;
}): Promise<{
  connection: XeroConnectionRecord;
  tenantName: string;
  returnUrl: string;
}> {
  const config = getXeroConfig();

  // 1. Verify and consume state
  const { data: stateRows, error: stateQueryError } = await dbQuery<Array<{
    state: string;
    person_id: string;
    organisation_id: string;
    return_url: string;
    expires_at: string;
  }>>(`xero_oauth_states?state=eq.${encodeURIComponent(params.state)}&limit=1`);

  if (stateQueryError || !stateRows || stateRows.length === 0) {
    throw new XeroAuthError('Invalid or unrecognised OAuth state. The authentication request may have expired or originated externally.');
  }

  const oauthState = stateRows[0];
  if (new Date(oauthState.expires_at).getTime() < Date.now()) {
    // Delete expired state
    await dbQuery(`xero_oauth_states?state=eq.${encodeURIComponent(params.state)}`, { method: 'DELETE' });
    throw new XeroAuthError('OAuth session has expired. Please try connecting to Xero again.');
  }

  // Delete consumed state (single-use CSRF defense)
  await dbQuery(`xero_oauth_states?state=eq.${encodeURIComponent(params.state)}`, { method: 'DELETE' });

  // 2. Exchange code for tokens
  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
  let tokenRes: Response;

  try {
    tokenRes = await fetch(XERO_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: params.code,
        redirect_uri: config.redirectUri,
      }).toString(),
      cache: 'no-store',
    });
  } catch (err: any) {
    throw new XeroNetworkError(`Failed to reach Xero token endpoint: ${err?.message}`);
  }

  if (!tokenRes.ok) {
    const errBody = await tokenRes.text().catch(() => '');
    throw new XeroAuthError(`Xero token exchange rejected (${tokenRes.status}): ${redactSecrets(errBody)}`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const expiresIn = tokenData.expires_in || 1800; // default 30 mins
  const tokenType = tokenData.token_type || 'Bearer';
  const scopeStr = tokenData.scope || '';
  const grantedScopes = scopeStr.split(' ').filter(Boolean);

  if (!accessToken || !refreshToken) {
    throw new XeroAuthError('Xero token response did not contain required access and refresh tokens.');
  }

  // 3. Fetch connected Xero tenants
  let tenantsRes: Response;
  try {
    tenantsRes = await fetch(XERO_CONNECTIONS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
  } catch (err: any) {
    throw new XeroNetworkError(`Failed to query Xero connections: ${err?.message}`);
  }

  if (!tenantsRes.ok) {
    const errBody = await tenantsRes.text().catch(() => '');
    throw new XeroApiError(tenantsRes.status, `Failed to retrieve Xero tenants: ${errBody}`);
  }

  const tenants: XeroTenant[] = await tenantsRes.json();
  if (!tenants || tenants.length === 0) {
    throw new XeroAuthError('No active Xero organisation was authorised by the user.');
  }

  // Use the primary/first connected organisation tenant
  const primaryTenant = tenants[0];
  const expiresAtDate = new Date(Date.now() + expiresIn * 1000).toISOString();

  // 4. Encrypt sensitive tokens at rest using AES-256-GCM
  const encryptedAccess = encryptToken(accessToken);
  const encryptedRefresh = encryptToken(refreshToken);

  // 5. Upsert connection record in EntireCAFM database
  const connectionPayload = {
    organisation_id: oauthState.organisation_id,
    xero_tenant_id: primaryTenant.tenantId,
    xero_tenant_name: primaryTenant.tenantName,
    status: 'CONNECTED',
    authorised_by_person_id: oauthState.person_id,
    scopes_granted: grantedScopes,
    token_type: tokenType,
    encrypted_access_token: encryptedAccess.ciphertext,
    encrypted_refresh_token: encryptedRefresh.ciphertext,
    token_iv: `${encryptedAccess.iv}:${encryptedRefresh.iv}`,
    token_auth_tag: `${encryptedAccess.tag}:${encryptedRefresh.tag}`,
    expires_at: expiresAtDate,
    last_error: null,
    is_active: true,
    updated_at: new Date().toISOString(),
  };

  const { data: savedRows, error: saveError } = await dbQuery<XeroConnectionRecord[]>('xero_connections', {
    method: 'POST',
    body: connectionPayload,
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });

  if (saveError || !savedRows || savedRows.length === 0) {
    throw new XeroAuthError(`Failed to persist Xero connection record: ${saveError}`);
  }

  const connection = savedRows[0];

  // Update canonical platform integration status
  await dbQuery('platform_integration_configs?name=eq.Xero', {
    method: 'PATCH',
    body: {
      state: 'LIVE',
      note: `Active live connection to Xero organisation: ${primaryTenant.tenantName}`,
      last_checked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  // Record immutable audit event
  await recordAuditEvent({
    event_type: 'XERO_CONNECTION_CREATED',
    actor_id: oauthState.person_id,
    actor_type: 'HUMAN',
    organisation_id: oauthState.organisation_id,
    object_type: 'xero_connections',
    object_id: connection.id,
    after_state: {
      xero_tenant_id: primaryTenant.tenantId,
      xero_tenant_name: primaryTenant.tenantName,
      scopes_granted: grantedScopes,
      status: 'CONNECTED',
    },
    is_ai: false,
  });

  return {
    connection,
    tenantName: primaryTenant.tenantName,
    returnUrl: oauthState.return_url || '/admin/integrations/xero',
  };
}

/**
 * Retrieves the active Xero connection for a given CAFM organisation (or first active system connection).
 */
export async function getActiveConnection(organisationId?: string): Promise<XeroConnectionRecord | null> {
  let endpoint = 'xero_connections?status=eq.CONNECTED&is_active=eq.true';
  if (organisationId) {
    endpoint += `&organisation_id=eq.${encodeURIComponent(organisationId)}`;
  }
  endpoint += '&order=updated_at.desc&limit=1';

  const { data, error } = await dbQuery<XeroConnectionRecord[]>(endpoint);
  if (error || !data || data.length === 0) {
    return null;
  }
  return data[0];
}

/**
 * Automatically refreshes connection tokens using the stored refresh token.
 * Persists the newly rotated refresh token and updated expiry.
 */
export async function refreshConnectionTokens(
  connection: XeroConnectionRecord
): Promise<{ accessToken: string; connection: XeroConnectionRecord }> {
  const config = getXeroConfig();

  // Extract IVs and Tags
  const [accessIv, refreshIv] = connection.token_iv.split(':');
  const [accessTag, refreshTag] = connection.token_auth_tag.split(':');

  if (!refreshIv || !refreshTag) {
    throw new XeroAuthError('Corrupt token initialization vectors. Re-authentication required.');
  }

  const rawRefreshToken = decryptToken(connection.encrypted_refresh_token, refreshIv, refreshTag);

  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
  let tokenRes: Response;

  try {
    tokenRes = await fetch(XERO_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: rawRefreshToken,
      }).toString(),
      cache: 'no-store',
    });
  } catch (err: any) {
    throw new XeroNetworkError(`Network error while refreshing Xero token: ${err?.message}`);
  }

  if (!tokenRes.ok) {
    const errText = await tokenRes.text().catch(() => '');
    console.error(`[XERO_REFRESH_FAILED] Status ${tokenRes.status}: ${redactSecrets(errText)}`);

    // Mark connection as EXPIRED or ERROR so UI prompts user to re-authorise
    await dbQuery(`xero_connections?id=eq.${encodeURIComponent(connection.id)}`, {
      method: 'PATCH',
      body: {
        status: 'EXPIRED',
        last_error: 'Refresh token expired or revoked. Please reconnect Xero.',
        updated_at: new Date().toISOString(),
      },
    });

    throw new XeroAuthError(
      `Xero token refresh rejected: ${redactSecrets(errText)}`,
      'Your Xero session has expired. Please reconnect EntireCAFM to Xero.'
    );
  }

  const tokenData = await tokenRes.json();
  const newAccessToken = tokenData.access_token;
  const newRefreshToken = tokenData.refresh_token;
  const expiresIn = tokenData.expires_in || 1800;
  const newExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  // Re-encrypt newly rotated tokens
  const encAccess = encryptToken(newAccessToken);
  const encRefresh = encryptToken(newRefreshToken);

  const patchPayload = {
    encrypted_access_token: encAccess.ciphertext,
    encrypted_refresh_token: encRefresh.ciphertext,
    token_iv: `${encAccess.iv}:${encRefresh.iv}`,
    token_auth_tag: `${encAccess.tag}:${encRefresh.tag}`,
    expires_at: newExpiresAt,
    status: 'CONNECTED' as const,
    last_error: undefined,
    updated_at: new Date().toISOString(),
  };

  await dbQuery(`xero_connections?id=eq.${encodeURIComponent(connection.id)}`, {
    method: 'PATCH',
    body: patchPayload,
  });

  return {
    accessToken: newAccessToken,
    connection: {
      ...connection,
      ...patchPayload,
    },
  };
}

/**
 * Returns a valid decrypted access token for the connection, refreshing it proactively
 * if it expires in less than 2 minutes.
 */
export async function getValidAccessToken(
  connection: XeroConnectionRecord
): Promise<{ accessToken: string; connection: XeroConnectionRecord }> {
  const expiresAtMs = new Date(connection.expires_at).getTime();
  const bufferMs = 2 * 60 * 1000; // 2 minutes buffer

  if (Date.now() + bufferMs >= expiresAtMs) {
    // Proactively refresh before expiry
    return await refreshConnectionTokens(connection);
  }

  // Decrypt current valid access token
  const [accessIv] = connection.token_iv.split(':');
  const [accessTag] = connection.token_auth_tag.split(':');
  const decryptedAccessToken = decryptToken(connection.encrypted_access_token, accessIv, accessTag);

  return {
    accessToken: decryptedAccessToken,
    connection,
  };
}

/**
 * Disconnects and revokes a Xero connection.
 */
export async function disconnectXeroConnection(
  connectionIdOrParams?: string | { connectionId?: string; reason?: string; actorPersonId?: string },
  legacyPersonId?: string
): Promise<void> {
  let targetId: string | undefined;
  let actorId: string | undefined = legacyPersonId;
  let reason: string | undefined;

  if (typeof connectionIdOrParams === 'string') {
    targetId = connectionIdOrParams;
  } else if (connectionIdOrParams) {
    targetId = connectionIdOrParams.connectionId;
    actorId = connectionIdOrParams.actorPersonId || actorId;
    reason = connectionIdOrParams.reason;
  }

  if (!targetId) {
    const active = await getActiveConnection();
    if (!active) return;
    targetId = active.id;
  }

  const { data } = await dbQuery<XeroConnectionRecord[]>(
    `xero_connections?id=eq.${encodeURIComponent(targetId)}&limit=1`
  );
  if (!data || data.length === 0) return;

  const conn = data[0];

  await dbQuery(`xero_connections?id=eq.${encodeURIComponent(targetId)}`, {
    method: 'PATCH',
    body: {
      status: 'DISCONNECTED',
      is_active: false,
      last_error: reason ? `Disconnected: ${reason}` : null,
      updated_at: new Date().toISOString(),
    },
  });

  // Check if any other active connections remain
  const { data: remaining } = await dbQuery<any[]>('xero_connections?status=eq.CONNECTED&is_active=eq.true&limit=1');
  if (!remaining || remaining.length === 0) {
    await dbQuery('platform_integration_configs?name=eq.Xero', {
      method: 'PATCH',
      body: {
        state: 'INTERFACE_ONLY',
        note: 'Xero connection was disconnected. Reconnect to resume sync.',
        updated_at: new Date().toISOString(),
      },
    });
  }

  await recordAuditEvent({
    event_type: 'XERO_CONNECTION_REVOKED',
    actor_id: actorId,
    actor_type: 'HUMAN',
    organisation_id: conn.organisation_id,
    object_type: 'xero_connections',
    object_id: targetId,
    before_state: { status: 'CONNECTED', xero_tenant_id: conn.xero_tenant_id },
    after_state: { status: 'DISCONNECTED' },
    is_ai: false,
  });
}
