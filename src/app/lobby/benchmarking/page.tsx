import type { Metadata } from 'next';
import { getAnnualBenchmarkingReport } from '@/server/benchmarking/survey-store';
import { TemplateBenchmarkingReport } from '@/templates/benchmarking/TemplateBenchmarkingReport';

export const metadata: Metadata = {
  title: 'State of UK Facilities Management 2026 — Annual Benchmarks | The Lobby',
  description: 'Live operational benchmarks on salaries, contractor engineering workforce sizes, statutory Building Safety Act friction points, and CAFM adoption.',
};

export const dynamic = 'force-dynamic';

export default async function LobbyBenchmarkingPage() {
  const report = await getAnnualBenchmarkingReport(2026);
  return <TemplateBenchmarkingReport initialReport={report} hasMemberSession={true} />;
}
