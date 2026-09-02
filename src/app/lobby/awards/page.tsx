import type { Metadata } from 'next';
import { getIndustryAwards, getClosingSoonAwards } from '@/server/awards/awards-store';
import { TemplateAwardsHome } from '@/templates/awards/TemplateAwardsHome';

export const metadata: Metadata = {
  title: 'UK Facilities Management Awards & Deadlines | The Lobby',
  description: 'Independent directory of UK facilities management awards, entry submission windows, shortlists, and ceremony benchmarks.',
};

export const dynamic = 'force-dynamic';

export default async function LobbyAwardsPage() {
  const { awards } = await getIndustryAwards({ limit: 50 });
  const closingSoon = await getClosingSoonAwards();

  return (
    <TemplateAwardsHome
      awards={awards}
      closingSoon={closingSoon}
    />
  );
}
