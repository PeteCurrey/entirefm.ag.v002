import { NextResponse } from 'next/server';
import { ingestionOrchestrator } from '@/server/intelligence/ingestion-orchestrator';

export async function POST(request: Request) {
  try {
    const res = await ingestionOrchestrator.runFullIngestion();
    return NextResponse.json({
      success: true,
      totalIngested: res.totalIngested,
      runs: res.runs,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (err as Error).message || 'Ingestion failed',
      },
      { status: 500 }
    );
  }
}
