'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import EmptyState from '@/components/admin/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { Plus, X, Loader2, Receipt, ArrowRight, CheckCircle2, FileText, Calendar, Building2 } from 'lucide-react';
import type { ClientInvoice } from '@/server/finance';
import type { ClientAccount } from '@/server/estate';

interface Props {
  initialInvoices: ClientInvoice[];
  clientAccounts: ClientAccount[];
}

const INVOICE_STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-zinc-100 text-zinc-700 border border-zinc-200',
  ISSUED: 'bg-blue-50 text-blue-700 border border-blue-200',
  PAID: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  OVERDUE: 'bg-red-50 text-red-700 border border-red-200',
  CANCELLED: 'bg-zinc-100 text-zinc-500 border border-zinc-200',
};

const PAYMENT_STATUS_BADGE: Record<string, string> = {
  NOT_DUE: 'text-[#6D6D68]',
  DUE: 'text-amber-600 font-medium',
  OVERDUE: 'text-red-600 font-medium',
  PART_PAID: 'text-blue-600 font-medium',
  PAID: 'text-emerald-600 font-medium',
};

export function ClientInvoicesPageClient({ initialInvoices, clientAccounts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldCreate = searchParams.get('create') === 'true';
  const prefillWoId = searchParams.get('workOrderId') || '';
  const prefillRef = searchParams.get('ref') || '';

  const [invoices, setInvoices] = useState<ClientInvoice[]>(initialInvoices);
  const [isModalOpen, setIsModalOpen] = useState(shouldCreate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [sourceType, setSourceType] = useState<'STANDALONE' | 'WORK_ORDER' | 'QUOTE' | 'CONTRACT'>(
    prefillWoId ? 'WORK_ORDER' : 'STANDALONE'
  );
  const [clientId, setClientId] = useState('');
  const [workOrderId, setWorkOrderId] = useState(prefillWoId);
  const [quoteId, setQuoteId] = useState('');
  const [contractId, setContractId] = useState('');
  const [clientPoRef, setClientPoRef] = useState('');
  const [description, setDescription] = useState(prefillRef ? `Completed Works — WO ${prefillRef}` : '');
  const [amountNet, setAmountNet] = useState('250.00');
  const [taxRatePct, setTaxRatePct] = useState('20.00');
  const [daysTerms, setDaysTerms] = useState('30');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (shouldCreate) {
      setIsModalOpen(true);
      if (prefillWoId) {
        setSourceType('WORK_ORDER');
        setWorkOrderId(prefillWoId);
        if (prefillRef && !description) {
          setDescription(`Completed Works — WO ${prefillRef}`);
        }
      }
    }
  }, [shouldCreate, prefillWoId, prefillRef, description]);

  const netNum = parseFloat(amountNet) || 0;
  const taxRateNum = parseFloat(taxRatePct) || 0;
  const taxNum = Math.round(netNum * (taxRateNum / 100) * 100) / 100;
  const grossNum = Math.round((netNum + taxNum) * 100) / 100;

  const totalBilled = invoices.reduce((sum, inv) => sum + (Number(inv.total_amount_gbp) || 0), 0);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('Please select a client account.');
      return;
    }
    if (!description.trim()) {
      setError('Invoice line description is required.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/finance/client-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientAccountId: clientId,
          contractId: contractId || undefined,
          workOrderId: workOrderId || undefined,
          quoteId: quoteId || undefined,
          clientPoRef: clientPoRef.trim() || undefined,
          notes: notes.trim() || undefined,
          daysTerms: parseInt(daysTerms, 10) || 30,
          lines: [
            {
              description: description.trim(),
              quantity: 1,
              unitPriceGbp: netNum,
              taxRatePct: taxRateNum,
              workOrderId: workOrderId || undefined,
              quoteId: quoteId || undefined,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to create client invoice');
      }

      setIsModalOpen(false);
      router.refresh();
      // Reload invoices from API to get the full formatted object
      const refreshed = await fetch('/api/admin/finance/client-invoices').then((r) => r.json());
      if (Array.isArray(refreshed)) {
        setInvoices(refreshed);
      }
    } catch (err: any) {
      setError(err.message || 'Error creating client invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminPageHeader
          category="Finance"
          title="Client Invoices"
          description="Authoritative client invoices, billing periods, payment status from accounting, and evidence packs."
        />
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Invoice
          </Button>
          <Link
            href="/admin/integrations/xero"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E8E8E5] text-xs text-[#111111] hover:bg-[#F5F5F3] transition"
          >
            <span>Xero Integration</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#9A9A95]" />
          </Link>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="flex items-center justify-between text-xs font-normal text-[#6D6D68] bg-[#FAFAF8] p-3.5 rounded-xl border border-[#E8E8E5]">
        <div>
          Total Invoices: <span className="text-[#111111] font-semibold">{invoices.length}</span>
        </div>
        <div>
          Total Invoiced: <span className="text-[#EA580C] font-semibold">£{totalBilled.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          title="No Client Invoices Found"
          description="Create a client invoice directly, or prepare invoices by batching items from the Billing Readiness queue."
          actionText="Create Invoice"
          onActionClick={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-white border border-[#E8E8E5] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-normal text-[#111111] min-w-[65rem]">
              <thead className="bg-[#FAFAF8] uppercase text-[10.5px] font-medium text-[#6D6D68] border-b border-[#E8E8E5]">
                <tr>
                  <th className="p-3.5">Invoice Number</th>
                  <th className="p-3.5">Client Account</th>
                  <th className="p-3.5">Issue Date</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Net (£)</th>
                  <th className="p-3.5">VAT (£)</th>
                  <th className="p-3.5">Total Gross (£)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Xero Sync</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E5]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F5F5F3] transition-colors">
                    <td className="p-3.5 font-medium text-[#111111]">
                      <Link
                        href={`/admin/finance/client-invoices/${inv.id}`}
                        className="hover:text-[#EA580C] underline underline-offset-2 transition"
                      >
                        {inv.invoice_number}
                      </Link>
                    </td>
                    <td className="p-3.5 text-[#111111]">
                      {clientAccounts.find((c) => c.id === inv.client_account_id)?.name ||
                        (inv.client_account_id ? inv.client_account_id.slice(0, 8) : '—')}
                    </td>
                    <td className="p-3.5 text-[#6D6D68]">{inv.issue_date || '—'}</td>
                    <td className="p-3.5 text-[#6D6D68]">{inv.due_date || '—'}</td>
                    <td className="p-3.5 font-normal text-[#111111]">£{(Number(inv.subtotal_gbp) || 0).toFixed(2)}</td>
                    <td className="p-3.5 text-[#6D6D68]">£{(Number(inv.tax_amount_gbp) || 0).toFixed(2)}</td>
                    <td className="p-3.5 font-semibold text-[#111111]">£{(Number(inv.total_amount_gbp) || 0).toFixed(2)}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-medium ${INVOICE_STATUS_BADGE[inv.status] || 'bg-zinc-100 text-zinc-600'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className={`p-3.5 text-[11px] ${PAYMENT_STATUS_BADGE[inv.payment_status] || 'text-[#111111]'}`}>
                      {inv.payment_status?.replace(/_/g, ' ') || 'NOT DUE'}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                          inv.accounting_sync_status === 'SYNCED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : inv.accounting_sync_status === 'SYNC_FAILED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : inv.accounting_sync_status === 'SYNCING'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                        }`}
                      >
                        {inv.accounting_sync_status || 'NOT SYNCED'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/admin/finance/client-invoices/${inv.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#EA580C] hover:text-[#C2410C]"
                      >
                        View
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E8E5] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#EA580C]" />
                <h3 className="text-sm font-semibold text-[#111111]">Create Client Invoice</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-[#9A9A95] hover:text-[#111111] hover:bg-[#F5F5F3]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Source Selection Pill Strip */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#6D6D68] mb-1.5">
                Invoice Source
              </label>
              <div className="grid grid-cols-4 gap-1.5 bg-[#FAFAF8] p-1 rounded-lg border border-[#E8E8E5] text-[11.5px]">
                {[
                  { id: 'STANDALONE', label: 'Standalone' },
                  { id: 'WORK_ORDER', label: 'Work Order' },
                  { id: 'QUOTE', label: 'Quote' },
                  { id: 'CONTRACT', label: 'Contract' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSourceType(s.id as any)}
                    className={`py-1 px-1.5 rounded-[5px] font-medium transition-all text-center truncate ${
                      sourceType === s.id
                        ? 'bg-white text-[#111111] shadow-2xs border border-[#E8E8E5]'
                        : 'text-[#6D6D68] hover:text-[#111111]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {prefillRef && sourceType === 'WORK_ORDER' && (
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
                <label className="block text-[11.5px] font-medium text-[#111111] mb-1">Client Account *</label>
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full rounded-lg border border-[#E8E8E5] bg-white px-3 py-2 text-xs text-[#111111] focus:border-[#EA580C] focus:outline-none"
                >
                  <option value="">Select Billed Client Account...</option>
                  {clientAccounts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.account_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#111111] mb-1">Invoice Line Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Electrical Compliance Remediation Works"
                  className="w-full rounded-lg border border-[#E8E8E5] bg-white px-3 py-2 text-xs text-[#111111] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#111111] mb-1">Client PO Reference</label>
                  <input
                    type="text"
                    value={clientPoRef}
                    onChange={(e) => setClientPoRef(e.target.value)}
                    placeholder="e.g. PO-89214"
                    className="w-full rounded-lg border border-[#E8E8E5] bg-white px-3 py-2 text-xs text-[#111111] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[#111111] mb-1">Payment Terms (Days)</label>
                  <select
                    value={daysTerms}
                    onChange={(e) => setDaysTerms(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E8E5] bg-white px-3 py-2 text-xs text-[#111111] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="14">14 Days</option>
                    <option value="30">30 Days (Standard)</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
              </div>

              {/* Arithmetic Breakdown */}
              <div className="grid grid-cols-3 gap-3 bg-[#FAFAF8] p-3 rounded-xl border border-[#E8E8E5]">
                <div>
                  <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">Net Amount (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={amountNet}
                    onChange={(e) => setAmountNet(e.target.value)}
                    className="w-full rounded-lg border border-[#E8E8E5] bg-white px-2.5 py-1.5 text-xs text-[#111111] font-medium focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">VAT (20%)</label>
                  <div className="w-full rounded-lg border border-[#E8E8E5] bg-[#F5F5F3] px-2.5 py-1.5 text-xs text-[#6D6D68] font-medium">
                    £{taxNum.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">Total Gross (£)</label>
                  <div className="w-full rounded-lg border border-[#E8E8E5] bg-white px-2.5 py-1.5 text-xs text-[#EA580C] font-semibold">
                    £{grossNum.toFixed(2)}
                  </div>
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
                      Creating Invoice…
                    </>
                  ) : (
                    'Generate Invoice'
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
