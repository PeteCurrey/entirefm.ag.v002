import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSupplierAvailability } from '@/server/allocation/allocation-store';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierPortalAvailabilityPage() {
  const avail = await getSupplierAvailability('sup-01');

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400">
                ENTIRECAFM // DISPATCH CAPACITY
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Operational Availability &amp; Slots
              </h1>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-sm">
              STATUS: {avail?.status || 'AVAILABLE'}
            </span>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100 font-sans">
              Configured Dispatch Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">DAILY REACTIVE SLOTS</span>
                <div className="text-2xl font-bold text-slate-900">{avail?.daily_reactive_slots || 5} Slots</div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">ACTIVE ENGINEERS</span>
                <div className="text-2xl font-bold text-slate-900">{avail?.available_engineers_count || 4} On Duty</div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">24/7 EMERGENCY</span>
                <div className="text-2xl font-bold text-emerald-700">{avail?.emergency_out_of_hours ? 'ACTIVE' : 'OFF'}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
