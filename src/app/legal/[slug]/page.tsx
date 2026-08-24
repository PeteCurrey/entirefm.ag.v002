import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LEGAL_POLICIES, getLegalPolicy, getPolicyTocItems } from '@/lib/legal/legal-content-registry';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LegalCallout } from '@/components/legal/LegalCallout';
import { HumanAiResponsibilityModel } from '@/components/legal/HumanAiResponsibilityModel';
import { DataProtectionComplaintForm } from '@/components/legal/DataProtectionComplaintForm';
import { SUBPROCESSOR_REGISTER, COOKIE_INVENTORY } from '@/config/legal';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(LEGAL_POLICIES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = getLegalPolicy(slug);

  if (!policy) {
    return {
      title: 'Policy Not Found | EntireFM',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${policy.title} | EntireFM Legal & Governance`,
    description: policy.metaDescription,
    alternates: {
      canonical: `https://www.entirefm.com/legal/${slug}`,
    },
    openGraph: {
      title: `${policy.title} | EntireFM Legal & Governance`,
      description: policy.metaDescription,
      type: 'article',
      url: `https://www.entirefm.com/legal/${slug}`,
    },
  };
}

export default async function LegalPolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const policy = getLegalPolicy(slug);

  if (!policy) {
    notFound();
  }

  const tocItems = getPolicyTocItems(policy);
  const relatedPolicies = policy.relatedSlugs
    .map((rSlug) => LEGAL_POLICIES[rSlug])
    .filter(Boolean)
    .map((p) => ({
      title: p.title,
      href: `/legal/${p.slug}`,
      description: p.summary,
    }));

  return (
    <LegalLayout
      title={policy.title}
      eyebrow={policy.eyebrow}
      categorySlug={policy.categorySlug}
      categoryTitle={policy.categoryTitle}
      summary={policy.summary}
      effectiveDate={policy.effectiveDate}
      version={policy.version}
      tocItems={tocItems}
      relatedPolicies={relatedPolicies}
      keyTakeaways={policy.keyTakeaways}
    >
      {/* Policy Sections */}
      {policy.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-28 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
            {section.heading}
          </h2>

          <div className="text-slate-700 leading-relaxed space-y-4">
            {typeof section.body === 'string' ? <p>{section.body}</p> : section.body}

            {section.bullets && section.bullets.length > 0 && (
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                {section.bullets.map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {section.callout && (
              <LegalCallout type={section.callout.type} title={section.callout.title}>
                {section.callout.content}
              </LegalCallout>
            )}

            {/* Special Interactive Embed for AI Policy */}
            {slug === 'ai' && section.id === 'human-in-the-loop' && (
              <HumanAiResponsibilityModel />
            )}

            {/* Special Interactive Embed for Data Protection Complaints */}
            {slug === 'data-protection-complaints' && section.id === 'complaints-commitment' && (
              <div className="my-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Submit an Electronic Data Protection Complaint
                </h3>
                <p className="text-xs text-slate-600 mb-6">
                  Complete the form below to generate an official statutory tracking reference.
                </p>
                <DataProtectionComplaintForm />
              </div>
            )}

            {/* Subprocessor Register Table View */}
            {slug === 'subprocessors' && section.id === 'active-subprocessors' && (
              <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2.5">Subprocessor</th>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5">Purpose</th>
                      <th className="px-3 py-2.5">Location</th>
                      <th className="px-3 py-2.5">UK Transfer Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SUBPROCESSOR_REGISTER.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2.5 font-bold text-slate-900">{sub.name}</td>
                        <td className="px-3 py-2.5">{sub.category}</td>
                        <td className="px-3 py-2.5">{sub.purpose}</td>
                        <td className="px-3 py-2.5">{sub.processingLocation}</td>
                        <td className="px-3 py-2.5 text-[11px] font-medium text-indigo-700">
                          {sub.transferMechanism}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ))}
    </LegalLayout>
  );
}
