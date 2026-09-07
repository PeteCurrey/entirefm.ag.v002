import { NextRequest, NextResponse } from 'next/server';
import { getPpmMarketContext } from '@/server/ai/ppm/market-context';

export const revalidate = 86400; // 24 hours

const SECTOR_NAMES: Record<string, string> = {
  office: 'Commercial Office / Corporate HQ',
  industrial: 'Industrial & Manufacturing Facility',
  logistics: 'Logistics & Distribution Warehousing',
  retail: 'Retail & Shopping Centres',
  healthcare: 'Healthcare & Clinical Environments',
  hospitality: 'Hotels & Hospitality Estates',
  education: 'Education & University Campuses',
};

const REGION_NAMES: Record<string, string> = {
  london: 'Greater London (Zones 1–6 & M25)',
  south_east: 'South East & Home Counties',
  midlands: 'Midlands (Birmingham, Nottingham, Derby)',
  north_west: 'North West (Manchester, Liverpool)',
  yorkshire: 'Yorkshire & Humber (Leeds, Sheffield, Doncaster)',
  north_east: 'North East & Scotland Corridor',
  national: 'UK Nationwide Multi-Site Portfolio',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectorKey = searchParams.get('sector') || 'office';
    const regionKey = searchParams.get('region') || 'london';

    const sectorName = SECTOR_NAMES[sectorKey] || SECTOR_NAMES.office;
    const regionName = REGION_NAMES[regionKey] || REGION_NAMES.london;

    const data = await getPpmMarketContext(sectorKey, sectorName, regionKey, regionName);

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
    console.error('[PPM Market Context API Error]:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate market context',
      },
      { status: 500 }
    );
  }
}
