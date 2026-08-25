'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ServiceHero } from '@/components/services/ServiceHero';
import { SectorSnapshot } from '@/components/sectors/SectorSnapshot';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { getActiveVacancies, Vacancy } from '@/server/careers/vacancies';
import { CONTACT_CONFIG } from '@/config/contact';
import {
  Briefcase,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Upload,
  User,
  Mail,
  Phone,
  FileText,
  Building,
  Sparkles,
  Layers,
} from 'lucide-react';
import type { TemplateProps } from './types';

export function TemplateCareers({ route, content }: TemplateProps) {
  const vacancies = getActiveVacancies();
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    tradeDiscipline: 'M&E Engineering',
    experienceYears: '3-5 Years',
    qualifications: '',
    coverNote: '',
    privacyConsent: false,
  });

  const handleApplyClick = (vac: Vacancy) => {
    setSelectedVacancy(vac);
    const formElement = document.getElementById('application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          vacancyRef: selectedVacancy ? selectedVacancy.reference : 'SPECULATIVE',
          roleTitle: selectedVacancy ? selectedVacancy.title : 'Speculative Application',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Submission failed. Please check required fields.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. CINEMATIC HERO */}
        <ServiceHero
          eyebrow="CAREERS // ENTIREFM ENGINEERING"
          title="Engineering Careers Built on High Standards &amp; Professional Pride"
          intro="Join a national facilities engineering company that values technical competence, direct delivery, modern vehicle tooling, and continuous certified development."
          imageSrc="/images/editorial/entirefm-engineers-office-testing-2000w.webp"
          imageAlt="EntireFM certified mobile engineers reviewing electrical test telemetry"
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'Careers & Vacancies', url: route.path },
          ]}
          primaryCta={{ label: 'View Active Vacancies', href: '#vacancies' }}
          secondaryCta={{ label: 'Speculative Application', href: '#application-form' }}
          serviceFacts={[
            { label: 'Engineering Delivery', value: 'Directly Employed' },
            { label: 'Funded Accreditations', value: 'Gas, NICEIC, F-Gas' },
            { label: 'Fleet & Equipment', value: 'Premium Calibrated' },
          ]}
        />

        <TrustBar />

        {/* 2. CULTURE & VALUES STRIP */}
        <SectorSnapshot
          leadText="EntireFM empowers qualified technicians and facilities managers with the autonomy, technology, and career support required to deliver true engineering excellence."
          priorities={[
            { title: 'Modern Fleet & Tooling', subtitle: 'Fully equipped vehicles, high-spec diagnostic gear, and quality PPE', iconName: 'maintenanceTools' },
            { title: 'Funded Industry CPD', subtitle: 'Company-sponsored Gas Safe, NICEIC, F-Gas Category 1 & IOSH training', iconName: 'operationalExcellence' },
            { title: 'EntireCAFM Digital App', subtitle: 'Clean mobile workflows removing paper bureaucracy and duplicate admin', iconName: 'dataInsights' },
            { title: 'Fair Roster & Overtime', subtitle: 'Agreed standby allowances, transparent overtime, and work-life balance', iconName: 'twentyFourSevenOps' },
          ]}
        />

        {/* 3. ACTIVE VACANCIES SECTION */}
        <section id="vacancies" className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
                  CURRENT VACANCIES
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Verified Career Opportunities Across the UK
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                All roles listed below are live and actively recruiting. Expired listings are automatically archived.
              </p>
            </div>

            <div className="space-y-6">
              {vacancies.length === 0 ? (
                <div className="p-8 bg-white border border-slate-200 rounded-sm text-center">
                  <p className="text-slate-600 text-sm">
                    No active public vacancies at this moment. We always welcome speculative applications from qualified M&amp;E and HVAC engineers.
                  </p>
                </div>
              ) : (
                vacancies.map((vac) => (
                  <div
                    key={vac.id}
                    className="p-8 bg-white border border-slate-200/90 rounded-sm shadow-sm hover:border-brand-pink/60 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
                  >
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[11px] font-mono font-light uppercase px-2.5 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                          {vac.reference}
                        </span>
                        <span className="text-[11px] font-mono font-light uppercase px-2.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                          {vac.department}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {vac.location}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {vac.contractType}
                        </span>
                      </div>

                      <h3 className="text-xl font-light text-slate-900 group-hover:text-brand-pink-dark transition-colors">
                        {vac.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {vac.summary}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {vac.certificationsRequired.map((cert, cIdx) => (
                          <span
                            key={cIdx}
                            className="inline-flex items-center gap-1 text-[11px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-sm"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                      {vac.salaryGuide && (
                        <span className="text-xs font-mono text-slate-600 font-light">
                          {vac.salaryGuide}
                        </span>
                      )}
                      <button
                        onClick={() => handleApplyClick(vac)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-pink hover:bg-brand-pink-dark text-white text-xs font-normal uppercase tracking-wider rounded-sm transition-colors shadow-sm"
                      >
                        <span>Apply For Position</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 4. FUNCTIONAL APPLICATION FORM */}
        <section id="application-form" className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-3xl">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
                  APPLICATION FORM
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900">
                {selectedVacancy ? `Apply for: ${selectedVacancy.title}` : 'Submit a Career Application'}
              </h2>
              {selectedVacancy && (
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Vacancy Ref: {selectedVacancy.reference} · Location: {selectedVacancy.location}
                </p>
              )}
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-sm text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-light text-emerald-900">Application Received</h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you for applying to EntireFM. Our operations and recruitment team will review your qualifications and contact you regarding the next stage.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSelectedVacancy(null);
                    }}
                    className="text-xs font-normal text-emerald-900 underline hover:text-emerald-700"
                  >
                    Submit another application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 bg-[#FAF9FB] p-8 border border-slate-200 rounded-sm shadow-sm">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. David Miller"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="david.miller@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                      Telephone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="07123 456789"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Location / Base Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Sheffield, London, Manchester"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                      Primary Trade / Discipline
                    </label>
                    <select
                      value={formData.tradeDiscipline}
                      onChange={(e) => setFormData({ ...formData, tradeDiscipline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    >
                      <option value="Commercial M&E">Commercial Mechanical &amp; Electrical</option>
                      <option value="HVAC / Air Conditioning">HVAC / Air Conditioning / Chillers</option>
                      <option value="Commercial Plumbing / Gas">Commercial Plumbing / Gas Safe</option>
                      <option value="Facilities / Helpdesk">Operations / CAFM Helpdesk</option>
                      <option value="Specialist Cleaning">Specialist Cleaning &amp; Hygiene</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                      Years of Relevant Experience
                    </label>
                    <select
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                    >
                      <option value="1-2 Years">1-2 Years (Improver / Technician)</option>
                      <option value="3-5 Years">3-5 Years (Qualified Engineer)</option>
                      <option value="5-10 Years">5-10 Years (Senior Engineer / Lead)</option>
                      <option value="10+ Years">10+ Years (Senior Lead / Manager)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                    Certifications &amp; Accreditations Held
                  </label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="e.g. 18th Edition, City & Guilds 2391, F-Gas Cat 1, Gas Safe, IOSH"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                    Brief Experience Summary &amp; Availability
                  </label>
                  <textarea
                    rows={3}
                    value={formData.coverNote}
                    onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                    placeholder="Briefly outline your previous commercial contracts, notice period, and key skills..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.privacyConsent}
                      onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-pink focus:ring-brand-pink"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I consent to EntireFM holding my contact details and application details for recruitment purposes in accordance with the{' '}
                      <a href="/privacy-policy" className="text-brand-pink underline">
                        Privacy Policy
                      </a>.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-brand-pink hover:bg-brand-pink-dark text-white text-xs font-normal uppercase tracking-wider rounded-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Submitting Application...' : 'Submit Application'}
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
          serviceName="Recruitment & Careers"
          headline="Looking to Connect with Our Recruitment Team?"
          subheadline="Contact our operations recruitment desk directly regarding ongoing technical engineering opportunities across the UK."
          badgeText="CAREERS HELPDESK"
          ctaButtonText="Email Careers Desk"
          directDeskNote={`Contacting ${CONTACT_CONFIG.careersEmail}`}
        />
      </main>

      <Footer />
    </div>
  );
}
