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
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10px] uppercase text-[#9A9A95]">Total Enquiries</div>
          <div className="mt-1 text-2xl font-light text-[#111111]">{leads.length}</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10px] uppercase text-[#9A9A95]">Today</div>
          <div className="mt-1 text-2xl font-light text-[#111111]">{todayCount}</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10px] uppercase text-[#9A9A95]">Unactioned</div>
          <div className="mt-1 text-2xl font-light text-brand-electric-bright">{newCount}</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="font-medium text-[10px] uppercase text-[#9A9A95]">Converting Pages</div>
          <div className="mt-1 text-2xl font-light text-[#111111]">{byPage.size}</div>
        </div>
      </div>

      {topPages.length > 0 && (
        <section className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-5">
          <div className="font-medium text-[11px] uppercase tracking-wider text-[#6D6D68] mb-3">
            Top Performing Landing Pages
          </div>
          <ul className="space-y-2">
            {topPages.map(([page, count]) => (
              <li key={page} className="flex items-center gap-4 text-[12.5px]">
                <span className="w-8 shrink-0 text-[#111111] font-normal">{count}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F5F5F3]">
                  <span
                    className="block h-full bg-brand-electric"
                    style={{ width: `${(count / topPages[0][1]) * 100}%` }}
                  />
                </span>
                <span className="w-1/2 shrink-0 truncate font-normal text-[11px] text-[#6D6D68]">
                  {page}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {leads.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[62rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Received</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Requirement</th>
                <th className="px-5 py-3">Attribution</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {leads.map((lead) => (
                <tr key={lead.id} className="text-[#6D6D68]">
                  <td className="whitespace-nowrap px-5 py-4 font-normal text-[11px] text-[#9A9A95]">
                    {new Date(lead.received_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-light text-[#111111]">{lead.name}</div>
                    {lead.company && <div className="text-[11.5px] text-[#6D6D68]">{lead.company}</div>}
                    <a href={`mailto:${lead.email}`} className="text-brand-electric-bright hover:underline">
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-5 py-4 max-w-sm">
                    <div className="font-normal text-[#111111]">{lead.service || 'General Service'}</div>
                    <div className="mt-1 text-[11.5px] text-[#6D6D68] line-clamp-2">{lead.message}</div>
                  </td>
                  <td className="px-5 py-4 max-w-xs truncate font-normal text-[11px] text-[#9A9A95]">
                    <div>{lead.conversion_page || lead.landing_page || 'Direct'}</div>
                    {lead.utm_source && <div className="text-[#9A9A95]">{lead.utm_source}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-brand-electric/20 px-2 py-0.5 font-normal text-[10px] text-brand-electric-bright">
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
