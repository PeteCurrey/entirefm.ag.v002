import React from 'react';
import { listCommercialProducts } from '@/server/partner-network/store';

export const dynamic = 'force-dynamic';

export default async function ProductsPricingPage() {
  const products = await listCommercialProducts();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
          COMMERCIAL PRODUCT CATALOGUE
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Products &amp; Pricing Management
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Dynamic product catalogue defining membership tiers, assurance fees, event tickets, and industry partner packages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-light">
                {p.category.replace(/_/g, ' ')}
              </span>
              <h3 className="text-base font-light text-slate-900 mt-1">{p.public_name}</h3>
              <p className="text-xs text-slate-600 mt-1 font-light">{p.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-mono font-light text-slate-900">£{p.price_gbp.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-mono block">+ VAT / {p.billing_frequency.toLowerCase()}</span>
              </div>
              <span className="text-[10.5px] font-mono font-light px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                ACTIVE
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
