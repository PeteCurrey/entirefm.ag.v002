import { NextRequest, NextResponse } from 'next/server';
import { getActivePulse, submitPulseVote } from '@/server/lobby/pulse-store';
import crypto from 'crypto';

function getOrCreateVoterHash(request: NextRequest): { hash: string; isNew: boolean } {
  const existing = request.cookies.get('lobby_pulse_voter')?.value;
  if (existing && existing.length >= 16) {
    return { hash: existing, isNew: false };
  }
  const random = crypto.randomBytes(16).toString('hex');
  return { hash: random, isNew: true };
}

export async function GET(request: NextRequest) {
  try {
    const { hash } = getOrCreateVoterHash(request);
    const poll = await getActivePulse(hash);

    const response = NextResponse.json({
      success: true,
      poll,
    });

    // Ensure visitor has a persistent voter token cookie
    if (!request.cookies.get('lobby_pulse_voter')) {
      response.cookies.set('lobby_pulse_voter', hash, {
        path: '/',
        maxAge: 60 * 60 * 24 * 90, // 90 days
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { hash } = getOrCreateVoterHash(request);
    const body = await request.json().catch(() => ({}));
    const { optionId, pollId = 'pulse-2026-08' } = body;

    if (!optionId) {
      return NextResponse.json({ error: 'Option selection is required' }, { status: 400 });
    }

    // Check if voter already has voted cookie for this poll
    const votedCookie = request.cookies.get(`lobby_pulse_voted_${pollId}`)?.value;
    if (votedCookie) {
      return NextResponse.json({ error: 'Already voted in this pulse survey' }, { status: 409 });
    }

    const updatedPoll = await submitPulseVote(pollId, optionId, hash);

    const response = NextResponse.json({
      success: true,
      poll: updatedPoll,
    });

    // Set voter tracking cookies
    response.cookies.set('lobby_pulse_voter', hash, {
      path: '/',
      maxAge: 60 * 60 * 24 * 90,
      httpOnly: true,
      sameSite: 'lax',
    });

    response.cookies.set(`lobby_pulse_voted_${pollId}`, '1', {
      path: '/',
      maxAge: 60 * 60 * 24 * 90,
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    const status = err.message?.includes('Already voted') ? 409 : 400;
    return NextResponse.json({ error: err.message || 'Failed to record vote' }, { status });
  }
}
