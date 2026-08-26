import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ingestObservation, validateSourceAuthority, quarantineObservation } from '@/server/telemetry';

const IngestSchema = z.object({
  source_id: z.string().uuid(),
  sensor_id: z.string().uuid().optional(),
  sensor_reference: z.string().optional(),
  asset_id: z.string().uuid(),
  metric_code: z.string().min(1),
  value: z.union([z.number(), z.string()]),
  unit: z.string().min(1),
  observed_at: z.string().datetime(),
  source_system: z.string().optional(),
  source_message_id: z.string().optional(),
});

// In-memory rate limiting map: source_id -> timestamp array
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_SECOND = 100;
const RATE_WINDOW_MS = 1000;

function checkRateLimit(sourceId: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(sourceId) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_SECOND) {
    return false; // rate limited
  }
  timestamps.push(now);
  rateLimitMap.set(sourceId, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = IngestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 422 }
      );
    }

    const payload = parsed.data;

    // 1. Rate limiting check
    if (!checkRateLimit(payload.source_id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded: backpressure active', source_id: payload.source_id },
        { status: 429 }
      );
    }

    // 2. Source authority check
    const sourceAuth = await validateSourceAuthority(payload.source_id, payload.asset_id);
    if (!sourceAuth.valid) {
      // Quarantine observation from unregistered or invalid source
      await quarantineObservation(
        payload,
        sourceAuth.status_code === 403 ? 'SOURCE_ERROR' : 'INVALID',
        sourceAuth.rejection_reason ?? 'Source validation failed',
        `unauth:${payload.source_id}:${Date.now()}`
      );

      return NextResponse.json(
        { error: sourceAuth.rejection_reason },
        { status: sourceAuth.status_code }
      );
    }

    const result = await ingestObservation(payload);

    if (result.duplicate) {
      return NextResponse.json(
        { message: 'Observation already ingested (idempotent duplicate)', result },
        { status: 200 }
      );
    }

    if (!result.accepted) {
      return NextResponse.json(
        { error: 'Observation rejected', reason: result.rejection_reason, quality: result.quality },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500 }
    );
  }
}
