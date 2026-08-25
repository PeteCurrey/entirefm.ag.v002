'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, Upload, Building2, Wrench } from 'lucide-react';
import { trackEvent } from '@/lib/analytics/tracker';

const TRADE_CATEGORIES = [
  'Electrical & Fixed Wire (NICEIC / ECA)',
  'Mechanical & Commercial Heating (Gas Safe)',
  'HVAC & Refrigeration (F-Gas / REFCOM)',
  'Building Management Systems (BMS) & Controls',
  'Fire Detection & Alarms (BAFE / FIA)',
  'Emergency Lighting & Life Safety (BS 5266)',
  'Water Hygiene & Legionella Control (ACOP L8)',
  'Industrial Rope Access (IRATA)',
  'Façade & BMU Cradle Maintenance',
  'Commercial Roofing & Weatherproofing',
  'Commercial Glazing & Curtain Walling',
  'Industrial Doors & Loading Docks',
  'Drainage, Civils & Groundworks',
  'Commercial & Industrial Cleaning',
  'Specialist High-Level Decontamination',
  'Grounds Maintenance & Winter Services',
  'Commercial Waste & Environmental Recycling',
  'Security Systems, CCTV & Access Control',
  'SIA Manned Guarding & Keyholding',
  'IoT, Telemetry & Sensor Deployment',
  'Drone Aerial Inspection & Thermography',
  'Specialist Equipment Manufacturer (OEM)',
];

const ACCREDITATION_LIST = [
  'SafeContractor (SSIP)',
  'CHAS Accredited',
  'Constructionline (Gold / Silver)',
  'SMAS Worksafe',
  'Altius Assured',
  'ISO 9001 Quality Management',
  'ISO 14001 Environmental',
  'ISO 45001 Health & Safety',
  'Gas Safe Register',
  'NICEIC Approved Contractor',
  'REFCOM / F-Gas Company Certified',
  'IRATA Member Company',
  'BAFE Registered',
  'SIA Approved Contractor Scheme',
  'BICSc Corporate Member',
];

export function SupplierApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appId, setAppId] = useState<string>('');

  const [form, setForm] = useState({
    companyName: '',
    tradingName: '',
    websiteUrl: '',
    companyNumber: '',
    yearEstablished: '',
    employeeCount: '1-10 Employees',
    businessType: 'Specialist Contractor',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    registeredAddress: '',
    coverageTier: 'REGIONAL' as 'LOCAL' | 'REGIONAL' | 'NATIONAL',
    geographicCoverage: 'Midlands & North of England',
    primaryTrades: [] as string[],
    publicLiabilityCover: '£5M Public Liability',
    employersLiabilityCover: '£10M Employers Liability',
    professionalIndemnityCover: 'None / Not Applicable',
    ssipAccreditations: [] as string[],
    tradeCertifications: '',
    additionalNotes: '',
    complianceDeclaration: false,
    privacyConsent: false,
  });

  const toggleTrade = (trade: string) => {
    setForm((prev) => ({
      ...prev,
      primaryTrades: prev.primaryTrades.includes(trade)
        ? prev.primaryTrades.filter((t) => t !== trade)
        : [...prev.primaryTrades, trade],
    }));
  };

  const toggleAccreditation = (accred: string) => {
    setForm((prev) => ({
      ...prev,
      ssipAccreditations: prev.ssipAccreditations.includes(accred)
        ? prev.ssipAccreditations.filter((a) => a !== accred)
        : [...prev.ssipAccreditations, accred],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.primaryTrades.length === 0) {
      setError('Please select at least one service category or trade discipline.');
      return;
    }

    setLoading(true);
    setError(null);

    trackEvent('supplier_application_start', {
      company: form.companyName,
      businessType: form.businessType,
      coverageTier: form.coverageTier,
    });

    try {
      const res = await fetch('/api/suppliers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Application submission failed. Please verify required fields.');
      }

      setAppId(data.applicationId);
      setSubmitted(true);

      trackEvent('supplier_application_complete', {
        applicationId: data.applicationId,
        businessType: form.businessType,
        tradesCount: form.primaryTrades.length,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {submitted ? (
        <div className="p-8 sm:p-12 bg-[#FAF9FB] border border-slate-200 rounded-sm text-center max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-block text-[11px] font-mono font-light px-3 py-1 bg-emerald-100 text-emerald-900 rounded-sm">
            APPLICATION LOGGED · {appId}
          </span>
          <h3 className="text-2xl font-extralight text-slate-900">
            Supplier Application Submitted for Assurance Review
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto font-light">
            Thank you for applying to join the EntireFM Supplier &amp; Partner Network. Your application has been logged with initial status <strong className="text-slate-900 font-mono font-light">APPLICATION</strong>. Our procurement and compliance desk will review your trade scope and contact you to request certificate documentation.
          </p>
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-center gap-4 text-xs font-normal">
            <Link href="/suppliers/how-we-work" className="text-slate-900 hover:text-brand-pink underline">
              View Our 10-Stage Operational Journey
            </Link>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setSubmitted(false)}
              className="text-slate-600 hover:text-slate-900"
            >
              Submit Another Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-10 bg-[#FAF9FB] p-8 sm:p-12 border border-slate-200 rounded-sm shadow-sm">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Business Identification */}
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                1. Business Identity &amp; Profile
              </h3>
              <span className="text-[11px] font-mono text-slate-400">PHASE 1 QUALIFICATION</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Company Legal Registered Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="e.g. Apex Electrical & Mechanical Engineering Ltd"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Trading Name (If different)
                </label>
                <input
                  type="text"
                  value={form.tradingName}
                  onChange={(e) => setForm({ ...form, tradingName: e.target.value })}
                  placeholder="e.g. Apex M&E Services"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Companies House Number
                </label>
                <input
                  type="text"
                  value={form.companyNumber}
                  onChange={(e) => setForm({ ...form, companyNumber: e.target.value })}
                  placeholder="e.g. 08123456"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Company Website URL
                </label>
                <input
                  type="url"
                  value={form.websiteUrl}
                  onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                  placeholder="https://www.company.co.uk"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Business Entity Type *
                </label>
                <select
                  value={form.businessType}
                  onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                >
                  <option value="Specialist Contractor">Specialist Contractor</option>
                  <option value="Regional Trade SME">Regional Trade SME</option>
                  <option value="National Service Provider">National Service Provider</option>
                  <option value="OEM / Equipment Manufacturer">OEM / Equipment Manufacturer</option>
                  <option value="Technology / IoT Provider">Technology / IoT Provider</option>
                  <option value="Consultant / Building Surveyor">Consultant / Building Surveyor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Year Established
                </label>
                <input
                  type="text"
                  value={form.yearEstablished}
                  onChange={(e) => setForm({ ...form, yearEstablished: e.target.value })}
                  placeholder="e.g. 2014"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Number of Operatives / Employees
                </label>
                <select
                  value={form.employeeCount}
                  onChange={(e) => setForm({ ...form, employeeCount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                >
                  <option value="1-5 Operatives">1-5 Operatives (Specialist / SME)</option>
                  <option value="6-20 Operatives">6-20 Operatives</option>
                  <option value="21-50 Operatives">21-50 Operatives</option>
                  <option value="51-200 Operatives">51-200 Operatives</option>
                  <option value="200+ Operatives">200+ Operatives (National)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Primary Contact */}
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                2. Primary Commercial &amp; Operational Contact
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  placeholder="e.g. David Richardson"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="contracts@company.co.uk"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  placeholder="0114 200 0000"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Office / Head Depot Address *
              </label>
              <input
                type="text"
                required
                value={form.registeredAddress}
                onChange={(e) => setForm({ ...form, registeredAddress: e.target.value })}
                placeholder="Unit 10, Industrial Park, Sheffield, S9 2TT"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
              />
            </div>
          </div>

          {/* Section 3: Disciplines & Coverage */}
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                3. Trade Disciplines &amp; Operational Coverage
              </h3>
            </div>

            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-2">
                Select Relevant Trade Disciplines * (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {TRADE_CATEGORIES.map((trade) => {
                  const isChecked = form.primaryTrades.includes(trade);
                  return (
                    <label
                      key={trade}
                      className={`flex items-center gap-2.5 p-3 rounded-sm border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTrade(trade)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                      />
                      <span className="text-[11.5px] font-normal leading-snug">{trade}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Coverage Scope Tier *
                </label>
                <select
                  value={form.coverageTier}
                  onChange={(e) => setForm({ ...form, coverageTier: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                >
                  <option value="LOCAL">Local / City Level (Within 30 miles)</option>
                  <option value="REGIONAL">Regional (e.g. Yorkshire, Midlands, North West, London)</option>
                  <option value="NATIONAL">National UK Wide Coverage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Counties / Operational Regions *
                </label>
                <input
                  type="text"
                  required
                  value={form.geographicCoverage}
                  onChange={(e) => setForm({ ...form, geographicCoverage: e.target.value })}
                  placeholder="e.g. South Yorkshire, West Yorkshire, East Midlands"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Insurances & Accreditations */}
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                4. Insurances &amp; Accreditations
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Public Liability Cover *
                </label>
                <select
                  value={form.publicLiabilityCover}
                  onChange={(e) => setForm({ ...form, publicLiabilityCover: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                >
                  <option value="£5M Public Liability">£5,000,000 (£5M)</option>
                  <option value="£10M Public Liability">£10,000,000 (£10M)</option>
                  <option value="£20M+ Public Liability">£20,000,000+ (£20M+)</option>
                  <option value="Under £5M (Will Upgrade Upon Approval)">Under £5M (Will upgrade upon approval)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Employers Liability Cover
                </label>
                <select
                  value={form.employersLiabilityCover}
                  onChange={(e) => setForm({ ...form, employersLiabilityCover: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                >
                  <option value="£10M Employers Liability">£10,000,000 (£10M)</option>
                  <option value="Sole Trader / No Direct Employees">Sole Trader / No Direct Employees</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Professional Indemnity Cover
                </label>
                <select
                  value={form.professionalIndemnityCover}
                  onChange={(e) => setForm({ ...form, professionalIndemnityCover: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                >
                  <option value="None / Not Applicable">None / Not Applicable</option>
                  <option value="£1M Professional Indemnity">£1,000,000 (£1M)</option>
                  <option value="£2M Professional Indemnity">£2,000,000 (£2M)</option>
                  <option value="£5M+ Professional Indemnity">£5,000,000+ (£5M+)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-2">
                SSIP &amp; Industry Accreditations Held
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {ACCREDITATION_LIST.map((accred) => {
                  const isChecked = form.ssipAccreditations.includes(accred);
                  return (
                    <label
                      key={accred}
                      className={`flex items-center gap-2.5 p-3 rounded-sm border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAccreditation(accred)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                      />
                      <span className="text-[11.5px] font-normal leading-snug">{accred}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                Specific Trade Scheme Numbers (Gas Safe, NICEIC, REFCOM, IRATA, BAFE etc.)
              </label>
              <input
                type="text"
                value={form.tradeCertifications}
                onChange={(e) => setForm({ ...form, tradeCertifications: e.target.value })}
                placeholder="e.g. Gas Safe: 654321 / NICEIC: 045678 / REFCOM: REF101234"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
              />
            </div>
          </div>

          {/* Section 5: Additional Info & Consent */}
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                5. Applicant Statement &amp; Governance Declarations
              </h3>
            </div>

            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                Brief Company Background / Key Client References
              </label>
              <textarea
                rows={3}
                value={form.additionalNotes}
                onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                placeholder="Detail key commercial sectors, typical plant worked on, emergency callout capabilities, or notable commercial frameworks..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.complianceDeclaration}
                  onChange={(e) => setForm({ ...form, complianceDeclaration: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                />
                <span className="text-xs text-slate-600 leading-relaxed font-light">
                  I declare that the information submitted is accurate and that our business operates in compliance with UK Health &amp; Safety legislation. I understand that formal insurance policies, RAMS, and trade certificates will be requested during Stage 2 review. *
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.privacyConsent}
                  onChange={(e) => setForm({ ...form, privacyConsent: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                />
                <span className="text-xs text-slate-600 leading-relaxed font-light">
                  I consent to EntireFM processing this application for supply chain assurance and commercial qualification in accordance with the{' '}
                  <Link href="/legal/privacy" className="text-brand-pink underline">
                    Privacy Policy
                  </Link>. *
                </span>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-normal uppercase tracking-wider rounded-sm transition-colors shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? 'Submitting Application...' : 'Submit Supplier Qualification Application'}
              <ArrowRight className="h-4 w-4 text-brand-pink" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
