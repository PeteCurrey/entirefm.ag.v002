import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, ExternalLink, ArrowRight, BookOpen } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { LEARN_RESOURCES } from '@/data/lobby/learn-data';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export async function generateStaticParams() {
  return LEARN_RESOURCES.filter(r => r.status === 'PUBLISHED').map(r => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = LEARN_RESOURCES.find(r => r.slug === slug);
  if (!resource) return { title: 'Resource Not Found | LEARN — EntireFM' };

  return {
    title: `${resource.title} | LEARN · EntireFM`,
    description: resource.summary.slice(0, 160),
    keywords: [resource.topic, resource.contentType, 'FM professional development', 'facilities management'],
    alternates: {
      canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/${resource.slug}`,
    },
    openGraph: {
      title: `${resource.title} | LEARN · EntireFM`,
      description: resource.summary.slice(0, 160),
      url: `${PRODUCTION_CANONICAL_HOST}/lobby/learn/${resource.slug}`,
      type: 'article',
    },
  };
}

const LEVEL_LABELS: Record<string, string> = {
  Foundation: 'bg-sky-50 text-sky-700',
  Practitioner: 'bg-teal-50 text-teal-700',
  Senior: 'bg-indigo-50 text-indigo-700',
  Leadership: 'bg-purple-50 text-purple-700',
  Specialist: 'bg-orange-50 text-orange-700',
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  Guide: 'bg-blue-50 text-blue-700 border-blue-200',
  Playbook: 'bg-violet-50 text-violet-700 border-violet-200',
  'Technical Briefing': 'bg-amber-50 text-amber-700 border-amber-200',
  Checklist: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Explainer: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

export default async function LearnResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = LEARN_RESOURCES.find(r => r.slug === slug);

  if (!resource || resource.status !== 'PUBLISHED') {
    notFound();
  }

  const related = LEARN_RESOURCES.filter(
    r => r.slug !== slug && r.status === 'PUBLISHED' && (r.pathway === resource.pathway || r.topic === resource.topic)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      <LobbySubNav currentSection="learn" />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">The Lobby</Link>
          <span>/</span>
          <Link href="/lobby/learn" className="hover:text-neutral-900 transition-colors">LEARN</Link>
          <span>/</span>
          <Link href="/lobby/learn/guides" className="hover:text-neutral-900 transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium truncate">{resource.title}</span>
        </nav>

        {/* Masthead */}
        <div className="space-y-4 border-b border-neutral-200 pb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] border ${CONTENT_TYPE_LABELS[resource.contentType] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>
              {resource.contentType}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${LEVEL_LABELS[resource.level] ?? ''}`}>{resource.level}</span>
            <span className="text-[10px] font-mono text-neutral-400">{resource.topic}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight leading-tight">{resource.title}</h1>
          <p className="text-sm font-light text-neutral-600 leading-relaxed max-w-2xl">{resource.summary}</p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {resource.readingTimeMinutes} min read</span>
            <span>Published: {resource.publishedDate}</span>
            <span>Reviewed: {resource.lastReviewedDate}</span>
          </div>
        </div>

        {/* Professional development notice */}
        <div className="bg-neutral-100 border border-neutral-200 rounded-[3px] px-4 py-3">
          <p className="text-[11px] font-light text-neutral-600">
            <span className="font-medium">Professional Development resource.</span> This content is provided for general information and development purposes. It does not constitute legal advice or formally accredited CPD.
          </p>
        </div>

        {/* ── CONTENT PLACEHOLDER ──────────────────────────────────────── */}
        {/* 
          This is the content area where article body content will be rendered.
          In a CMS-backed implementation, this would be populated from the content field.
          Currently, the architecture, routing, metadata, and surrounding structure are built.
          Content body requires editorial population per resource.
        */}
        <div className="prose prose-sm prose-neutral max-w-none font-light leading-relaxed space-y-6">
          <div className="bg-white border border-neutral-200 rounded-[4px] p-8 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-sm font-light text-neutral-500">
              Full resource content for <strong className="font-medium text-neutral-900">&ldquo;{resource.title}&rdquo;</strong> is being prepared by the EntireFM editorial team.
            </p>
            <p className="text-xs font-light text-neutral-400">
              Pathway: {resource.pathway.replace(/-/g, ' ')} · Level: {resource.level}
            </p>
          </div>
        </div>

        {/* DO cross-link */}
        {resource.relatedToolUrl && resource.relatedToolName && (
          <section className="bg-neutral-950 text-white rounded-[4px] p-6 space-y-3">
            <p className="text-[10px] font-mono text-brand-electric uppercase tracking-widest">LEARN → DO</p>
            <p className="text-sm font-light text-neutral-300">Ready to put this knowledge into practice?</p>
            <Link
              href={resource.relatedToolUrl}
              className="inline-flex items-center gap-2 bg-brand-electric text-white text-xs font-medium px-4 py-2.5 rounded-[3px] hover:bg-brand-electric/90 transition-colors"
            >
              {resource.relatedToolName} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </section>
        )}

        {/* CHECK cross-link */}
        {resource.relatedCheckSlug && (
          <section className="bg-white border border-neutral-200 rounded-[4px] p-5 space-y-2 shadow-2xs">
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">LEARN → CHECK</p>
            <p className="text-sm font-light text-neutral-700">Understand your compliance requirements</p>
            <Link
              href={`/lobby/check/${resource.relatedCheckSlug}`}
              className="text-xs text-brand-electric hover:underline font-light inline-flex items-center gap-1"
            >
              View compliance topic <ArrowRight className="w-3 h-3" />
            </Link>
          </section>
        )}

        {/* Related resources */}
        {related.length > 0 && (
          <section className="space-y-4 border-t border-neutral-200 pt-8">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Related Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/lobby/learn/${r.slug}`}
                  className="group block p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
                >
                  <span className="text-[10px] font-mono text-neutral-400 block mb-1">{r.contentType}</span>
                  <span className="text-xs font-light text-neutral-900 group-hover:text-brand-electric transition-colors leading-snug">{r.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cross-lobby footer */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs border-t border-neutral-200 pt-8">
          {[
            { label: 'KNOW', desc: 'Latest intelligence', href: '/lobby/know', num: '01' },
            { label: 'CHECK', desc: 'Compliance requirements', href: '/lobby/check', num: '02' },
            { label: 'DO', desc: 'FM tools', href: '/lobby/do', num: '03' },
            { label: 'FIND', desc: 'Find specialists', href: '/lobby/find', num: '04' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
            >
              <span className="text-neutral-400 text-[10px] block font-mono mb-1">{item.num} · {item.label}</span>
              <span className="text-neutral-900 font-medium">{item.desc} &rarr;</span>
            </Link>
          ))}
        </section>

        <Link href="/lobby/learn" className="text-xs font-light text-neutral-500 hover:text-neutral-900 transition-colors inline-flex items-center gap-1">
          &larr; Back to LEARN
        </Link>

      </main>
      <Footer />
    </div>
  );
}
