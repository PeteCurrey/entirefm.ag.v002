import { NextResponse } from 'next/server';
import { getAllMembers } from '@/server/member/member-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const discipline = searchParams.get('discipline') || undefined;

  const all = await getAllMembers();
  let members = all.filter((m) => m.member_status === 'active' && m.profile_visibility === 'public');

  if (q) {
    members = members.filter(
      (m) =>
        m.display_name.toLowerCase().includes(q) ||
        (m.headline && m.headline.toLowerCase().includes(q)) ||
        (m.company && m.company.toLowerCase().includes(q))
    );
  }

  if (discipline) {
    members = members.filter((m) => m.disciplines?.some((d) => d.toLowerCase() === discipline.toLowerCase()));
  }

  // Sanitize for public view
  const publicProfiles = members.map((m) => ({
    id: m.id,
    display_name: m.display_name,
    headline: m.headline,
    company: m.company,
    avatar_url: m.avatar_url,
    disciplines: m.disciplines,
    badges: m.badges,
    reputation_score: m.reputation_score,
    joined_at: m.joined_at,
  }));

  return NextResponse.json({ members: publicProfiles });
}
