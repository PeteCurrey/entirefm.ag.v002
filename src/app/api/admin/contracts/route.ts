import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listContracts, createContract } from '@/server/estate';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const clientAccountId = searchParams.get('clientAccountId') || undefined;
    const contracts = await listContracts(clientAccountId);
    return NextResponse.json({ success: true, contracts });
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
      client_account_id,
      name,
      contract_reference,
      contract_type,
      start_date,
      end_date,
      billing_method,
      annual_value_gbp,
    } = body;

    if (!client_account_id || !name || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, error: 'client_account_id, name, start_date, and end_date are required.' },
        { status: 400 }
      );
    }

    const contract = await createContract({
      client_account_id,
      name: name.trim(),
      contract_reference,
      contract_type,
      start_date,
      end_date,
      billing_method,
      annual_value_gbp: annual_value_gbp ? Number(annual_value_gbp) : undefined,
    });

    return NextResponse.json({ success: true, contract }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
