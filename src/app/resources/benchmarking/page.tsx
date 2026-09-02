import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAnnualBenchmarkingReport } from '@/server/benchmarking/survey-store';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  Users,
  Wrench,
  Zap,
  Building2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'UK Facilities Management Benchmarking Reports 2026 | EntireFM Resources',
  description: 'First-party empirical benchmarks on salaries, contractor engineering workforce sizes, Building Safety Act friction, and CAFM adoption from verified UK facilities leaders.',
};

export const dynamic = 'force-dynamic';

const TOPIC_CARDS = [
  {
    title: 'Salary & Compensation Bands',
    slug: 'salaries',
    icon: Briefcase,
    eyebrow: 'REMUNERATION',
    desc: 'Practitioner-reported salary distribution across UK hard FM management, technical leads, and heads of estate.',
  },
  {
    title: 'Contractor & Engineering Team Sizes',
    slug: 'team-sizes',
    icon: Users,
    eyebrow: 'WORKFORCE',
    desc: 'Operational team scale: direct engineering heads and specialist subcontracting ratios across UK estates.',
  },
  {
    title: 'Statutory Compliance & Operational Challenges',
    slug: 'operational-challenges',
    icon: Wrench,
    eyebrow: 'COMPLIANCE & RISK',
    desc: 'First-party data on Building Safety Act golden thread friction, labour shortages, and part replacement lead times.',
  },
  {
    title: 'CAFM & IoT Telemetry Adoption',
    slug: 'technology-adoption',
    icon: Zap,
    eyebrow: 'DIGITAL MATURITY',
    desc: 'Empirical assessment of computer-aided facilities management systems, sensor telemetry, and dispatch automation.',
  },
  {
    title: 'Decarbonisation & Net Zero Timelines',
    slug: 'sustainability-targets',
    icon: Building2,
    eyebrow: 'SUSTAINABILITY',
    desc: 'Committed commercial target years for operational net zero and EPC rating improvements across UK portfolios.',
  },
];

export default async function BenchmarkingHubPage() {
  const report = await getAnnualBenchmarkingReport(2026);
  const surveyPeriod = report.surveyPeriod || `Q${report.quarter || 3} ${report.year}`;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* HERO */}
        <section className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#EA580C]/20 border border-[#EA580C]/30 text-[#EA580C]">
                PULSE BENCHMARKING INTELLIGENCE
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white">
                UK FM Benchmarking Reports
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
                Aggregated, privacy-protected operational data from verified UK facilities management practitioners and estate directors.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Practitioner Dataset</span>
                </div>
                <span>•</span>
                <span className="font-mono text-white font-medium">
                  {report.totalResponses} Verified Responses ({surveyPeriod})
                </span>
                <span>•</span>
                <span className="text-slate-400 font-mono">
                  Privacy suppression: n ≥ 10
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TOPIC GRID */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-light text-slate-900">Report Topics</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select a topic to explore empirical distributions and statutory compliance baselines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TOPIC_CARDS.map((topic) => {
                const Icon = topic.icon;
                return (
                  <Link
                    key={topic.slug}
                    href={`/resources/benchmarking/${topic.slug}`}
                    className="bg-[#FAFAF8] border border-slate-200 rounded-lg p-6 space-y-4 hover:-translate-y-0.5 hover:border-[#EA580C]/50 hover:bg-white transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                          {topic.eyebrow}
                        </span>
                        <Icon className="w-4 h-4 text-[#EA580C]" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {topic.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-[#EA580C]">
                      <span>View Topic Report</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
