import React from 'react';
import type { Metadata } from 'next';
import { listDefects } from '@/server/field';
import { DefectsPageClient } from './DefectsPageClient';

export const metadata: Metadata = {
  title: 'Defects & Remedial Actions | EntireFM Operations',
  description: 'Physical flaws, safety hazards, and statutory non-compliances logged from field observations.',
};

export const dynamic = 'force-dynamic';

export default async function DefectsPage() {
  const defects = await listDefects();

  return <DefectsPageClient initialDefects={defects} />;
}
