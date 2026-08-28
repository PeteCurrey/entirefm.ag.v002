import { NextResponse } from 'next/server';
import { opportunityStore } from '@/server/intelligence/opportunity-store';
import type { FMTradeCategory } from '@/server/intelligence/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as FMTradeCategory | null;
  const region = searchParams.get('region');
  const view = searchParams.get('view') || 'all';

  if (view === 'awards') {
    const awards = opportunityStore.getContractAwards(30);
    return NextResponse.json(
      { success: true, awards },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  }

  const tenders = opportunityStore.getActiveTenders({
    category: category || undefined,
    region: region || undefined,
    closingSoonOnly: view === 'closing_soon',
    limit: 50,
  });

  const awards = opportunityStore.getContractAwards(10);
  const counts = opportunityStore.getCounts();

  return NextResponse.json(
    {
      success: true,
      tenders,
      awards,
      counts,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
