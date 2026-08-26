import React from 'react';
import Link from 'next/link';
import { getApplications, getVacancies } from '@/server/careers/store';
import { ApplicationsAtsClient } from './ApplicationsAtsClient';

export default async function AdminApplicationsPage() {
  const applications = await getApplications();
  const vacancies = await getVacancies();

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
              APPLICATIONS &amp; ATS
            </span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-[#111111]">
            Candidate Application Pipeline
          </h1>
        </div>
      </div>

      <ApplicationsAtsClient initialApplications={applications} vacancies={vacancies} />
    </div>
  );
}
