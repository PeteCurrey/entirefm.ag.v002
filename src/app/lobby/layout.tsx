import React from 'react';
import { LobbyHeader } from '@/components/lobby/LobbyHeader';

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <LobbyHeader />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
