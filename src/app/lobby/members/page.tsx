import { Suspense } from 'react';
import { TemplateMembersDirectory } from '@/templates/discovery/TemplateMembersDirectory';

export const metadata = {
  title: 'Practitioner Directory | The Lobby — EntireFM',
  description: 'Connect directly with verified UK facilities managers, hard FM engineers, and compliance leaders.',
};

export default function MembersDirectoryPage() {
  return (
    <Suspense fallback={null}>
      <TemplateMembersDirectory />
    </Suspense>
  );
}
