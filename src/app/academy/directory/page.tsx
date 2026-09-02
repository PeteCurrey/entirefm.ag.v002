import type { Metadata } from 'next';
import { TemplateMembersDirectory } from '@/templates/discovery/TemplateMembersDirectory';

export const metadata: Metadata = {
  title: 'Certified Practitioners Directory | EntireFM Academy',
  description:
    'Search certified FM professionals who have completed EntireFM Academy learning paths and passed proctored compliance assessments.',
  openGraph: {
    title: 'Certified Practitioners Directory | EntireFM Academy',
    description:
      'Search certified FM professionals who have completed EntireFM Academy learning paths and passed proctored compliance assessments.',
  },
};

export default function AcademyDirectoryPage() {
  return <TemplateMembersDirectory />;
}
