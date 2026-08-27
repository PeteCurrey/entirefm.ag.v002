import { Metadata } from 'next';
import { TemplateLobbyToday } from '@/templates/lobby/TemplateLobbyToday';

export const metadata: Metadata = {
  title: 'What Changed Today | The Lobby · EntireFM Intelligence',
  description: 'Daily facilities management control centre: statutory changes, public procurement awards, parliament watch, and safety alerts.',
};

export default function LobbyTodayPage() {
  return <TemplateLobbyToday />;
}
