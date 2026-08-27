'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  FileText,
  Wrench,
  Calendar,
  DollarSign,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Clock,
  ChevronRight,
  Users,
  Layers,
} from 'lucide-react';
import { ClientAccount, Contract, Site, Asset } from '@/server/estate';
import { WorkOrder } from '@/server/work';
import { Quote } from '@/server/commercial';
import { MaintenancePlan } from '@/server/ppm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';

interface Props {
  client: ClientAccount;
  contracts: Contract[];
  sites: Site[];
  assets: Asset[];
  workOrders: WorkOrder[];
  quotes: Quote[];
  ppmPlans: MaintenancePlan[];
}

export function ClientHubClient({
  client,
  contracts,
  sites,
  assets,
  workOrders,
  quotes,
  ppmPlans,
}: Props) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SITES' | 'ASSETS' | 'CONTRACTS' | 'JOBS' | 'PPM' | 'QUOTES'>('OVERVIEW');

  const openJobs = workOrders.filter((w) => w.status !== 'COMPLETED' && w.status !== 'CLOSED' && w.status !== 'CANCELLED');

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <AdminPageHeader
        category="Client Operations Hub"
        title={client.name}
        description={`Account #${client.account_number} · ${client.account_tier} · Status: ${client.account_status}`}
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/operations/work-orders">
              <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
                Raise Job
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#686866]">Managed Sites</span>
          <p className="text-xl font-light text-[#101010] mt-1">{sites.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#686866]">Total Assets</span>
          <p className="text-xl font-light text-[#101010] mt-1">{assets.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#686866]">Live Contracts</span>
          <p className="text-xl font-light text-[#101010] mt-1">{contracts.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#686866]">Open Jobs</span>
          <p className="text-xl font-light text-amber-600 mt-1">{openJobs.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#686866]">PPM Plans</span>
          <p className="text-xl font-light text-[#101010] mt-1">{ppmPlans.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#686866]">Quotes</span>
          <p className="text-xl font-light text-[#101010] mt-1">{quotes.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E4E4E1] flex gap-4 text-[13px]">
        {(['OVERVIEW', 'SITES', 'ASSETS', 'CONTRACTS', 'JOBS', 'PPM', 'QUOTES'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-[#686866] hover:text-[#101010]'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sites Summary */}
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium text-[#101010]">Managed Sites ({sites.length})</h3>
              <Link href="/admin/estate/sites" className="text-[12px] text-[#EA580C] hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {sites.length === 0 ? (
              <p className="text-[12.5px] text-[#686866]">No physical sites registered under this client yet.</p>
            ) : (
              <div className="space-y-2">
                {sites.slice(0, 5).map((s) => (
                  <Link
                    key={s.id}
                    href={`/admin/estate/sites/${s.id}`}
                    className="flex items-center justify-between p-2.5 rounded-[6px] hover:bg-[#FAFAF8] border border-[#E4E4E1] transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[13px] text-[#101010]">{s.name}</div>
                      <div className="text-[11px] text-[#686866]">{s.city}, {s.postcode} · {s.site_code}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#9B9B97]" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Active Work Orders */}
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium text-[#101010]">Recent & Open Jobs ({openJobs.length})</h3>
              <Link href="/admin/operations/work-orders" className="text-[12px] text-[#EA580C] hover:underline flex items-center gap-1">
                All Jobs <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {openJobs.length === 0 ? (
              <p className="text-[12.5px] text-[#686866]">No active work orders. Estate operations running normally.</p>
            ) : (
              <div className="space-y-2">
                {openJobs.slice(0, 5).map((w) => (
                  <div key={w.id} className="p-2.5 rounded-[6px] border border-[#E4E4E1] flex items-center justify-between">
                    <div>
                      <div className="font-medium text-[13px] text-[#101010]">{w.title}</div>
                      <div className="text-[11px] text-[#686866]">{w.work_order_number} · {w.priority}</div>
                    </div>
                    <span className="rounded px-2 py-0.5 text-[10px] font-mono bg-[#FAFAF8] border border-[#E4E4E1] text-[#686866]">
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'SITES' && (
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-medium text-[#101010]">All Sites ({sites.length})</h3>
          </div>
          {sites.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No sites registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/estate/sites/${s.id}`}
                  className="p-4 rounded-[8px] border border-[#E4E4E1] hover:border-[#EA580C] transition-colors block"
                >
                  <div className="font-medium text-[13.5px] text-[#101010]">{s.name}</div>
                  <div className="text-[11.5px] text-[#686866] mt-1">{s.address_line1}, {s.city} {s.postcode}</div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#686866]">
                    <span>{s.site_code}</span>
                    <span className="text-[#EA580C]">Open Site 360 →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ASSETS' && (
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
          <h3 className="text-[14px] font-medium text-[#101010] mb-4">Assets ({assets.length})</h3>
          {assets.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No assets registered under client sites yet.</p>
          ) : (
            <div className="divide-y divide-[#E4E4E1]">
              {assets.map((a) => (
                <div key={a.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[13px] text-[#101010]">{a.name}</div>
                    <div className="text-[11px] text-[#686866]">{a.asset_reference} · {a.category} · Condition: {a.condition}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAFAF8] border border-[#E4E4E1] text-[#686866]">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'CONTRACTS' && (
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
          <h3 className="text-[14px] font-medium text-[#101010] mb-4">Commercial Contracts ({contracts.length})</h3>
          {contracts.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No active commercial contracts.</p>
          ) : (
            <div className="space-y-3">
              {contracts.map((c) => (
                <div key={c.id} className="p-3 rounded-[6px] border border-[#E4E4E1] flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[13px] text-[#101010]">{c.name}</div>
                    <div className="text-[11px] text-[#686866]">Ref: {c.contract_reference} · Type: {c.contract_type} · Term: {c.start_date} to {c.end_date}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'JOBS' && (
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
          <h3 className="text-[14px] font-medium text-[#101010] mb-4">Work Orders ({workOrders.length})</h3>
          {workOrders.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No work orders logged for this client.</p>
          ) : (
            <div className="space-y-2">
              {workOrders.map((w) => (
                <div key={w.id} className="p-3 rounded-[6px] border border-[#E4E4E1] flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[13px] text-[#101010]">{w.title}</div>
                    <div className="text-[11px] text-[#686866]">{w.work_order_number} · Priority: {w.priority} · Type: {w.work_type}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAFAF8] border border-[#E4E4E1] text-[#686866]">
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'PPM' && (
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
          <h3 className="text-[14px] font-medium text-[#101010] mb-4">Planned Maintenance Plans ({ppmPlans.length})</h3>
          {ppmPlans.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No maintenance plans created yet.</p>
          ) : (
            <div className="space-y-2">
              {ppmPlans.map((p) => (
                <div key={p.id} className="p-3 rounded-[6px] border border-[#E4E4E1] flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[13px] text-[#101010]">{p.name}</div>
                    <div className="text-[11px] text-[#686866]">Plan #{p.plan_number} · Year: {p.plan_year}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAFAF8] border border-[#E4E4E1] text-[#686866]">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'QUOTES' && (
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
          <h3 className="text-[14px] font-medium text-[#101010] mb-4">Commercial Quotes ({quotes.length})</h3>
          {quotes.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No quotes generated for this client.</p>
          ) : (
            <div className="space-y-2">
              {quotes.map((q) => (
                <div key={q.id} className="p-3 rounded-[6px] border border-[#E4E4E1] flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[13px] text-[#101010]">{q.title}</div>
                    <div className="text-[11px] text-[#686866]">{q.quote_number} · Value: £{q.total_sell_gbp.toFixed(2)}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAFAF8] border border-[#E4E4E1] text-[#686866]">
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
