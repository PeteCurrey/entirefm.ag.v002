import { NextResponse } from 'next/server';
import { getActiveChallenge, getMemberChallengeResponse } from '@/server/community/community-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';

export async function GET(request: Request) {
  const session = getMemberSessionFromRequest(request);
  const challenge = getActiveChallenge();

  if (!challenge) {
    return NextResponse.json({ challenge: null });
  }

  // Obfuscate correct option from client payload until answered
  const publicChallenge = {
    id: challenge.id,
    weekNumber: challenge.weekNumber,
    year: challenge.year,
    title: challenge.title,
    question: challenge.question,
    scenario: challenge.scenario,
    topic: challenge.topic,
    difficulty: challenge.difficulty,
    points: challenge.points,
    options: challenge.options,
    status: challenge.status,
  };

  let userResponse = null;
  if (session) {
    userResponse = getMemberChallengeResponse(challenge.id, session.memberId);
  }

  return NextResponse.json({
    challenge: publicChallenge,
    userResponse: userResponse
      ? {
          isCorrect: userResponse.isCorrect,
          explanation: challenge.explanation,
          technicalWhy: challenge.technicalWhy,
          sourceReferences: challenge.sourceReferences,
          selectedOptionId: userResponse.selectedOptionId,
        }
      : null,
  });
}
