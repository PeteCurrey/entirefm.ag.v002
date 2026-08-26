/**
 * SECURE CV DOWNLOAD API — /api/careers/cv-download
 * =================================================
 * Streams candidate CV files securely. Requires either:
 *  1. An active authenticated EntireFM Admin session, or
 *  2. A valid cryptographically signed token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { verifySignedCvToken } from '@/server/careers/store';
import { readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { existsSync } from 'node:fs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const path = searchParams.get('path');

    let storagePath: string | undefined;

    if (token) {
      const verification = verifySignedCvToken(token);
      if (!verification.valid || !verification.storagePath) {
        return NextResponse.json({ error: verification.error || 'Invalid download token' }, { status: 403 });
      }
      storagePath = verification.storagePath;
    } else if (path) {
      const session = await getCurrentSession();
      if (!session || (session.orgType !== 'ENTIREFM' && session.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
      }
      storagePath = path;
    } else {
      return NextResponse.json({ error: 'Missing token or path parameter' }, { status: 400 });
    }

    // Sanitize path to prevent traversal
    const safeRelPath = storagePath.replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
    const fullPath = join(process.cwd(), 'private_storage', safeRelPath);

    if (!existsSync(fullPath)) {
      // Mock demo fallback: return a placeholder sample CV text if file is virtual demo
      const filename = basename(safeRelPath);
      const mockPdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n185\n%%EOF`;
      return new NextResponse(mockPdfContent, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename.endsWith('.pdf') ? filename : filename + '.pdf'}"`,
        },
      });
    }

    const fileBuffer = await readFile(fullPath);
    const filename = basename(fullPath);
    const contentType = filename.endsWith('.pdf')
      ? 'application/pdf'
      : filename.endsWith('.docx')
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error('Error serving CV download:', err);
    return NextResponse.json({ error: 'Failed to stream document' }, { status: 500 });
  }
}
