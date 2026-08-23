import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import EngineerShell from '@/components/engineer/EngineerShell';

export const metadata: Metadata = {
  title: 'EntireFM Field',
  description: 'Field Engineer Application',
  robots: { index: false, follow: false, nocache: true },
  other: { 'mobile-web-app-capable': 'yes', 'apple-mobile-web-app-capable': 'yes', 'apple-mobile-web-app-status-bar-style': 'black-translucent' },
};

export default async function EngineerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  return (
    <EngineerShell session={{ personId: session.personId, displayName: session.name ?? 'Engineer' }}>
      {children}
    </EngineerShell>
  );
}
