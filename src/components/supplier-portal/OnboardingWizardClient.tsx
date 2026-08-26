'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Wrench,
  MapPin,
  Clock,
  Briefcase,
  ShieldCheck,
  Award,
  HeartPulse,
  Scale,
  Lock,
  FileText,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { CANONICAL_ACCREDITATIONS, CANONICAL_PUBLIC_PRICING } from '@/config/supplier-data';

const STEPS = [
  { num: 1, key: 'company', title: 'Company Profile', icon: Building2 },
  { num: 2, key: 'contacts', title: 'Contacts & Roles', icon: Users },
  { num: 3, key: 'services', title: 'Services & Trades', icon: Wrench },
  { num: 4, key: 'coverage', title: 'Coverage & Bases', icon: MapPin },
  { num: 5, key: 'operations', title: 'Operational Capability', icon: Clock },
  { num: 6, key: 'workforce', title: 'Workforce & Subs', icon: Briefcase },
  { num: 7, key: 'insurance', title: 'Insurance Schedules', icon: ShieldCheck },
  { num: 8, key: 'accreditations', title: 'Accreditations', icon: Award },
  { num: 9, key: 'health_safety', title: 'Health & Safety', icon: HeartPulse },
  { num: 10, key: 'governance', title: 'Governance & Ethics', icon: Scale },
  { num: 11, key: 'security', title: 'Information Security', icon: Lock },
  { num: 12, key: 'documents', title: 'Document Vault', icon: FileText },
  { num: 13, key: 'commercial', title: 'Commercial Info', icon: CreditCard },
  { num: 14, key: 'declarations', title: 'Declarations', icon: CheckCircle2 },
  { num: 15, key: 'review', title: 'Review & Submit', icon: Save },
];

export function OnboardingWizardClient({ initialOrgId = '', initialAppRef = '', initialLegalName = '', initialTradingName = '' }: {
  initialOrgId?: string;
  initialAppRef?: string;
  initialLegalName?: string;
  initialTradingName?: string;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [lastSaved, setLastSaved] = useState<string>('Not yet saved');
  const [submitted, setSubmitted] = useState(false);
  const [appRef, setAppRef] = useState(initialAppRef);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Form State — all fields blank; only pre-populate from legitimate server-provided data
  const [formData, setFormData] = useState({
    legalCompanyName: initialLegalName,
    tradingName: initialTradingName,
    companyNumber: '',
    vatNumber: '',
    websiteUrl: '',
    yearEstablished: '',
    employeeCount: '',
    tradingAddress: '',
    mainPhone: '',
    generalEmail: '',
    businessType: '',
    companySummary: '',

    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    opsContactName: '',
    opsContactEmail: '',

    selectedServices: [] as string[],
    selectedRegions: [] as string[],
    has247: false,
    emergencySlaHours: '',

    hasSubcontractors: false,
    directEngineers: '',

    plInsurer: '',
    plPolicyNumber: '',
    plCoverLimit: '',
    plExpiryDate: '',

    selectedAccreditations: [] as string[],
    accreditationNumbers: {} as Record<string, string>,

    gasSafeNumber: '',
    gasSafeExpiry: '',
    fGasNumber: '',
    fGasExpiry: '',

    hasHsPolicy: false,
    hasRams: false,
    hasIncidentHistory: false,

    antiBribery: false,
    modernSlavery: false,
    codeOfConduct: false,
    truthfulnessDeclaration: false,

    // Pre-submission Assurance Payment Gateway
    paymentMethod: 'CARD' as 'CARD' | 'INVOICE' | 'WAIVER',
    waiverReason: '',
  });



  const handleSave = () => {
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleNext = () => {
    handleSave();
    if (currentStep < 15) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    handleSave();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setPaymentError(null);

    if (formData.paymentMethod === 'CARD') {
      setIsProcessingPayment(true);
      try {
        const res = await fetch('/api/supplier/application/payment/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ supplierId: initialOrgId || 'supplier-draft' }),
        });

        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        } else if (data.alreadyPaid) {
          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        } else {
          setPaymentError(data.error || 'Failed to initialize Stripe Checkout session');
          setIsProcessingPayment(false);
        }
      } catch (err: any) {
        setPaymentError(err.message || 'Payment network error. Please try again.');
        setIsProcessingPayment(false);
      }
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="bg-white border border-slate-200 rounded-sm p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-6">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            APPLICATION SUBMISSION CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Application Submitted Successfully
          </h1>
          <p className="text-xs text-slate-600 font-light max-w-md mx-auto">
            Your supplier application reference is{' '}
            <strong className="text-slate-900 font-mono font-bold">{appRef}</strong>. Our supply chain assurance desk has received your documentation.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded text-left text-xs font-mono space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-900 font-sans">Assurance Review Fee:</span>
            <span className="text-emerald-700 font-bold">
              {formData.paymentMethod === 'CARD' ? 'PAID — £350 + VAT (Card)' : formData.paymentMethod === 'INVOICE' ? 'INVOICE ISSUED — £350 + VAT' : 'WAIVED (Authorised)'}
            </span>
          </div>
          <span className="font-bold text-slate-900 font-sans block pt-1">What Happens Next:</span>
          <ul className="space-y-1 text-slate-600 font-sans text-[11.5px]">
            <li>1. Technical review of insurance schedules and trade accreditations (3-5 business days).</li>
            <li>2. If clarifications or replacement documents are required, you will see an action banner in your portal.</li>
            <li>3. Scoped service &amp; regional authorization decisions will appear in your portal.</li>
            <li>4. Payment VAT receipt / invoice is available under your Supplier Portal Billing tab.</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link href="/supplier-portal" className="btn-primary text-xs py-2.5 px-6 font-bold">
            Go to Supplier Portal &rarr;
          </Link>
          <Link href="/supplier-portal/billing" className="btn-secondary text-xs py-2.5 px-6">
            View Billing &amp; Invoices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Navigation Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
              ONBOARDING WIZARD
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              {Math.round((currentStep / 15) * 100)}%
            </span>
          </div>

          <div className="space-y-1">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCurrent = currentStep === step.num;
              const isPast = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => {
                    handleSave();
                    setCurrentStep(step.num);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded text-left text-xs transition-colors ${
                    isCurrent
                      ? 'bg-slate-900 text-white font-medium shadow-sm'
                      : isPast
                      ? 'text-slate-700 hover:bg-slate-50'
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${isCurrent ? 'text-brand-pink' : isPast ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span className="truncate">{step.num}. {step.title}</span>
                  </div>
                  {isPast && <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[10.5px] font-mono text-slate-400 flex items-center justify-between">
            <span>Autosaved: {lastSaved}</span>
            <button onClick={handleSave} className="text-slate-900 font-bold hover:underline">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Main Step Form Area */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
          {/* Step Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-mono uppercase text-brand-pink font-bold">
                STAGE {currentStep} OF 15
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {STEPS[currentStep - 1].title}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Ref: {appRef}</span>
          </div>

          {/* Form Content by Step */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Legal Company Name *</label>
                  <input
                    type="text"
                    value={formData.legalCompanyName}
                    onChange={(e) => setFormData({ ...formData, legalCompanyName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Trading Name (if different)</label>
                  <input
                    type="text"
                    value={formData.tradingName}
                    onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Companies House Number *</label>
                  <input
                    type="text"
                    value={formData.companyNumber}
                    onChange={(e) => setFormData({ ...formData, companyNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">VAT Registration Number</label>
                  <input
                    type="text"
                    value={formData.vatNumber}
                    onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Trading Address *</label>
                <textarea
                  rows={2}
                  value={formData.tradingAddress}
                  onChange={(e) => setFormData({ ...formData, tradingAddress: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Year Established</label>
                  <input
                    type="text"
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Total Employees</label>
                  <input
                    type="text"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Primary Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  >
                    <option>Local SME</option>
                    <option>Regional Contractor</option>
                    <option>National Contractor</option>
                    <option>Specialist Contractor</option>
                    <option>Manufacturer / OEM</option>
                    <option>Technology Provider</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Company Capability Summary</label>
                <textarea
                  rows={3}
                  value={formData.companySummary}
                  onChange={(e) => setFormData({ ...formData, companySummary: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="font-bold text-slate-900 block">Primary Commercial Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.primaryContactName}
                    onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.primaryContactEmail}
                    onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={formData.primaryContactPhone}
                    onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                <span className="font-bold text-slate-900 block">Operations &amp; 24/7 Lead</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.opsContactName}
                    onChange={(e) => setFormData({ ...formData, opsContactName: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.opsContactEmail}
                    onChange={(e) => setFormData({ ...formData, opsContactEmail: e.target.value })}
                    className="p-2 border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 text-xs font-sans">
              <span className="font-bold text-slate-900 block">Select Declared Service Disciplines</span>
              <p className="text-slate-500 font-light text-[11.5px]">
                Selecting a service does not constitute automatic approval. Applicable technical accreditations must be submitted in subsequent steps.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { slug: 'hvac', name: 'HVAC & Chillers', desc: 'VRV, Chillers, AHUs (REFCOM / F-Gas)' },
                  { slug: 'gas-heating', name: 'Commercial Gas & Boilers', desc: 'Plant rooms & heating (Gas Safe)' },
                  { slug: 'electrical', name: 'Electrical & Critical Power', desc: 'Fixed wire & UPS (NICEIC / ECA)' },
                  { slug: 'water-hygiene', name: 'Water Hygiene & Legionella', desc: 'L8 monitoring & chlorination' },
                  { slug: 'fire-safety', name: 'Fire Alarms & Life Safety', desc: 'BAFE / FIA certified systems' },
                  { slug: 'rope-access', name: 'Rope Access & BMU Façade', desc: 'IRATA certified working at height' },
                  { slug: 'cleaning', name: 'Commercial & Industrial Cleaning', desc: 'BICSc accredited soft services' },
                  { slug: 'drone-survey', name: 'Drone Aerial Asset Inspection', desc: 'CAA certified thermography' },
                ].map((s) => {
                  const isChecked = formData.selectedServices.includes(s.slug);
                  return (
                    <label
                      key={s.slug}
                      className={`flex items-start gap-3 p-3.5 border rounded cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const updated = isChecked
                            ? formData.selectedServices.filter((x) => x !== s.slug)
                            : [...formData.selectedServices, s.slug];
                          setFormData({ ...formData, selectedServices: updated });
                        }}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-[11px] text-slate-500">{s.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4 text-xs font-sans">
              <span className="font-bold text-slate-900 block">Declared Operating Regions</span>
              <p className="text-slate-500 font-light text-[11.5px]">
                Declare the geographical regions your mobile engineers reliably cover within contractual response targets.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {[
                  'London', 'Manchester', 'Birmingham', 'Leeds', 'Sheffield',
                  'Bristol', 'Liverpool', 'Newcastle', 'Nottingham', 'Leicester',
                  'Coventry', 'Southampton', 'Reading', 'Cardiff', 'Glasgow', 'Edinburgh'
                ].map((city) => {
                  const isSelected = formData.selectedRegions.includes(city);
                  return (
                    <label
                      key={city}
                      className={`flex items-center gap-2 p-2.5 border rounded cursor-pointer text-xs ${
                        isSelected ? 'bg-emerald-50 border-emerald-300 font-bold text-slate-900' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          const updated = isSelected
                            ? formData.selectedRegions.filter((x) => x !== city)
                            : [...formData.selectedRegions, city];
                          setFormData({ ...formData, selectedRegions: updated });
                        }}
                        className="rounded text-emerald-600"
                      />
                      <span>{city}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-4 text-xs font-sans">
              <span className="font-bold text-slate-900 block">Public Liability Insurance Schedule</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Insurer Name *</label>
                  <input
                    type="text"
                    value={formData.plInsurer}
                    onChange={(e) => setFormData({ ...formData, plInsurer: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Policy Number *</label>
                  <input
                    type="text"
                    value={formData.plPolicyNumber}
                    onChange={(e) => setFormData({ ...formData, plPolicyNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Indemnity Cover Limit *</label>
                  <input
                    type="text"
                    value={formData.plCoverLimit}
                    onChange={(e) => setFormData({ ...formData, plCoverLimit: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.plExpiryDate}
                    onChange={(e) => setFormData({ ...formData, plExpiryDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded text-center space-y-2">
                <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                <span className="text-slate-700 font-bold block">Upload Insurance Broker Schedule (PDF)</span>
                <span className="text-[11px] text-slate-400">Attached: Aviva_PL_10M_2026.pdf (480 KB)</span>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">SSIP &amp; Industry Accreditations</span>
                  <p className="text-slate-500 font-light text-[11.5px]">
                    Select each active accreditation held by your organisation and provide the scheme registration or certificate number.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {formData.selectedAccreditations.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {CANONICAL_ACCREDITATIONS.map((accred) => {
                  const isChecked = formData.selectedAccreditations.includes(accred.name);
                  return (
                    <div
                      key={accred.name}
                      onClick={() => {
                        const updated = isChecked
                          ? formData.selectedAccreditations.filter((x) => x !== accred.name)
                          : [...formData.selectedAccreditations, accred.name];
                        setFormData({ ...formData, selectedAccreditations: updated });
                        handleSave();
                      }}
                      className={`p-3.5 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handled by card click
                          className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                        />
                        <div>
                          <span className={`text-[12px] block ${isChecked ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                            {accred.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {accred.category}
                          </span>
                        </div>
                      </div>

                      {isChecked && accred.requiresIdentifier && (
                        <div
                          className="mt-3 pt-3 border-t border-emerald-200/80 w-full space-y-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="block text-[10.5px] font-mono font-bold text-slate-800">
                            {accred.identifierLabel} *
                          </label>
                          <input
                            type="text"
                            value={formData.accreditationNumbers[accred.name] || ''}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                accreditationNumbers: {
                                  ...formData.accreditationNumbers,
                                  [accred.name]: e.target.value,
                                },
                              });
                            }}
                            onBlur={handleSave}
                            placeholder={accred.placeholder}
                            className="w-full p-2 bg-white border border-emerald-300 rounded text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 14 && (
            <div className="space-y-4 text-xs font-sans">
              <span className="font-bold text-slate-900 block">Declarations &amp; Code of Conduct</span>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.codeOfConduct}
                    onChange={(e) => setFormData({ ...formData, codeOfConduct: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">EntireFM Supplier Code of Conduct (v2026.1) *</span>
                    <span className="text-[11px] text-slate-500">
                      We agree to adhere to safe working, prompt communication, transparent defect reporting, and professional site standards.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.truthfulnessDeclaration}
                    onChange={(e) => setFormData({ ...formData, truthfulnessDeclaration: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Accuracy of Information *</span>
                    <span className="text-[11px] text-slate-500">
                      We certify that all submitted insurances, certifications, and operational capabilities are accurate and valid.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {currentStep === 15 && (
            <div className="space-y-6 text-xs font-sans">
              <span className="font-bold text-slate-900 block text-sm">Pre-Submission Application Review</span>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Company Profile</span>
                    <span className="text-slate-500 text-[11px]">{formData.legalCompanyName} ({formData.companyNumber})</span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono text-[10.5px]">COMPLETE</span>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Declared Services</span>
                    <span className="text-slate-500 text-[11px]">{formData.selectedServices.join(', ')}</span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono text-[10.5px]">COMPLETE</span>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Public Liability Insurance</span>
                    <span className="text-slate-500 text-[11px]">{formData.plCoverLimit} (Exp: {formData.plExpiryDate})</span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono text-[10.5px]">COMPLETE</span>
                </div>
                <div className="p-3.5 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Accreditations &amp; Trade Schemes</span>
                    <div className="text-slate-600 text-[11px] mt-1 space-y-0.5">
                      {formData.selectedAccreditations.map((acc) => (
                        <div key={acc} className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-900">{acc}</span>
                          {formData.accreditationNumbers[acc] && (
                            <span className="font-mono text-slate-500 text-[10.5px]">
                              (Ref: {formData.accreditationNumbers[acc]})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono text-[10.5px]">COMPLETE</span>
                </div>
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Declarations &amp; Code of Conduct</span>
                    <span className="text-slate-500 text-[11px]">Accepted by {formData.primaryContactName}</span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono text-[10.5px]">COMPLETE</span>
                </div>
              </div>

              {/* INITIAL SUPPLIER ASSURANCE REVIEW GATEWAY */}
              <div className="bg-[#FAF9FB] border-2 border-slate-900 rounded-sm p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PRE-SUBMISSION ASSURANCE GATEWAY
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {CANONICAL_PUBLIC_PRICING.INITIAL_ASSURANCE_REVIEW.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-slate-900">
                      {CANONICAL_PUBLIC_PRICING.INITIAL_ASSURANCE_REVIEW.displayPrice}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">£420.00 inc. 20% VAT</span>
                  </div>
                </div>

                <div className="text-[11.5px] text-slate-600 space-y-2">
                  <p>
                    The Initial Supplier Assurance Review fee covers the administration and independent review of applicable supplier-assurance information submitted by your organisation, including company identity, insurance schedules, H&amp;S competence, and trade qualifications.
                  </p>
                  
                  {/* Critical Disclosure */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-950 text-[11px] leading-relaxed">
                    <strong>Critical Disclosure:</strong> Payment enables your completed application to be submitted for EntireFM assurance review. It does not guarantee approval, Preferred Supplier status, work allocation, or any minimum volume of work.
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-2 pt-1">
                  <span className="font-bold text-slate-900 text-xs block">Select Payment Method:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-2.5 p-3 rounded border cursor-pointer text-xs ${
                        formData.paymentMethod === 'CARD'
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'CARD'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'CARD' })}
                        className="text-brand-pink"
                      />
                      <CreditCard className="h-4 w-4 shrink-0" />
                      <span>Credit / Debit Card (Stripe Instant)</span>
                    </label>

                    <label
                      className={`flex items-center gap-2.5 p-3 rounded border cursor-pointer text-xs ${
                        formData.paymentMethod === 'INVOICE'
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'INVOICE'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'INVOICE' })}
                        className="text-brand-pink"
                      />
                      <FileText className="h-4 w-4 shrink-0" />
                      <span>Commercial Invoice (30-Day BACS)</span>
                    </label>
                  </div>
                </div>

                {paymentError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{paymentError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1 || isProcessingPayment}
              className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            {currentStep < 15 ? (
              <button onClick={handleNext} className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5">
                Continue to Step {currentStep + 1} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isProcessingPayment}
                className="btn-primary text-xs py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Redirecting to Stripe...</span>
                  </>
                ) : formData.paymentMethod === 'CARD' ? (
                  <>
                    <span>Pay Assurance Review Fee &amp; Submit (£420.00)</span>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </>
                ) : formData.paymentMethod === 'INVOICE' ? (
                  <>
                    <span>Issue Invoice &amp; Submit Application</span>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    <span>Submit with Authorised Waiver</span>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
