import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  UserCheck,
  PlusCircle,
  FileText,
} from 'lucide-react';
import {
  getRecruitmentMetrics,
  getVacancies,
  getApplications,
  getTalentPoolCandidates,
} from '@/server/careers/store';

export default async function AdminCareersDashboardPage() {
  const metrics = await getRecruitmentMetrics();
  const recentApplications = (await getApplications()).slice(0, 5);
  const recentTalent = (await getTalentPoolCandidates()).slice(0, 5);
  const activeVacancies = (await getVacancies({ activeOnly: true })).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E5] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-medium tracking-wider uppercase text-[#6D6D68]">
              RECRUITMENT &amp; WORKFORCE MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-[#111111]">
            Careers &amp; Recruitment Control Centre
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/careers/talent-pool"
            className="px-3.5 py-2 text-xs font-normal text-[#111111] bg-white border border-[#E8E8E5] hover:border-[#CCCCCC] rounded transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#6D6D68]" />
            <span>Search Talent Pool</span>
          </Link>
          <Link
            href="/admin/careers/vacancies/new"
            className="px-4 py-2 text-xs font-normal text-white bg-[#111111] hover:bg-[#222222] rounded transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Vacancy</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded border border-[#E8E8E5] bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-normal text-[#6D6D68]">
            <span>Active Vacancies</span>
            <Briefcase className="w-4 h-4 text-[#111111]" />
          </div>
          <div className="text-3xl font-extralight text-[#111111] tracking-tight">
            {metrics.activeVacancies}
          </div>
          <div className="text-[11px] text-[#6D6D68]">Live on public careers page</div>
        </div>

        <div className="p-5 rounded border border-[#E8E8E5] bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-normal text-[#6D6D68]">
            <span>Awaiting Review</span>
            <Clock className="w-4 h-4 text-[#EA580C]" />
          </div>
          <div className="text-3xl font-extralight text-[#EA580C] tracking-tight">
            {metrics.applicationsAwaitingReview}
          </div>
          <div className="text-[11px] text-[#6D6D68]">New &amp; unreviewed applications</div>
        </div>

        <div className="p-5 rounded border border-[#E8E8E5] bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-normal text-[#6D6D68]">
            <span>Talent Network</span>
            <Users className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-3xl font-extralight text-[#111111] tracking-tight">
            {metrics.talentPoolCandidates}
          </div>
          <div className="text-[11px] text-[#6D6D68]">Retained speculative profiles</div>
        </div>

        <div className="p-5 rounded border border-[#E8E8E5] bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-normal text-[#6D6D68]">
            <span>Interviews &amp; Offers</span>
            <UserCheck className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-3xl font-extralight text-[#059669] tracking-tight">
            {metrics.interviewsScheduled} / {metrics.offersExtended}
          </div>
          <div className="text-[11px] text-[#6D6D68]">Active pipeline stages</div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Recent Applications (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-[#E8E8E5] rounded bg-white overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-[#E8E8E5] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-[#111111]">Recent Applications</h2>
                <p className="text-xs text-[#6D6D68]">Latest candidates applying to active EntireFM vacancies</p>
              </div>
              <Link
                href="/admin/careers/applications"
                className="text-xs text-[#2563EB] hover:underline font-normal flex items-center gap-1"
              >
                <span>View ATS Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#E8E8E5]">
              {recentApplications.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#6D6D68]">No applications received yet.</div>
              ) : (
                recentApplications.map((app) => (
                  <div key={app.id} className="p-4 hover:bg-[#F9F9F8] transition-colors flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-normal text-[#111111]">
                          {app.firstName} {app.lastName}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-normal uppercase tracking-wider ${
                            app.stage === 'NEW'
                              ? 'bg-[#FEF3C7] text-[#92400E]'
                              : app.stage === 'INTERVIEW'
                              ? 'bg-[#DBEAFE] text-[#1E40AF]'
                              : app.stage === 'SHORTLISTED'
                              ? 'bg-[#E0E7FF] text-[#3730A3]'
                              : app.stage === 'HIRED'
                              ? 'bg-[#D1FAE5] text-[#065F46]'
                              : 'bg-[#F3F4F6] text-[#4B5563]'
                          }`}
                        >
                          {app.stage}
                        </span>
                      </div>
                      <div className="text-xs text-[#6D6D68] truncate">
                        Applied for: <strong className="font-normal text-[#111111]">{app.vacancyTitle}</strong>
                      </div>
                      <div className="text-[11px] text-[#8C8C85]">
                        {app.location} · Applied {app.createdAt.split('T')[0]}
                      </div>
                    </div>

                    <Link
                      href={`/admin/careers/applications?id=${app.id}`}
                      className="px-3 py-1.5 rounded border border-[#E8E8E5] text-xs font-normal text-[#111111] hover:bg-white hover:border-[#CCCCCC] shrink-0"
                    >
                      Review
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Talent Pool Preview */}
          <div className="border border-[#E8E8E5] rounded bg-white overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-[#E8E8E5] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-[#111111]">Recent Talent Network Registrations</h2>
                <p className="text-xs text-[#6D6D68]">Speculative candidate profiles retained for future opportunities</p>
              </div>
              <Link
                href="/admin/careers/talent-pool"
                className="text-xs text-[#2563EB] hover:underline font-normal flex items-center gap-1"
              >
                <span>All Profiles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#E8E8E5]">
              {recentTalent.map((t) => (
                <div key={t.id} className="p-4 hover:bg-[#F9F9F8] transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-normal text-[#111111]">
                        {t.firstName} {t.lastName}
                      </span>
                      {t.currentRole && (
                        <span className="text-xs text-[#6D6D68]">({t.currentRole})</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {t.interestAreas.map((ia) => (
                        <span key={ia} className="px-1.5 py-0.5 bg-[#F4F4F2] text-[10px] text-[#555550] rounded">
                          {ia}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-[#8C8C85]">
                      {t.preferredLocation} · Availability: {t.availability || 'Standard'}
                    </div>
                  </div>

                  <Link
                    href={`/admin/careers/talent-pool?id=${t.id}`}
                    className="px-3 py-1.5 rounded border border-[#E8E8E5] text-xs font-normal text-[#111111] hover:bg-white shrink-0"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Vacancies & Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Vacancies */}
          <div className="border border-[#E8E8E5] rounded bg-white overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-[#E8E8E5] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-[#111111]">Live Vacancies</h2>
                <p className="text-xs text-[#6D6D68]">Currently active on public website</p>
              </div>
              <Link
                href="/admin/careers/vacancies"
                className="text-xs text-[#2563EB] hover:underline font-normal"
              >
                Manage
              </Link>
            </div>

            <div className="divide-y divide-[#E8E8E5]">
              {activeVacancies.map((v) => (
                <div key={v.id} className="p-4 hover:bg-[#F9F9F8] transition-colors space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/admin/careers/vacancies/${v.id}/edit`}
                      className="text-sm font-normal text-[#111111] hover:text-[#2563EB] transition-colors line-clamp-1"
                    >
                      {v.title}
                    </Link>
                    <span className="text-[10px] uppercase font-normal px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] shrink-0">
                      LIVE
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6D6D68]">
                    <span>{v.location}</span>
                    <span>Closes: {v.closingDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#F9F9F8] border-t border-[#E8E8E5]">
              <Link
                href="/admin/careers/vacancies/new"
                className="w-full py-2 bg-white border border-[#E8E8E5] hover:border-[#CCCCCC] rounded text-xs font-normal text-[#111111] flex items-center justify-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add New Job Opening</span>
              </Link>
            </div>
          </div>

          {/* Compliance & GDPR Status */}
          <div className="border border-[#E8E8E5] rounded bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-medium text-[#111111]">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>GDPR &amp; Data Retention Compliance</span>
            </div>
            <p className="text-xs text-[#6D6D68] leading-relaxed">
              All candidate CVs and speculative applications are captured with explicit processing consent and indexed with 24-month retention metadata. CV files are stored in private storage and accessed exclusively via signed admin tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
