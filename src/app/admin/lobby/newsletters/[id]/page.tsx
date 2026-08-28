import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEditionById } from '@/server/lobby-daily/store';
import { LobbyDailyEditionEditor } from '@/components/admin/LobbyDailyEditionEditor';

export const metadata: Metadata = {
  title: 'Edit Edition | The Lobby Daily Admin',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LobbyDailyEditionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const edition = await getEditionById(id);

  if (!edition) {
    notFound();
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <LobbyDailyEditionEditor edition={edition} />
    </main>
  );
}
