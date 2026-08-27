import { NextResponse } from 'next/server';
import { intelligenceStore } from '@/server/intelligence/intelligence-store';
import { opportunityStore } from '@/server/intelligence/opportunity-store';
import { ingestionOrchestrator } from '@/server/intelligence/ingestion-orchestrator';

export async function GET() {
  // If store is empty, trigger a background initialisation sync
  if (intelligenceStore.getCounts().totalItems === 0) {
    try {
      await ingestionOrchestrator.runFullIngestion();
    } catch {
      // Background sync handled gracefully
    }
  }

  const statutoryItems = intelligenceStore.query({ statutoryOnly: true, limit: 5 }).items;
  const latestNews = intelligenceStore.query({ eventType: 'trade_news', limit: 6 }).items;
  const consultations = intelligenceStore.query({ eventType: 'consultation', limit: 4 }).items;
  const parliamentWatch = intelligenceStore.query({ eventType: 'parliament_stage', limit: 4 }).items;
  const safetyAlerts = intelligenceStore.query({ eventType: 'safety_alert', limit: 4 }).items;
  const contractAwards = opportunityStore.getContractAwards(4);
  const closingTenders = opportunityStore.getActiveTenders({ closingSoonOnly: true, limit: 4 });

  return NextResponse.json({
    success: true,
    data: {
      statutoryItems,
      latestNews,
      consultations,
      parliamentWatch,
      safetyAlerts,
      contractAwards,
      closingTenders,
    },
    generatedAt: new Date().toISOString(),
  });
}
