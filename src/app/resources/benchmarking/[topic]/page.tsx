import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAnnualBenchmarkingReport } from '@/server/benchmarking/survey-store';
import type { ReportSection } from '@/server/benchmarking/types';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  EyeOff,
  Info,
  Building2,
  Wrench,
  Zap,
  Users,
  Briefcase,
  Share2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface TopicConfig {
  slug: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  description: string;
  sectionKey: 'salaryDistribution' | 'teamSizeDistribution' | 'sectorDistribution' | 'topChallenges' | 'technologyAdoption' | 'sustainabilityTargets';
  icon: any;
  metricUnit: string;
}

const TOPICS: Record<string, TopicConfig> = {
  'salaries': {
    slug: 'salaries',
    title: 'UK Facilities Management Salary Benchmarks 2026',
    subtitle: 'Practitioner-reported base salary bands across UK hard & soft FM leadership.',
    eyebrow: 'COMPENSATION BENCHMARKING',
    description: 'Empirical distribution of base compensation for FM managers, estate leads, and technical directors. All figures are drawn directly from verified Lobby survey respondents with privacy suppression for small cuts.',
    sectionKey: 'salaryDistribution',
    icon: Briefcase,
    metricUnit: 'practitioners in band',
  },
  'team-sizes': {
    slug: 'team-sizes',
    title: 'Contractor & In-House Engineering Team Sizes',
    subtitle: 'Direct and indirect workforce scale across UK commercial and public estates.',
    eyebrow: 'WORKFORCE BENCHMARKING',
    description: 'Operational team scale benchmarks across commercial portfolios, healthcare facilities, and educational campuses.',
    sectionKey: 'teamSizeDistribution',
    icon: Users,
    metricUnit: 'estates at scale',
  },
  'operational-challenges': {
    slug: 'operational-challenges',
    title: 'Top Operational Bottlenecks & Compliance Friction',
    subtitle: 'Primary statutory and operational challenges reported by estate leaders.',
    eyebrow: 'RISK & COMPLIANCE BENCHMARKING',
    description: 'First-party data on where UK facilities managers experience their greatest friction — from the Building Safety Act Golden Thread to engineering labour shortages.',
    sectionKey: 'topChallenges',
    icon: Wrench,
    metricUnit: 'citations as #1 priority',
  },
  'technology-adoption': {
    slug: 'technology-adoption',
    title: 'CAFM & IoT Telemetry Adoption Rates',
    subtitle: 'Digital maturity: from paper and spreadsheets to automated dispatch.',
    eyebrow: 'DIGITAL MATURITY BENCHMARKING',
    description: 'Empirical assessment of computer-aided facilities management (CAFM) and IoT sensor telemetry penetration across UK estates.',
    sectionKey: 'technologyAdoption',
    icon: Zap,
    metricUnit: 'estates reporting level',
  },
  'sustainability-targets': {
    slug: 'sustainability-targets',
    title: 'Estate Net Zero & Decarbonisation Timelines',
    subtitle: 'Reported commercial commitments towards net zero operational buildings.',
    eyebrow: 'DECARBONISATION BENCHMARKING',
    description: 'Committed target years for net zero building portfolios and EPC B compliance preparations.',
    sectionKey: 'sustainabilityTargets',
    icon: Building2,
    metricUnit: 'estates committed',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const config = TOPICS[topic];
  if (!config) return { title: 'Benchmarking Report | EntireFM' };

  return {
    title: `${config.title} | The Lobby Benchmarking — EntireFM`,
    description: config.description,
  };
}

export default async function TopicBenchmarkingPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const config = TOPICS[topic];
  if (!config) notFound();

  const report = await getAnnualBenchmarkingReport(2026);
  const section: ReportSection = report[config.sectionKey];

  const visibleItems = section?.visible || [];
  const suppressedCount = section?.suppressedCount || 0;
  const threshold = section?.threshold || 10;
  const surveyPeriod = report.surveyPeriod || `Q${report.quarter || 3} ${report.year}`;

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO SECTION */}
        <section className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#EA580C]/20 border border-[#EA580C]/30 text-[#EA580C]">
                  {config.eyebrow}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Cycle: {surveyPeriod} • Cell Threshold: n ≥ {threshold}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white">
                {config.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light max-w-3xl leading-relaxed">
                {config.subtitle}
              </p>

              {/* Sample Attribution Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Member Survey Data</span>
                </div>
                <span>•</span>
                <span className="font-mono text-white font-medium">
                  Based on {report.totalResponses} verified responses, {surveyPeriod}
                </span>
                <span>•</span>
                <Link
                  href="/lobby/benchmarking"
                  className="text-[#EA580C] hover:underline flex items-center gap-1 font-medium"
                >
                  View Full State of FM Report <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICAL BREAKDOWN */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-light text-slate-900">Empirical Distribution</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Cuts meeting the privacy threshold (n ≥ {threshold} verified respondents).
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {visibleItems.length} published cut{visibleItems.length === 1 ? '' : 's'}
                </span>
              </div>

              {visibleItems.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center space-y-2">
                  <EyeOff className="w-6 h-6 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-medium text-slate-800">Insufficient Data for this Segment</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No individual category currently meets the minimum sample size threshold (n ≥ {threshold} verified respondents) for public release. Data updates automatically when the threshold is reached.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {visibleItems.map((item, idx) => (
                    <div key={idx} className="bg-[#FAFAF8] border border-slate-200 rounded-lg p-5 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm font-medium text-slate-900">
                        <span>{item.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-600 text-xs">
                            {item.count} responses
                          </span>
                          <span className="font-mono font-bold text-[#EA580C] text-base">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-[#EA580C] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(item.percentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Suppression Notice */}
              {suppressedCount > 0 && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-amber-900 text-xs">
                  <EyeOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Privacy suppression applied: </span>
                    <span>
                      {suppressedCount} category cut{suppressedCount === 1 ? '' : 's'} omitted from this breakdown because they have fewer than {threshold} respondents. Under our standing governance rules, small respondent pools are never displayed or estimated.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* METHODOLOGY & CITATION GUIDELINES */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
                <Info className="w-4 h-4 text-[#EA580C] shrink-0" />
                <span>Methodology &amp; Citation Guidance</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 font-light leading-relaxed">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Data Source</h4>
                  <p>
                    Aggregated from self-reported survey responses by verified UK facilities management practitioners and estate directors within The Lobby at EntireFM. This is non-scientific industry sentiment, not a national census.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Suppression Threshold</h4>
                  <p>
                    Every cut enforces a mandatory floor of n ≥ 10. Combinations below this threshold are omitted entirely to prevent re-identification through cross-referencing with external public data.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="font-mono text-slate-500 text-[11px]">
                  Cite as: EntireFM Pulse Benchmarking ({surveyPeriod})
                </span>
                <Link
                  href="/lobby/benchmarking"
                  className="inline-flex items-center gap-1 text-[#EA580C] hover:underline font-medium"
                >
                  Submit your benchmark <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
