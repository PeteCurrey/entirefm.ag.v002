import { NextRequest, NextResponse } from 'next/server';
import { listSupplierRfis, respondToSupplierRfi } from '@/server/suppliers/rfi-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get('supplierId');
    if (!supplierId) {
      return NextResponse.json({ error: 'supplierId parameter required' }, { status: 400 });
    }

    const rfis = await listSupplierRfis(supplierId);
    return NextResponse.json({ rfis });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rfiId, supplierId, responseText, documentId } = body;

    if (!rfiId || !supplierId || !responseText) {
      return NextResponse.json(
        { error: 'rfiId, supplierId, and responseText are required' },
        { status: 400 }
      );
    }

    const result = await respondToSupplierRfi(rfiId, supplierId, responseText, documentId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      rfi: result.rfi,
      message: 'Information submitted successfully for review without any additional fee.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
