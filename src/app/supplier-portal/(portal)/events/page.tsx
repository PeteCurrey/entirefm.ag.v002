import React from 'react';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { listPartnerEvents } from '@/server/partner-network/store';

export const metadata = {
  title: 'Partner Network Events & Forums | EntireFM Supplier Portal',
  description: 'View upcoming technical roundtables, OEM breakfasts, and register attendee tickets.',
};

export default async function SupplierEventsPage() {
  const events = await listPartnerEvents();

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
          SUPPLIER ECOSYSTEM &amp; TECHNICAL ROUNDTABLES
        </span>
        <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
          Partner Network Events &amp; Forums
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Join executive facilities roundtables, manufacturer CPD sessions, and regional contractor forums.
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event) => {
          const attendeeProduct = event.products?.find((p) => p.ticket_type === 'ATTENDEE');
          const priceGbp = attendeeProduct ? attendeeProduct.price_gbp : 0;

          return (
            <div key={event.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-white text-[10.5px] font-light px-2 py-0.5 rounded uppercase font-bold">
                    {event.event_type.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-light text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" /> {event.event_date} ({event.start_time} - {event.end_time})
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-sans">{event.title}</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">{event.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-light text-slate-500 pt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" /> {event.venue_name} ({event.venue_address})</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3 text-slate-400" /> {event.capacity} Capacity</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                <div className="text-right">
                  <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 block">Member Price</span>
                  <span className="text-base font-bold text-slate-900">
                    {priceGbp === 0 ? 'Complimentary' : `£${priceGbp} + VAT`}
                  </span>
                </div>
                <button className="btn-primary text-xs py-2 px-5 font-bold">
                  Register Attendee &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
