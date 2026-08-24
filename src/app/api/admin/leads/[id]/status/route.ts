import { NextResponse } from 'next/server';
import { setLeadStatus } from '@/lib/leads/store';
import { markNotificationRead } from '@/server/notifications';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const leadId = resolvedParams.id;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    await setLeadStatus(leadId, status);

    // If marked as contacted or qualified, also mark its notification as read
    await markNotificationRead(`lead:${leadId}:new`).catch(() => {});

    return NextResponse.json({
      success: true,
      leadId,
      status,
      message: `Lead ${leadId} status updated to ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update lead status' },
      { status: 500 }
    );
  }
}
