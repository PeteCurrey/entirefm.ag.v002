import { Metadata } from 'next';
import {
  getLatestSnapshot,
  getSnapshotHistory,
  getAdminCutCounts,
} from '@/server/benchmarking/survey-store';
import { AdminPulseClient } from '@/components/admin/pulse/AdminPulseClient';

export const metadata: Metadata = {
  title: 'Pulse Survey Health & Suppression Monitor | EntireFM Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminPulsePage() {
  const year = 2026;

  const [latestSnapshot, history, cutCounts] = await Promise.all([
    getLatestSnapshot(year).catch(() => null),
    getSnapshotHistory(year).catch(() => []),
    getAdminCutCounts(year).catch(() => ({
      year,
      totalRows: 0,
      suspiciousRowCount: 0,
      salaryBand: [],
      teamSize: [],
      primarySector: [],
      biggestChallenge: [],
      technologyAdoptionLevel: [],
      sustainabilityTargetYear: [],
      region: [],
    })),
  ]);

  return (
    <AdminPulseClient
      initialCutCounts={cutCounts}
      initialLatestSnapshot={latestSnapshot}
      initialHistory={history}
    />
  );
}
