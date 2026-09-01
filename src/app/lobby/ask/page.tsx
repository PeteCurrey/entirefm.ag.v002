import { Suspense } from 'react';
import { Metadata } from 'next';
import { TemplateAskLobby } from '@/templates/ask/TemplateAskLobby';

export const metadata: Metadata = {
  title: 'Ask The Lobby | Grounded FM Research Desk · EntireFM',
  description: 'Grounded facilities management intelligence research desk: query UK building safety, statutory compliance, procurement tenders, and technical guidance with transparent citations.',
};

export default function AskLobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F7] pt-24 text-center font-normal text-xs text-neutral-400">Loading Ask The Lobby...</div>}>
      <TemplateAskLobby />
    </Suspense>
  );
}
