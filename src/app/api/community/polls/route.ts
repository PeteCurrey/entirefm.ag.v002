import { NextResponse } from 'next/server';
import { getActivePoll, getPollArchive, hasMemberVotedPoll } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  const activePoll = getActivePoll();
  const archive = getPollArchive();

  const userVoted = session && activePoll ? hasMemberVotedPoll(activePoll.id, session.memberId) : false;

  return NextResponse.json({
    activePoll,
    archive,
    userVoted,
  });
}
