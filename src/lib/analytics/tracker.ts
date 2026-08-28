/**
 * ENTIREFM CLIENT-SIDE ANALYTICS & ATTRIBUTION TRACKER
 * ====================================================
 * Privacy-safe, zero-PII session and journey memory helper.
 * Strictly respects user consent preferences stored in 'efm_consent_prefs'.
 */

export interface TrackEventParams {
  cta_type?: string;
  source_page?: string;
  source_page_type?: string;
  service?: string;
  location?: string;
  sector?: string;
  position?: string;
  tool_id?: string;
  action?: string;
  [key: string]: any;
}

const JOURNEY_KEY = 'efm_journey_trail';
const FIRST_TOUCH_KEY = 'efm_first_touch';
const FIRST_REFERRER_KEY = 'efm_first_referrer';

/**
 * Synchronize consent status with Google Consent Mode v2
 */
export function updateGoogleConsent(prefs: { analytics?: boolean; marketing?: boolean }) {
  if (typeof window === 'undefined') return;
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('consent', 'update', {
      analytics_storage: prefs.analytics ? 'granted' : 'denied',
      ad_storage: prefs.marketing ? 'granted' : 'denied',
      ad_user_data: prefs.marketing ? 'granted' : 'denied',
      ad_personalization: prefs.marketing ? 'granted' : 'denied',
    });
  }
}

/**
 * Check if the user has consented to a specific storage category
 */
export function hasConsent(category: 'essential' | 'necessary' | 'functional' | 'analytics' | 'marketing'): boolean {
  if (typeof window === 'undefined') return false;
  if (category === 'essential' || category === 'necessary') return true;

  try {
    const stored = localStorage.getItem('efm_consent_prefs');
    if (!stored) {
      // Default privacy-first stance: functional/analytics/marketing blocked before consent
      return false;
    }
    const parsed = JSON.parse(stored);
    if (category === 'analytics') return parsed.analytics === true;
    if (category === 'marketing') return parsed.marketing === true;
    if (category === 'functional') return parsed.functional === true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Initialize / update user journey in sessionStorage (if functional storage is permitted)
 */
export function recordPageView(path: string, pageType: string = 'general') {
  if (typeof window === 'undefined') return;
  if (!hasConsent('functional')) return;

  try {
    const timestamp = new Date().toISOString();
    const referrer = document.referrer || 'direct';

    // 1. Record First Touch if not set
    if (!sessionStorage.getItem(FIRST_TOUCH_KEY)) {
      sessionStorage.setItem(FIRST_TOUCH_KEY, path);
      sessionStorage.setItem(FIRST_REFERRER_KEY, referrer);
    }

    // 2. Append to journey trail (cap at 15 steps)
    const existing = JSON.parse(sessionStorage.getItem(JOURNEY_KEY) || '[]');
    const isRepeat = existing.length > 0 && existing[existing.length - 1].path === path;

    if (!isRepeat) {
      existing.push({ path, pageType, timestamp });
      if (existing.length > 15) existing.shift();
      sessionStorage.setItem(JOURNEY_KEY, JSON.stringify(existing));
    }
  } catch {
    // Session storage may fail in strict privacy modes; fail silently
  }
}

/**
 * Retrieve current user journey & attribution payload for forms
 */
export function getAttributionPayload() {
  if (typeof window === 'undefined') {
    return {
      first_touch_url: '',
      first_touch_referrer: '',
      last_touch_url: '',
      journey_trail: [],
      assisted_pages: [],
    };
  }

  try {
    const firstTouch = sessionStorage.getItem(FIRST_TOUCH_KEY) || window.location.pathname;
    const firstRef = sessionStorage.getItem(FIRST_REFERRER_KEY) || document.referrer || 'direct';
    const journey = JSON.parse(sessionStorage.getItem(JOURNEY_KEY) || '[]');
    const currentPath = window.location.pathname;

    const assisted = journey
      .map((j: any) => j.path)
      .filter((p: string) => p !== currentPath && p !== firstTouch);

    return {
      first_touch_url: firstTouch,
      first_touch_referrer: firstRef,
      last_touch_url: currentPath,
      journey_trail: journey,
      assisted_pages: Array.from(new Set(assisted)),
    };
  } catch {
    return {
      first_touch_url: window.location.pathname,
      first_touch_referrer: '',
      last_touch_url: window.location.pathname,
      journey_trail: [],
      assisted_pages: [],
    };
  }
}

/**
 * Track non-PII structured event (strictly consent-gated for GA4/GTM)
 */
export function trackEvent(eventName: string, params: TrackEventParams = {}) {
  if (typeof window === 'undefined') return;

  // STRICT ZERO-PII FILTER: scrub any prohibited fields
  const safeParams: Record<string, any> = {};
  const prohibitedKeys = ['name', 'email', 'phone', 'message', 'company', 'address', 'password'];

  for (const [k, v] of Object.entries(params)) {
    if (!prohibitedKeys.includes(k.toLowerCase()) && typeof v !== 'object') {
      safeParams[k] = v;
    }
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[EVENT_TRACKER] ${eventName}:`, safeParams);
  }

  // Dispatch to GA4 / GTM ONLY if user has granted explicit analytics consent
  if (hasConsent('analytics') && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, safeParams);
  }
}
