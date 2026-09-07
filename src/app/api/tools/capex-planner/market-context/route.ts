import { NextRequest, NextResponse } from 'next/server';
import { getCapexLifecycleContext } from '@/server/ai/capex/capex-context';

export const revalidate = 86400; // 24 hours

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profile = searchParams.get('profile') || 'balanced_estate';

    const data = await getCapexLifecycleContext(profile);

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
    console.error('[CAPEX Lifecycle Context API Error]:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate operational lifecycle context commentary',
      },
      { status: 500 }
    );
  }
}
