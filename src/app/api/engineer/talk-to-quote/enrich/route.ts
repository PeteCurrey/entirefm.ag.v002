/**
 * TALK TO QUOTE — AI FIELD INTELLIGENCE ENRICHMENT ENDPOINT
 * ==========================================================
 * Transforms spoken notes and photos into structured FM entities,
 * scope of works, parts & labour pricing, and quote preview.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { EntireCAFMFieldIntelligenceEngine } from '@/server/field-intelligence';

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

  const { transcript, sessionId, context = {}, imageUrl } = body;

  if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
    return NextResponse.json({ error: 'Transcript string is required' }, { status: 400 });
  }

  try {
    const result = await EntireCAFMFieldIntelligenceEngine.analyze({
      transcript: transcript.trim(),
      sessionId,
      imageUrl,
      session,
      context: {
        sessionEngineerId: session.personId,
        sessionEngineerName: session.name || 'Field Operative',
        sessionOrgId: session.orgId,
        clientAccountId: context.clientAccountId,
        clientName: context.clientName,
        siteId: context.siteId,
        siteName: context.siteName,
        locationId: context.locationId,
        locationName: context.locationName,
        assetId: context.assetId,
        assetReference: context.assetReference,
        workOrderId: context.workOrderId,
        workOrderNumber: context.workOrderNumber,
      },
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    console.error('[ENRICH_EXCEPTION]', err);
    return NextResponse.json(
      { error: err.message || 'Field intelligence enrichment failed' },
      { status: 500 }
    );
  }
}
