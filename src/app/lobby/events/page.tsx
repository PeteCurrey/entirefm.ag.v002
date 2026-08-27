import { TemplateEventsDirectory } from '@/templates/discovery/TemplateEventsDirectory';

export const metadata = {
  title: 'Worth Attending | The Lobby Events — EntireFM',
  description: 'Curated UK facilities management exhibitions, regulator briefings, and technical symposia.',
};

export default function EventsPage() {
  return <TemplateEventsDirectory />;
}
