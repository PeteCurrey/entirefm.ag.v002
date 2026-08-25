import React from 'react';
import Link from 'next/link';
import { getCommercialDashboardMetrics, listCommercialProducts, listPartnerInvoices, listPartnerMemberships } from '@/server/partner-network/store';
import { CommercialMetricCards } from '@/components/admin/suppliers/CommercialMetricCards';
import { DollarSign, CreditCard, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PartnerCommercialHubPage() {
  const [metrics, products, invoices, memberships] = await Promise.all([
    getCommercialDashboardMetrics(),
    listCommercialProducts(),
    listPartnerInvoices(),
    listPartnerMemberships(),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            PARTNER NETWORK COMMERCIAL GOVERNANCE
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Commercial &amp; Revenue Control Centre
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Supplier memberships, annual renewal billing, event ticketing, sponsorship agreements, and Stripe receivables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/suppliers/commercial/invoices" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5" /> Invoices &amp; Billing
          </Link>
          <Link href="/admin/suppliers/commercial/products" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold rounded transition-colors">
            Pricing &amp; Products
          </Link>
        </div>
      </div>

      {/* Procurement Firewall Advisory */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">PROCUREMENT FIREWALL MANDATE: </span>
          <span>
            Supplier commercial payment, membership tier, or sponsorship never grants technical compliance approval, preferred status, or automated job allocation.
          </span>
        </div>
      </div>

      {/* Commercial KPIs */}
      <CommercialMetricCards metrics={metrics} />

      {/* Grid: Memberships & Invoices Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Memberships Snapshot */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Active Network Memberships
            </h3>
            <Link href="/admin/suppliers/commercial/memberships" className="text-xs font-mono text-brand-pink font-semibold underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {products.filter((p) => p.category === 'SUPPLIER_MEMBERSHIP').map((prod) => {
              const count = memberships.filter((m) => m.product_id === prod.id).length;
              return (
                <div key={prod.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{prod.public_name}</span>
                    <span className="text-slate-500 block font-mono text-[11px]">
                      £{prod.price_gbp.toLocaleString()} + VAT / {prod.billing_frequency.toLowerCase()}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                    {count} Members
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Invoices Snapshot */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Recent Partner Invoices
            </h3>
            <Link href="/admin/suppliers/commercial/invoices" className="text-xs font-mono text-brand-pink font-semibold underline">
              View All Invoices
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {invoices.length === 0 ? (
              <p className="py-6 text-center text-slate-500 font-light">
                No commercial invoices issued yet.
              </p>
            ) : (
              invoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{inv.invoice_number}</div>
                    <span className="text-slate-500 font-mono text-[11px]">{inv.supplier_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block font-mono">£{inv.total_gbp.toLocaleString()}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
