import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Users, UserPlus, ShieldCheck } from 'lucide-react';

export default function SupplierPortalUsersPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
                ENTIRECAFM // ORGANISATION USER MANAGEMENT
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Supplier Team &amp; User Access
              </h1>
            </div>

            <button className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5" /> Invite Team Member
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
              Active Organisation Members
            </h3>

            <div className="divide-y divide-slate-100 text-xs font-mono">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 font-sans">Marcus Vance (Managing Director)</div>
                  <span className="text-slate-500">m.vance@apexhvac.example.co.uk</span>
                </div>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                  SUPPLIER_ADMIN
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 font-sans">Sarah Jenkins (Compliance Lead)</div>
                  <span className="text-slate-500">s.jenkins@apexhvac.example.co.uk</span>
                </div>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                  COMPLIANCE
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
