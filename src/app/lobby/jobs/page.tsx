import type { Metadata } from 'next';
import { getJobListings } from '@/server/jobs/jobs-store';
import { TemplateJobsDirectory } from '@/templates/jobs/TemplateJobsDirectory';

export const metadata: Metadata = {
  title: 'UK Facilities Management Jobs Board | The Lobby — EntireFM',
  description: 'Verified opportunities across commercial estates, M&E engineering, statutory building safety, and operational FM leadership.',
};

export const dynamic = 'force-dynamic';

export default async function LobbyJobsPage() {
  const { jobs, total } = await getJobListings({ limit: 50 });
  return <TemplateJobsDirectory initialJobs={jobs} total={total} />;
}
