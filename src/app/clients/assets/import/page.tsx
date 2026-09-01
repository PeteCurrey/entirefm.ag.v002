import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import { AssetImportClient } from '@/components/assets/AssetImportClient';

export const metadata: Metadata = {
  title: 'Import & Reconcile Assets — EntireFM CAFM',
  description: 'AI-assisted asset register import, duplicate detection, and automated QR generation.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function AssetImportPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?redirect=/clients/assets/import');
  }

  return (
    <AssetImportClient
      sessionUser={{
        id: session.personId || '',
        name: session.name,
        role: session.role,
        orgName: session.orgName,
      }}
    />
  );
}
