'use client';

import { Suspense } from 'react';
import { TemplateMemberAssetDetail } from '@/templates/member/TemplateMemberAssetDetail';

export default function MemberAssetDetailPage() {
  return (
    <Suspense fallback={null}>
      <TemplateMemberAssetDetail />
    </Suspense>
  );
}
