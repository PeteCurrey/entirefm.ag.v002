import React from 'react';
import Link from 'next/link';
import {
  listAllSupplierApplications,
  getSupplierApplicationQueueCounts,
  type CanonicalSupplierApplication,
} from '@/server/suppliers/applications-repo';
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  XCircle,
  Info,
  Building2,
  ShieldAlert,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  STARTED: {
    label: 'Started',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    icon: <Clock className="h-3 w-3" />,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    icon: <Clock className="h-3 w-3" />,
  },
  SUBMITTED: {
    label: 'Submitted',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: <Info className="h-3 w-3" />,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: <Info className="h-3 w-3" />,
  },
  INFORMATION_REQUIRED: {
    label: 'Info Required',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    icon: <AlertCircle className="h-3 w-3" />,
  },
  APPROVED: {
    label: 'Approved',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: <XCircle className="h-3 w-3" />,
  },
  REGISTRATION_CLASSIFICATION_REQUIRED: {
    label: 'Unclassified',
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    icon: <ShieldAlert className="h-3 w-3" />,
  },
};

const STATUS_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING_REVIEW', label: 'Pending Review' },
  { key: 'INFORMATION_REQUIRED', label: 'Info Required' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'REGISTRATION_CLASSIFICATION_REQUIRED', label: 'Unclassified' },
];

export default async function InboundApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams?.status || 'ALL';
  const searchQuery = resolvedParams?.q || '';

  const [applications, counts] = await Promise.all([
    listAllSupplierApplications({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      search: searchQuery || undefined,
    }),
    getSupplierApplicationQueueCounts(),
  ]);

  const pendingAction = counts.underReview + counts.informationRequired + counts.classificationRequired;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            SUPPLIER ASSURANCE REVIEW QUEUE
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Supplier Qualification Applications
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            All inbound contractor registrations from the EntireFM public supplier portal. Live data from Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {pendingAction > 0 && (
            <span className="text-xs px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {pendingAction} Require Action
            </span>
          )}
          <span className="text-xs px-2.5 py-1 rounded bg-slate-900 text-white font-bold">
            {counts.total} Total
          </span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total', value: counts.total, bg: 'bg-slate-50', text: 'text-slate-900' },
          { label: 'In Progress', value: counts.started, bg: 'bg-amber-50', text: 'text-amber-900' },
          { label: 'Submitted', value: counts.submitted, bg: 'bg-blue-50', text: 'text-blue-900' },
          { label: 'Under Review', value: counts.underReview, bg: 'bg-indigo-50', text: 'text-indigo-900' },
          { label: 'Info Required', value: counts.informationRequired, bg: 'bg-orange-50', text: 'text-orange-900' },
          { label: 'Approved', value: counts.approved, bg: 'bg-emerald-50', text: 'text-emerald-900' },
          { label: 'Unclassified', value: counts.classificationRequired, bg: 'bg-rose-50', text: 'text-rose-900' },
        ].map((k) => (
          <div key={k.label} className={`${k.bg} border border-slate-200 p-3 rounded-sm text-center`}>
            <div className={`text-xl font-bold ${k.text}`}>{k.value}</div>
            <div className="text-[10px] text-slate-500 font-normal uppercase mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="flex gap-0 overflow-x-auto border-b border-slate-200">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <Link
                key={tab.key}
                href={`/admin/suppliers/applications?status=${tab.key}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-brand-pink text-brand-pink bg-rose-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Applications List */}
        <div className="divide-y divide-slate-100">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <UserCheck className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No applications in this category.</p>
              <p className="text-xs text-slate-400 mt-1">New contractor signups will appear here automatically.</p>
            </div>
          ) : (
            applications.map((app) => {
              const statusConf = STATUS_CONFIG[app.status] || STATUS_CONFIG['IN_PROGRESS'];
              const isUnclassified = app.status === 'REGISTRATION_CLASSIFICATION_REQUIRED';

              return (
                <div
                  key={app.id}
                  className={`p-5 hover:bg-slate-50/50 transition-colors ${isUnclassified ? 'bg-rose-50/30' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Identity */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-brand-pink font-bold">{app.applicationReference}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1${statusConf.bg} ${statusConf.text}`}
                        >
                          {statusConf.icon}
                          {statusConf.label}
                        </span>
                        {app.recordOrigin === 'RECOVERED_FROM_CONTRACTOR_SIGNUP' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                            RECOVERED
                          </span>
                        )}
                        {app.pendingRfiCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {app.pendingRfiCount} RFI Open
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {isUnclassified ? (
                          <span className="italic text-slate-500">Awaiting organisation setup</span>
                        ) : (
                          app.companyName
                        )}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{app.applicantName}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-normal">{app.applicantEmail}</span>
                        {app.companyNumber && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="font-normal">Co. {app.companyNumber}</span>
                          </>
                        )}
                      </div>
                      {(app.trades.length > 0 || app.coverage.length > 0) && (
                        <div className="flex gap-4 text-[11px] text-slate-500 pt-0.5">
                          {app.trades.length > 0 && (
                            <span>
                              <span className="text-slate-400">Trades: </span>
                              {app.trades.slice(0, 4).join(', ')}
                              {app.trades.length > 4 && ` +${app.trades.length - 4} more`}
                            </span>
                          )}
                          {app.coverage.length > 0 && (
                            <span>
                              <span className="text-slate-400">Coverage: </span>
                              {app.coverage.slice(0, 3).join(', ')}
                              {app.coverage.length > 3 && ` +${app.coverage.length - 3} more`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right text-[10px] text-slate-400 font-normal hidden sm:block">
                        <div>{new Date(app.createdAt).toLocaleDateString('en-GB')}</div>
                        <div>Step {app.currentStep}/12</div>
                      </div>
                      {isUnclassified ? (
                        <Link
                          href={`/admin/suppliers/applications/${app.id}`}
                          className="text-xs py-1.5 px-3 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold flex items-center gap-1"
                        >
                          <Building2 className="h-3 w-3" />
                          Classify
                        </Link>
                      ) : (
                        <Link
                          href={`/admin/suppliers/applications/${app.id}`}
                          className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1 font-bold"
                        >
                          <span>Review</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
