import { NextRequest, NextResponse } from 'next/server';
import { revokeInvitationCode } from '@/server/invitations/invitation-codes';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Invitation ID required' }, { status: 400 });
    }

    const body = await req.json();
    if (body.isRevoked !== true && body.is_revoked !== true) {
      return NextResponse.json(
        { error: 'Only revocation (isRevoked: true) is supported' },
        { status: 400 }
      );
    }

    const success = await revokeInvitationCode(id);
    if (!success) {
      return NextResponse.json(
        { error: 'Invitation code not found or already revoked' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation code has been revoked.',
    });
  } catch (err: any) {
    console.error('Error revoking invitation code:', err);
    return NextResponse.json(
      { error: err.message || 'Server error revoking invitation code' },
      { status: 500 }
    );
  }
}
