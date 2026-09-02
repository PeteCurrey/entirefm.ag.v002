import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, ShieldCheck, ArrowRight, MapPin, Search } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { getJobListings } from '@/server/jobs/jobs-store';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export const metadata: Metadata = {
  title: 'FM Employers & Recruiting Organisations | FIND — EntireFM',
  description:
    'Discover organisations actively employing facilities management and property engineering professionals across the UK. Grounded in verified database listings.',
  alternates: {
    canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/employers`,
  },
  openGraph: {
    title: 'FM Employers & Recruiting Organisations | FIND — EntireFM',
    description:
      'Organisations actively recruiting facilities management and property professionals across the UK.',
    url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/employers`,
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function FindEmployersPage() {
  const { jobs } = await getJobListings({ limit: 100 });

  // Group unique employers authentically from live jobs database
  const employerMap = new Map<string, {
    name: string;
    isVerified: boolean;
    jobCount: number;
    locations: Set<string>;
    disciplines: Set<string>;
  }>();

  jobs.forEach((j) => {
    const existing = employerMap.get(j.employerName) || {
      name: j.employerName,
      isVerified: j.isEntireFMVerifiedEmployer,
      jobCount: 0,
      locations: new Set<string>(),
      disciplines: new Set<string>(),
    };
    existing.jobCount += 1;
    if (j.location) existing.locations.add(j.location);
    if (j.disciplineTags) j.disciplineTags.forEach((t) => existing.disciplines.add(t));
    employerMap.set(j.employerName, existing);
  });

  const employers = Array.from(employerMap.values());

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      <LobbySubNav currentSection="find" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">The Lobby</Link>
          <span>/</span>
          <Link href="/lobby/find" className="hover:text-neutral-900 transition-colors">FIND</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">Employers</span>
        </nav>

        {/* Masthead */}
        <div className="space-y-4 border-b border-neutral-200 pb-8">
          <p className="text-[10px] font-mono text-brand-electric uppercase tracking-widest font-semibold">
            THE LOBBY · FIND · Employers
          </p>
          <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight leading-tight">
            FM Employers & Organisations
          </h1>
          <p className="text-sm font-light text-neutral-600 max-w-2xl leading-relaxed">
            Discover organisations actively recruiting FM professionals. All employer profiles are grounded strictly in live database listings and verified contractor status — zero fabricated rankings or pay-to-rank placements.
          </p>
        </div>

        {/* Employers Grid */}
        {employers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employers.map((emp, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border border-neutral-200 rounded-[4px] shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {emp.isVerified && (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-[2px] inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Employer
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-medium text-neutral-900 leading-snug">{emp.name}</h2>
                  <p className="text-xs font-mono text-neutral-400">
                    {emp.jobCount} open vacancy{emp.jobCount > 1 ? 's' : ''}
                  </p>
                  {emp.locations.size > 0 && (
                    <p className="text-xs font-light text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{Array.from(emp.locations).join(', ')}</span>
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <Link
                    href={`/lobby/find/jobs?q=${encodeURIComponent(emp.name)}`}
                    className="text-xs text-brand-electric font-medium hover:underline inline-flex items-center gap-1"
                  >
                    View Vacancies <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-neutral-200 rounded-[4px] space-y-2">
            <Building2 className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-sm font-light text-neutral-600">No employers currently have open vacancies in the database.</p>
            <p className="text-xs font-light text-neutral-400">
              Only authentic employers with live job listings are displayed. Check back as new vacancies are published.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="pt-4">
          <Link
            href="/lobby/find"
            className="text-xs text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1 font-light"
          >
            &larr; Back to FIND Career Centre
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
