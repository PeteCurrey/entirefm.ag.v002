import { NextResponse } from 'next/server';
import { getEditionById } from '@/server/lobby-daily/store';
import { renderDailyEmailHtml, renderDailyEmailText } from '@/server/lobby-daily/email-renderer';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const format = searchParams.get('format') || 'html';

  if (!id) {
    return new NextResponse('Edition ID is required', { status: 400 });
  }

  const edition = await getEditionById(id);
  if (!edition) {
    return new NextResponse('Edition not found', { status: 404 });
  }

  if (format === 'raw-html') {
    const html = renderDailyEmailHtml(edition, { previewMode: true });
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  if (format === 'text') {
    const text = renderDailyEmailText(edition, { subscriberToken: 'preview' });
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const html = renderDailyEmailHtml(edition, { previewMode: true });
  const text = renderDailyEmailText(edition, { subscriberToken: 'preview' });

  return NextResponse.json({
    html,
    text,
    edition,
  });
}
