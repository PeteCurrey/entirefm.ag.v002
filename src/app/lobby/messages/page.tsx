import { TemplateMessagesInbox } from '@/templates/messages/TemplateMessagesInbox';

export const metadata = {
  title: 'Direct Messages | The Lobby — EntireFM',
  description: 'Confidential 1:1 professional communication between Lobby members.',
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  return <TemplateMessagesInbox />;
}
