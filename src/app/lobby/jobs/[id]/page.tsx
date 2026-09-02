import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJobListingBySlugOrId, getJobListings } from '@/server/jobs/jobs-store';
import { TemplateJobDetail } from '@/templates/jobs/TemplateJobDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobListingBySlugOrId(id);

  if (!job) {
    return { title: 'Job Not Found | The Lobby' };
  }

  return {
    title: `${job.title} at ${job.employerName} | The Lobby Jobs`,
    description: job.description.slice(0, 160),
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobListingBySlugOrId(id);

  if (!job) {
    notFound();
  }

  const { jobs: relatedJobs } = await getJobListings({
    discipline: job.disciplineTags[0],
    limit: 3,
  });

  return (
    <TemplateJobDetail
      job={job}
      relatedJobs={relatedJobs.filter((j) => j.id !== job.id)}
    />
  );
}
