/**
 * ASSET SCANNER PROCESSING ENDPOINT — /api/tools/asset-scanner/process
 * ===================================================================
 * Invoked when an image, video frame, or PDF is uploaded.
 * Runs extraction pipeline, cross-references SFG20, and persists to Firestore.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { extractAssetFromUpload } from '@/server/asset-scanner/extractor';
import { verifySupabaseAuthToken } from '@/server/asset-scanner/auth-bridge';
import { AssetScannerFileType } from '@/types/asset-scanner';

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

    return NextResponse.json(
      {
        success: true,
        data: {
          asset: extraction.asset,
          matchedDefinition: extraction.matchedDefinition,
          engineUsed: extraction.engineUsed,
          processingTimeMs: extraction.processingTimeMs,
          ownerUid: verifiedUid,
          sessionId: sessionId || null,
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
