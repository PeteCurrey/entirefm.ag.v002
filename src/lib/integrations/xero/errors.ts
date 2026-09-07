/**
 * ENTIREFM XERO INTEGRATION ERRORS
 * =================================
 * Structured, auditable, and security-hardened error classes.
 * Enforces secret redaction so tokens and secrets never leak into logs or UI.
 */

export class XeroIntegrationError extends Error {
  public readonly safeMessage: string;
  public readonly statusCode?: number;
  public readonly errorCode?: string;

  constructor(message: string, safeMessage?: string, statusCode?: number, errorCode?: string) {
    super(redactSecrets(message));
    this.name = 'XeroIntegrationError';
    this.safeMessage = safeMessage || 'A Xero integration error occurred.';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export class XeroAuthError extends XeroIntegrationError {
  constructor(message: string, safeMessage?: string) {
    super(message, safeMessage || 'Xero authentication failed or token has expired. Re-authorisation required.', 401, 'XERO_AUTH_ERROR');
    this.name = 'XeroAuthError';
  }
}

export class XeroScopeError extends XeroIntegrationError {
  public readonly missingScopes: string[];

  constructor(missingScopes: string[] = []) {
    const scopeMsg = missingScopes.length > 0 ? ` (Missing: ${missingScopes.join(', ')})` : '';
    super(
      `Insufficient Xero OAuth scopes granted${scopeMsg}`,
      'Additional Xero permissions are required. Please update Xero permissions.',
      403,
      'XERO_INSUFFICIENT_SCOPE'
    );
    this.name = 'XeroScopeError';
    this.missingScopes = missingScopes;
  }
}

export class XeroRateLimitError extends XeroIntegrationError {
  public readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds = 60, message?: string) {
    super(
      message || `Xero API rate limit exceeded. Retry after ${retryAfterSeconds} seconds.`,
      `Xero rate limit reached. Please wait ${retryAfterSeconds} seconds before retrying.`,
      429,
      'XERO_RATE_LIMIT'
    );
    this.name = 'XeroRateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class XeroApiError extends XeroIntegrationError {
  public readonly validationErrors?: Array<{ message: string }>;

  constructor(statusCode: number, message: string, validationErrors?: Array<{ message: string }>) {
    const safe = buildSafeApiMessage(statusCode, message, validationErrors);
    super(message, safe, statusCode, `XERO_API_${statusCode}`);
    this.name = 'XeroApiError';
    this.validationErrors = validationErrors;
  }
}

export class XeroNetworkError extends XeroIntegrationError {
  constructor(message: string) {
    super(message, 'Unable to connect to Xero API. Network timeout or service unavailable.', 503, 'XERO_NETWORK_ERROR');
    this.name = 'XeroNetworkError';
  }
}

export class XeroWebhookError extends XeroIntegrationError {
  constructor(message: string, statusCode = 400) {
    super(message, 'Xero webhook validation failed.', statusCode, 'XERO_WEBHOOK_ERROR');
    this.name = 'XeroWebhookError';
  }
}

/**
 * Strips tokens, secrets, passwords, and authorization headers from error strings.
 */
export function redactSecrets(text: string): string {
  if (!text) return '';
  return text
    .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
    .replace(/eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}(\.[A-Za-z0-9_\-]*)?/g, '[REDACTED_JWT]')
    .replace(/(client_secret|clientSecret|secret|refresh_token|access_token|authorization|token)[\s=:]+[^&\s,]+/gi, '$1=[REDACTED]')
    .replace(/xero_client_secret=[^&\s]+/gi, 'xero_client_secret=[REDACTED]');
}

function buildSafeApiMessage(
  statusCode: number,
  rawMessage: string,
  validationErrors?: Array<{ message: string }>
): string {
  if (validationErrors && validationErrors.length > 0) {
    return `Xero validation error: ${validationErrors.map(e => e.message).join('; ')}`;
  }

  switch (statusCode) {
    case 400:
      return 'Xero rejected the request due to invalid data formatting.';
    case 401:
      return 'Xero access token expired or invalid. Please re-authorise connection.';
    case 403:
      return 'Additional Xero permissions are required.';
    case 404:
      return 'The requested record does not exist in Xero.';
    case 429:
      return 'Xero API rate limit reached. Please try again in a few moments.';
    case 500:
    case 502:
    case 503:
      return 'Xero accounting service is temporarily unavailable. Please retry later.';
    default:
      return `Xero API error (${statusCode}): ${redactSecrets(rawMessage).slice(0, 150)}`;
  }
}
