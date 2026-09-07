/**
 * ASSET SCANNER PROCESSING ENDPOINT — /api/tools/asset-scanner/process
 * ===================================================================
 * Invoked when an image, video frame, or PDF is uploaded.
 * Runs extraction pipeline, cross-references SFG20, and persists to Firestore
 * when the caller is an authenticated member.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { extractAssetFromUpload } from '@/server/asset-scanner/extractor';
import { verifySupabaseAuthToken } from '@/server/asset-scanner/auth-bridge';
import { createEstateAsset } from '@/server/firestore/client';
import { AssetScannerFileType } from '@/types/asset-scanner';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { getMemberById } from '@/server/member/member-store';
import { saveToolOutput } from '@/server/workspace/workspace-store';

const ProcessRequestSchema = z.object({
  uploadId: z.string().min(1, 'uploadId is required'),
  fileType: z.enum(['image', 'video', 'pdf']),
  filename: z.string().min(1, 'filename is required'),
  base64Data: z.string().optional(),
  textContent: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    let verifiedUid: string | null = null;

    // Verify Supabase Auth JWT if provided
    if (authHeader) {
      try {
        const verified = await verifySupabaseAuthToken(authHeader);
        verifiedUid = verified.supabaseUid;
      } catch (err: any) {
        console.warn('[ASSET_SCANNER_PROCESS] Auth token invalid or expired, treating as anonymous:', err?.message);
      }
    }

    const body = await request.json();
    const parsed = ProcessRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_FAILED',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { uploadId, fileType, filename, base64Data, textContent, sessionId } = parsed.data;

    // Run extraction pipeline
    const extraction = await extractAssetFromUpload({
      uploadId,
      fileType: fileType as AssetScannerFileType,
      filename,
      base64Data,
      textContent,
      ownerUid: verifiedUid,
    });

    // Persist to Firestore for authenticated members
    let persistedAssetId: string | null = null;
    let persistError: string | null = null;

    if (verifiedUid) {
      const { assetId, error } = await createEstateAsset(verifiedUid, extraction.asset);
      persistedAssetId = assetId;
      persistError = error;
      if (error) {
        console.error('[ASSET_SCANNER_PROCESS] Firestore persist failed:', error);
      } else {
        // Insert lightweight pointer record into Supabase Workspace
        try {
          const session = getMemberSessionFromRequest(request);
          let memberId = session?.memberId;
          if (!memberId) {
            const member = await getMemberById(verifiedUid);
            memberId = member?.id;
          }
          if (memberId) {
            const assetTitle =
              [extraction.asset.manufacturer, extraction.asset.model || extraction.asset.assetType]
                .filter(Boolean)
                .join(' ') || extraction.matchedDefinition?.name || 'Scanned Equipment';

            await saveToolOutput(memberId, {
              tool_name: 'asset-scanner',
              title: `Scanned: ${assetTitle}`,
              summary_kpis: {
                assetType: extraction.asset.assetType || 'Plant Equipment',
                manufacturer: extraction.asset.manufacturer || 'Unspecified',
                model: extraction.asset.model || 'Unspecified',
                serialNumber: extraction.asset.serialNumber || 'Unspecified',
                categoryName: extraction.matchedDefinition?.categoryName || 'General M&E',
                sfg20AssetId: extraction.asset.sfg20AssetId || extraction.matchedDefinition?.id || 'General',
                firestoreAssetId: persistedAssetId,
                confidence: extraction.asset.extractionConfidence,
                scannedAt: new Date().toISOString(),
              },
              inputs_json: { filename, fileType },
              outputs_json: {
                firestoreAssetId: persistedAssetId,
                matchedCategoryId: extraction.matchedDefinition?.categoryId,
                matchedCategoryName: extraction.matchedDefinition?.categoryName,
                sfg20AssetId: extraction.asset.sfg20AssetId,
              },
              pdf_reference: null,
            });
          }
        } catch (wsErr: any) {
          console.error('[ASSET_SCANNER_WORKSPACE_HOOK_ERROR]:', wsErr);
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          asset: { ...extraction.asset, id: persistedAssetId ?? undefined },
          matchedDefinition: extraction.matchedDefinition,
          engineUsed: extraction.engineUsed,
          processingTimeMs: extraction.processingTimeMs,
          ownerUid: verifiedUid,
          sessionId: sessionId || null,
          persisted: verifiedUid ? (persistedAssetId !== null) : false,
          persistError: persistError ?? undefined,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[ASSET_SCANNER_PROCESS_EXCEPTION]:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'PROCESSING_ERROR',
        message: err?.message || 'Failed to process asset scan',
      },
      { status: 500 }
    );
  }
}
