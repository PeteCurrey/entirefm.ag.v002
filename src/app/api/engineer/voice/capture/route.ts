import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { saveVoiceCapture } from '@/server/field';

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
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { workOrderId, visitId, assetId, audioStoragePath, durationSeconds } = body;
  if (!visitId) {
    return NextResponse.json({ error: 'visitId is required' }, { status: 400 });
  }

  const result = await saveVoiceCapture(
    {
      workOrderId: workOrderId || '',
      visitId,
      assetId,
      engineerPersonId: session.personId,
      audioStoragePath: audioStoragePath || `voice/${visitId}/${Date.now()}.webm`,
      durationSeconds,
    },
    session
  );

  if (!result.id) {
    return NextResponse.json({ error: result.error || 'Failed to save voice capture' }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: result.id, captureId: result.id });
}
