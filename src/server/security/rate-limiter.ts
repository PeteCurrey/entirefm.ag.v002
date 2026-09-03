/**
 * ENTIREFM REGISTRATION SECURITY — SLIDING-WINDOW RATE LIMITER
 * =============================================================
 * In-process sliding-window rate limiter.
 *
 * On Vercel serverless, each function instance has its own in-memory state.
 * This limiter is deliberately conservative so it is effective even without
 * cross-instance coordination — it limits within a single instance, and the
 * combination of all instances provides collective coverage.
 *
 * For production-grade cross-instance rate limiting, configure Upstash Redis
 * and replace this with an atomic Redis INCR approach.
 */

interface RateLimitEntry {
  timestamps: number[];
  blockedUntil?: number;
}

const store = new Map<string, RateLimitEntry>();

// LRU eviction: purge entries older than 1 hour to prevent memory growth
const EVICTION_INTERVAL_MS = 60 * 60 * 1000;
let lastEviction = Date.now();

function evictStale(): void {
  const now = Date.now();
  if (now - lastEviction < EVICTION_INTERVAL_MS) return;
  lastEviction = now;

  const cutoff = now - EVICTION_INTERVAL_MS;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0 && (!entry.blockedUntil || entry.blockedUntil < now)) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** If exceeded, block for this duration (ms). Defaults to windowMs. */
  blockDurationMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Check (and record) a rate limit for a given key.
 * Key should be constructed as: `${endpoint}:${identifier}` e.g. `register:1.2.3.4`
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  evictStale();

  const now = Date.now();
  const { limit, windowMs, blockDurationMs = windowMs } = config;

  const entry = store.get(key) ?? { timestamps: [] };

  // Check if currently hard-blocked
  if (entry.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  // Slide the window: remove timestamps outside the window
  const windowStart = now - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= limit) {
    // Exceeded: set a hard block
    entry.blockedUntil = now + blockDurationMs;
    store.set(key, entry);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(blockDurationMs / 1000),
    };
  }

  // Record this request
  entry.timestamps.push(now);
  store.set(key, entry);

  return {
    allowed: true,
    remaining: limit - entry.timestamps.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Convenience: extract and normalise the best IP address from a request.
 * On Vercel, the real client IP is in x-forwarded-for.
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    // Take only the first (real client) address
    return xff.split(',')[0].trim();
  }
  // Fallback for local dev
  return '127.0.0.1';
}

/**
 * Standard rate limit configs for EntireFM auth endpoints.
 */
export const RATE_LIMITS = {
  /** Registration: 5 attempts per IP per hour */
  REGISTER: { limit: 5, windowMs: 60 * 60 * 1000, blockDurationMs: 2 * 60 * 60 * 1000 },

  /** Sign-in: 10 attempts per IP per 15 minutes */
  SIGNIN: { limit: 10, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },

  /** Password reset request: 3 per IP per 15 minutes */
  FORGOT_PASSWORD: { limit: 3, windowMs: 15 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },

  /** Resend verification: 3 per IP per 10 minutes */
  RESEND_VERIFICATION: { limit: 3, windowMs: 10 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },

  /** Password reset token submission: 5 per IP per hour */
  RESET_PASSWORD: { limit: 5, windowMs: 60 * 60 * 1000, blockDurationMs: 2 * 60 * 60 * 1000 },
} as const;
