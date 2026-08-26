import React from 'react';
import { getCurrentSession } from '@/server/identity';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, Clock, CheckCircle2, Upload, FileText } from 'lucide-react';
import { getSupplierComplianceRadar } from '@/server/suppliers/store';

export const metadata = {
  title: 'Compliance Radar & Expiries | EntireFM Supplier Portal',
  description: 'Track 30/60/90-day certification expiries and maintain continuous work eligibility.',
};

export default async function SupplierComplianceRadarPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const radar = orgId ? await getSupplierComplianceRadar(orgId) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
            CONTINUOUS ASSURANCE MONITORING
          </span>
          <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
            Compliance Radar &amp; Expiries
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            Track upcoming statutory certificate renewals across insurance, safety, and trade accreditations.
          </p>
        </div>

        <Link href="/supplier-portal/documents" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto">
          <Upload className="h-3.5 w-3.5" /> Upload Document in Vault
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {radar.length > 0 ? (
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-900 text-white font-light uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Compliance Item</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Expiry Date</th>
                <th className="p-3.5">Days Remaining</th>
                <th className="p-3.5">Health State</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {radar.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{item.item_name}</span>
                    {item.action_required && (
                      <span className="text-[10.5px] text-amber-700 block mt-0.5">{item.action_required}</span>
                    )}
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-500">{item.category}</td>
                  <td className="p-3.5 text-[11px] text-slate-900 font-bold">{item.expiry_date}</td>
                  <td className="p-3.5 text-[11px] text-slate-700">{item.days_remaining} Days</td>
                  <td className="p-3.5">
                    {item.status === 'VALID' && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10.5px] font-light px-2 py-0.5 rounded font-bold">
                        VALID
                      </span>
                    )}
                    {item.status === 'EXPIRING_60' && (
                      <span className="bg-amber-100 text-amber-800 text-[10.5px] font-light px-2 py-0.5 rounded font-bold">
                        EXPIRING (60 DAYS)
                      </span>
                    )}
                    {item.status === 'EXPIRED' && (
                      <span className="bg-rose-100 text-rose-800 text-[10.5px] font-light px-2 py-0.5 rounded font-bold">
                        EXPIRED
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link href="/supplier-portal/documents" className="text-slate-900 font-bold hover:underline text-[11px]">
                      Upload Renewal &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <Clock className="h-8 w-8 text-slate-300 mx-auto" />
            <p>No active compliance tracking items yet. Upload your statutory certificates in the Document Vault to activate automated expiry radar monitoring.</p>
            <Link href="/supplier-portal/documents" className="text-brand-pink font-bold hover:underline inline-block">
              Open Document Vault &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
