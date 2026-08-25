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

export function OnboardingWizardClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [lastSaved, setLastSaved] = useState<string>('Just now');
  const [submitted, setSubmitted] = useState(false);
  const [appRef, setAppRef] = useState('SUP-260825-9921');

  // Form State
  const [formData, setFormData] = useState({
    legalCompanyName: 'Midlands Mechanical & HVAC Services Ltd',
    tradingName: 'Midlands HVAC Pro',
    companyNumber: '08923412',
    vatNumber: 'GB982341290',
    websiteUrl: 'https://midlandshvac.example.co.uk',
    yearEstablished: '2014',
    employeeCount: '18',
    tradingAddress: '14 Industrial Way, Aston, Birmingham, B6 7RH',
    mainPhone: '0121 555 0192',
    generalEmail: 'info@midlandshvac.example.co.uk',
    businessType: 'Regional Contractor',
    companySummary: 'Commercial building engineering firm specializing in planned chiller maintenance, commercial gas heating, and 24/7 reactive HVAC callout.',

    primaryContactName: 'David Patterson',
    primaryContactEmail: 'd.patterson@midlandshvac.example.co.uk',
    primaryContactPhone: '07700 900123',
    opsContactName: 'Sarah Jenkins',
    opsContactEmail: 's.jenkins@midlandshvac.example.co.uk',

    selectedServices: ['hvac', 'gas-heating'],
    selectedRegions: ['Birmingham', 'Coventry', 'Wolverhampton', 'Leicester'],
    has247: true,
    emergencySlaHours: '4',

    hasSubcontractors: false,
    directEngineers: '12',

    plInsurer: 'Aviva Insurance Ltd',
    plPolicyNumber: 'AV-PL-889921',
    plCoverLimit: '£10,000,000',
    plExpiryDate: '2027-04-30',

    gasSafeNumber: 'GS-554921',
    gasSafeExpiry: '2026-06-01',
    fGasNumber: 'REF-100921',
    fGasExpiry: '2028-01-01',

    hasHsPolicy: true,
    hasRams: true,
    hasIncidentHistory: false,

    antiBribery: true,
    modernSlavery: true,
    codeOfConduct: true,
    truthfulnessDeclaration: true,
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

  const handleSubmit = () => {
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
          <span className="font-bold text-slate-900 font-sans block">What Happens Next:</span>
          <ul className="space-y-1 text-slate-600 font-sans text-[11.5px]">
            <li>1. Technical review of insurance schedules and trade accreditations (3-5 business days).</li>
            <li>2. If clarifications or replacement documents are required, you will see an action banner in your portal.</li>
            <li>3. Upon review completion, scoped service &amp; regional authorization decisions will appear in your portal.</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link href="/supplier-portal" className="btn-primary text-xs py-2.5 px-6">
            Go to Supplier Portal &rarr;
          </Link>
          <Link href="/supplier-portal/documents" className="btn-secondary text-xs py-2.5 px-6">
            View Document Vault
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
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Declarations &amp; Code of Conduct</span>
                    <span className="text-slate-500 text-[11px]">Accepted by {formData.primaryContactName}</span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono text-[10.5px]">COMPLETE</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded text-emerald-950 space-y-1">
                <span className="font-bold block">Ready for Submission:</span>
                <p className="text-[11.5px] leading-relaxed">
                  All 15 application sections are complete and validated. Click below to submit your profile for technical assurance review.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            {currentStep < 15 ? (
              <button onClick={handleNext} className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5">
                Continue to Step {currentStep + 1} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary text-xs py-2 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5">
                Submit Application <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
