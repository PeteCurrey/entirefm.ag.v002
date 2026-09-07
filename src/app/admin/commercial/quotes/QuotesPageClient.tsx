'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { Plus, X, Loader2, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Quote } from '@/server/commercial';
import type { ClientAccount, Site } from '@/server/estate';

interface Props {
  initialQuotes: Quote[];
  clientAccounts: ClientAccount[];
  sites: Site[];
  currentStatus?: string;
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  INTERNAL_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  READY_TO_ISSUE: 'bg-blue-50 text-blue-700 border-blue-200',
  ISSUED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  EXPIRED: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};

export function QuotesPageClient({ initialQuotes, clientAccounts, sites, currentStatus }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldCreate = searchParams.get('create') === 'true';
  const prefillWoId = searchParams.get('workOrderId') || '';
  const prefillRef = searchParams.get('ref') || '';

  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [isModalOpen, setIsModalOpen] = useState(shouldCreate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(prefillRef ? `Variation Quote — WO ${prefillRef}` : '');
  const [clientId, setClientId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [description, setDescription] = useState(prefillRef ? `Work order ${prefillRef} additional works and materials scope.` : '');
  const [costGbp, setCostGbp] = useState('120.00');
  const [markupPct, setMarkupPct] = useState('25.00');
  const [sellGbp, setSellGbp] = useState('150.00');

  useEffect(() => {
    if (shouldCreate) {
      setIsModalOpen(true);
      if (prefillRef && !title) {
        setTitle(`Variation Quote — WO ${prefillRef}`);
        setDescription(`Work order ${prefillRef} additional works and materials scope.`);
      }
    }
  }, [shouldCreate, prefillRef, title]);

  // Recalculate sell when cost or markup changes
  const handleCostChange = (newCost: string) => {
    setCostGbp(newCost);
    const c = parseFloat(newCost) || 0;
    const m = parseFloat(markupPct) || 0;
    setSellGbp((c * (1 + m / 100)).toFixed(2));
  };

  const handleMarkupChange = (newMarkup: string) => {
    setMarkupPct(newMarkup);
    const c = parseFloat(costGbp) || 0;
    const m = parseFloat(newMarkup) || 0;
    setSellGbp((c * (1 + m / 100)).toFixed(2));
  };

  const handleSellChange = (newSell: string) => {
    setSellGbp(newSell);
    const s = parseFloat(newSell) || 0;
    const c = parseFloat(costGbp) || 0;
    if (c > 0) {
      setMarkupPct((((s - c) / c) * 100).toFixed(2));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Quote title is required');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/commercial/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || title.trim(),
          client_account_id: clientId || undefined,
          site_id: siteId || undefined,
          estimated_cost_gbp: parseFloat(costGbp) || 0,
          estimated_sell_gbp: parseFloat(sellGbp) || 0,
          lines: [
            {
              line_type: 'LABOUR',
              description: title.trim(),
              quantity: 1,
              unit_cost_gbp: parseFloat(costGbp) || 0,
              markup_pct: parseFloat(markupPct) || 0,
              unit_price_gbp: parseFloat(sellGbp) || 0,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create quote');
      }

      setQuotes([data.quote, ...quotes]);
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error creating quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { label: 'All Quotes', value: undefined },
    { label: 'Draft / Scope', value: 'DRAFT' },
    { label: 'Internal Review', value: 'INTERNAL_REVIEW' },
    { label: 'Ready to Issue', value: 'READY_TO_ISSUE' },
    { label: 'Issued to Client', value: 'ISSUED' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-8 font-sans">
      <AdminPageHeader
        category="Commercial"
        title="Quotes & Proposals"
        description="Authoritative quoting engine, rate card governance, client approvals, and margin intelligence."
        action={
          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Quote
            </Button>
            <Link
              href="/admin/commercial/talk-to-quote"
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-normal text-[#111111] border border-[#E8E8E5] hover:bg-[#F5F5F3] transition-colors"
            >
              🎤 Talk-to-Quote
            </Link>
            <Link
              href="/admin/commercial/wip"
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-normal text-[#111111] border border-[#E8E8E5] hover:bg-[#F5F5F3] transition-colors"
            >
              📊 Commercial WIP
            </Link>
          </div>
        }
      />

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 border-b border-[#E8E8E5] pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.value || (!currentStatus && !tab.value);
          const href = tab.value ? `/admin/commercial/quotes?status=${tab.value}` : '/admin/commercial/quotes';
          return (
            <Link
              key={tab.label}
              href={href}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#111111] text-white shadow-2xs'
                  : 'text-[#6D6D68] hover:text-[#111111] hover:bg-[#F5F5F3]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {quotes.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[70rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#FAFAF8] font-medium text-[11px] uppercase tracking-wider text-[#6D6D68]">
                <th className="px-5 py-3">Quote Ref</th>
                <th className="px-5 py-3">Ver</th>
                <th className="px-5 py-3">Description / Scope</th>
                <th className="px-5 py-3">Total (GBP)</th>
                <th className="px-5 py-3">Expected Margin</th>
                <th className="px-5 py-3">Client PO</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {quotes.map((q) => {
                const marginPct = q.expected_margin_pct ?? 0;
                const isHealthyMargin = marginPct >= 20;

                return (
                  <tr key={q.id} className="text-[#6D6D68] hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-5 py-4 text-xs text-[#111111] font-medium">
                      {q.quote_number}
                    </td>
                    <td className="px-5 py-4 font-normal text-xs text-[#9A9A95]">
                      v{q.version || 1}
                    </td>
                    <td className="px-5 py-4 max-w-xs truncate text-xs text-[#111111]">
                      {q.title || 'Standard Service Delivery'}
                    </td>
                    <td className="px-5 py-4 font-medium text-xs text-[#111111]">
                      £{(Number(q.total_sell_gbp) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4 text-xs font-normal">
                      <span className={isHealthyMargin ? 'text-emerald-700 font-medium' : 'text-amber-700'}>
                        {marginPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#9A9A95]">
                      {q.client_po_reference || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${STATUS_BADGE[q.status] || 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/commercial/quotes/${q.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#EA580C] hover:text-[#C2410C]"
                      >
                        Review
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Quotes Found"
          description="Create your first formal client quote or generate proposals from field survey scopes."
          actionText="Create Quote"
          onActionClick={() => setIsModalOpen(true)}
        />
      )}

      {/* CREATE QUOTE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E8E5] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#EA580C]" />
                <h3 className="text-sm font-semibold text-[#111111]">Create New Quote</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-[#9A9A95] hover:text-[#111111] hover:bg-[#F5F5F3]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {prefillRef && (
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-2.5 text-xs text-[#15803D] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Linked to Work Order: <strong>{prefillRef}</strong></span>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11.5px] font-medium text-[#111111] mb-1">Quote Title / Scope Summary *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AHU Fan Motor Replacement"
                  className="w-full rounded-lg border border-[#E8E8E5] bg-white px-3 py-2 text-xs text-[#111111] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#111111] mb-1">Client Account</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E8E5] bg-white px-3 py-2 text-xs text-[#111111] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="">Select Client (Optional)...</option>
                    {clientAccounts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.account_number})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#111111] mb-1">Site / Property</label>
                  <select
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E8E5] bg-white px-3 py-2 text-xs text-[#111111] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="">Select Site (Optional)...</option>
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.site_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#111111] mb-1">Detailed Scope</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scope of works, required parts, access considerations..."
                  className="w-full rounded-lg border border-[#E8E8E5] bg-white px-3 py-2 text-xs text-[#111111] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 bg-[#FAFAF8] p-3 rounded-xl border border-[#E8E8E5]">
                <div>
                  <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">Estimated Cost (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costGbp}
                    onChange={(e) => handleCostChange(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E8E5] bg-white px-2.5 py-1.5 text-xs text-[#111111] font-medium focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">Markup (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={markupPct}
                    onChange={(e) => handleMarkupChange(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E8E5] bg-white px-2.5 py-1.5 text-xs text-[#111111] font-medium focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">Total Sell (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={sellGbp}
                    onChange={(e) => handleSellChange(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E8E5] bg-white px-2.5 py-1.5 text-xs text-[#EA580C] font-semibold focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E8E5]">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-normal text-[#6D6D68] hover:bg-[#F5F5F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-[#EA580C] hover:bg-[#C2410C] shadow-2xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Creating Quote…
                    </>
                  ) : (
                    'Create Quote'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
