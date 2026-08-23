import React from 'react';
import { listLeads, leadStoreConfigured } from '@/lib/leads/store';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function EnquiriesPage() {
  const leads = await listLeads(300);
  const storeReady = leadStoreConfigured();

  const today = new Date().toDateString();
  const todayCount = leads.filter((l) => new Date(l.received_at).toDateString() === today).length;
  const newCount = leads.filter((l) => l.status === 'new').length;

  const byPage = new Map<string, number>();
  for (const l of leads) {
    const page = l.conversion_page || l.landing_page || '(not recorded)';
    byPage.set(page, (byPage.get(page) ?? 0) + 1);
  }
  const topPages = [...byPage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Website & Growth"
        title="Enquiries & Inbound Leads"
        description="Every prospective customer enquiry submitted across geo and service landing pages, with exact attribution."
      />

      {!storeReady && (
        <div className="rounded border border-amber-500/30 bg-amber-500/10 p-4 text-[13px] text-amber-200">
          Supabase lead store credentials not detected in environment. New enquiries are currently falling back to email delivery.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="font-mono text-[10px] uppercase text-brand-mist/50">Total Enquiries</div>
          <div className="mt-1 text-2xl font-light text-white">{leads.length}</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="font-mono text-[10px] uppercase text-brand-mist/50">Today</div>
          <div className="mt-1 text-2xl font-light text-white">{todayCount}</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="font-mono text-[10px] uppercase text-brand-mist/50">Unactioned</div>
          <div className="mt-1 text-2xl font-light text-brand-electric-bright">{newCount}</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <div className="font-mono text-[10px] uppercase text-brand-mist/50">Converting Pages</div>
          <div className="mt-1 text-2xl font-light text-white">{byPage.size}</div>
        </div>
      </div>

      {topPages.length > 0 && (
        <section className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/60 mb-3">
            Top Performing Landing Pages
          </div>
          <ul className="space-y-2">
            {topPages.map(([page, count]) => (
              <li key={page} className="flex items-center gap-4 text-[12.5px]">
                <span className="w-8 shrink-0 font-mono text-white font-medium">{count}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-edge-dark">
                  <span
                    className="block h-full bg-brand-electric"
                    style={{ width: `${(count / topPages[0][1]) * 100}%` }}
                  />
                </span>
                <span className="w-1/2 shrink-0 truncate font-mono text-[11px] text-brand-mist/60">
                  {page}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {leads.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40">
          <table className="w-full min-w-[62rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/40">
                <th className="px-5 py-3">Received</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Requirement</th>
                <th className="px-5 py-3">Attribution</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {leads.map((lead) => (
                <tr key={lead.id} className="text-brand-mist/80">
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-[11px] text-brand-mist/50">
                    {new Date(lead.received_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{lead.name}</div>
                    {lead.company && <div className="text-[11.5px] text-brand-mist/60">{lead.company}</div>}
                    <a href={`mailto:${lead.email}`} className="text-brand-electric-bright hover:underline">
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-5 py-4 max-w-sm">
                    <div className="font-medium text-white">{lead.service || 'General Service'}</div>
                    <div className="mt-1 text-[11.5px] text-brand-mist/60 line-clamp-2">{lead.message}</div>
                  </td>
                  <td className="px-5 py-4 max-w-xs truncate font-mono text-[11px] text-brand-mist/50">
                    <div>{lead.conversion_page || lead.landing_page || 'Direct'}</div>
                    {lead.utm_source && <div className="text-brand-mist/40">{lead.utm_source}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-brand-electric/20 px-2 py-0.5 font-mono text-[10px] text-brand-electric-bright">
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Inbound Enquiries Yet"
          description="Enquiries submitted via public website contact forms will appear here in real-time with full UTM attribution."
        />
      )}
    </div>
  );
}
