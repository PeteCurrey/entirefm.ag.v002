import React from 'react';
import { getCurrentSession } from '@/server/identity';
import Link from 'next/link';
import { Building2, Edit3, ShieldCheck, MapPin, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Company Profile & Partner Record | EntireFM Supplier Portal',
  description: 'View and maintain your commercial Partner Profile, trade capabilities, and declared operating bases.',
};

export default async function SupplierCompanyProfilePage() {
  const session = await getCurrentSession();
  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          PARTNER PROFILE BUILDER // PHASE 2A
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Company Profile &amp; Operational Capabilities
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          This data forms your active EntireFM Partner Profile used for technical matching and operational allocation.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{session?.orgName ?? "Your Company"}</h2>
            <span className="text-xs text-slate-500 font-mono">Company details will appear once your application is complete.</span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold self-start sm:self-auto">
            APPROVED SUPPLIER
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          <div className="space-y-1">
            <span className="font-bold text-slate-400 text-[10px] uppercase font-mono block">Registered Office</span>
            <p className="text-slate-800">14 Industrial Way, Aston, Birmingham, B6 7RH</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-400 text-[10px] uppercase font-mono block">Direct Operatives</span>
            <p className="text-slate-800">12 Mobile Engineers &middot; 6 Office/Support Staff</p>
          </div>
          <div className="space-y-1 md:col-span-2">
            <span className="font-bold text-slate-400 text-[10px] uppercase font-mono block">Capability Summary</span>
            <p className="text-slate-700 leading-relaxed">
              Specialist commercial building engineering firm providing planned chiller maintenance, commercial gas heating, and 24/7 reactive HVAC callout across the West Midlands.
            </p>
          </div>

          <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100">
            <span className="font-bold text-slate-400 text-[10px] uppercase font-mono block">Active Scheme Accreditations &amp; Registrations</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block text-xs">Gas Safe Register</span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold block mt-0.5">Reg: 654321</span>
                <span className="text-[10px] text-slate-500 block">Valid until 01 JUN 2026</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block text-xs">REFCOM / F-Gas Certified</span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold block mt-0.5">Co #: REF101234</span>
                <span className="text-[10px] text-slate-500 block">Valid until 01 JAN 2028</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-900 block text-xs">SafeContractor (SSIP)</span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold block mt-0.5">Supplier #: SC-009882</span>
                <span className="text-[10px] text-slate-500 block">Valid until 30 APR 2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
