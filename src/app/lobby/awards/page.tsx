import type { Metadata } from 'next';
import { getIndustryAwards, getClosingSoonAwards } from '@/server/awards/awards-store';
import { TemplateAwardsHome } from '@/templates/awards/TemplateAwardsHome';

export const metadata: Metadata = {
  title: 'UK Facilities Management Awards & Deadlines | The Lobby',
  description: 'Independent directory of UK facilities management awards, entry submission windows, shortlists, and ceremony benchmarks.',
};

export default function LobbyAwardsPage() {
  const { awards } = getIndustryAwards({ limit: 50 });
  const closingSoon = getClosingSoonAwards();

  return (
    <TemplateAwardsHome
      awards={awards}
      closingSoon={closingSoon}
    />
  );
}
