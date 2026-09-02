import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, BookOpen, Layers, ShieldCheck, ChevronRight } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { CAREER_PATHWAYS } from '@/data/lobby/career-data';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export async function generateStaticParams() {
  return CAREER_PATHWAYS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pathway = CAREER_PATHWAYS.find((p) => p.slug === slug);

  if (!pathway) {
    return { title: 'Career Pathway Not Found | FIND — EntireFM' };
  }

  return {
    title: `${pathway.title} Career Progression Pathway | FIND · EntireFM`,
    description: `Structured progression route in UK facilities management: ${pathway.summary.slice(0, 150)}`,
    keywords: [pathway.title, 'FM career progression', 'facilities management career path', 'FM ladder'],
    alternates: {
      canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/careers/${pathway.slug}`,
    },
    openGraph: {
      title: `${pathway.title} Career Progression Pathway | FIND · EntireFM`,
      description: `Structured progression route in UK facilities management: stages, core skills, and qualifications.`,
      url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/careers/${pathway.slug}`,
      type: 'article',
    },
  };
}

export default async function CareerPathwayDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pathway = CAREER_PATHWAYS.find((p) => p.slug === slug);

  if (!pathway) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      <LobbySubNav currentSection="find" />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">The Lobby</Link>
          <span>/</span>
          <Link href="/lobby/find" className="hover:text-neutral-900 transition-colors">FIND</Link>
          <span>/</span>
          <Link href="/lobby/find/careers" className="hover:text-neutral-900 transition-colors">Career Pathways</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{pathway.title}</span>
        </nav>

        {/* Masthead */}
        <div className="space-y-4 border-b border-neutral-200 pb-10">
          <p className="text-[10px] font-mono text-brand-electric uppercase tracking-widest font-semibold">
            FM Career Progression Pathway
          </p>
          <h1 className="text-3xl sm:text-4xl font-extralight text-neutral-900 tracking-tight leading-tight">
            {pathway.title}
          </h1>
          <p className="text-base font-light text-neutral-600 leading-relaxed max-w-2xl">
            {pathway.summary}
          </p>
        </div>

        {/* Progression Stages Stepper */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-brand-electric font-semibold">
            Progression Stages (Entry to Executive)
          </h2>

          <div className="space-y-4">
            {pathway.stages.map((stage, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border border-neutral-200 rounded-[4px] shadow-2xs space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-white font-mono text-xs flex items-center justify-center font-medium shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-base font-medium text-neutral-900">{stage.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-light">
                    <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded-[2px] text-neutral-600">{stage.level}</span>
                    <span className="text-[10px] font-mono text-neutral-400">Typical tenure: {stage.typicalTenure}</span>
                  </div>
                </div>

                <p className="text-xs font-light text-neutral-600 leading-relaxed">
                  <span className="font-medium text-neutral-800">Primary operational focus: </span>{stage.focus}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Skills & Qualifications */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white border border-neutral-200 rounded-[4px] p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-900 font-semibold">Key Capabilities & Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {pathway.keySkills.map((sk, idx) => (
                <span key={idx} className="text-xs font-light bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-[2px]">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-[4px] p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-900 font-semibold">Industry Qualifications Context</h3>
            <p className="text-xs font-light text-neutral-600 leading-relaxed">
              {pathway.qualificationsNote}
            </p>
            <p className="text-[10px] font-mono text-neutral-400">
              *EntireFM does not confer qualifications or accreditation. References indicate recognized industry bodies (IWFM, CIBSE, RICS, NEBOSH).
            </p>
          </div>
        </section>

        {/* Cross-Lobby Connections */}
        <section className="border-t border-neutral-200 pt-8 space-y-4">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Related Lobby Tools & Learning for this Pathway</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-light">
            <Link
              href={`/lobby/learn/${pathway.relatedLearnSlug}`}
              className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
            >
              <span className="text-[10px] font-mono text-neutral-400 block mb-1">05 · LEARN</span>
              <span className="font-medium text-neutral-900">{pathway.relatedLearnTopic} &rarr;</span>
            </Link>

            {pathway.relatedDoToolUrl && (
              <Link
                href={pathway.relatedDoToolUrl}
                className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
              >
                <span className="text-[10px] font-mono text-neutral-400 block mb-1">03 · DO</span>
                <span className="font-medium text-neutral-900">{pathway.relatedDoToolName} &rarr;</span>
              </Link>
            )}

            <Link
              href={`/lobby/find/jobs?q=${encodeURIComponent(pathway.title)}`}
              className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
            >
              <span className="text-[10px] font-mono text-neutral-400 block mb-1">04 · FIND</span>
              <span className="font-medium text-neutral-900">Browse Vacancies &rarr;</span>
            </Link>
          </div>
        </section>

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
