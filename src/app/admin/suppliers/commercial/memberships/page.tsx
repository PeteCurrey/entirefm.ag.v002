import React from 'react';
import { listCommercialProducts } from '@/server/partner-network/store';

export const dynamic = 'force-dynamic';

export default async function MembershipsAdminPage() {
  const products = await listCommercialProducts('SUPPLIER_MEMBERSHIP');

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
          MEMBERSHIP LIFECYCLE
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Supplier Memberships Administration
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Manage paid membership tiers, fee waivers, complimentary strategic grants, and renewal terms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-light">{p.internal_id}</span>
            <h3 className="text-base font-light text-slate-900">{p.public_name}</h3>
            <p className="text-xs text-slate-600 font-light">{p.description}</p>
            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-xl font-mono font-light text-slate-900">£{p.price_gbp.toLocaleString()}</span>
              <span className="text-[10.5px] font-mono text-slate-500">+ VAT / {p.billing_frequency.toLowerCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
