import React from 'react';
import { listImportBatches } from '@/server/ppm';
import { ImportsPageClient } from './ImportsPageClient';

export const dynamic = 'force-dynamic';

export default async function ImportsPage() {
  const batches = await listImportBatches().catch(() => []);
  return <ImportsPageClient initialBatches={batches} />;
}
