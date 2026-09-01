/**
 * ENTIREFM MULTIMODAL JOB ANALYSIS API (Phase 01)
 * ===============================================
 * Receives user description and uploaded media/evidence, fetches estate asset context,
 * and calls MultimodalJobAnalysisService to return structured advisory job data.
 *
 * Security:
 *   - Verifies authenticated session (Client, Operations, Admin)
 *   - Enforces site scope boundaries (prevents tenant cross-inspection)
 *   - Untrusted input wrapping & strict Zod validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasScope } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { MultimodalJobAnalysisService } from '@/server/ai/multimodal/service';
import { EstateAssetSummary, MultimodalEvidenceItem } from '@/server/ai/multimodal/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const isViewAs = !!session.viewAsContext?.isViewAs;
    if (session.orgType !== 'CLIENT' && !isViewAs && session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
    }

    const {
      description = '',
      evidence = [],
      site_id,
      correlation_id,
    } = body as {
      description: string;
      evidence: MultimodalEvidenceItem[];
      site_id?: string;
      correlation_id?: string;
    };

    if (!site_id || typeof site_id !== 'string' || !site_id.trim()) {
      return NextResponse.json(
        { error: 'site_id is mandatory for multimodal job analysis to ensure asset register grounding and tenant isolation.' },
        { status: 400 }
      );
    }

    if (!description && (!evidence || evidence.length === 0)) {
      return NextResponse.json(
        { error: 'Please provide either a problem description or upload media evidence to analyze.' },
        { status: 400 }
      );
    }

    let siteName: string | undefined = undefined;
    let availableAssets: EstateAssetSummary[] = [];

    // Verify scope & retrieve site name and asset register
    const { data: sites } = await dbQuery<any[]>(
      `sites?id=eq.${encodeURIComponent(site_id)}&select=id,name,organisation_id`
    );
      const site = sites?.[0];

      if (!site) {
        return NextResponse.json({ error: 'Specified site not found' }, { status: 404 });
      }

      // Verify site belongs to client org
      if (session.orgType === 'CLIENT' && !isViewAs) {
        if (site.organisation_id !== session.orgId) {
          return NextResponse.json({ error: 'Forbidden: Unauthorised site access' }, { status: 403 });
        }
        if (!hasScope(session, 'SITE', site_id)) {
          return NextResponse.json({ error: 'Forbidden: Restricted site scope' }, { status: 403 });
        }
      }

      siteName = site.name;

      // Query active assets for this site to empower AI Asset Matching
      const { data: assetRecords } = await dbQuery<any[]>(
        `assets?site_id=eq.${encodeURIComponent(site_id)}&status=neq.DECOMMISSIONED&select=id,name,asset_reference,category,sub_category,location,manufacturer,model,serial_number&limit=100`
      );

      if (assetRecords && assetRecords.length > 0) {
        availableAssets = assetRecords.map((a) => ({
          id: a.id,
          name: a.name,
          asset_reference: a.asset_reference || a.name,
          category: a.category,
          sub_category: a.sub_category,
          location: a.location,
          manufacturer: a.manufacturer,
          model: a.model,
          serial_number: a.serial_number,
        }));
      }

    // Call Multimodal AI Specialist Service
    const analysisResult = await MultimodalJobAnalysisService.analyze({
      userDescription: description,
      evidence: evidence || [],
      siteId: site_id,
      siteName,
      availableAssets,
      correlationId: correlation_id,
      requesterOrgId: session.orgId,
    });

    return NextResponse.json({
      success: true,
      assessment: analysisResult.assessment,
      meta: {
        provider: analysisResult.modelProvider,
        model: analysisResult.modelName,
        is_fallback: analysisResult.isFallback,
        tokens_used: analysisResult.tokensUsed,
        latency_ms: analysisResult.latencyMs,
        matched_candidate: analysisResult.assessment.asset_match,
      },
    });
  } catch (err: any) {
    console.error('[MULTIMODAL_API_ERROR]:', err);
    return NextResponse.json({ error: err?.message || 'Failed to complete multimodal analysis' }, { status: 500 });
  }
}
