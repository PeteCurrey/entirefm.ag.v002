import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { listAllPathsForAdmin } from '@/server/academy/academy-store';
import {
  GraduationCap,
  Plus,
  BookOpen,
  CheckCircle2,
  Clock,
  Archive,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Academy Authoring & Curriculum Command | EntireFM Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminAcademyDashboardPage() {
  const paths = await listAllPathsForAdmin();

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-300">
              <GraduationCap className="w-3.5 h-3.5 text-neutral-600" />
              Academy Authoring Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Learning Paths &amp; Assessments
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
            Author and publish accredited FM learning curricula, configure proctored question banks with pass marks, and maintain audit trails.
          </p>
        </div>

        <div>
          <Link
            href="/admin/academy/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Learning Path
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-sm space-y-1">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Paths</span>
          <p className="text-2xl font-bold text-neutral-900">{paths.length}</p>
          <span className="text-xs text-neutral-400">Curricula in system</span>
        </div>
        <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-sm space-y-1">
          <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Published</span>
          <p className="text-2xl font-bold text-emerald-600">
            {paths.filter((p) => p.status === 'published').length}
          </p>
          <span className="text-xs text-neutral-400">Live for members</span>
        </div>
        <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-sm space-y-1">
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Draft / Review</span>
          <p className="text-2xl font-bold text-amber-600">
            {paths.filter((p) => p.status === 'draft' || p.status === 'archived').length}
          </p>
          <span className="text-xs text-neutral-400">Unreachable by members</span>
        </div>
      </div>

      {/* Paths Listing Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">All Learning Paths</h2>
          <span className="text-xs text-neutral-500">Sorted by creation date</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {paths.map((path) => (
            <div
              key={path.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                      path.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : path.status === 'draft'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                    }`}
                  >
                    {path.status}
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    Role: <strong className="text-neutral-700">{path.targetRole}</strong>
                  </span>
                  <span className="text-xs font-medium text-neutral-400">·</span>
                  <span className="text-xs font-medium text-neutral-500">
                    Pass Mark: <strong className="text-neutral-700">{path.passMarkPercent}%</strong>
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900">
                  <Link href={`/admin/academy/${path.id}`} className="hover:text-blue-600 transition-colors">
                    {path.title}
                  </Link>
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2">{path.description}</p>

                <div className="flex items-center gap-4 pt-1 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {path.modules?.length || 0} Modules
                  </span>
                  {path.updatedBy && (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                      Updated by {path.updatedBy}
                    </span>
                  )}
                  <span>Last edit: {new Date(path.updatedAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/academy/${path.id}`}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors inline-flex items-center gap-1"
                >
                  Edit Path &amp; Quiz
                  <ArrowRight className="w-3 h-3" />
                </Link>
                {path.status === 'published' && (
                  <Link
                    href={`/academy/${path.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:text-neutral-900 text-xs font-medium transition-colors"
                  >
                    View Live
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
