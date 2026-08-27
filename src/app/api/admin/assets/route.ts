import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listAssets, createAsset } from '@/server/estate';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId') || undefined;
    const category = searchParams.get('category') || undefined;
    const criticality = searchParams.get('criticality') || undefined;
    const assets = await listAssets({ siteId, category, criticality });
    return NextResponse.json({ success: true, assets });
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
      site_id,
      name,
      category,
      asset_reference,
      system_category,
      building_id,
      space_id,
      manufacturer,
      model_number,
      serial_number,
      condition,
      criticality,
      statutory_compliance_required,
    } = body;

    if (!site_id || !name || !category) {
      return NextResponse.json(
        { success: false, error: 'site_id, name, and category are required.' },
        { status: 400 }
      );
    }

    const asset = await createAsset({
      site_id,
      name: name.trim(),
      category: category.trim(),
      asset_reference,
      system_category,
      building_id,
      space_id,
      manufacturer,
      model_number,
      serial_number,
      condition,
      criticality,
      statutory_compliance_required,
    });

    return NextResponse.json({ success: true, asset }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
