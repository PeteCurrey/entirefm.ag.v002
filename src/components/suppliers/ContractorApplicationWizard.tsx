'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  Sliders,
  Check,
  AlertCircle
} from "lucide-react";

interface WizardState {
  companyName: string;
  companyNumber: string;
  tradingType: "Limited Company" | "Sole Trader / Partnership" | "LLP";
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  postcode: string;
  primaryTrade: string;
  secondaryTrades: string[];
  travelRadius: "15" | "30" | "45" | "60+";
  has247Emergency: boolean;
  publicLiability: "£5,000,000" | "£10,000,000" | "Under £5M (Upgrading)";
  employersLiability: boolean;
  ssipScheme: string;
  tradeAccreditation: string;
  agreedToTerms: boolean;
}

const TRADES_LIST = [
  { id: "electrical", label: "Electrical Engineering (18th Edition / EICR)" },
  { id: "mechanical", label: "Mechanical & Plantroom Services" },
  { id: "hvac", label: "HVAC, Air Conditioning & Chillers (Refcom/F-Gas)" },
  { id: "plumbing", label: "Commercial Plumbing & Water Systems (WRAS)" },
  { id: "roofing", label: "Commercial Roofing & Working at Height" },
  { id: "cleaning", label: "Commercial Cleaning & Hygiene (BICSc/COSHH)" },
  { id: "fire-security", label: "Fire Alarms & Security Systems (BAFE/BS5839)" },
  { id: "grounds-maintenance", label: "Grounds Maintenance & Landscaping (NPTC)" },
  { id: "fabric-maintenance", label: "Building Fabric & Fire Doors (CSCS/BM TRADA)" },
  { id: "drainage", label: "Commercial Drainage & Jetting (WJA)" },
];

export function ContractorApplicationWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<WizardState>({
    companyName: "",
    companyNumber: "",
    tradingType: "Limited Company",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    postcode: "",
    primaryTrade: "electrical",
    secondaryTrades: [],
    travelRadius: "30",
    has247Emergency: false,
    publicLiability: "£5,000,000",
    employersLiability: true,
    ssipScheme: "SafeContractor / CHAS",
    tradeAccreditation: "NICEIC / NAPIT / Scheme Member",
    agreedToTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);

  // Pre-fill from URL params
  useEffect(() => {
    const tradeParam = searchParams.get("trade");
    const locParam = searchParams.get("location");

    if (tradeParam && TRADES_LIST.some((t) => t.id === tradeParam)) {
      setFormData((prev) => ({ ...prev, primaryTrade: tradeParam }));
    }
    if (locParam) {
      setFormData((prev) => ({ ...prev, postcode: locParam.toUpperCase() }));
    }
  }, [searchParams]);

  const updateField = <K extends keyof WizardState>(field: K, value: WizardState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSecondaryTrade = (tradeId: string) => {
    setFormData((prev) => {
      const exists = prev.secondaryTrades.includes(tradeId);
      if (exists) {
        return { ...prev, secondaryTrades: prev.secondaryTrades.filter((t) => t !== tradeId) };
      } else {
        return { ...prev, secondaryTrades: [...prev.secondaryTrades, tradeId] };
      }
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) setStep((prev) => (prev + 1) as any);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => (prev - 1) as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#FAF9FB] border border-slate-300 rounded-sm p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
            INITIAL INTAKE RECORDED
          </span>
          <h3 className="text-2xl sm:text-3xl font-light text-slate-900">
            Welcome, {formData.companyName || "Contractor"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Your technical discipline (<strong>{TRADES_LIST.find((t) => t.id === formData.primaryTrade)?.label}</strong>) and operational radius ({formData.travelRadius} miles from {formData.postcode || "your base"}) have been staged for qualification.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-sm max-w-lg mx-auto text-left space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Selected Membership:</span>
            <span className="font-semibold text-slate-900">EntireFM Supplier Membership (£95+VAT/yr)</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Contact Email:</span>
            <span className="font-mono text-slate-900">{formData.contactEmail || "Provided on next step"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Assurance Check:</span>
            <span className="font-medium text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Initial Criteria Met
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/supplier-portal/register"
            className="btn-primary text-xs py-3.5 px-8 font-bold w-full sm:w-auto"
          >
            Activate Your Document Vault &rarr;
          </Link>
          <Link
            href="/suppliers/membership"
            className="btn-secondary text-xs py-3.5 px-6 w-full sm:w-auto"
          >
            Review Membership Benefits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-300 rounded-sm shadow-card overflow-hidden">
      {/* Step Tracker Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 border-b border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#EA580C] uppercase tracking-wider font-semibold">
              STEP {step} OF 4 // CONTRACTOR QUALIFICATION
            </span>
            <h3 className="text-xl sm:text-2xl font-light text-white">
              {step === 1 && "Company Identity & Contact"}
              {step === 2 && "Trade Scope & Operational Radius"}
              {step === 3 && "Compliance & Accreditations"}
              {step === 4 && "Review & Platform Access"}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-sm text-xs font-mono flex items-center justify-center transition-colors ${
                  step === s
                    ? "bg-[#EA580C] text-white font-bold"
                    : step > s
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-10">
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-slate-900">
                  Registered Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Electrical & Mechanical Ltd"
                  value={formData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Companies House Number (or UTR)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12345678"
                  value={formData.companyNumber}
                  onChange={(e) => updateField("companyNumber", e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Trading Structure
                </label>
                <select
                  value={formData.tradingType}
                  onChange={(e) => updateField("tradingType", e.target.value as any)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900 bg-white"
                >
                  <option value="Limited Company">Limited Company (Ltd)</option>
                  <option value="Sole Trader / Partnership">Sole Trader / Partnership</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Primary Contact Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Walker"
                  value={formData.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Primary Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. info@apexelectrical.co.uk"
                  value={formData.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Contact Telephone / Mobile <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0114 200 0000"
                  value={formData.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Operating Base Postcode (HQ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S1 2HE or M1 1AE"
                  value={formData.postcode}
                  onChange={(e) => updateField("postcode", e.target.value.toUpperCase())}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button type="submit" className="btn-primary text-xs py-3.5 px-8 font-bold">
                Continue to Trade Scope &rarr;
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Primary Contractor Discipline <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.primaryTrade}
                  onChange={(e) => updateField("primaryTrade", e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900 bg-white"
                >
                  {TRADES_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="font-semibold text-slate-900 block">
                  Secondary / Additional Disciplines (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRADES_LIST.filter((t) => t.id !== formData.primaryTrade).map((t) => {
                    const isChecked = formData.secondaryTrades.includes(t.id);
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => toggleSecondaryTrade(t.id)}
                        className={`p-3 rounded-sm border text-left flex items-center justify-between transition-colors ${
                          isChecked
                            ? "bg-[#EA580C]/5 border-[#EA580C] text-slate-900 font-medium"
                            : "bg-[#FAFAF8] border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span>{t.label}</span>
                        <div
                          className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                            isChecked ? "bg-[#EA580C] border-[#EA580C] text-white" : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-900">
                    Operational Travel Radius
                  </label>
                  <select
                    value={formData.travelRadius}
                    onChange={(e) => updateField("travelRadius", e.target.value as any)}
                    className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900 bg-white"
                  >
                    <option value="15">Up to 15 miles from base</option>
                    <option value="30">Up to 30 miles from base (Recommended)</option>
                    <option value="45">Up to 45 miles from base</option>
                    <option value="60+">60+ miles / Regional Coverage</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="p-3 border border-slate-200 rounded-sm bg-[#FAFAF8] flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has247Emergency}
                      onChange={(e) => updateField("has247Emergency", e.target.checked)}
                      className="w-4 h-4 text-[#EA580C] rounded-xs"
                    />
                    <span className="font-semibold text-slate-900">
                      We offer 24/7 reactive emergency call-out
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePrev}
                className="btn-secondary text-xs py-3.5 px-6"
              >
                &larr; Back
              </button>
              <button type="submit" className="btn-primary text-xs py-3.5 px-8 font-bold">
                Continue to Compliance &rarr;
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Public Liability Insurance Cover <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.publicLiability}
                  onChange={(e) => updateField("publicLiability", e.target.value as any)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900 bg-white"
                >
                  <option value="£5,000,000">£5,000,000 (Standard Commercial)</option>
                  <option value="£10,000,000">£10,000,000 (High-Hazard / Corporate)</option>
                  <option value="Under £5M (Upgrading)">Under £5M (In process of upgrading)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Employers' Liability Insurance (£10M Statutory)
                </label>
                <select
                  value={formData.employersLiability ? "yes" : "exempt"}
                  onChange={(e) => updateField("employersLiability", e.target.value === "yes")}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900 bg-white"
                >
                  <option value="yes">Yes (£10M policy active)</option>
                  <option value="exempt">Exempt (Sole Director, no other employees)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  SSIP Health &amp; Safety Scheme Accreditation
                </label>
                <input
                  type="text"
                  placeholder="e.g. SafeContractor, CHAS, Constructionline Gold"
                  value={formData.ssipScheme}
                  onChange={(e) => updateField("ssipScheme", e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-900">
                  Trade Scheme / Competency Accreditation
                </label>
                <input
                  type="text"
                  placeholder="e.g. NICEIC, Gas Safe, Refcom, BAFE, BICSc"
                  value={formData.tradeAccreditation}
                  onChange={(e) => updateField("tradeAccreditation", e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-sm focus:border-[#EA580C] focus:outline-none text-slate-900"
                />
              </div>
            </div>

            <div className="p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm text-xs text-slate-600 font-light flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Document Vault Verification:</strong> Certificates and schedules do not need to be uploaded right now. Once your account is opened, you will be able to upload PDF copies with automated 90/60/30-day expiry tracking.
              </span>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePrev}
                className="btn-secondary text-xs py-3.5 px-6"
              >
                &larr; Back
              </button>
              <button type="submit" className="btn-primary text-xs py-3.5 px-8 font-bold">
                Review &amp; Pay £95 + VAT &rarr;
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 text-xs">
              <div className="border border-slate-200 rounded-sm p-5 bg-[#FAFAF8] space-y-3">
                <h4 className="font-semibold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  Application Summary
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Company:</span>
                    <span className="font-medium text-slate-900">{formData.companyName || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact:</span>
                    <span className="font-medium text-slate-900">{formData.contactName} ({formData.contactEmail})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Primary Trade:</span>
                    <span className="font-medium text-slate-900">
                      {TRADES_LIST.find((t) => t.id === formData.primaryTrade)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Operating Base &amp; Radius:</span>
                    <span className="font-medium text-slate-900">
                      {formData.postcode || "Declared Base"} ({formData.travelRadius} miles)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Insurance:</span>
                    <span className="font-medium text-slate-900">
                      {formData.publicLiability} Public Liability
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Supplier Membership:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm inline-block">
                      EntireFM Supplier Membership (£95+VAT/yr)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="p-3.5 border border-slate-300 rounded-sm bg-white flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreedToTerms}
                    onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                    className="w-4 h-4 text-[#EA580C] rounded-xs mt-0.5"
                  />
                  <span className="text-slate-700 text-xs font-light leading-relaxed">
                    I confirm that the information provided is accurate, that our business holds the declared insurance and accreditations, and I understand that membership (£95+VAT/yr) provides access to the EntireFM Supplier Platform operating environment with merit-based work order eligibility.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePrev}
                className="btn-secondary text-xs py-3.5 px-6"
              >
                &larr; Back
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-3.5 px-8 font-bold flex items-center gap-2 shadow-sm"
              >
                <span>Review &amp; Pay £95 + VAT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
