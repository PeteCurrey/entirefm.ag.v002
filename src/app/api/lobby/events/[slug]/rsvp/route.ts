import { NextRequest, NextResponse } from 'next/server';
import { getEventRsvps, getMemberEventRsvp, setMemberEventRsvp } from '@/server/events/event-rsvp-store';
import { getMemberSessionFromRequest, requireActiveMemberSession } from '@/server/member/member-session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = getMemberSessionFromRequest(request);

    const rsvps = await getEventRsvps(slug);
    const memberStatus = session ? await getMemberEventRsvp(slug, session.memberId) : null;

    return NextResponse.json({
      success: true,
      ...rsvps,
      memberStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { session, error, status } = requireActiveMemberSession(request);
  if (!session) {
    return NextResponse.json({ error: error || 'Authentication required to RSVP' }, { status });
  }

  const { slug } = await params;

  try {
    const body = await request.json().catch(() => ({}));
    const rsvpStatus = body.status || 'attending';

    const result = await setMemberEventRsvp(slug, session.memberId, rsvpStatus);

    return NextResponse.json({
      success: true,
      status: result.status,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
