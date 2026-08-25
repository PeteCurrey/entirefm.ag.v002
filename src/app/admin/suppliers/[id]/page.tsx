import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupplierOrganisation } from '@/server/suppliers/store';
import { getSupplierMembership, listPartnerInvoices } from '@/server/partner-network/store';
import { ShieldCheck, Award, Building2, Phone, Mail, Globe, MapPin, CheckCircle2, ArrowLeft, CreditCard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = await getSupplierOrganisation(id);

  if (!supplier) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Supplier Not Found</h2>
        <p className="text-xs text-slate-500">The supplier ID {id} does not exist in the repository.</p>
        <Link href="/admin/suppliers/landscape" className="btn-primary text-xs inline-block">
          Return to Supplier Landscape
        </Link>
      </div>
    );
  }

  const [membership, invoices] = await Promise.all([
    getSupplierMembership(supplier.id),
    listPartnerInvoices({ supplierId: supplier.id }),
  ]);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/admin/suppliers/landscape" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Supplier Landscape
      </Link>

      {/* Profile Header */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-slate-900 text-white font-medium">
                {supplier.relationship_level.replace(/_/g, ' ')}
              </span>
              <span className={`text-[10.5px] font-mono px-2 py-0.5 rounded ${
                supplier.compliance_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                COMPLIANCE: {supplier.compliance_status.replace(/_/g, ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {supplier.legal_name}
            </h1>
            {supplier.trading_name && (
              <span className="text-xs font-mono text-slate-500 block">Trading as {supplier.trading_name}</span>
            )}
          </div>

          <div className="text-right space-y-1 font-mono text-xs text-slate-600">
            <div>ID: <span className="font-bold text-slate-900">{supplier.id}</span></div>
            <div>Company Reg: <span className="font-bold">{supplier.company_number || '—'}</span></div>
            <div>VAT: <span className="font-bold">{supplier.vat_number || '—'}</span></div>
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{supplier.headquarters_city}, {supplier.headquarters_postcode}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" />
            <span>{supplier.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <span>{supplier.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-400" />
            <span>{supplier.website_url ? supplier.website_url.replace(/^https?:\/\//, '') : '—'}</span>
          </div>
        </div>
      </div>

      {/* Profile Tabs: Capabilities & Commercial Framework */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Operational Capabilities & Coverage */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
              Trade Disciplines &amp; Accreditations
            </h3>

            <div className="space-y-3">
              {supplier.services.length === 0 ? (
                <p className="text-xs text-slate-500 font-light">No services configured.</p>
              ) : (
                supplier.services.map((srv, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{srv.service_name}</div>
                      <span className="text-[10.5px] font-mono text-slate-500">{srv.category}</span>
                    </div>
                    {srv.is_primary && (
                      <span className="text-[10px] font-mono bg-slate-900 text-white px-2 py-0.5 rounded">
                        PRIMARY TRADE
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Internal Commercial Tab */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-brand-pink" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Commercial &amp; Membership
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                INTERNAL ONLY
              </span>
            </div>

            {membership ? (
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Tier</span>
                  <span className="font-bold text-slate-900">{membership.product_name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-emerald-600">{membership.membership_status}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Annual Fee</span>
                  <span className="font-bold text-slate-900">£{membership.price_gbp.toLocaleString()} + VAT</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Renewal Date</span>
                  <span className="font-bold text-slate-900">{membership.renewal_date.split('T')[0]}</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-3">
                <p className="text-xs text-slate-500 font-light">No commercial membership assigned.</p>
                <button className="btn-primary text-xs py-1.5 px-3">
                  Assign Membership Tier &rarr;
                </button>
              </div>
            )}

            {/* Invoices */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[10.5px] font-mono uppercase text-slate-400 block">INVOICE HISTORY</span>
              {invoices.length === 0 ? (
                <p className="text-xs text-slate-500 font-light">No invoices on record for this organisation.</p>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between text-xs font-mono">
                    <span>{inv.invoice_number}</span>
                    <span className="font-bold">£{inv.total_gbp.toLocaleString()} ({inv.status})</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
