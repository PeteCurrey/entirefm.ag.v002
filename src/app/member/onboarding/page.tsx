import { Suspense } from 'react';
import { TemplateMemberOnboarding } from '@/templates/member/TemplateMemberOnboarding';

export const metadata = {
  title: 'Welcome to The Lobby | EntireFM',
  description: 'Personalise your EntireFM Lobby intelligence and community experience.',
};

export default function MemberOnboardingPage() {
  return (
    <Suspense fallback={null}>
      <TemplateMemberOnboarding />
    </Suspense>
  );
}
