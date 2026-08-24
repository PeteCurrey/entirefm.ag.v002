'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { SectorSnapshot } from '@/components/sectors/SectorSnapshot';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { CONTACT_CONFIG } from '@/config/contact';
import {
  Handshake,
  Building,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Users,
  Compass,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import type { TemplateProps } from './types';

const COLLABORATION_AREAS = [
  'Commercial Managing Agent FM Frameworks',
  'Commercial Property Surveyors / M&E Dilapidations',
  'Property Developers & Fit-Out Mobilisations',
  'Insurance Brokers & Risk Mitigation Surveys',
  'Joint Venture Tender Submissions',
  'Consultancy & Energy Transition Advisory',
];

export function TemplatePartnerNetwork({ route, content }: TemplateProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    partnerType: 'Commercial Managing Agent',
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    portfolioOverview: '',
    estimatedManagedSqFt: '',
    geographicFocus: 'National / UK Wide',
    primaryInterests: [] as string[],
    notes: '',
    consent: false,
  });

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.primaryInterests.includes(interest);
      return {
        ...prev,
        primaryInterests: exists
          ? prev.primaryInterests.filter((i) => i !== interest)
          : [...prev.primaryInterests, interest],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.primaryInterests.length === 0) {
      setError('Please select at least one collaboration area.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. Please verify required fields.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <ServiceHero
          eyebrow="PARTNERSHIPS // PROPERTY PROFESSIONAL NETWORK"
          title="B2B Commercial Partnerships &amp; Managing Agent Frameworks"
          intro="We collaborate with commercial managing agents, chartered building surveyors, property developers, and asset managers to deliver transparent, engineering-led facilities management across UK property portfolios."
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
          imageAlt="EntireFM commercial directors reviewing estate maintenance SLA performance with managing agent partners"
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Partner Network', url: route.path },
          ]}
          primaryCta={{ label: 'Discuss Partnership Framework', href: '#partner-form' }}
          secondaryCta={{ label: 'Review Collaboration Models', href: '#models' }}
          serviceFacts={[
            { label: 'Governance', value: 'RICS Service Charge Aligned' },
            { label: 'Reporting', value: 'EntireCAFM Portal Access' },
            { label: 'Coverage', value: 'National UK Estate Delivery' },
          ]}
        />

        <TrustBar />

        {/* 2. VALUE PROPOSITION FOR PROPERTY PROFESSIONALS */}
        <SectorSnapshot
          leadText="Partnering with EntireFM enhances property portfolio asset value, resolves landlord-tenant friction through clear compliance evidence, and provides total visibility over statutory obligations."
          priorities={[
            { title: 'Commercial Managing Agents', subtitle: 'RICS service charge compliance, common-parts M&E, and tenant helpdesk', iconName: 'commercialBuildings' },
            { title: 'Building Surveyors & Consultancies', subtitle: 'Condition surveys, dilapidation remedials, and plant replacement execution', iconName: 'maintenanceTools' },
            { title: 'Commercial Developers', subtitle: 'Post-PC defects management, plant commissioning, and seamless mobilisation', iconName: 'operationalExcellence' },
            { title: 'Insurance & Risk Advisors', subtitle: 'Documented statutory compliance archives and proactive risk reduction', iconName: 'complianceAudit' },
          ]}
        />

        {/* 3. COLLABORATION MODELS */}
        <section id="models" className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  PARTNERSHIP FRAMEWORKS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                How We Work With Property Professionals
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Structured commercial relationships designed to support your operational teams and protect your clients&apos; assets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white border border-slate-200 rounded-sm shadow-sm space-y-4">
                <Building className="w-7 h-7 text-brand-pink" />
                <h3 className="text-lg font-bold text-slate-900">Portfolio FM Agreements</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consolidated multi-site facilities management across your managed property instructions, backed by dedicated account management and centralised monthly billing.
                </p>
                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Single-point escalation desk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Live client portal access</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-white border border-slate-200 rounded-sm shadow-sm space-y-4">
                <FileCheck className="w-7 h-7 text-brand-pink" />
                <h3 className="text-lg font-bold text-slate-900">Technical M&amp;E Dilapidations</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Working alongside chartered surveyors to price, scope, and deliver complex mechanical, electrical, and fabric remedial works at lease-end or during refurbishment.
                </p>
                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Transparent itemised costings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Certified completion packages</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-white border border-slate-200 rounded-sm shadow-sm space-y-4">
                <Compass className="w-7 h-7 text-brand-pink" />
                <h3 className="text-lg font-bold text-slate-900">Developer Mobilisation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Engaging prior to practical completion to build digital asset registers, establish baseline SFG20 PPM schedules, and ensure a flawless handover into live occupation.
                </p>
                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pre-handover plant audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Warranty protection tagging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PARTNER APPLICATION FORM */}
        <section id="partner-form" className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  PARTNERSHIP ENQUIRY
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Explore a B2B Collaboration Framework
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Connect directly with our commercial directors to discuss portfolio requirements, framework terms, or joint opportunities.
              </p>
            </div>

            {submitted ? (
              <div className="p-10 bg-emerald-50 border border-emerald-200 rounded-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Partnership Enquiry Logged</h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
                  Thank you for reaching out to EntireFM. Your enquiry has been routed directly to our commercial partnerships team. We will review your portfolio requirements and arrange an introductory discussion.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-emerald-900 underline hover:text-emerald-700"
                  >
                    Submit another partnership enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 bg-[#FAF9FB] p-8 sm:p-10 border border-slate-200 rounded-sm shadow-sm">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Partner Category & Org */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                    1. Professional Organisation Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Partner Category *
                      </label>
                      <select
                        value={formData.partnerType}
                        onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      >
                        <option value="Commercial Managing Agent">Commercial Managing Agent</option>
                        <option value="Chartered Building Surveyors">Chartered Building Surveyors / Consultants</option>
                        <option value="Commercial Property Developer">Commercial Property Developer</option>
                        <option value="Asset Manager / Institutional Landlord">Asset Manager / Institutional Landlord</option>
                        <option value="Insurance Broker / Risk Advisor">Insurance Broker / Risk Advisor</option>
                        <option value="Joint Venture Contractor">Joint Venture / Tier 1 Contractor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Sterling Property Consultants Ltd"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="e.g. Richard Thornton"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="r.thornton@sterling-property.co.uk"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Direct Telephone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="020 7946 0000"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      />
                    </div>
                  </div>
                </div>

                {/* Scope & Collaboration */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                    2. Portfolio Scope &amp; Collaboration Focus
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Areas of Interest / Collaboration *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {COLLABORATION_AREAS.map((area, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center gap-2.5 p-3 rounded-sm border cursor-pointer transition-all ${
                            formData.primaryInterests.includes(area)
                              ? 'bg-brand-pink/5 border-brand-pink text-slate-900'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.primaryInterests.includes(area)}
                            onChange={() => handleInterestToggle(area)}
                            className="h-4 w-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                          />
                          <span className="text-xs font-medium">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Portfolio Summary / Opportunity Overview *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.portfolioOverview}
                      onChange={(e) => setFormData({ ...formData, portfolioOverview: e.target.value })}
                      placeholder="Briefly describe your managed estate, key commercial requirements, and target timeline..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                {/* Consent */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I agree to EntireFM contacting me regarding commercial partnership opportunities in accordance with the{' '}
                      <a href="/privacy-policy" className="text-brand-pink underline">
                        Privacy Policy
                      </a>.
                    </span>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-brand-pink hover:bg-brand-pink-dark text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Submitting Enquiry...' : 'Submit Partnership Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* 5. ACCREDITATIONS & CONVERSION */}
        <section className="py-12 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>

        <ServiceConversionSection
          serviceName="Commercial Partnerships"
          headline="Looking for an Informal Commercial Discussion?"
          subheadline="Call our commercial desk to discuss managing agent frameworks or joint venture tender agreements."
          badgeText="PARTNERSHIP DESK"
          ctaButtonText="Contact Partnerships"
          directDeskNote={`Contacting ${CONTACT_CONFIG.enquiryEmail}`}
        />
      </main>

      <Footer />
    </div>
  );
}
