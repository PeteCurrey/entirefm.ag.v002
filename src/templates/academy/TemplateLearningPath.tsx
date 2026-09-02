'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  Award,
  ArrowRight,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { AssessmentRunner } from '@/components/academy/AssessmentRunner';
import { CertificationBadge } from '@/components/academy/CertificationBadge';
import { LearningPath, LearningPathModule, MemberCertification } from '@/server/academy/types';

interface TemplateLearningPathProps {
  initialPath: LearningPath;
}

export function TemplateLearningPath({ initialPath }: TemplateLearningPathProps) {
  const [path] = useState<LearningPath>(initialPath);
  const [viewedModules, setViewedModules] = useState<string[]>([]);
  const [certification, setCertification] = useState<MemberCertification | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(
    initialPath.modules[0]?.id || null
  );
  const [markingModule, setMarkingModule] = useState<string | null>(null);

  // Fetch live member progress
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch(`/api/academy/paths/${path.slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.progress) {
            setViewedModules(data.progress.viewedModules || []);
            setCertification(data.progress.certification || null);
          }
        }
      } catch {
        // Silently handle guest mode
      }
    }

    loadProgress();
  }, [path.slug]);

  const toggleExpand = (modId: string) => {
    setExpandedModuleId((prev) => (prev === modId ? null : modId));
  };

  const handleToggleModuleViewed = async (modId: string) => {
    setMarkingModule(modId);
    try {
      const res = await fetch('/api/academy/modules/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathSlug: path.slug,
          moduleId: modId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setViewedModules(data.viewedModules || []);
      } else {
        // Fallback for unauthenticated preview
        setViewedModules((prev) =>
          prev.includes(modId) ? prev : [...prev, modId]
        );
      }
    } catch {
      setViewedModules((prev) =>
        prev.includes(modId) ? prev : [...prev, modId]
      );
    } finally {
      setMarkingModule(null);
    }
  };

  const totalModules = path.modules.length;
  const completedCount = viewedModules.length;
  const isAssessmentUnlocked = completedCount >= totalModules;
  const isAlreadyPassed = certification?.status === 'passed';

  const breadcrumbs = [
    { name: 'The Lobby', url: '/lobby' },
    { name: 'LEARN', url: '/lobby/learn' },
    { name: 'Academy', url: '/lobby/learn/academy' },
    { name: path.title, url: `/academy/${path.slug}` },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <LobbySubNav currentSection="learn" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} className="text-neutral-500 font-light text-xs" />

        {/* Path Hero Header */}
        <div className="border-b border-neutral-200 pb-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric font-medium">
              ACADEMY LEARNING PATH
            </span>
            <span className="text-neutral-300">·</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-800">
              <Award className="w-3 h-3 text-amber-600" />
              <span>Target Role: {path.targetRole}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-neutral-900 leading-tight">
            {path.title}
          </h1>

          <p className="text-base sm:text-lg font-light text-neutral-600 leading-relaxed max-w-3xl">
            {path.description}
          </p>

          {/* Quick Stats Strip */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-light text-neutral-500">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-400" />
              <span>{totalModules} Structured Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>
                ~{path.modules.reduce((acc, m) => acc + m.durationMinutes, 0)} mins total reading
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
              <span>Gated Assessment ({path.passMarkPercent}% Pass Mark)</span>
            </div>
          </div>
        </div>

        {/* Already Passed Celebration Banner */}
        {isAlreadyPassed && certification?.publicCertId && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Credential Awarded</span>
              </div>
              <h3 className="text-xl font-medium text-neutral-900">
                You hold the {path.targetRole} Certification
              </h3>
              <p className="text-xs text-neutral-600 font-light">
                Issued on {new Date(certification.badgeIssuedAt!).toLocaleDateString('en-GB')}. Credential ID: {certification.publicCertId}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/academy/verify/${certification.publicCertId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                <span>View Public Certificate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Curriculum Progress Bar */}
        <div className="p-6 rounded-xl bg-white border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
              Curriculum Progress
            </h3>
            <p className="text-sm font-light text-neutral-900">
              {completedCount} of {totalModules} modules marked as reviewed
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-36 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-pink transition-all duration-500"
                style={{ width: `${(completedCount / totalModules) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-medium text-neutral-700">
              {Math.round((completedCount / totalModules) * 100)}%
            </span>
          </div>
        </div>

        {/* Modules Syllabus Section */}
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">SYLLABUS</p>
            <h2 className="text-2xl font-light text-neutral-900 tracking-tight">
              Learning Modules
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Review each module and mark as completed to unlock the official assessment.
            </p>
          </div>

          <div className="space-y-4">
            {path.modules.map((mod, idx) => {
              const isViewed = viewedModules.includes(mod.id);
              const isExpanded = expandedModuleId === mod.id;

              return (
                <div
                  key={mod.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isViewed
                      ? 'border-emerald-200 bg-white shadow-xs'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  {/* Module Accordion Header */}
                  <div
                    onClick={() => toggleExpand(mod.id)}
                    className="p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/60 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <span className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-mono text-neutral-700 shrink-0 mt-0.5 sm:mt-0">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-medium text-neutral-900 leading-snug">
                            {mod.title}
                          </h3>
                          {isViewed && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Reviewed</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 font-light line-clamp-1">
                          {mod.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                        {mod.durationMinutes} mins
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content Body */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-neutral-100 space-y-6 animate-in fade-in duration-200">
                      {/* Key Topics */}
                      <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100 space-y-2">
                        <h4 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-neutral-700">
                          Core Technical Topics:
                        </h4>
                        <ul className="space-y-1.5 text-xs text-neutral-600 font-light">
                          {mod.keyTopics.map((topic, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technical Reading Content */}
                      <div className="prose prose-sm max-w-none text-xs text-neutral-700 font-light leading-relaxed whitespace-pre-line bg-white p-5 rounded-lg border border-neutral-200">
                        {mod.readingContent.trim()}
                      </div>

                      {/* Action: Mark as Completed */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-neutral-400 font-light">
                          Duration: {mod.durationMinutes} minutes
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleModuleViewed(mod.id)}
                          disabled={markingModule === mod.id}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isViewed
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {markingModule === mod.id
                              ? 'Updating...'
                              : isViewed
                              ? 'Module Completed'
                              : 'Mark as Reviewed'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Gated Assessment Section */}
        <section id="assessment" className="pt-8 border-t border-neutral-200 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric">
              GATE 2 · RIGOROUS ASSESSMENT
            </p>
            <h2 className="text-2xl font-light text-neutral-900 tracking-tight">
              Gated Certification Assessment
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Server-graded evaluation. Pass mark is {path.passMarkPercent}%. Successful completion issues your verifiable badge.
            </p>
          </div>

          {!isAssessmentUnlocked ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-medium text-neutral-900">
                  Assessment Locked
                </h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  You have reviewed <strong className="font-semibold text-neutral-800">{completedCount}</strong> of <strong className="font-semibold text-neutral-800">{totalModules}</strong> modules. Review all modules above to unlock the examination.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-10 shadow-sm">
              <AssessmentRunner
                pathSlug={path.slug}
                pathTitle={path.title}
                targetRole={path.targetRole}
                passMarkPercent={path.passMarkPercent}
                onCertificationPassed={(res) => {
                  setCertification((prev) => {
                    const base: MemberCertification = prev || {
                      id: 'cert-new',
                      memberUid: 'self',
                      pathId: path.id,
                      startedAt: new Date().toISOString(),
                      completedAt: null,
                      attemptCount: 1,
                      score: null,
                      status: 'in_progress' as const,
                      badgeIssuedAt: null,
                      publicCertId: null,
                      lastAttemptAt: null,
                      viewedModules,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    };
                    return {
                      ...base,
                      status: 'passed' as const,
                      score: res.score,
                      badgeIssuedAt: res.badgeIssuedAt || new Date().toISOString(),
                      publicCertId: res.publicCertId || null,
                      completedAt: new Date().toISOString(),
                      lastAttemptAt: new Date().toISOString(),
                    };
                  });
                }}
              />
            </div>
          )}
        </section>

        {/* Accreditation & Integrity Notice */}
        <div className="rounded-xl bg-neutral-100/70 border border-neutral-200 p-6 text-xs text-neutral-500 space-y-2 leading-relaxed">
          <h4 className="font-semibold text-neutral-800 uppercase tracking-wider text-[11px]">
            Academic Integrity &amp; Verifiable Credential Policy
          </h4>
          <p className="font-light">
            EntireFM Academy assessments are graded exclusively on the server against rigorous technical rubrics. Badges represent verified completion of operational standards and can be verified by third parties and prospective employers on the EntireFM public credential registry.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
