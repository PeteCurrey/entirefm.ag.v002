import { NextRequest, NextResponse } from 'next/server';
import { getRoiWhyThisWorksContext } from '@/server/ai/roi/roi-context';

export const revalidate = 86400; // 24 hours

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const band = searchParams.get('band') || 'multi';

    const data = await getRoiWhyThisWorksContext(band);

    return NextResponse.json(
      {
        success: true,
        ...data,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      }
    );
  } catch (err: any) {
    console.error('[ROI Market Context API Error]:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate operational context commentary',
      },
      { status: 500 }
    );
  }
}
