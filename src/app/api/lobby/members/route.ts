import { NextResponse } from 'next/server';
import { getDirectoryMembers } from '@/server/member/member-store';
import { getMemberSessionFromRequest } from '@/server/member/member-session';
import { checkRateLimit, getClientIp } from '@/server/security/rate-limiter';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const session = getMemberSessionFromRequest(request);

  // Rate limit directory scraping: 30 requests per minute per IP
  const rateCheck = checkRateLimit(`directory:${clientIp}`, {
    limit: 30,
    windowMs: 60 * 1000,
    blockDurationMs: 5 * 60 * 1000,
  });

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || searchParams.get('query') || undefined;
  const certification = searchParams.get('certification') || searchParams.get('pathSlug') || undefined;
  const sector = searchParams.get('sector') || undefined;
  const location = searchParams.get('location') || searchParams.get('region') || undefined;

  const rawMembers = await getDirectoryMembers({
    query: q,
    pathSlug: certification,
    sector,
    location,
  });

  // Security & Privacy sanitisation:
  // 1. Never expose raw database UUIDs (id) - public identity is username
  // 2. Never expose emails or phone numbers
  // 3. For unauthenticated guests, limit batch size to 20 to prevent total scrape
  const limit = session && session.status === 'active' ? rawMembers.length : 20;
  const sanitized = rawMembers.slice(0, limit).map((m) => ({
    username: m.username,
    displayName: m.displayName,
    headline: m.headline,
    company: m.company,
    jobTitle: m.jobTitle,
    location: m.location,
    avatarUrl: m.avatarUrl,
    sectors: m.sectors,
    disciplines: m.disciplines,
    badges: m.badges,
    reputationScore: m.reputationScore,
    acceptedSolutionsCount: m.acceptedSolutionsCount,
    certifications: m.certifications,
    joinedAt: m.joinedAt,
  }));

  return NextResponse.json({
    success: true,
    count: sanitized.length,
    totalAvailable: rawMembers.length,
    members: sanitized,
  });
}
