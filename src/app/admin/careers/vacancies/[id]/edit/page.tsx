import React from 'react';
import { notFound } from 'next/navigation';
import { getVacancyById } from '@/server/careers/store';
import { VacancyEditorClient } from '../../VacancyEditorClient';

interface EditVacancyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVacancyPage({ params }: EditVacancyPageProps) {
  const { id } = await params;
  const vacancy = await getVacancyById(id);

  if (!vacancy) {
    notFound();
  }

  return <VacancyEditorClient initialVacancy={vacancy} isNew={false} />;
}
