import React from 'react';
import { listPartnerEvents } from '@/server/partner-network/store';

export const dynamic = 'force-dynamic';

export default async function PartnerEventsAdminPage() {
  const events = await listPartnerEvents();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          CONVENING &amp; INDUSTRY FORUMS
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Partner Network Events Management
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Manage Meet the Supplier, Meet the Manufacturer, Technical Breakfasts, and commercial tickets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((e) => (
          <div key={e.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-bold">
                {e.event_type.replace(/_/g, ' ')}
              </span>
              <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {e.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{e.title}</h3>
              <p className="text-xs text-slate-600 mt-1 font-light">{e.description}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs font-mono space-y-1 text-slate-700">
              <div>Date: {e.event_date} ({e.start_time} - {e.end_time})</div>
              <div>Venue: {e.venue_name}, {e.venue_address}</div>
              <div>Registered: {e.registered_count} / {e.capacity} capacity</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
