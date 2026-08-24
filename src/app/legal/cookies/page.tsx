'use client';

import React from 'react';
import { LEGAL_POLICIES, getPolicyTocItems } from '@/lib/legal/legal-content-registry';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LegalCallout } from '@/components/legal/LegalCallout';
import { COOKIE_INVENTORY } from '@/config/legal';
import { Settings, Cookie, ShieldCheck, Lock } from 'lucide-react';

export default function CookiesPage() {
  const policy = LEGAL_POLICIES['cookies'];
  const tocItems = getPolicyTocItems(policy);
  const relatedPolicies = policy.relatedSlugs
    .map((rSlug) => LEGAL_POLICIES[rSlug])
    .filter(Boolean)
    .map((p) => ({
      title: p.title,
      href: `/legal/${p.slug}`,
      description: p.summary,
    }));

  const openCookiePreferences = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('efm-open-cookie-settings'));
    }
  };

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
      {/* Interactive Cookie Preference Manager Box */}
      <div className="my-6 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Cookie className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Your Cookie & Privacy Preferences
              </h3>
              <p className="text-xs text-slate-600">
                You can review, customise, or withdraw non-essential storage consent at any time.
              </p>
            </div>
          </div>
          <button
            onClick={openCookiePreferences}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 shrink-0"
          >
            <Settings className="h-4 w-4" />
            Manage Cookie Preferences
          </button>
        </div>
      </div>

      {/* Policy Sections */}
      {policy.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-28 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
            {section.heading}
          </h2>

          <div className="text-slate-700 leading-relaxed space-y-4">
            {typeof section.body === 'string' ? <p>{section.body}</p> : section.body}

            {section.callout && (
              <LegalCallout type={section.callout.type} title={section.callout.title}>
                {section.callout.content}
              </LegalCallout>
            )}

            {/* Live Inventory Table */}
            {section.id === 'live-inventory' && (
              <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2.5">Name</th>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5">Provider</th>
                      <th className="px-3 py-2.5">Duration</th>
                      <th className="px-3 py-2.5">Type</th>
                      <th className="px-3 py-2.5">Statutory Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {COOKIE_INVENTORY.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2.5 font-mono font-bold text-slate-900">
                          {item.name}
                        </td>
                        <td className="px-3 py-2.5 capitalize">{item.category}</td>
                        <td className="px-3 py-2.5">{item.provider}</td>
                        <td className="px-3 py-2.5">{item.duration}</td>
                        <td className="px-3 py-2.5 text-slate-600">{item.type}</td>
                        <td className="px-3 py-2.5 text-[11px] font-medium text-slate-600">
                          {item.statutoryBasis}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.id === 'managing-preferences' && (
              <div className="pt-2">
                <button
                  onClick={openCookiePreferences}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-600 bg-white px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Launch Cookie Consent Manager
                </button>
              </div>
            )}
          </div>
        </section>
      ))}
    </LegalLayout>
  );
}
