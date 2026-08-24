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
  FileCheck,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldAlert,
  Layers,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import type { TemplateProps } from './types';

const TRADE_OPTIONS = [
  'Commercial Electrical & Fixed Wire (NICEIC / ECA)',
  'Commercial Gas & Heating (Gas Safe Registered)',
  'Commercial HVAC & Refrigeration (F-Gas / REFCOM)',
  'Fire Safety & Detection Systems (BAFE / FIA)',
  'Water Hygiene & Legionella Control (LCA)',
  'Lifting Equipment & Access Systems (LEEA / IPAF)',
  'Specialist High-Level & Industrial Cleaning',
  'Commercial Grounds & Winter Maintenance',
  'Roofing & Building Fabric Remedials',
];

const ACCREDITATION_OPTIONS = [
  'SafeContractor / SSIP',
  'CHAS Accredited',
  'Constructionline Gold / Silver',
  'ISO 9001 Quality Management',
  'ISO 14001 Environmental',
  'ISO 45001 Health & Safety',
  'Altius Assured Vendor',
];

export function TemplateSupplyChain({ route, content }: TemplateProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    tradingName: '',
    companyNumber: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    registeredAddress: '',
    geographicCoverage: 'Midlands & North',
    primaryTrades: [] as string[],
    publicLiabilityCover: '£5M Public Liability',
    employersLiabilityCover: '£10M Employers Liability',
    ssipAccreditations: [] as string[],
    tradeCertifications: '',
    additionalNotes: '',
    complianceDeclaration: false,
  });

  const handleTradeToggle = (trade: string) => {
    setFormData((prev) => {
      const exists = prev.primaryTrades.includes(trade);
      return {
        ...prev,
        primaryTrades: exists ? prev.primaryTrades.filter((t) => t !== trade) : [...prev.primaryTrades, trade],
      };
    });
  };

  const handleAccredToggle = (accred: string) => {
    setFormData((prev) => {
      const exists = prev.ssipAccreditations.includes(accred);
      return {
        ...prev,
        ssipAccreditations: exists
          ? prev.ssipAccreditations.filter((a) => a !== accred)
          : [...prev.ssipAccreditations, accred],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.primaryTrades.length === 0) {
      setError('Please select at least one primary trade discipline.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/suppliers/apply', {
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
          eyebrow="SUPPLY CHAIN // APPROVED CONTRACTOR HUB"
          title="National Specialist Subcontractor &amp; Supplier Network"
          intro="EntireFM maintains rigorous vetting standards for all approved subcontractors, specialist trades, and material suppliers to ensure consistent safety, quality, and statutory compliance across our UK client portfolio."
          imageSrc="/images/editorial/entirefm-switchroom-survey-2000w.webp"
          imageAlt="EntireFM compliance team reviewing specialist contractor certification"
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Supply Chain & Approved Contractors', url: route.path },
          ]}
          primaryCta={{ label: 'Apply for Approved Network', href: '#supplier-form' }}
          secondaryCta={{ label: 'Review Compliance Standards', href: '#standards' }}
          serviceFacts={[
            { label: 'Network Vetting', value: '100% SSIP & RAMS' },
            { label: 'Payment Terms', value: 'Prompt Commercial' },
            { label: 'Job Dispatch', value: 'EntireCAFM Portal' },
          ]}
        />

        <TrustBar />

        {/* 2. ONBOARDING WORKFLOW & STANDARDS */}
        <SectorSnapshot
          leadText="Joining the EntireFM contractor network gives specialist engineering firms direct access to high-volume commercial, retail, and corporate work orders backed by transparent digital invoicing."
          priorities={[
            { title: '1. Online Application', subtitle: 'Submit trade scope, coverage, and insurance verification', iconName: 'proposalReporting' },
            { title: '2. Compliance Audit', subtitle: 'Due diligence on SSIP, H&S policies, and operative tickets', iconName: 'complianceAudit' },
            { title: '3. Portal Onboarding', subtitle: 'EntireCAFM subcontractor credentials and dispatch training', iconName: 'dataInsights' },
            { title: '4. Work Order Allocation', subtitle: 'Receive scheduled PPM and reactive engineering work orders', iconName: 'operationalExcellence' },
          ]}
        />

        {/* 3. COMPLIANCE CRITERIA DETAILS */}
        <section id="standards" className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  MINIMUM CRITERIA
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Accreditation &amp; Insurance Standards
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                To protect our clients and maintain statutory compliance, all applicants must meet our core commercial governance thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                <FileCheck className="w-6 h-6 text-brand-pink" />
                <h3 className="text-base font-bold text-slate-900">Insurance Verification</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Minimum £5M Public Liability insurance and £10M Employers Liability coverage (where employing staff) is mandatory. Professional Indemnity required for design/consultancy disciplines.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                <ShieldCheck className="w-6 h-6 text-brand-pink" />
                <h3 className="text-base font-bold text-slate-900">Health &amp; Safety / SSIP</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Valid SSIP accreditation (SafeContractor, CHAS, Constructionline, SMAS) or documented evidence of compliant health and safety management systems, RAMS, and COSHH registers.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                <Building2 className="w-6 h-6 text-brand-pink" />
                <h3 className="text-base font-bold text-slate-900">Trade Competence</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct trade registrations: Gas Safe for commercial heating, NICEIC/ECA for electrical systems, F-Gas/REFCOM for HVAC engineers, and LEEA for lifting equipment inspection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FUNCTIONAL SUPPLIER APPLICATION FORM */}
        <section id="supplier-form" className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-pink">
                  SUPPLIER REGISTRATION
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Apply for Approved Contractor Status
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Complete this initial commercial qualification form. Our procurement team will review your application and request supporting insurance/accreditation certificates.
              </p>
            </div>

            {submitted ? (
              <div className="p-10 bg-emerald-50 border border-emerald-200 rounded-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Application Submitted for Review</h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
                  Thank you for applying to the EntireFM Approved Contractor Network. Your submission has been securely logged. Our procurement team will review your credentials and contact you to request certificate documentation.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-emerald-900 underline hover:text-emerald-700"
                  >
                    Submit another contractor profile
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

                {/* Company Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                    1. Company &amp; Contact Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Company Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Apex Electrical Engineering Ltd"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Companies House Number / Trading Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyNumber}
                        onChange={(e) => setFormData({ ...formData, companyNumber: e.target.value })}
                        placeholder="e.g. 12345678"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Primary Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
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
                        placeholder="contracts@company.co.uk"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Contact Telephone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="0114 200 0000"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Registered Business Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.registeredAddress}
                      onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                      placeholder="e.g. Unit 4, Commercial Way, Sheffield, S9 2TT"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                {/* Primary Trades & Coverage */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                    2. Trade Disciplines &amp; Geographic Coverage
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Primary Trade Disciplines *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TRADE_OPTIONS.map((trade, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center gap-2.5 p-3 rounded-sm border cursor-pointer transition-all ${
                            formData.primaryTrades.includes(trade)
                              ? 'bg-brand-pink/5 border-brand-pink text-slate-900'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.primaryTrades.includes(trade)}
                            onChange={() => handleTradeToggle(trade)}
                            className="h-4 w-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                          />
                          <span className="text-xs font-medium">{trade}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Primary Geographic Coverage Region *
                    </label>
                    <select
                      value={formData.geographicCoverage}
                      onChange={(e) => setFormData({ ...formData, geographicCoverage: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    >
                      <option value="National / UK Wide">National / UK Wide</option>
                      <option value="London & South East">London &amp; South East</option>
                      <option value="Midlands & Central">Midlands &amp; Central (Birmingham, Derby, Nottingham)</option>
                      <option value="Yorkshire & Humber">Yorkshire &amp; Humber (Sheffield, Leeds)</option>
                      <option value="North West">North West (Manchester, Liverpool, Preston)</option>
                      <option value="East of England & Lincolnshire">East of England &amp; Lincolnshire</option>
                      <option value="North East & Scotland">North East &amp; Scotland</option>
                    </select>
                  </div>
                </div>

                {/* Accreditations & Insurance */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                    3. Insurance &amp; Compliance Accreditations
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Public Liability Cover Amount *
                      </label>
                      <select
                        value={formData.publicLiabilityCover}
                        onChange={(e) => setFormData({ ...formData, publicLiabilityCover: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      >
                        <option value="£5M Public Liability">£5,000,000 (£5M)</option>
                        <option value="£10M Public Liability">£10,000,000 (£10M)</option>
                        <option value="£20M+ Public Liability">£20,000,000+ (£20M+)</option>
                        <option value="Under £5M (Will Upgrade)">Under £5M (Will upgrade upon approval)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Employers Liability Cover
                      </label>
                      <select
                        value={formData.employersLiabilityCover}
                        onChange={(e) => setFormData({ ...formData, employersLiabilityCover: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                      >
                        <option value="£10M Employers Liability">£10,000,000 (£10M)</option>
                        <option value="Sole Trader / No Employees">Sole Trader / No Employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Current SSIP &amp; Management Accreditations Held
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ACCREDITATION_OPTIONS.map((accred, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center gap-2.5 p-3 rounded-sm border cursor-pointer transition-all ${
                            formData.ssipAccreditations.includes(accred)
                              ? 'bg-brand-pink/5 border-brand-pink text-slate-900'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.ssipAccreditations.includes(accred)}
                            onChange={() => handleAccredToggle(accred)}
                            className="h-4 w-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                          />
                          <span className="text-xs font-medium">{accred}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Specific Trade Registration Numbers (Gas Safe, NICEIC, REFCOM etc.)
                    </label>
                    <input
                      type="text"
                      value={formData.tradeCertifications}
                      onChange={(e) => setFormData({ ...formData, tradeCertifications: e.target.value })}
                      placeholder="e.g. Gas Safe: 123456 / NICEIC: 045678"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                {/* Declaration */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.complianceDeclaration}
                      onChange={(e) => setFormData({ ...formData, complianceDeclaration: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I declare that all information provided is accurate and that our company operates in full accordance with UK Health &amp; Safety legislation. I understand that formal certificates, insurance documents, and RAMS will be requested prior to any work order dispatch.
                    </span>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-brand-pink hover:bg-brand-pink-dark text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Submitting Application...' : 'Submit Contractor Application'}
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
          serviceName="Procurement & Supply Chain"
          headline="Have Questions Regarding Our Supply Chain Standards?"
          subheadline="Contact our national procurement team directly for questions regarding approved vendor agreements and framework tenders."
          badgeText="SUPPLY CHAIN DESK"
          ctaButtonText="Contact Procurement"
          directDeskNote={`Contacting ${CONTACT_CONFIG.enquiryEmail}`}
        />
      </main>

      <Footer />
    </div>
  );
}
