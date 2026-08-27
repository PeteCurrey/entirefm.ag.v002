import { TemplateMyLobby } from '@/templates/discovery/TemplateMyLobby';

export const metadata = {
  title: 'My Lobby | EntireFM',
  description: 'Your personal facilities management reading room, saved library, following topics, and activity.',
  robots: { index: false, follow: false },
};

export default function MyLobbyPage() {
  return <TemplateMyLobby />;
}
