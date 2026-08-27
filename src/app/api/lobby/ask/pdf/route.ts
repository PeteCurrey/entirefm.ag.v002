/**
 * POST /api/lobby/ask/pdf
 * ========================
 * Generates an EntireFM-branded research brief HTML/PDF report stream for download.
 */

import { NextResponse } from 'next/server';
import { buildAskLobbyPdfDefinition } from '@/lib/pdf/ask-lobby-pdf';
import { buildHtmlReport } from '@/lib/pdf/generator';
import type { StructuredAskAnswer } from '@/server/ask/types';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { answer } = body as { answer: StructuredAskAnswer };

    if (!answer || !answer.question || !answer.shortAnswer) {
      return NextResponse.json(
        { error: 'Valid answer snapshot required to generate PDF' },
        { status: 400 }
      );
    }

    const { doc, filename } = buildAskLobbyPdfDefinition(answer);
    const html = buildHtmlReport(doc);

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${filename}.html"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
