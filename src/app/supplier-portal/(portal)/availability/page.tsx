import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { getSupplierAvailability } from '@/server/allocation/allocation-store';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierPortalAvailabilityPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const avail = orgId ? await getSupplierAvailability(orgId) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10.5px] font-light uppercase tracking-wider text-slate-400">
            ENTIRECAFM // DISPATCH CAPACITY
          </span>
          <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
            Operational Availability &amp; Slots
          </h1>
        </div>

        <span className="text-xs font-medium px-3 py-1 bg-emerald-100 text-emerald-900 rounded-sm self-start sm:self-auto">
          STATUS: {avail?.status || 'STANDBY (IN ONBOARDING)'}
        </span>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4 text-xs font-light">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100 font-sans">
          Configured Dispatch Capacity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">DAILY REACTIVE SLOTS</span>
            <div className="text-2xl font-bold text-slate-900">{avail?.daily_reactive_slots || 0} Slots</div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">ACTIVE FIELD OPERATIVES</span>
            <div className="text-2xl font-bold text-slate-900">{avail?.available_engineers_count || 0} On Duty</div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">24/7 EMERGENCY</span>
            <div className="text-2xl font-bold text-emerald-700">{avail?.emergency_out_of_hours ? 'ACTIVE' : 'OFF'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
