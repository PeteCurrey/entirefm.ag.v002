import { TemplateMessagesInbox } from '@/templates/messages/TemplateMessagesInbox';

export const metadata = {
  title: 'Conversation | The Lobby Messages — EntireFM',
  robots: { index: false, follow: false },
};

export default async function MessageThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TemplateMessagesInbox activeConversationId={id} />;
}
