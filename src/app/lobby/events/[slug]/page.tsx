import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CANONICAL_FEATURED_EVENTS } from '@/server/events/event-rsvp-store';
import { TemplateEventDetail } from '@/templates/events/TemplateEventDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = CANONICAL_FEATURED_EVENTS[slug];

  if (!event) {
    return { title: 'Event Not Found | The Lobby' };
  }

  return {
    title: `${event.title} | The Lobby Events — EntireFM`,
    description: event.description.slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = CANONICAL_FEATURED_EVENTS[slug];

  if (!event) {
    notFound();
  }

  return <TemplateEventDetail event={event} />;
}
