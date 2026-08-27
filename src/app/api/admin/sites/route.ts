import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listSites, createSite } from '@/server/estate';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const clientAccountId = searchParams.get('clientAccountId') || undefined;
    const status = searchParams.get('status') || undefined;
    const sites = await listSites({ clientAccountId, status });
    return NextResponse.json({ success: true, sites });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      site_code,
      client_account_id,
      portfolio_id,
      site_type,
      address_line1,
      address_line2,
      city,
      county,
      postcode,
      country,
      access_instructions,
      security_clearance_required,
    } = body;

    if (!name || !address_line1 || !city || !postcode) {
      return NextResponse.json(
        { success: false, error: 'Name, address_line1, city, and postcode are required.' },
        { status: 400 }
      );
    }

    const site = await createSite({
      name: name.trim(),
      site_code,
      client_account_id,
      portfolio_id,
      site_type,
      address_line1,
      address_line2,
      city,
      county,
      postcode,
      country,
      access_instructions,
      security_clearance_required,
    });

    return NextResponse.json({ success: true, site }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
