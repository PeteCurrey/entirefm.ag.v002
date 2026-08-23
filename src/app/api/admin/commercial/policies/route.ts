import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await dbQuery<any[]>('commercial_policies?select=*&order=created_at.desc');
  return NextResponse.json({ data: data || [] });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      scopeLevel,
      clientAccountId,
      contractId,
      minMarginPct,
      targetMarginPct,
      quoteApprovalThresholdGbp,
      poApprovalThresholdGbp,
      materialMarkupPct,
      subcontractMarkupPct,
    } = body;

    const record = {
      name: name || 'Custom Commercial Policy',
      scope_level: scopeLevel || 'PLATFORM',
      client_account_id: clientAccountId || null,
      contract_id: contractId || null,
      min_margin_pct: minMarginPct ?? 20.0,
      target_margin_pct: targetMarginPct ?? 35.0,
      quote_approval_threshold_gbp: quoteApprovalThresholdGbp ?? 2500.0,
      po_approval_threshold_gbp: poApprovalThresholdGbp ?? 1000.0,
      material_markup_pct: materialMarkupPct ?? 20.0,
      subcontract_markup_pct: subcontractMarkupPct ?? 15.0,
      is_active: true,
    };

    const { data, error } = await dbQuery('commercial_policies?select=*', {
      method: 'POST',
      body: JSON.stringify(record),
    });

    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 400 });
    }

    return NextResponse.json({ policy: data?.[0] }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
