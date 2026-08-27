import { TemplateMemberSettings } from '@/templates/member/TemplateMemberSettings';

export const metadata = {
  title: 'Account Settings | The Lobby — EntireFM',
  description: 'Manage your Lobby Member preferences, email subscriptions and privacy settings.',
  robots: { index: false, follow: false },
};

export default function MemberSettingsPage() {
  return <TemplateMemberSettings />;
}
