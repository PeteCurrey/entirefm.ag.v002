import { Suspense } from 'react';
import { TemplateLobbySearch } from '@/templates/discovery/TemplateLobbySearch';

export const metadata = {
  title: 'Search The Lobby | EntireFM',
  description: 'Search statutory compliance, field engineering guides, active discussions, FM calculators, and expert practitioners.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <TemplateLobbySearch />
    </Suspense>
  );
}
