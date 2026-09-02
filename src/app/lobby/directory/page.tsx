import type { Metadata } from 'next';
import { TemplateMembersDirectory } from '@/templates/discovery/TemplateMembersDirectory';

export const metadata: Metadata = {
  title: 'FM Practitioner Directory | The Lobby — EntireFM',
  description:
    'Search and connect with verified UK facilities managers, hard FM engineers, and compliance leaders holding certified Academy credentials.',
  openGraph: {
    title: 'FM Practitioner Directory | EntireFM Lobby',
    description:
      'Search and connect with verified UK facilities managers, hard FM engineers, and compliance leaders holding certified Academy credentials.',
  },
};

export default function LobbyDirectoryPage() {
  return <TemplateMembersDirectory />;
}
