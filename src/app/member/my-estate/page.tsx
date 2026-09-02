'use client';

import { Suspense } from 'react';
import { TemplateMemberMyEstate } from '@/templates/member/TemplateMemberMyEstate';

export default function MemberMyEstatePage() {
  return (
    <Suspense fallback={null}>
      <TemplateMemberMyEstate />
    </Suspense>
  );
}
