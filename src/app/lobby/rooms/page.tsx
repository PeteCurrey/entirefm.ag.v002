import { TemplateRoomsDirectory } from '@/templates/rooms/TemplateRoomsDirectory';

export const metadata = {
  title: 'Live Realtime Rooms | The Lobby — EntireFM',
  description: 'Live subject and event roundtables for UK facilities managers and engineers.',
};

export default function RoomsPage() {
  return <TemplateRoomsDirectory />;
}
