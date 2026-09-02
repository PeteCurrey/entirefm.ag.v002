import { TemplateRoomLive } from '@/templates/rooms/TemplateRoomLive';
import { getAllRooms } from '@/server/rooms/room-store';

export async function generateStaticParams() {
  const rooms = await getAllRooms();
  return rooms.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rooms = await getAllRooms();
  const found = rooms.find((r) => r.slug === slug);
  return {
    title: `${found ? found.name : 'Live Room'} | The Lobby — EntireFM`,
    description: found?.description || 'Live technical FM room.',
  };
}

export default async function RoomLivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TemplateRoomLive slug={slug} />;
}
