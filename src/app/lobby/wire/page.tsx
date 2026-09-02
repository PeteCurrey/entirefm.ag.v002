import type { Metadata } from 'next';
import { getGroupedWeeklyWire, getPeopleMovesWire } from '@/server/wire/wire-store';
import { TemplateTheWire } from '@/templates/wire/TemplateTheWire';

export const metadata: Metadata = {
  title: 'The Wire — UK FM People Moves & Senior Appointments | The Lobby',
  description: 'Weekly digest of executive appointments, promotions, and strategic people moves across UK facilities management.',
};

export default async function LobbyWirePage() {
  const weeklyGroups = await getGroupedWeeklyWire();
  const latestItems = await getPeopleMovesWire(20);

  return <TemplateTheWire weeklyGroups={weeklyGroups} latestItems={latestItems} />;
}
