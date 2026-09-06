import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getSite, updateSite } from '@/server/estate';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const site = await getSite(id);
    if (!site) {
      return NextResponse.json({ success: false, error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, site });
  } catch (error: any) {
    console.error('[SITE_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await getSite(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Site not found' }, { status: 404 });
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
      status,
    } = body;

    const updated = await updateSite(id, {
      name: name !== undefined ? name.trim() : undefined,
      site_code: site_code !== undefined ? site_code.trim() : undefined,
      client_account_id: client_account_id !== undefined ? (client_account_id ? client_account_id : null) : undefined,
      portfolio_id: portfolio_id !== undefined ? (portfolio_id ? portfolio_id : null) : undefined,
      site_type,
      address_line1: address_line1 !== undefined ? address_line1.trim() : undefined,
      address_line2: address_line2 !== undefined ? address_line2.trim() : undefined,
      city: city !== undefined ? city.trim() : undefined,
      county: county !== undefined ? county.trim() : undefined,
      postcode: postcode !== undefined ? postcode.trim() : undefined,
      country,
      access_instructions,
      security_clearance_required,
      status,
    });

    return NextResponse.json({ success: true, site: updated });
  } catch (error: any) {
    console.error('[SITE_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
