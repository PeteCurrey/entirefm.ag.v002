/**
 * Supplier Invoice Side-by-Side Review & Line Comparison Desk — Phase 0H
 * High-density operational matching workspace.
 */
import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import Link from 'next/link';
import {
  Receipt, CheckCircle2, XCircle, AlertTriangle,
  ShieldAlert, ArrowLeft, Building2, Calendar, FileText
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:read')) redirect('/admin');

  const { id } = await params;

  const [invRes, linesRes, poRes, auditRes] = await Promise.all([
    dbQuery<any[]>(`supplier_invoices?id=eq.${encodeURIComponent(id)}&select=*`),
    dbQuery<any[]>(`supplier_invoice_lines?supplier_invoice_id=eq.${encodeURIComponent(id)}&select=*&order=line_number.asc`),
    dbQuery<any[]>(`purchase_orders?select=*`),
    dbQuery<any[]>(`audit_events?object_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc&limit=20`),
  ]);

  if (!invRes.data || invRes.data.length === 0) {
    redirect('/admin/finance/supplier-invoices');
  }

  const invoice = invRes.data[0];
  const lines = linesRes.data || [];
  const po = (poRes.data || []).find((p: any) => p.id === (invoice.matched_po_id || invoice.purchase_order_id));
  const audits = auditRes.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-normal text-brand-mist/60">
        <Link href="/admin/finance/supplier-invoices" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Supplier Invoices
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-edge-dark pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extralight text-white tracking-tight">
              {invoice.invoice_ref}
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-normal bg-brand-edge-dark text-white border border-brand-edge-dark">
              {invoice.processing_status}
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-normal bg-blue-950/60 text-blue-300 border border-blue-800/40">
              MATCH: {invoice.match_status}
            </span>
          </div>
          <p className="text-xs font-normal text-brand-mist/70 mt-1">
            Supplier ID: {invoice.supplier_org_id} · Channel: {invoice.ingest_channel} · Created: {new Date(invoice.created_at).toLocaleString('en-GB')}
          </p>
        </div>

        {/* FINANCIAL TOTALS */}
        <div className="flex items-center gap-6 bg-brand-carbon/60 border border-brand-edge-dark p-4 rounded-xl font-normal text-right">
          <div>
            <div className="text-[10.5px] uppercase text-brand-mist/60">Net</div>
            <div className="text-sm font-normal text-white">£{(Number(invoice.subtotal_gbp) || 0).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-[10.5px] uppercase text-brand-mist/60">VAT (20%)</div>
            <div className="text-sm font-normal text-white">£{(Number(invoice.tax_amount_gbp) || 0).toFixed(2)}</div>
          </div>
          <div className="border-l border-brand-edge-dark pl-6">
            <div className="text-[10.5px] uppercase text-brand-mist/60">Total Gross</div>
            <div className="text-xl font-light text-brand-electric">£{(Number(invoice.total_amount_gbp) || 0).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* BANK ALERT BANNER */}
      {invoice.bank_details_change_alert && (
        <div className="p-4 rounded-xl border border-red-800 bg-red-950/40 text-red-300 space-y-2">
          <div className="flex items-center gap-2 font-normal text-sm">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            CRITICAL: BANK DETAIL CHANGE ALERT
          </div>
          <p className="text-xs text-red-200/80">
            This invoice contains banking details differing from approved records on file.
            Supplier master data has NOT been modified. Verification must be performed out-of-band before approval.
          </p>
        </div>
      )}

      {/* DUPLICATE BANNER */}
      {invoice.duplicate_of_invoice_id && (
        <div className="p-4 rounded-xl border border-amber-800 bg-amber-950/40 text-amber-300 space-y-1">
          <div className="flex items-center gap-2 font-normal text-sm">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            POSSIBLE DUPLICATE DETECTED
          </div>
          <p className="text-xs text-amber-200/80">
            This invoice matches existing invoice <Link href={`/admin/finance/supplier-invoices/${invoice.duplicate_of_invoice_id}`} className="underline font-normal">{invoice.duplicate_of_invoice_id.slice(0, 8)}</Link>.
          </p>
        </div>
      )}

      {/* SIDE BY SIDE COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: SUPPLIER INVOICE DATA */}
        <div className="space-y-4 bg-brand-carbon/40 border border-brand-edge-dark p-5 rounded-xl">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <h2 className="text-sm font-normal uppercase tracking-wider text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-brand-electric" /> Supplier Invoice Document
            </h2>
            <span className="text-xs font-normal text-brand-mist/60">
              Confidence: {((invoice.extraction_confidence || 1) * 100).toFixed(0)}%
            </span>
          </div>

          <div className="space-y-2 text-xs font-normal">
            <div className="flex justify-between py-1 border-b border-brand-edge-dark/40">
              <span className="text-brand-mist/60">Invoice Ref:</span>
              <span className="text-white font-light">{invoice.invoice_ref}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-edge-dark/40">
              <span className="text-brand-mist/60">Issue Date:</span>
              <span className="text-white">{invoice.issue_date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-edge-dark/40">
              <span className="text-brand-mist/60">Due Date:</span>
              <span className="text-white">{invoice.due_date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-brand-edge-dark/40">
              <span className="text-brand-mist/60">Document Storage:</span>
              <span className="text-brand-mist/80 truncate max-w-[200px]">{invoice.document_storage_path || 'Direct Ingestion'}</span>
            </div>
          </div>

          {/* EXTRACTED LINES */}
          <div className="mt-4">
            <div className="text-xs font-normal uppercase text-brand-mist/60 mb-2">Invoiced Lines ({lines.length})</div>
            <div className="space-y-2">
              {lines.map((l: any, i: number) => (
                <div key={l.id || i} className="p-3 bg-brand-void/60 border border-brand-edge-dark/60 rounded-lg text-xs font-normal space-y-1">
                  <div className="flex justify-between text-white font-light">
                    <span>{l.description}</span>
                    <span className="text-brand-electric">£{(Number(l.total_amount_gbp) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-brand-mist/60">
                    <span>Qty: {l.quantity} × £{(Number(l.unit_price_gbp || l.unit_price_net_gbp) || 0).toFixed(2)}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${l.variance_type === 'EXACT_MATCH' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {l.variance_type || 'PENDING MATCH'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: ENTIREFM RECORD (PO / CAFM) */}
        <div className="space-y-4 bg-brand-carbon/40 border border-brand-edge-dark p-5 rounded-xl">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <h2 className="text-sm font-normal uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" /> Authorised PO & CAFM Record
            </h2>
            <span className="text-xs font-normal text-emerald-400">
              {po ? `PO: ${po.po_number || po.id.slice(0, 8)}` : 'NO PO LINKED'}
            </span>
          </div>

          {po ? (
            <div className="space-y-2 text-xs font-normal">
              <div className="flex justify-between py-1 border-b border-brand-edge-dark/40">
                <span className="text-brand-mist/60">PO Reference:</span>
                <span className="text-white font-light">{po.po_number || po.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-edge-dark/40">
                <span className="text-brand-mist/60">PO Status:</span>
                <span className="text-emerald-400 font-light">{po.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-edge-dark/40">
                <span className="text-brand-mist/60">Authorised Net:</span>
                <span className="text-white">£{(Number(po.amount_net_gbp || po.total_amount_gbp) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-edge-dark/40">
                <span className="text-brand-mist/60">Variance vs Invoice:</span>
                <span className={`font-light ${(Number(invoice.variance_amount_gbp) || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  £{(Number(invoice.variance_amount_gbp) || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-lg text-xs font-normal text-purple-300">
              No formal Purchase Order linked. Emergency/no-PO policy rules apply.
            </div>
          )}

          {/* AUDIT / CAUSATION */}
          <div className="mt-4">
            <div className="text-xs font-normal uppercase text-brand-mist/60 mb-2">Audit Provenance</div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {audits.map((a: any) => (
                <div key={a.id} className="p-2 bg-brand-void/40 border border-brand-edge-dark/40 rounded text-[11px] font-normal flex justify-between">
                  <span className="text-white/80">{a.event_type}</span>
                  <span className="text-brand-mist/50">{new Date(a.created_at).toLocaleTimeString('en-GB')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
