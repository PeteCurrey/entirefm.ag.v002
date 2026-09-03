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
  Briefcase,
  Mail,
  Phone,
  Edit2,
  Check,
  AlertCircle,
  X,
  Receipt,
  ArrowRight,
} from 'lucide-react';
import { ClientAccount, Contract, Site, Asset } from '@/server/estate';
import { EligibleAccountManager } from '@/server/estate/account-managers';
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
  accountManagers?: EligibleAccountManager[];
  invoices?: any[];
}

export function ClientHubClient({
  client: initialClient,
  contracts,
  sites,
  assets,
  workOrders: initialWorkOrders,
  quotes: initialQuotes,
  ppmPlans,
  accountManagers = [],
  invoices: initialInvoices = [],
}: Props) {
  const [client, setClient] = useState<ClientAccount>(initialClient);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'SITES' | 'ASSETS' | 'CONTRACTS' | 'JOBS' | 'PPM' | 'QUOTES' | 'INVOICES'
  >('OVERVIEW');

  // Reassignment state
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState<string>(client.account_manager_id || '');
  const [isSavingManager, setIsSavingManager] = useState(false);
  const [reassignError, setReassignError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quote Creation Modal state
  const [isCreateQuoteOpen, setIsCreateQuoteOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    title: '',
    site_id: sites[0]?.id || '',
    description: '',
    estimated_cost_gbp: '250.00',
    estimated_sell_gbp: '350.00',
  });
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const openJobs = workOrders.filter(
    (w) => w.status !== 'COMPLETED' && w.status !== 'CLOSED' && w.status !== 'CANCELLED'
  );

  const handleSaveAccountManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingManager(true);
    setReassignError(null);

    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_manager_id: selectedManagerId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update account manager');
      }

      setClient(data.client);
      setSuccessMessage('Dedicated Account Manager updated successfully.');
      setIsReassignModalOpen(false);
    } catch (err: any) {
      setReassignError(err.message || 'Error updating account manager');
    } finally {
      setIsSavingManager(false);
    }
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingQuote(true);
    setReassignError(null);

    try {
      const cost = parseFloat(quoteForm.estimated_cost_gbp) || 200;
      const sell = parseFloat(quoteForm.estimated_sell_gbp) || 280;

      const res = await fetch('/api/admin/commercial/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_account_id: client.id,
          site_id: quoteForm.site_id || undefined,
          title: quoteForm.title.trim(),
          description: quoteForm.description.trim() || quoteForm.title.trim(),
          lines: [
            {
              line_type: 'LABOUR',
              description: quoteForm.title.trim(),
              quantity: 1,
              unit_cost_gbp: cost,
              markup_pct: cost > 0 ? ((sell - cost) / cost) * 100 : 25,
              unit_price_gbp: sell,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create quote');
      }

      setQuotes((prev) => [data.quote, ...prev]);
      setSuccessMessage(`Quotation ${data.quote.quote_number} generated successfully.`);
      setIsCreateQuoteOpen(false);
      setQuoteForm({
        title: '',
        site_id: sites[0]?.id || '',
        description: '',
        estimated_cost_gbp: '250.00',
        estimated_sell_gbp: '350.00',
      });
      setActiveTab('QUOTES');
    } catch (err: any) {
      setReassignError(err.message || 'Error creating quote');
    } finally {
      setIsCreatingQuote(false);
    }
  };

  const handleConvertQuoteToJob = async (quoteId: string) => {
    setActionLoadingId(quoteId);
    setReassignError(null);

    try {
      const res = await fetch(`/api/admin/commercial/quotes/${quoteId}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overrideStatus: true }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to convert quote to job');
      }

      setQuotes((prev) =>
        prev.map((q) =>
          q.id === quoteId
            ? { ...q, converted_work_order_id: data.workOrder.id, work_order_id: data.workOrder.id }
            : q
        )
      );

      // Check if job already exists in state
      if (!workOrders.find((w) => w.id === data.workOrder.id)) {
        setWorkOrders((prev) => [data.workOrder, ...prev]);
      }

      setSuccessMessage(
        `Quotation successfully converted to Work Order ${data.workOrder.work_order_number}!`
      );
    } catch (err: any) {
      setReassignError(err.message || 'Error converting quote to work order');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleGenerateInvoiceFromJob = async (workOrderId: string) => {
    setActionLoadingId(workOrderId);
    setReassignError(null);

    try {
      const res = await fetch(`/api/admin/work-orders/${workOrderId}/invoice`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate invoice from job');
      }

      setWorkOrders((prev) =>
        prev.map((w) => (w.id === workOrderId ? { ...w, billing_status: 'INVOICED' } : w))
      );

      if (!invoices.find((inv) => inv.id === data.invoice.id)) {
        setInvoices((prev) => [data.invoice, ...prev]);
      }

      setSuccessMessage(
        `Invoice ${data.invoice.invoice_number} generated and issued successfully!`
      );
    } catch (err: any) {
      setReassignError(err.message || 'Error generating invoice');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <AdminPageHeader
        category="Client Operations Hub"
        title={client.name}
        description={`Account #${client.account_number || client.id.substring(0, 8)} · ${client.account_tier} · Status: ${client.account_status}`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Users className="h-3.5 w-3.5" />}
              onClick={() => {
                setSelectedManagerId(client.account_manager_id || '');
                setReassignError(null);
                setIsReassignModalOpen(true);
              }}
            >
              Reassign Manager
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<FileText className="h-3.5 w-3.5" />}
              onClick={() => {
                setReassignError(null);
                setIsCreateQuoteOpen(true);
              }}
            >
              Raise Quote
            </Button>
            <Link href="/admin/operations/work-orders">
              <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
                Raise Job
              </Button>
            </Link>
          </div>
        }
      />

      {/* Success Notification */}
      {successMessage && (
        <div className="rounded-[8px] bg-emerald-50 border border-emerald-200 p-3.5 flex items-center justify-between text-emerald-800 text-[12.5px]">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {reassignError && (
        <div className="rounded-[8px] bg-rose-50 border border-rose-200 p-3.5 flex items-center justify-between text-rose-800 text-[12.5px]">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{reassignError}</span>
          </div>
          <button
            onClick={() => setReassignError(null)}
            className="text-rose-600 hover:text-rose-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-normal uppercase text-[#686866]">Managed Sites</span>
          <p className="text-xl font-light text-[#101010] mt-1">{sites.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-normal uppercase text-[#686866]">Total Assets</span>
          <p className="text-xl font-light text-[#101010] mt-1">{assets.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-normal uppercase text-[#686866]">Live Contracts</span>
          <p className="text-xl font-light text-[#101010] mt-1">{contracts.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-normal uppercase text-[#686866]">Open Jobs</span>
          <p className="text-xl font-light text-amber-600 mt-1">{openJobs.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-normal uppercase text-[#686866]">PPM Plans</span>
          <p className="text-xl font-light text-[#101010] mt-1">{ppmPlans.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-normal uppercase text-[#686866]">Quotes</span>
          <p className="text-xl font-light text-[#101010] mt-1">{quotes.length}</p>
        </div>
        <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-3 shadow-xs">
          <span className="text-[11px] font-normal uppercase text-[#686866]">Invoices</span>
          <p className="text-xl font-light text-emerald-600 mt-1">{invoices.length}</p>
        </div>
      </div>

      {/* Account Management Banner Strip */}
      <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-medium text-[#686866] tracking-wider block">
              EntireFM Account Lead
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-medium text-[#101010]">
                {client.account_manager
                  ? `${client.account_manager.first_name} ${client.account_manager.last_name}`
                  : 'Unassigned Account Manager'}
              </span>
              {client.account_manager?.email && (
                <span className="text-[11.5px] text-[#686866]">
                  ({client.account_manager.email})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedManagerId(client.account_manager_id || '');
              setReassignError(null);
              setIsReassignModalOpen(true);
            }}
          >
            {client.account_manager ? 'Change Account Manager' : 'Assign Account Manager'}
          </Button>
          <Link href="/admin/estate/team">
            <Button variant="secondary" size="sm">
              Team Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E4E4E1] flex gap-4 text-[13px] overflow-x-auto">
        {(
          [
            'OVERVIEW',
            'SITES',
            'ASSETS',
            'CONTRACTS',
            'JOBS',
            'PPM',
            'QUOTES',
            'INVOICES',
          ] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-[#686866] hover:text-[#101010]'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}{' '}
            {tab === 'JOBS' && `(${workOrders.length})`}
            {tab === 'QUOTES' && `(${quotes.length})`}
            {tab === 'INVOICES' && `(${invoices.length})`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sites Summary */}
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium text-[#101010]">
                Managed Sites ({sites.length})
              </h3>
              <Link
                href="/admin/estate/sites"
                className="text-[12px] text-[#EA580C] hover:underline flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {sites.length === 0 ? (
              <p className="text-[12.5px] text-[#686866]">
                No physical sites registered under this client yet.
              </p>
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
                      <div className="text-[11px] text-[#686866]">
                        {s.city}, {s.postcode} · {s.site_code}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#9B9B97]" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Work Orders */}
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium text-[#101010]">
                Active Work Orders ({openJobs.length})
              </h3>
              <button
                onClick={() => setActiveTab('JOBS')}
                className="text-[12px] text-[#EA580C] hover:underline flex items-center gap-1"
              >
                View all ({workOrders.length})
              </button>
            </div>
            {openJobs.length === 0 ? (
              <p className="text-[12.5px] text-[#686866]">No active jobs awaiting completion.</p>
            ) : (
              <div className="space-y-2">
                {openJobs.slice(0, 5).map((w) => (
                  <Link
                    key={w.id}
                    href={`/admin/operations/work-orders/${w.id}`}
                    className="flex items-center justify-between p-2.5 rounded-[6px] hover:bg-[#FAFAF8] border border-[#E4E4E1] transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[13px] text-[#101010]">{w.title}</div>
                      <div className="text-[11px] text-[#686866]">
                        {w.work_order_number} · Priority: {w.priority} · Status: {w.status}
                      </div>
                    </div>
                    <Badge variant={w.status === 'IN_PROGRESS' ? 'amber' : 'neutral'}>
                      {w.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'SITES' && (
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-medium text-[#101010]">
              Managed Estate Sites ({sites.length})
            </h3>
            <Link href="/admin/estate/sites">
              <Button variant="secondary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
                Register Site
              </Button>
            </Link>
          </div>
          {sites.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No sites registered.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sites.map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/estate/sites/${s.id}`}
                  className="p-4 rounded-[8px] border border-[#E4E4E1] hover:border-[#EA580C] bg-[#FFFFFF] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAFAF8] border border-[#E4E4E1]">
                      {s.site_code}
                    </span>
                    <Badge variant="green">Active</Badge>
                  </div>
                  <h4 className="font-medium text-[13.5px] text-[#101010] mb-1">{s.name}</h4>
                  <p className="text-[11.5px] text-[#686866]">
                    {s.address_line1}, {s.city} {s.postcode}
                  </p>
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
            <p className="text-[12.5px] text-[#686866]">
              No assets registered under client sites yet.
            </p>
          ) : (
            <div className="divide-y divide-[#E4E4E1]">
              {assets.map((a) => (
                <div key={a.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[13px] text-[#101010]">{a.name}</div>
                    <div className="text-[11px] text-[#686866]">
                      {a.asset_reference} · {a.category} · Condition: {a.condition}
                    </div>
                  </div>
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-[#FAFAF8] border border-[#E4E4E1] text-[#686866]">
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
          <h3 className="text-[14px] font-medium text-[#101010] mb-4">
            Commercial Contracts ({contracts.length})
          </h3>
          {contracts.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No active commercial contracts.</p>
          ) : (
            <div className="space-y-3">
              {contracts.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-[6px] border border-[#E4E4E1] flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-[13px] text-[#101010]">{c.name}</div>
                    <div className="text-[11px] text-[#686866]">
                      Ref: {c.contract_reference} · Type: {c.contract_type} · Term: {c.start_date} to{' '}
                      {c.end_date}
                    </div>
                  </div>
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-medium text-[#101010]">
              Work Orders & Jobs ({workOrders.length})
            </h3>
            <Link href="/admin/operations/work-orders">
              <Button variant="secondary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
                Create Work Order
              </Button>
            </Link>
          </div>
          {workOrders.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No work orders logged for this client.</p>
          ) : (
            <div className="space-y-3">
              {workOrders.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-[8px] border border-[#E4E4E1] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FFFFFF]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/operations/work-orders/${w.id}`}
                        className="font-medium text-[13px] text-[#101010] hover:text-[#EA580C] transition-colors"
                      >
                        {w.title}
                      </Link>
                      <Badge
                        variant={
                          w.status === 'COMPLETED'
                            ? 'green'
                            : w.status === 'IN_PROGRESS'
                            ? 'amber'
                            : 'neutral'
                        }
                      >
                        {w.status}
                      </Badge>
                      {w.billing_status === 'INVOICED' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          INVOICED
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-[#686866] mt-1">
                      {w.work_order_number} · Priority: {w.priority} · Type: {w.work_type}
                      {w.site && ` · Site: ${w.site.name}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {w.status === 'COMPLETED' && w.billing_status !== 'INVOICED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Receipt className="h-3.5 w-3.5 text-emerald-600" />}
                        disabled={actionLoadingId === w.id}
                        onClick={() => handleGenerateInvoiceFromJob(w.id)}
                      >
                        {actionLoadingId === w.id ? 'Invoicing...' : 'Generate Invoice'}
                      </Button>
                    )}
                    <Link href={`/admin/operations/work-orders/${w.id}`}>
                      <Button variant="secondary" size="sm" icon={<ExternalLink className="h-3.5 w-3.5" />}>
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'QUOTES' && (
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-medium text-[#101010]">
              Commercial Quotations ({quotes.length})
            </h3>
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setIsCreateQuoteOpen(true)}
            >
              Create Quotation
            </Button>
          </div>
          {quotes.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No quotes generated for this client.</p>
          ) : (
            <div className="space-y-3">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-[8px] border border-[#E4E4E1] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FFFFFF]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[13px] text-[#101010]">
                        {q.scope_description || q.title || q.quote_number}
                      </span>
                      <Badge
                        variant={
                          q.status === 'APPROVED' || q.status === 'ACCEPTED'
                            ? 'green'
                            : q.status === 'REJECTED'
                            ? 'red'
                            : 'neutral'
                        }
                      >
                        {q.status}
                      </Badge>
                    </div>
                    <div className="text-[11.5px] text-[#686866] mt-1">
                      {q.quote_number} · Net Value: £
                      {Number(q.total_amount_gbp || q.total_sell_gbp || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {q.converted_work_order_id ? (
                      <Link href={`/admin/operations/work-orders/${q.converted_work_order_id}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                        >
                          View Work Order
                        </Button>
                      </Link>
                    ) : (
                      (q.status === 'APPROVED' || q.status === 'ACCEPTED' || q.status === 'DRAFT') && (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<ArrowRight className="h-3.5 w-3.5" />}
                          disabled={actionLoadingId === q.id}
                          onClick={() => handleConvertQuoteToJob(q.id)}
                        >
                          {actionLoadingId === q.id ? 'Converting...' : 'Convert to Job'}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'INVOICES' && (
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-5">
          <h3 className="text-[14px] font-medium text-[#101010] mb-4">
            Client Invoices ({invoices.length})
          </h3>
          {invoices.length === 0 ? (
            <p className="text-[12.5px] text-[#686866]">No client invoices on record.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead className="border-b border-[#E4E4E1] text-[#686866] text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Invoice Number</th>
                    <th className="py-2.5 px-3">Subtotal</th>
                    <th className="py-2.5 px-3">Total (inc. VAT)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E1] text-[#101010]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#FAFAF8]">
                      <td className="py-2.5 px-3 font-mono font-medium">{inv.invoice_number}</td>
                      <td className="py-2.5 px-3">
                        £{Number(inv.subtotal_gbp || 0).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 font-medium">
                        £{Number(inv.total_amount_gbp || inv.total_gbp || 0).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant={inv.status === 'ISSUED' ? 'green' : 'neutral'}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            inv.payment_status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {inv.payment_status || 'NOT_DUE'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#686866]">{inv.due_date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Create Quotation Modal ── */}
      {isCreateQuoteOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E4E4E1] max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E1]">
              <div>
                <h3 className="text-base font-light text-[#101010]">Raise Quotation</h3>
                <p className="text-xs text-[#686866]">
                  Generate a quotation for {client.name}.
                </p>
              </div>
              <button
                onClick={() => setIsCreateQuoteOpen(false)}
                className="text-[#9B9B97] hover:text-[#101010]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#101010] font-medium mb-1">Quote Title *</label>
                <input
                  type="text"
                  required
                  value={quoteForm.title}
                  onChange={(e) => setQuoteForm({ ...quoteForm, title: e.target.value })}
                  placeholder="e.g. Annual Gas Boiler Inspection & Certification"
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">Target Site</label>
                <select
                  value={quoteForm.site_id}
                  onChange={(e) => setQuoteForm({ ...quoteForm, site_id: e.target.value })}
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                >
                  <option value="">-- Select Client Site --</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.site_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Estimated Cost (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={quoteForm.estimated_cost_gbp}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, estimated_cost_gbp: e.target.value })
                    }
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Quoted Sell Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={quoteForm.estimated_sell_gbp}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, estimated_sell_gbp: e.target.value })
                    }
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">Scope Description</label>
                <textarea
                  rows={3}
                  value={quoteForm.description}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, description: e.target.value })
                  }
                  placeholder="Outline work scope and inclusions..."
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E1]">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  disabled={isCreatingQuote}
                  onClick={() => setIsCreateQuoteOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isCreatingQuote}>
                  {isCreatingQuote ? 'Creating...' : 'Create Quotation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reassign Account Manager Modal ── */}
      {isReassignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E4E4E1] max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E1]">
              <div>
                <h3 className="text-base font-light text-[#101010]">Reassign Account Manager</h3>
                <p className="text-xs text-[#686866]">
                  Select an active EntireFM internal personnel to manage {client.name}.
                </p>
              </div>
              <button
                onClick={() => setIsReassignModalOpen(false)}
                className="text-[#9B9B97] hover:text-[#101010]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAccountManager} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#101010] font-medium mb-1">
                  Dedicated Account Manager
                </label>
                <select
                  value={selectedManagerId}
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                >
                  <option value="">-- No Assigned Account Manager --</option>
                  {accountManagers.map((mgr) => (
                    <option key={mgr.id} value={mgr.id}>
                      {mgr.first_name} {mgr.last_name} (
                      {mgr.role_name || mgr.job_title || 'Account Manager'})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#686866] mt-1.5">
                  Only active EntireFM personnel with account management capabilities are listed.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E1]">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  disabled={isSavingManager}
                  onClick={() => setIsReassignModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSavingManager}>
                  {isSavingManager ? 'Saving...' : 'Save Assignment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
