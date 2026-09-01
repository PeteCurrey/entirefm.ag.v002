import { Metadata } from 'next';
import Link from 'next/link';
import { listEditions } from '@/server/lobby-daily/store';
import { runDailyDraftGeneration } from '@/server/lobby-daily/scheduler';
import { Mail, Calendar, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

// Always server-rendered — fetches live edition data from Supabase on every request
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Lobby Daily — UK Facilities Management Executive Briefing | EntireFM',
  description:
    'The morning briefing for UK facilities management leaders: statutory compliance, M&E engineering diagnostics, procurement contracts, and building safety updates.',
  robots: {
    index: true,
    follow: true,
  },
};

export default async function LobbyDailyArchivePage() {
  // Ensure at least one initial edition exists
  let { editions } = await listEditions({ limit: 30 });
  if (editions.length === 0) {
    await runDailyDraftGeneration();
    const refreshed = await listEditions({ limit: 30 });
    editions = refreshed.editions;
  }

  const latestEdition = editions[0];

  return (
    <main className="min-h-screen bg-[#0A0D14] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Masthead Header */}
        <div className="border-b border-white/10 pb-8 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-[#00E599]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#00E599] font-semibold">
              EXECUTIVE INTELLIGENCE BRIEFING
            </span>
            <span className="h-px w-6 bg-[#00E599]" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extralight text-white tracking-tight leading-tight">
            THE LOBBY DAILY
          </h1>

          <p className="text-base sm:text-lg font-light text-white/70 max-w-2xl leading-relaxed">
            What changed. Why it matters. What to do next in UK facilities management and commercial estate operations.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-normal text-white/60">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00E599]" /> Weekday 06:45 dispatch
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E599]" /> Tier 1 Statutory Grounding
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#00E599]" /> 4-Minute Executive Read
            </span>
          </div>
        </div>

        {/* Latest Edition Feature Card */}
        {latestEdition && (
          <div className="bg-[#111622] border border-white/15 rounded-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-normal">
              <span className="text-[#00E599] uppercase tracking-wider font-semibold">
                LATEST EDITION · #{latestEdition.editionNumber}
              </span>
              <span className="text-white/50">{latestEdition.masthead?.ukDateFormatted}</span>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-medium uppercase tracking-widest text-sky-400">
                {latestEdition.leadStory?.categoryLabel}
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-white leading-snug">
                <Link
                  href={`/lobby/daily/${latestEdition.slug}`}
                  className="hover:text-[#00E599] transition-colors"
                >
                  {latestEdition.leadStory?.headline}
                </Link>
              </h2>
              <p className="text-sm sm:text-base font-light text-white/75 leading-relaxed max-w-3xl">
                {latestEdition.leadStory?.summary}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-xs text-white/40">
                Source: {latestEdition.leadStory?.sourceName}
              </span>
              <Link
                href={`/lobby/daily/${latestEdition.slug}`}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#00E599] hover:underline"
              >
                <span>Read Full Edition</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Edition Archive List */}
        <div className="space-y-6">
          <h3 className="text-xs font-medium uppercase tracking-widest text-white/50">
            PREVIOUS EDITIONS
          </h3>

          <div className="grid gap-4">
            {editions.map((ed) => (
              <Link
                key={ed.id}
                href={`/lobby/daily/${ed.slug}`}
                className="block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 p-5 rounded-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-white/50 font-normal">
                      <span>Edition #{ed.editionNumber}</span>
                      <span>·</span>
                      <span>{ed.masthead?.ukDateFormatted || ed.editionDate}</span>
                    </div>
                    <h4 className="text-base font-light text-white group-hover:text-[#00E599]">
                      {ed.leadStory?.headline || ed.subjectLine}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-normal text-[#00E599] shrink-0">
                    <span>View Edition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
