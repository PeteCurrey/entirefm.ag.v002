/**
 * ENTIREFM REGISTRATION SECURITY — HONEYPOT FIELD VALIDATOR
 * ===========================================================
 * Server-side honeypot validation.
 *
 * The honeypot field is a hidden text input on the registration form with a
 * plausible-sounding name (e.g. "website_url"). It is hidden from real users
 * via CSS (not `display:none` or `visibility:hidden` alone — use off-screen
 * positioning so screen reader users are not confused).
 *
 * Legitimate users will never populate it. Bots that fill all fields will.
 */

/** The field name used in the registration form and API body */
export const HONEYPOT_FIELD_NAME = 'website_url';

export interface HoneypotCheckResult {
  triggered: boolean;
  reason?: string;
}

/**
 * Checks whether the honeypot field has been populated.
 * @param fieldValue - The value submitted for the honeypot field
 */
export function checkHoneypot(fieldValue: unknown): HoneypotCheckResult {
  // Not present at all — fine (field is optional from the form's perspective)
  if (fieldValue === undefined || fieldValue === null) {
    return { triggered: false };
  }

  // Empty string — legitimate (CSS-hidden field that was present but unfilled)
  if (typeof fieldValue === 'string' && fieldValue.trim() === '') {
    return { triggered: false };
  }

  // Any non-empty value means a bot filled it in
  return { triggered: true, reason: 'Honeypot field populated' };
}
