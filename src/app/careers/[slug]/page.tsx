import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JobDetailPageClient } from './JobDetailPageClient';
import { getVacancyBySlug, getVacancies } from '@/server/careers/store';

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const vacancies = await getVacancies();
  return vacancies.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = await getVacancyBySlug(slug);

  if (!vacancy) {
    return { title: 'Role Not Found | EntireFM Careers' };
  }

  return {
    title: `${vacancy.title} — ${vacancy.location} | EntireFM Careers`,
    description: vacancy.summary,
    openGraph: {
      title: `${vacancy.title} — ${vacancy.location} | EntireFM`,
      description: vacancy.summary,
      url: `https://entirefm.com/careers/${vacancy.slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://entirefm.com/careers/${vacancy.slug}`,
    },
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;
  const vacancy = await getVacancyBySlug(slug);

  if (!vacancy) {
    notFound();
  }

  // Schema.org JobPosting structured data
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: vacancy.title,
    description: vacancy.overview || vacancy.summary,
    identifier: {
      '@type': 'PropertyValue',
      name: 'EntireFM',
      value: vacancy.reference,
    },
    datePosted: vacancy.postedDate,
    validThrough: vacancy.closingDate,
    employmentType:
      vacancy.contractType.includes('Permanent') || vacancy.contractType.includes('Full-time')
        ? 'FULL_TIME'
        : vacancy.contractType.includes('Part-time')
        ? 'PART_TIME'
        : 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'EntireFM',
      sameAs: 'https://entirefm.com',
      logo: 'https://entirefm.com/branding/EntireFM%20Branding%20001.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'GB',
        addressLocality: vacancy.location,
      },
    },
    ...(vacancy.salaryMin && vacancy.salaryMax
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'GBP',
            value: {
              '@type': 'QuantitativeValue',
              minValue: vacancy.salaryMin,
              maxValue: vacancy.salaryMax,
              unitText: 'YEAR',
            },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <JobDetailPageClient vacancy={vacancy} />
      </main>
      <Footer />
    </>
  );
}
