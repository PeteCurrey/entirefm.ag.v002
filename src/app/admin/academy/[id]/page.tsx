import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPathById, getAdminAssessment } from '@/server/academy/academy-store';
import { AdminAcademyEditorClient } from './AdminAcademyEditorClient';

export const metadata: Metadata = {
  title: 'Edit Learning Path & Assessment | EntireFM Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminAcademyPathEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === 'new';

  if (isNew) {
    const emptyPath = {
      id: 'new',
      slug: '',
      title: '',
      description: '',
      targetRole: '',
      modules: [],
      passMarkPercent: 80,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return <AdminAcademyEditorClient initialPath={emptyPath} initialAssessment={null} isNew={true} />;
  }

  const path = await getPathById(id);
  if (!path) {
    notFound();
  }

  const assessment = await getAdminAssessment(path.id);

  return (
    <AdminAcademyEditorClient
      initialPath={path}
      initialAssessment={assessment}
      isNew={false}
    />
  );
}
