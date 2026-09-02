import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { COMPLIANCE_TOPICS } from '@/data/lobby/compliance-data';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export async function generateStaticParams() {
  return COMPLIANCE_TOPICS.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = COMPLIANCE_TOPICS.find((t) => t.slug === slug);

  if (!topic) {
    return {
      title: 'Compliance Topic Not Found | CHECK — EntireFM',
    };
  }

  return {
    title: `${topic.title} — FM Statutory Compliance | CHECK · EntireFM`,
    description: `Authoritative UK guidance on ${topic.title}: responsible person, inspection frequencies, mandatory evidence requirements, and official legislative sources.`,
    keywords: [
      topic.title,
      topic.category,
      'FM statutory compliance',
      'facilities management compliance',
      topic.officialSources[0]?.issuingBody ?? '',
    ],
    alternates: {
      canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/check/${topic.slug}`,
    },
    openGraph: {
      title: `${topic.title} — FM Statutory Compliance | CHECK · EntireFM`,
      description: `Authoritative UK guidance on ${topic.title}: responsible person, inspection frequencies, and mandatory evidence requirements.`,
      url: `${PRODUCTION_CANONICAL_HOST}/lobby/check/${topic.slug}`,
      type: 'article',
    },
  };
}

export default async function ComplianceTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = COMPLIANCE_TOPICS.find((t) => t.slug === slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      <LobbySubNav currentSection="check" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">

        {/* ── BREADCRUMBS ──────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">
            The Lobby
          </Link>
          <span>/</span>
          <Link href="/lobby/check" className="hover:text-neutral-900 transition-colors">
            CHECK
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{topic.title}</span>
        </nav>

        {/* ── TOPIC MASTHEAD ───────────────────────────────────────────── */}
        <div className="space-y-4 border-b border-neutral-200/90 pb-10">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-brand-electric font-semibold uppercase tracking-widest">
              {topic.category}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-neutral-100 border border-neutral-200 text-neutral-700">
              {topic.statusContext}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extralight text-neutral-900 tracking-tight leading-tight">
            {topic.title}
          </h1>

          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400">
            <span>Last reviewed: {topic.lastReviewedDate}</span>
          </div>
        </div>

        {/* ── WHAT IS IT? ──────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-lg font-light text-neutral-900 tracking-tight uppercase text-xs font-semibold text-brand-electric font-mono tracking-widest">
            What is it?
          </h2>
          <p className="text-sm sm:text-base font-light text-neutral-700 leading-relaxed">
            {topic.whatIsIt}
          </p>
        </section>

        {/* ── WHO IS RESPONSIBLE? ──────────────────────────────────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs space-y-2">
          <h2 className="text-[10px] uppercase font-mono tracking-widest text-brand-electric font-semibold">
            Who is responsible?
          </h2>
          <p className="text-sm font-light text-neutral-700 leading-relaxed">
            {topic.whoIsResponsible}
          </p>
        </section>

        {/* ── WHAT NEEDS TO HAPPEN? ────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase font-mono tracking-widest text-brand-electric font-semibold">
            What needs to happen?
          </h2>
          <ul className="space-y-3">
            {topic.whatNeedsToHappen.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm font-light text-neutral-700 leading-relaxed">
                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 border border-neutral-200 rounded-[2px] px-1.5 py-0.5 mt-0.5 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── HOW OFTEN? ───────────────────────────────────────────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs space-y-3">
          <h2 className="text-[10px] uppercase font-mono tracking-widest text-brand-electric font-semibold">
            How often?
          </h2>
          <p className="text-sm font-normal text-neutral-900 font-mono leading-relaxed">
            {topic.howOften}
          </p>
          <p className="text-[11px] font-light text-neutral-500">
            Source: {topic.frequencySource}
          </p>
        </section>

        {/* ── WHAT EVIDENCE SHOULD I HAVE? ─────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase font-mono tracking-widest text-brand-electric font-semibold">
            What evidence should I hold?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topic.evidenceRequired.map((ev, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 bg-white border border-neutral-200/90 rounded-[4px] text-xs font-light text-neutral-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{ev}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── IMPLICATIONS IF MISSED ───────────────────────────────────── */}
        <section className="bg-amber-50/80 border border-amber-200/90 rounded-[4px] p-6 space-y-3">
          <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-amber-900 font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>What happens if it is missed?</span>
          </div>
          <p className="text-sm font-light text-amber-950/90 leading-relaxed">
            {topic.implicationsIfMissed}
          </p>
        </section>

        {/* ── OFFICIAL SOURCES ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase font-mono tracking-widest text-brand-electric font-semibold">
            Official Sources
          </h2>
          <div className="space-y-3">
            {topic.officialSources.map((src) => (
              <div
                key={src.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-white border border-neutral-200/90 rounded-[4px] shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-neutral-400">
                    {src.issuingBody} · Last updated {src.lastUpdated}
                  </div>
                  <h3 className="text-sm font-normal text-neutral-900">{src.title}</h3>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-brand-electric hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── ENTIREFM PRACTICAL GUIDANCE ──────────────────────────────── */}
        <section className="bg-white border border-neutral-200/90 rounded-[4px] p-6 shadow-2xs space-y-3">
          <h2 className="text-[10px] uppercase font-mono tracking-widest text-neutral-600 font-semibold flex items-center gap-2">
            <span className="h-px w-4 bg-brand-electric" />
            EntireFM Practical Guidance
          </h2>
          <p className="text-sm font-light text-neutral-700 leading-relaxed italic">
            {topic.entireFmGuidance}
          </p>
          <p className="text-[11px] font-light text-neutral-400">
            EntireFM practical interpretation is separate from official statutory guidance. Always verify against primary legislation.
          </p>
        </section>

        {/* ── CROSS-LINK: RELATED LOBBY DESTINATIONS ───────────────────── */}
        <section className="space-y-4 border-t border-neutral-200/90 pt-8">
          <h2 className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-semibold">
            Related Lobby Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {topic.relatedKnowSlug && (
              <Link href={`/lobby/${topic.relatedKnowSlug}`} className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
                <span className="text-neutral-400 text-[10px] block">01 · KNOW</span>
                <span className="text-neutral-900 font-medium">Regulatory Intelligence &rarr;</span>
              </Link>
            )}
            {topic.relatedDoToolUrl && (
              <Link href={topic.relatedDoToolUrl} className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
                <span className="text-neutral-400 text-[10px] block">03 · DO</span>
                <span className="text-neutral-900 font-medium">{topic.relatedDoToolName ?? 'FM Tool'} &rarr;</span>
              </Link>
            )}
            {topic.relatedFindCategory && (
              <Link href={`/lobby/find/${topic.relatedFindCategory.toLowerCase()}`} className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
                <span className="text-neutral-400 text-[10px] block">04 · FIND</span>
                <span className="text-neutral-900 font-medium">Specialist Contractors &rarr;</span>
              </Link>
            )}
            <Link href="/lobby/connect" className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors">
              <span className="text-neutral-400 text-[10px] block">06 · CONNECT</span>
              <span className="text-neutral-900 font-medium">Practitioner Discussion &rarr;</span>
            </Link>
          </div>
        </section>

        {/* ── BACK TO CHECK ────────────────────────────────────────────── */}
        <div className="pt-4">
          <Link
            href="/lobby/check"
            className="text-xs text-neutral-600 hover:text-neutral-900 font-light inline-flex items-center gap-1.5 transition-colors"
          >
            &larr; Back to CHECK Compliance Centre
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
