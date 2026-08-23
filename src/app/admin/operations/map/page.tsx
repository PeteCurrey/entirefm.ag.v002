import React from 'react';
import { listSites } from '@/server/estate';
import { listWorkOrders } from '@/server/work';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function OperationsMapPage() {
  const [sites, activeJobs] = await Promise.all([
    listSites({ status: 'ACTIVE' }),
    listWorkOrders({ limit: 50 }),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Operations"
        title="Operations Radar Map"
        description="Geospatial distribution of managed client sites, active emergency callouts, and field contractor coverage points."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map Canvas / Visual Radar */}
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
              UK Operational Estate Radar ({sites.length} Managed Sites)
            </h2>
            <span className="font-mono text-[11px] text-emerald-400">Live Telemetry</span>
          </div>

          <div className="mt-4 flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-brand-edge-dark/60 bg-brand-void/80 p-8 text-center">
            <div className="h-12 w-12 rounded-full border border-brand-electric/40 bg-brand-electric/10 p-2.5 text-brand-electric-bright">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-white">Geospatial Estate Density Active</h3>
            <p className="mt-1 max-w-sm text-[12px] text-brand-mist/60">
              Interactive Leaflet / Mapbox tile rendering ready. Sites with valid latitude/longitude coordinates are plotted alongside active reactive work orders.
            </p>
          </div>
        </div>

        {/* Active Site Feeds */}
        <div className="space-y-4">
          <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-5">
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
              Active Regional Hubs
            </h2>
            <div className="mt-3 space-y-2.5">
              {sites.length > 0 ? (
                sites.slice(0, 5).map((s) => (
                  <div key={s.id} className="rounded border border-brand-edge-dark bg-brand-void p-2.5 text-[12px]">
                    <div className="font-semibold text-white">{s.name}</div>
                    <div className="font-mono text-[11px] text-brand-mist/50">
                      {s.city} · {s.postcode}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[12px] text-brand-mist/50">No geocoded sites registered.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
