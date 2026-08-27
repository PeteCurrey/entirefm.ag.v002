import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect, notFound } from 'next/navigation';
import { getJobPackById, assembleJobPack } from '@/server/contractor/job-pack-engine';
import { JobPackDetailClient } from '@/components/contractor/JobPackDetailClient';

export const metadata: Metadata = {
  title: 'Job Pack Details | EntireFM Contractor Platform',
  description: 'Work-Ready Pre-Attendance Safety Pack and Evidence Checklist.',
};

export const dynamic = 'force-dynamic';

export default async function JobPackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/job-packs');

  const { id } = await params;
  let pack = await getJobPackById(id, session);

  // If not found by JobPack ID, attempt to assemble by workOrderId
  if (!pack) {
    try {
      pack = await assembleJobPack(id, session);
    } catch {
      notFound();
    }
  }

  if (!pack) notFound();

  return (
    <JobPackDetailClient
      jobPack={pack}
      currentPersonId={session.personId}
    />
  );
}
