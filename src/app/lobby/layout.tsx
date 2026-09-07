import React from 'react';
import { LobbyHeader } from '@/components/lobby/LobbyHeader';

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialDateStr = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).format(new Date());

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <LobbyHeader initialDateStr={initialDateStr} />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
