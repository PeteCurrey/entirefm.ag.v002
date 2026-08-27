import { NextResponse } from 'next/server';
import { sourceRegistry } from '@/server/intelligence/source-registry';
import { intelligenceStore } from '@/server/intelligence/intelligence-store';

export async function GET() {
  const sources = sourceRegistry.getAllSources();
  const counts = intelligenceStore.getCounts();
  const recentRuns = intelligenceStore.getIngestionRuns(10);

  return NextResponse.json({
    success: true,
    sources,
    counts,
    recentRuns,
    timestamp: new Date().toISOString(),
  });
}
