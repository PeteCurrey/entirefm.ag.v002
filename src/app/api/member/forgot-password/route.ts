import { NextResponse } from 'next/server';
import { getMemberByEmail } from '@/server/member/member-store';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const member = await getMemberByEmail(email);

    // Generic privacy-preserving message to prevent email enumeration
    return NextResponse.json({
      success: true,
      message:
        'If an account exists with this email address, password reset instructions have been dispatched.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unable to process password reset request.' },
      { status: 500 }
    );
  }
}
