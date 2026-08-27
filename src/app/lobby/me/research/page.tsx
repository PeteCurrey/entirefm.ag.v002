import { Suspense } from 'react';
import { TemplateMemberResearchLibrary } from '@/templates/member/TemplateMemberResearchLibrary';

export const metadata = {
  title: 'My Research Library | The Lobby · EntireFM',
  description: 'Access your private saved Ask The Lobby research reports and download branded EntireFM briefings.',
};

export default function MemberResearchLibraryPage() {
  return (
    <Suspense fallback={null}>
      <TemplateMemberResearchLibrary />
    </Suspense>
  );
}
