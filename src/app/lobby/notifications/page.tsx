import { TemplateNotifications } from '@/templates/discovery/TemplateNotifications';

export const metadata = {
  title: 'Notifications | The Lobby — EntireFM',
  description: 'Your Lobby activity, discussion replies, and compliance alerts.',
  robots: { index: false, follow: false },
};

export default function NotificationsPage() {
  return <TemplateNotifications />;
}
