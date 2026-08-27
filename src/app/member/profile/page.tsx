'use client';

import { Suspense } from 'react';
import { TemplateMemberProfile } from '@/templates/member/TemplateMemberProfile';

export default function MemberProfilePage() {
  return (
    <Suspense fallback={null}>
      <TemplateMemberProfile />
    </Suspense>
  );
}
