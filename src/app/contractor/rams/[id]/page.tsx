import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect, notFound } from 'next/navigation';
import { getRamsRecordById } from '@/server/contractor/rams-service';
import { RamsDetailClient } from '@/components/contractor/RamsDetailClient';

export const metadata: Metadata = {
  title: 'RAMS Pack Detail | EntireFM Contractor Platform',
  description: 'Digital Risk Assessment, Method Statement, and Operative Safety Register.',
};

export const dynamic = 'force-dynamic';

export default async function RamsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/rams');

  const { id } = await params;
  const rams = await getRamsRecordById(id, session);

  if (!rams) {
    notFound();
  }

  const isContractorUser = session.orgType === 'CONTRACTOR';

  return (
    <RamsDetailClient
      rams={rams}
      currentPersonId={session.personId}
      isContractorUser={isContractorUser}
    />
  );
}
