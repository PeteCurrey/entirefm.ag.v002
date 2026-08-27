import { TemplateCommunityCompose } from '@/templates/community/TemplateCommunityCompose';

export const metadata = {
  title: 'Start a Discussion | The Lobby Community — EntireFM',
  description: 'Ask a technical question to verified UK facilities management practitioners.',
  robots: { index: false, follow: false },
};

export default function ComposePage() {
  return <TemplateCommunityCompose />;
}
