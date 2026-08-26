import React from 'react';
import Link from 'next/link';
import { getTalentPoolCandidates, getVacancies } from '@/server/careers/store';
import { TalentPoolClient } from './TalentPoolClient';

export default async function AdminTalentPoolPage() {
  const candidates = await getTalentPoolCandidates();
  const vacancies = await getVacancies({ activeOnly: true });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E5] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/careers" className="text-[11px] text-[#6D6D68] hover:underline">
              Careers Dashboard
            </Link>
            <span className="text-[11px] text-[#8C8C85]">/</span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-[#111111]">
              TALENT NETWORK
            </span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-[#111111]">
            Talent Pool &amp; Speculative Registrations
          </h1>
        </div>
      </div>

      <TalentPoolClient initialCandidates={candidates} vacancies={vacancies} />
    </div>
  );
}
