import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ingestObservation } from '@/server/telemetry';

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

    const result = await ingestObservation(parsed.data);

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
