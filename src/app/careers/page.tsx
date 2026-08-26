import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CareersHero } from '@/components/careers/CareersHero';
import { LifeAtEntireFM } from '@/components/careers/LifeAtEntireFM';
import { CurrentOpportunities } from '@/components/careers/CurrentOpportunities';
import { CareersBenefitsCulture } from '@/components/careers/CareersBenefitsCulture';
import { TalentNetworkSection } from '@/components/careers/TalentNetworkSection';
import { getVacancies } from '@/server/careers/store';

export const metadata: Metadata = {
  title: 'Careers & Vacancies | EntireFM Engineering & Operations',
  description:
    'Explore engineering, facilities management, helpdesk, projects, and digital technology career opportunities at EntireFM. View open vacancies and join our UK talent network.',
  openGraph: {
    title: 'Careers at EntireFM — Engineering, Facilities Management & Operations',
    description:
      'Join our technology-enabled facilities management team. Explore live vacancies across London, Manchester, Midlands, and Yorkshire.',
    url: 'https://entirefm.com/careers',
    siteName: 'EntireFM',
    type: 'website',
  },
  alternates: {
    canonical: 'https://entirefm.com/careers',
  },
};

export default async function CareersPage() {
  const vacancies = await getVacancies({ activeOnly: true });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-void text-white">
        <CareersHero />
        <LifeAtEntireFM />
        <CurrentOpportunities initialVacancies={vacancies} />
        <CareersBenefitsCulture />
        <TalentNetworkSection />
      </main>
      <Footer />
    </>
  );
}
