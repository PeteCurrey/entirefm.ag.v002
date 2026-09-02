import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  ChevronRight,
  ShieldCheck,
  Building2,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { PROFESSIONAL_ROLES, type ProfessionalRoleGuide } from '@/data/lobby/career-data';
import { PRODUCTION_CANONICAL_HOST } from '@/config/site';

export async function generateStaticParams() {
  return PROFESSIONAL_ROLES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = PROFESSIONAL_ROLES.find((r) => r.slug === slug);

  if (!role) {
    return { title: 'Role Guide Not Found | FIND — EntireFM' };
  }

  return {
    title: `${role.title} Role Guide & Career Specification | FIND · EntireFM`,
    description: `Comprehensive UK professional guide for ${role.title}: responsibilities, technical knowledge, compliance duties, salary benchmarks, and progression paths.`,
    keywords: [
      role.title,
      'FM career guide',
      'facilities management role',
      'responsibilities',
      'salary benchmark',
      'progression paths',
    ],
    alternates: {
      canonical: `${PRODUCTION_CANONICAL_HOST}/lobby/find/roles/${role.slug}`,
    },
    openGraph: {
      title: `${role.title} Role Guide & Career Specification | FIND · EntireFM`,
      description: `Comprehensive UK professional guide for ${role.title}: responsibilities, compliance duties, and salary benchmarks.`,
      url: `${PRODUCTION_CANONICAL_HOST}/lobby/find/roles/${role.slug}`,
      type: 'article',
    },
  };
}

export default async function RoleGuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = PROFESSIONAL_ROLES.find((r) => r.slug === slug);

  if (!role) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-electric selection:text-white">
      <LobbySubNav currentSection="find" />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 w-full space-y-12">

        {/* ── BREADCRUMBS ──────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">The Lobby</Link>
          <span>/</span>
          <Link href="/lobby/find" className="hover:text-neutral-900 transition-colors">FIND</Link>
          <span>/</span>
          <Link href="/lobby/find/roles" className="hover:text-neutral-900 transition-colors">Roles</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{role.title}</span>
        </nav>

        {/* ── MASTHEAD ─────────────────────────────────────────────────── */}
        <div className="space-y-4 border-b border-neutral-200 pb-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-brand-electric uppercase tracking-widest font-semibold">
              Professional Role Guide
            </span>
            <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-[2px] border border-neutral-200">
              {role.seniority}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extralight text-neutral-900 tracking-tight leading-tight">
            {role.title}
          </h1>

          <div className="bg-white border border-neutral-200 rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Typical UK Salary Range</p>
              <p className="text-base font-mono font-medium text-neutral-900 mt-0.5">{role.typicalSalaryRangeUK}</p>
            </div>
            <Link
              href={`/lobby/find/jobs?q=${encodeURIComponent(role.title)}`}
              className="text-xs bg-neutral-900 text-white px-4 py-2 rounded-[3px] hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 shrink-0"
            >
              Search Open Vacancies <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-[11px] font-light text-neutral-400">{role.salarySourceNote}</p>
        </div>

        {/* ── ROLE OVERVIEW ────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-brand-electric font-semibold">Role Overview</h2>
          <p className="text-base font-light text-neutral-700 leading-relaxed">
            {role.overview}
          </p>
        </section>

        {/* ── CORE RESPONSIBILITIES ────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-brand-electric font-semibold">Typical Responsibilities</h2>
          <ul className="space-y-2.5">
            {role.coreResponsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm font-light text-neutral-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── TECHNICAL & COMMERCIAL CAPABILITY ────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white border border-neutral-200 rounded-[4px] p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-900 font-semibold">Technical Knowledge</h3>
            <ul className="space-y-2 text-xs font-light text-neutral-600 leading-relaxed">
              {role.technicalKnowledge.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-neutral-400 font-mono">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-neutral-200 rounded-[4px] p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-900 font-semibold">Commercial Knowledge</h3>
            <ul className="space-y-2 text-xs font-light text-neutral-600 leading-relaxed">
              {role.commercialKnowledge.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-neutral-400 font-mono">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── STATUTORY COMPLIANCE RESPONSIBILITIES ────────────────────── */}
        <section className="bg-white border border-neutral-200 rounded-[4px] p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-electric" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-900 font-semibold">
              Statutory Compliance Duties
            </h3>
          </div>
          <ul className="space-y-2 text-xs font-light text-neutral-700 leading-relaxed">
            {role.complianceResponsibilities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-brand-electric font-mono">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── TYPICAL PROGRESSION ROUTES ───────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-brand-electric font-semibold">Typical Progression Routes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {role.typicalProgressionRoutes.map((prog, idx) => (
              <div key={idx} className="p-4 bg-white border border-neutral-200 rounded-[4px] text-xs font-light text-neutral-800">
                <span className="text-[10px] font-mono text-neutral-400 block mb-1">Target Next Step</span>
                <span className="font-medium text-neutral-900">{prog}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── RELEVANT LOBBY TOOLS & LEARNING ─────────────────────────── */}
        <section className="border-t border-neutral-200 pt-8 space-y-4">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Related Lobby Resources for This Role</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-light">
            <Link
              href={role.recommendedLearnUrl}
              className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
            >
              <span className="text-[10px] font-mono text-neutral-400 block mb-1">05 · LEARN</span>
              <span className="font-medium text-neutral-900">{role.recommendedLearnPath} &rarr;</span>
            </Link>

            {role.recommendedDoTool && (
              <Link
                href={role.recommendedDoTool.url}
                className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
              >
                <span className="text-[10px] font-mono text-neutral-400 block mb-1">03 · DO</span>
                <span className="font-medium text-neutral-900">{role.recommendedDoTool.name} &rarr;</span>
              </Link>
            )}

            {role.recommendedCheckSlug && (
              <Link
                href={`/lobby/check/${role.recommendedCheckSlug}`}
                className="p-4 bg-white border border-neutral-200 rounded-[4px] hover:border-neutral-400 transition-colors"
              >
                <span className="text-[10px] font-mono text-neutral-400 block mb-1">02 · CHECK</span>
                <span className="font-medium text-neutral-900">Compliance Duties &rarr;</span>
              </Link>
            )}
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
