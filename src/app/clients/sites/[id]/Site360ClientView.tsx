'use client';

/**
 * SITE360 CLIENT PROPERTY VIEW
 * ==============================
 * A single operational view of a property and the FM services EntireFM delivers:
 * Property info, active & historical jobs, PPM schedules, compliance records,
 * maintainable assets, technical documents & drawings, and quotations.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Wrench,
  CalendarClock,
  ShieldCheck,
  Cpu,
  FileText,
  Coins,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  ExternalLink,
  ChevronRight,
  History,
} from 'lucide-react';

interface Site360ClientViewProps {
  site: any;
  buildings: any[];
  workOrders: any[];
  ppmOccurrences: any[];
  complianceObligations: any[];
  certificates: any[];
  assets: any[];
  documents: any[];
  quotes: any[];
  clientName: string;
}

type TabType = 'property' | 'jobs' | 'ppm' | 'compliance' | 'assets' | 'documents' | 'quotes';

export function Site360ClientView({
  site,
  buildings,
  workOrders,
  ppmOccurrences,
  complianceObligations,
  certificates,
  assets,
  documents,
  quotes,
  clientName,
}: Site360ClientViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('property');

  const openJobs = workOrders.filter(
    (wo) => !['COMPLETED', 'CLOSED', 'CANCELLED'].includes(wo.status)
  );
  const completedJobs = workOrders.filter((wo) =>
    ['COMPLETED', 'CLOSED'].includes(wo.status)
  );

  const pendingQuotes = quotes.filter((q) =>
    ['DRAFT', 'ISSUED', 'PENDING_APPROVAL'].includes(q.status)
  );

  const tabs: Array<{ id: TabType; label: string; count?: number; alert?: boolean }> = [
    { id: 'property', label: 'Property' },
    { id: 'jobs', label: 'Jobs', count: openJobs.length, alert: openJobs.length > 0 },
    { id: 'ppm', label: 'Planned Maintenance', count: ppmOccurrences.length },
    {
      id: 'compliance',
      label: 'Compliance',
      count: complianceObligations.length,
      alert: complianceObligations.some((o) => o.status === 'OVERDUE'),
    },
    { id: 'assets', label: 'Assets', count: assets.length },
    { id: 'documents', label: 'Documents & Drawings', count: documents.length },
    { id: 'quotes', label: 'Quotations', count: pendingQuotes.length, alert: pendingQuotes.length > 0 },
  ];

  return (
    <div className="space-y-6">
      {/* ─── SITE HEADER ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-medium">
                SITE360 · PROPERTY OPERATIONAL VIEW
              </span>
              <span className="rounded bg-brand-void border border-brand-edge-dark px-2 py-0.5 text-[10px] font-mono text-brand-mist/60">
                {site.site_code || 'SITE'}
              </span>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                {site.status || 'ACTIVE'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">{site.name}</h1>
            <p className="text-xs text-brand-mist/70 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-electric" />
              {[site.address_line1, site.address_line2, site.city, site.postcode]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/log-a-job?site_id=${site.id}`}
              className="inline-flex items-center gap-1.5 rounded-sm border border-brand-electric/50 bg-brand-electric/15 px-4 py-2 text-xs font-light tracking-wide text-brand-electric-bright hover:border-brand-electric hover:bg-brand-electric/25 hover:text-white transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              Log Job on Site
            </Link>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-brand-edge-dark/60 text-xs">
          <div>
            <span className="text-[10px] uppercase text-brand-mist/40 block">Open Jobs</span>
            <span className={`text-base font-light ${openJobs.length > 0 ? 'text-amber-400' : 'text-white'}`}>
              {openJobs.length} active
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-brand-mist/40 block">Maintainable Assets</span>
            <span className="text-base font-light text-white">{assets.length} registered</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-brand-mist/40 block">Compliance</span>
            <span className={`text-base font-light ${
              complianceObligations.some((o) => o.status === 'OVERDUE')
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`}>
              {complianceObligations.some((o) => o.status === 'OVERDUE')
                ? 'Attention Required'
                : 'Up to Date'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-brand-mist/40 block">Quotes Pending</span>
            <span className={`text-base font-light ${pendingQuotes.length > 0 ? 'text-purple-300' : 'text-brand-mist/60'}`}>
              {pendingQuotes.length} awaiting
            </span>
          </div>
        </div>
      </div>

      {/* ─── NAVIGATION TABS ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-brand-edge-dark/60 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-light whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'border-brand-electric text-white font-normal bg-brand-carbon/40'
                : 'border-transparent text-brand-mist/60 hover:text-white hover:bg-brand-carbon/20'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  tab.alert
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-brand-void text-brand-mist/60'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── TAB CONTENT ─────────────────────────────────────────────────── */}

      {/* 1. PROPERTY TAB */}
      {activeTab === 'property' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-4">
              <h2 className="text-sm font-normal text-white">Property Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-brand-mist/50 block">Property Name</span>
                  <p className="text-white font-light text-sm mt-0.5">{site.name}</p>
                </div>
                <div>
                  <span className="text-brand-mist/50 block">Site Code</span>
                  <p className="text-white font-mono mt-0.5">{site.site_code || '—'}</p>
                </div>
                <div>
                  <span className="text-brand-mist/50 block">Property Type</span>
                  <p className="text-white mt-0.5">{site.site_type?.replace(/_/g, ' ') || 'Commercial Facility'}</p>
                </div>
                <div>
                  <span className="text-brand-mist/50 block">Managing Client</span>
                  <p className="text-white mt-0.5">{clientName}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-brand-mist/50 block">Full Address</span>
                  <p className="text-white mt-0.5">
                    {[site.address_line1, site.address_line2, site.city, site.county, site.postcode, site.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
                {site.access_instructions && (
                  <div className="sm:col-span-2 pt-2 border-t border-brand-edge-dark/40">
                    <span className="text-brand-mist/50 block">Access & Attendance Notes</span>
                    <p className="text-brand-mist mt-1 leading-relaxed">{site.access_instructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Buildings and floor zones if present */}
            {buildings.length > 0 && (
              <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-3">
                <h2 className="text-sm font-normal text-white">Buildings & Demarcations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {buildings.map((b) => (
                    <div
                      key={b.id}
                      className="border border-brand-edge-dark bg-brand-void/40 rounded-lg p-3 text-xs"
                    >
                      <span className="text-[10px] text-brand-electric-bright font-mono">
                        {b.building_code}
                      </span>
                      <p className="text-white font-normal mt-0.5">{b.name}</p>
                      {b.gross_internal_area_sqm && (
                        <p className="text-brand-mist/50 mt-1">GIA: {b.gross_internal_area_sqm.toLocaleString()} m²</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-3">
              <h3 className="text-xs uppercase tracking-wider text-brand-mist/50 font-normal">
                EntireFM Contract Scope
              </h3>
              <p className="text-xs text-brand-mist/80 leading-relaxed">
                EntireFM provides contracted facilities management services for this site. Work orders, maintenance visits, compliance tests, and documentation are recorded against this property.
              </p>
              <div className="pt-2 border-t border-brand-edge-dark/40 space-y-2 text-xs">
                <div className="flex items-center justify-between text-brand-mist/60">
                  <span>Site Status:</span>
                  <span className="text-emerald-400">{site.status || 'Active'}</span>
                </div>
                <div className="flex items-center justify-between text-brand-mist/60">
                  <span>Security Clearance:</span>
                  <span className="text-white">{site.security_clearance_required ? 'Required' : 'Standard'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-brand-mist/50 font-normal">
                Need Assistance?
              </h3>
              <p className="text-xs text-brand-mist/70">
                To report an urgent issue or request service attendance for this site, contact the 24/7 EntireFM Helpdesk.
              </p>
              <Link
                href="/log-a-job"
                className="inline-flex items-center gap-1 text-xs text-brand-electric hover:underline pt-1"
              >
                Log a maintenance request →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. JOBS TAB */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-normal text-white mb-3">Open Work Orders ({openJobs.length})</h2>
            {openJobs.length === 0 ? (
              <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-8 text-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-2 opacity-70" />
                <p className="text-sm text-brand-mist font-normal">No open maintenance jobs for this property.</p>
                <p className="text-xs text-brand-mist/40 mt-1">All reactive tasks for this site are up to date.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
                <table className="w-full text-left text-[13px]">
                  <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                    <tr>
                      <th className="px-5 py-3">Reference</th>
                      <th className="px-5 py-3">Issue Title</th>
                      <th className="px-5 py-3">Priority</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                    {openJobs.map((wo) => (
                      <tr key={wo.id} className="hover:bg-brand-void/30 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-brand-electric-bright text-xs">
                          {wo.work_order_number}
                        </td>
                        <td className="px-5 py-3.5 text-white font-normal">{wo.title}</td>
                        <td className="px-5 py-3.5 text-xs text-brand-mist/70">{wo.priority}</td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded border px-2 py-0.5 text-[10px] font-normal ${
                            wo.status === 'IN_PROGRESS'
                              ? 'border-brand-electric/30 bg-brand-electric/10 text-brand-electric-bright'
                              : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                          }`}>
                            {wo.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/clients/work-orders/${wo.id}`}
                            className="text-xs text-brand-electric hover:underline inline-flex items-center gap-1"
                          >
                            View Details <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {completedJobs.length > 0 && (
            <div>
              <h2 className="text-sm font-normal text-white mb-3">Recently Completed Jobs</h2>
              <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
                <table className="w-full text-left text-[13px]">
                  <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                    <tr>
                      <th className="px-5 py-3">Reference</th>
                      <th className="px-5 py-3">Issue Title</th>
                      <th className="px-5 py-3">Completed Date</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                    {completedJobs.slice(0, 10).map((wo) => (
                      <tr key={wo.id} className="hover:bg-brand-void/30 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-brand-mist/70 text-xs">
                          {wo.work_order_number}
                        </td>
                        <td className="px-5 py-3.5 text-white">{wo.title}</td>
                        <td className="px-5 py-3.5 text-xs text-brand-mist/50">
                          {wo.completed_at
                            ? new Date(wo.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Completed'}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/clients/work-orders/${wo.id}`}
                            className="text-xs text-brand-mist/60 hover:text-white"
                          >
                            View Record →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. PPM TAB */}
      {activeTab === 'ppm' && (
        <div>
          {ppmOccurrences.length === 0 ? (
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-8 text-center">
              <CalendarClock className="w-7 h-7 text-brand-mist/30 mx-auto mb-2" />
              <p className="text-sm text-brand-mist font-normal">No planned maintenance visits currently scheduled for this site.</p>
              <p className="text-xs text-brand-mist/40 mt-1">PPM schedules are coordinated according to contract requirements.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                  <tr>
                    <th className="px-5 py-3">Schedule Ref</th>
                    <th className="px-5 py-3">Asset / Equipment</th>
                    <th className="px-5 py-3">Maintenance Plan</th>
                    <th className="px-5 py-3">Planned Date</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                  {ppmOccurrences.map((occ) => (
                    <tr key={occ.id} className="hover:bg-brand-void/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-brand-electric-bright text-xs">
                        {occ.occurrence_code}
                      </td>
                      <td className="px-5 py-3.5 text-white font-normal">{occ.asset?.name || 'Site Asset'}</td>
                      <td className="px-5 py-3.5 text-brand-mist/70">{occ.plan?.name || 'Standard Service'}</td>
                      <td className="px-5 py-3.5 text-xs text-white">
                        {occ.planned_date
                          ? new Date(occ.planned_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                          {occ.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. COMPLIANCE TAB */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-normal text-white mb-3">Statutory Obligations</h2>
            {complianceObligations.length === 0 ? (
              <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-8 text-center">
                <ShieldCheck className="w-7 h-7 text-brand-mist/30 mx-auto mb-2" />
                <p className="text-sm text-brand-mist font-normal">No statutory obligations currently registered for this site.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
                <table className="w-full text-left text-[13px]">
                  <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                    <tr>
                      <th className="px-5 py-3">Obligation</th>
                      <th className="px-5 py-3">Responsible Party</th>
                      <th className="px-5 py-3">Next Due</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                    {complianceObligations.map((ob) => (
                      <tr key={ob.id} className="hover:bg-brand-void/30 transition-colors">
                        <td className="px-5 py-3.5 text-white font-normal">
                          {ob.rule_version?.rule?.title || ob.title || 'Statutory Inspection'}
                        </td>
                        <td className="px-5 py-3.5 text-brand-mist/70">{ob.responsible_party || 'EntireFM'}</td>
                        <td className="px-5 py-3.5 text-xs text-white">
                          {ob.next_due_at
                            ? new Date(ob.next_due_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded border px-2 py-0.5 text-[10px] ${
                            ob.status === 'COMPLIANT'
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                              : ob.status === 'OVERDUE'
                              ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                              : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                          }`}>
                            {ob.status === 'COMPLIANT' ? 'Current' : ob.status === 'OVERDUE' ? 'Expired' : 'Due Soon'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {certificates.length > 0 && (
            <div>
              <h2 className="text-sm font-normal text-white mb-3">Filed Certificates</h2>
              <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
                <table className="w-full text-left text-[13px]">
                  <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                    <tr>
                      <th className="px-5 py-3">Certificate Type</th>
                      <th className="px-5 py-3">Issued Date</th>
                      <th className="px-5 py-3">Expiry Date</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                    {certificates.map((c) => (
                      <tr key={c.id} className="hover:bg-brand-void/30 transition-colors">
                        <td className="px-5 py-3.5 text-white">{c.certificate_type}</td>
                        <td className="px-5 py-3.5 text-xs text-brand-mist/60">{c.issued_date || '—'}</td>
                        <td className="px-5 py-3.5 text-xs text-brand-mist/60">{c.expiry_date || '—'}</td>
                        <td className="px-5 py-3.5">
                          <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. ASSETS TAB */}
      {activeTab === 'assets' && (
        <div>
          {assets.length === 0 ? (
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-8 text-center">
              <Cpu className="w-7 h-7 text-brand-mist/30 mx-auto mb-2" />
              <p className="text-sm text-brand-mist font-normal">No assets currently registered to this property.</p>
              <p className="text-xs text-brand-mist/40 mt-1">Maintainable equipment is catalogued during contract mobilisation.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                  <tr>
                    <th className="px-5 py-3">Asset Ref</th>
                    <th className="px-5 py-3">Equipment Name</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Manufacturer / Model</th>
                    <th className="px-5 py-3">Condition</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                  {assets.map((a) => (
                    <tr key={a.id} className="hover:bg-brand-void/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-brand-electric-bright text-xs">
                        {a.asset_reference}
                      </td>
                      <td className="px-5 py-3.5 text-white font-normal">{a.name}</td>
                      <td className="px-5 py-3.5 text-xs text-brand-mist/70">{a.category}</td>
                      <td className="px-5 py-3.5 text-xs text-brand-mist/50">
                        {[a.manufacturer, a.model_number].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-brand-mist/70">
                        {a.condition || 'Good'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                          {a.status?.replace(/_/g, ' ') || 'In Service'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/20 p-4 text-xs text-brand-mist/70">
            <span className="text-white font-normal block mb-1">Technical Drawings &amp; Property Documentation</span>
            Drawings, plans, manuals, and technical documents stored here have been supplied to EntireFM and are organised against this site record.
          </div>

          {documents.length === 0 ? (
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-8 text-center">
              <FileText className="w-7 h-7 text-brand-mist/30 mx-auto mb-2" />
              <p className="text-sm text-brand-mist font-normal">No documents have been added to this site yet.</p>
              <p className="text-xs text-brand-mist/40 mt-1">Technical documents and plans can be supplied to your account team for archival.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                  <tr>
                    <th className="px-5 py-3">Document Title</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Expiry</th>
                    <th className="px-5 py-3 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-brand-void/30 transition-colors">
                      <td className="px-5 py-3.5 text-white font-normal">{doc.title}</td>
                      <td className="px-5 py-3.5 text-xs text-brand-mist/70">{doc.document_type || 'Record'}</td>
                      <td className="px-5 py-3.5 text-xs text-brand-mist/50">{doc.expiry_date || '—'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/api/documents/download?id=${doc.id}`}
                          className="inline-flex items-center gap-1 text-xs text-brand-electric hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 7. QUOTATIONS TAB */}
      {activeTab === 'quotes' && (
        <div>
          {quotes.length === 0 ? (
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-8 text-center">
              <Coins className="w-7 h-7 text-brand-mist/30 mx-auto mb-2" />
              <p className="text-sm text-brand-mist font-normal">No quotations are currently associated with this site.</p>
              <p className="text-xs text-brand-mist/40 mt-1">Extra works recommendations and quotes appear here for your review.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                  <tr>
                    <th className="px-5 py-3">Quote Ref</th>
                    <th className="px-5 py-3">Title / Scope</th>
                    <th className="px-5 py-3">Value (ex VAT)</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-brand-void/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-brand-electric-bright text-xs">
                        {q.quote_number}
                      </td>
                      <td className="px-5 py-3.5 text-white font-normal">{q.title}</td>
                      <td className="px-5 py-3.5 text-xs text-white">
                        £{Number(q.total_price_gbp || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded border px-2 py-0.5 text-[10px] ${
                          q.status === 'APPROVED'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                            : q.status === 'REJECTED'
                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                            : 'border-purple-500/20 bg-purple-500/10 text-purple-300'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href="/clients/quotes"
                          className="text-xs text-brand-electric hover:underline"
                        >
                          Review in Approvals →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
