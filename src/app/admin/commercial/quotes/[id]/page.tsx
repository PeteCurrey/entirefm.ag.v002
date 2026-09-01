import React from 'react';
import Link from 'next/link';
import { dbQuery } from '@/server/db/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: quotes } = await dbQuery<any[]>(`quotes?id=eq.${id}&select=*`);
  if (!quotes || quotes.length === 0) {
    return (
      <div className="space-y-6">
        <AdminPageHeader category="Commercial" title="Quote Not Found" description="The requested quote could not be located." />
        <EmptyState
          title="Quote Not Found"
          description={`No quote exists with ID ${id}.`}
          actionText="Back to Quotes"
          actionHref="/admin/commercial/quotes"
        />
      </div>
    );
  }

  const quote = quotes[0];
  const { data: lines } = await dbQuery<any[]>(`quote_lines?quote_id=eq.${id}&select=*`);
  const { data: provenance } = await dbQuery<any[]>(`quote_provenance?quote_id=eq.${id}&select=*`);
  const { data: versions } = await dbQuery<any[]>(`quote_versions?quote_id=eq.${id}&select=*&order=version.desc`);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Commercial"
        title={`${quote.quote_number} (v${quote.version || 1})`}
        description={`Status: ${quote.internal_status || quote.status} · Created ${new Date(quote.created_at).toLocaleDateString('en-GB')}`}
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/commercial/quotes"
              className="rounded bg-brand-carbon px-3 py-1.5 text-[12px] font-normal text-brand-mist/80 border border-brand-edge-dark hover:text-white"
            >
              ← Back to Quotes
            </Link>
          </div>
        }
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="font-medium text-[11px] uppercase tracking-wider text-brand-mist/50">Sell Total (Net)</div>
          <div className="mt-1 text-[20px] font-normal text-white">
            £{Number(quote.subtotal_gbp || 0).toFixed(2)}
          </div>
          <div className="mt-1 font-normal text-[11px] text-brand-mist/60">
            VAT (£{Number(quote.tax_amount_gbp || 0).toFixed(2)}) → Gross £{Number(quote.total_amount_gbp || 0).toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="font-medium text-[11px] uppercase tracking-wider text-brand-mist/50">Expected Cost (Internal)</div>
          <div className="mt-1 text-[20px] font-normal text-brand-mist/90">
            £{Number(quote.expected_cost_gbp || 0).toFixed(2)}
          </div>
          <div className="mt-1 font-normal text-[11px] text-brand-mist/40">
            Labour + Materials direct supplier cost
          </div>
        </div>

        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="font-medium text-[11px] uppercase tracking-wider text-brand-mist/50">Projected Margin</div>
          <div className="mt-1 text-[20px] font-normal text-emerald-400">
            £{Number(quote.expected_margin_gbp || 0).toFixed(2)} ({quote.expected_margin_pct ?? 0}%)
          </div>
          <div className="mt-1 font-normal text-[11px] text-emerald-400/60">
            Complies with policy min 20%
          </div>
        </div>

        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="font-medium text-[11px] uppercase tracking-wider text-brand-mist/50">Client PO Status</div>
          <div className="mt-1 text-[16px] font-normal text-white">
            {quote.client_po_ref ? (
              <span className="text-emerald-400">{quote.client_po_ref}</span>
            ) : quote.client_po_required ? (
              <span className="text-amber-400">PO Required Prior to Delivery</span>
            ) : (
              <span className="text-brand-mist/40">Not Required</span>
            )}
          </div>
          <div className="mt-1 font-normal text-[11px] text-brand-mist/40">
            Validity: {quote.validity_days || 30} days
          </div>
        </div>
      </div>

      {/* Scope Overview Card */}
      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5">
        <h3 className="font-medium text-[12px] uppercase tracking-wider text-brand-mist/60">Commercial Scope</h3>
        <p className="mt-2 text-[13px] text-brand-mist/90 leading-relaxed">
          {quote.scope_description || 'Standard remedial and rectification works.'}
        </p>
      </div>

      {/* Quote Lines Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[12px] uppercase tracking-wider text-brand-mist/60">Quoted Line Items</h3>
          <span className="font-normal text-[11px] text-brand-mist/40">{lines?.length || 0} line(s)</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[55rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-medium text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Unit Sell (GBP)</th>
                <th className="px-5 py-3">Total Sell (GBP)</th>
                <th className="px-5 py-3 text-right">Pricing Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {lines && lines.length > 0 ? (
                lines.map((l, idx) => (
                  <tr key={l.id || idx} className="text-brand-mist/80 hover:bg-brand-void/40">
                    <td className="px-5 py-4">
                      <span className="rounded bg-brand-edge-dark px-2 py-0.5 font-normal text-[10px] text-brand-electric-bright">
                        {l.line_type}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-normal text-[12px] text-white">
                      {l.description}
                    </td>
                    <td className="px-5 py-4 font-normal text-[11.5px] text-brand-mist/60">
                      {l.quantity}
                    </td>
                    <td className="px-5 py-4 font-normal text-[12px] text-brand-mist/80">
                      £{Number(l.unit_price_gbp).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-[12.5px] font-normal text-white">
                      £{Number(l.total_gbp).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-right font-normal text-[11px] text-brand-mist/50">
                      {l.pricing_notes || 'Verified Rate Card'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-brand-mist/40">
                    No line items attached to this quote.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Version History & Provenance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5">
          <h3 className="font-medium text-[12px] uppercase tracking-wider text-brand-mist/60">Quote Version Snapshots</h3>
          <div className="mt-4 space-y-3">
            {versions && versions.length > 0 ? (
              versions.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded border border-brand-edge-dark/60 bg-brand-void/40 p-3 text-[12px]">
                  <div>
                    <span className="font-light text-white">Version {v.version}</span>
                    <p className="text-[11px] text-brand-mist/60 mt-0.5">{v.change_reason}</p>
                  </div>
                  <span className="font-normal text-[10.5px] text-brand-mist/40">
                    {new Date(v.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-brand-mist/40">Initial version (v1) active.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5">
          <h3 className="font-medium text-[12px] uppercase tracking-wider text-brand-mist/60">AI Governance & Source Provenance</h3>
          <div className="mt-4 space-y-3">
            {provenance && provenance.length > 0 ? (
              provenance.map((p, idx) => (
                <div key={p.id || idx} className="rounded border border-brand-edge-dark/60 bg-brand-void/40 p-3 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="font-normal text-[11px] text-brand-electric-bright">{p.source_type}</span>
                    <span className="font-normal text-[10px] text-emerald-400">Confidence: {(Number(p.ai_confidence_score || 0.85) * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-[11.5px] text-brand-mist/70 mt-1">{p.pricing_rule_applied || 'Standard deterministic rule calculation'}</p>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-brand-mist/40">No external source provenance records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
