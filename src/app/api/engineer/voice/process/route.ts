import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { structureVoiceTranscript, proposeVoiceStructuring } from '@/server/field';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { captureId, transcript } = body;
  if (!transcript) {
    return NextResponse.json({ error: 'Transcript required' }, { status: 400 });
  }

  // Run structuring engine
  const structured = structureVoiceTranscript(transcript);

  if (captureId) {
    await proposeVoiceStructuring(
      captureId,
      transcript,
      structured.actionType,
      structured,
      structured.confidence,
      undefined,
      session
    );
  }

  return NextResponse.json({
    success: true,
    ...structured,
  });
}
