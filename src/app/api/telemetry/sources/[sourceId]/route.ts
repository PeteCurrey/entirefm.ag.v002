import { NextRequest, NextResponse } from 'next/server';
import { getConnectorState } from '@/server/telemetry';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  try {
    const { sourceId } = await params;
    if (!sourceId) {
      return NextResponse.json({ error: 'sourceId required' }, { status: 400 });
    }

    const connectorState = await getConnectorState(sourceId);
    return NextResponse.json({ source_id: sourceId, ...connectorState }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500 }
    );
  }
}
