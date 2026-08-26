import React from 'react';
import Link from 'next/link';
import { PlusCircle, Briefcase } from 'lucide-react';
import { getVacancies, getApplications } from '@/server/careers/store';
import { VacanciesClient } from './VacanciesClient';

export default async function AdminVacanciesPage() {
  const vacancies = await getVacancies();
  const applications = await getApplications();

  // Compute applicant counts per vacancy
  const applicantCounts: Record<string, number> = {};
  applications.forEach((app) => {
    applicantCounts[app.vacancyId] = (applicantCounts[app.vacancyId] || 0) + 1;
  });

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
              VACANCIES
            </span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-[#111111]">
            Vacancy Management
          </h1>
        </div>

        <Link
          href="/admin/careers/vacancies/new"
          className="px-4 py-2 text-xs font-normal text-white bg-[#111111] hover:bg-[#222222] rounded transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create Vacancy</span>
        </Link>
      </div>

      <VacanciesClient initialVacancies={vacancies} applicantCounts={applicantCounts} />
    </div>
  );
}
