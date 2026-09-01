import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listClientAccounts, createClientAccount } from '@/server/estate';
import { sendAdminSignupAlert } from '@/server/notifications/admin-alert';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const clients = await listClientAccounts();
    return NextResponse.json({ success: true, clients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, account_tier, account_status, email, phone, organisation_code } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Client name is required.' }, { status: 400 });
    }

    const client = await createClientAccount({
      name: name.trim(),
      account_tier,
      account_status,
      email,
      phone,
      organisation_code,
    });

    // Dispatch Admin Notification (Client Account Created)
    sendAdminSignupAlert({
      type: 'CLIENT_CREATED',
      name: name.trim(),
      email: email || session?.email || 'helpdesk@entirefm.com',
      company: name.trim(),
      phone,
      referenceId: client?.account_number || client?.id || 'CLIENT-NEW',
      actionUrl: '/admin/estate/clients',
      details: {
        'Tier': account_tier || 'STANDARD',
        'Status': account_status || 'ACTIVE',
        'Created By Admin': session.name || session.email,
      },
    }).catch((err) => console.error('[ADMIN_ALERT_ERROR: Client Created]', err));

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
