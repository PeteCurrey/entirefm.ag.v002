import React from 'react';
import Link from 'next/link';
import { listCertificates } from '@/server/compliance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ComplianceCertificatesPage() {
  const certificates = await listCertificates();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Compliance"
        title="Statutory Certificate Register"
        description="Gas Safety (CP12), EICR, Fire Alarm, LOLER, Legionella Risk Assessment, and TM44 certificates."
        action={
          <Link
            href="/admin/compliance"
            className="rounded border border-[#E8E8E5] bg-white px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-white"
          >
            ← Command Centre
          </Link>
        }
      />

      {certificates.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-[#E8E8E5] bg-white shadow-sm">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] font-medium text-[10.5px] uppercase tracking-wider text-[#9A9A95]">
                <th className="px-5 py-3">Certificate Type & Ref</th>
                <th className="px-5 py-3">Site / Scope</th>
                <th className="px-5 py-3">Issued By</th>
                <th className="px-5 py-3">Issued Date</th>
                <th className="px-5 py-3">Expiry Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {certificates.map((c) => (
                <tr key={c.id} className="text-[#6D6D68] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <div className="font-light text-[#111111]">{c.certificate_type}</div>
                    <div className="font-normal text-[11px] text-[#9A9A95]">#{c.certificate_number}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-normal text-[#111111]">{c.site?.name || 'Site'}</div>
                  </td>
                  <td className="px-5 py-4 text-[#6D6D68]">
                    {c.issued_by_org}
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px]">
                    {c.issued_date}
                  </td>
                  <td className="px-5 py-4 font-normal text-[11px] text-white">
                    {c.expiry_date}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded px-2 py-0.5 font-normal text-[10px] ${
                        c.status === 'VALID'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : c.status === 'EXPIRING_SOON'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No Certificates Uploaded"
          description="Statutory inspection certificates and risk assessments will appear here once submitted."
          actionText="Command Centre"
          actionHref="/admin/compliance"
        />
      )}
    </div>
  );
}
