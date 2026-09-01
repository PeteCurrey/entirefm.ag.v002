import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ClientDocumentsPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const { data: docs } = await dbQuery<any[]>(
    `contractor_compliance_documents?is_current=eq.true&select=id,document_type,document_title,expiry_date,review_status,created_at&limit=50`
  );

  const list = docs || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Document Library & Certificates</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Service reports, O&M manuals, test certificates, and compliance records for {session.orgName}.
        </p>
      </div>

      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Document Title</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Expiry Date</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-brand-mist/40">
                  No documents available in this view.
                </td>
              </tr>
            ) : (
              list.map((d) => (
                <tr key={d.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5 font-normal text-white">{d.document_title}</td>
                  <td className="px-6 py-3.5 font-normal text-[11.5px]">{d.document_type}</td>
                  <td className="px-6 py-3.5 font-normal text-[12px]">{d.expiry_date || 'N/A'}</td>
                  <td className="px-6 py-3.5">
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
                      {d.review_status || 'VERIFIED'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
