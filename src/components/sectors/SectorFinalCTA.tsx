'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Phone, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

export interface SectorFinalCTAProps {
  serviceName: string;
  headline?: string;
  subline?: string;
  imageSrc?: string;
}

export function SectorFinalCTA({
  serviceName,
  headline = "Your estate isn't generic. Your FM contract shouldn't be either.",
  subline = 'Tell us how your building operates and we will build the maintenance strategy, statutory compliance schedule, and priority SLA around it.',
  imageSrc = '/images/editorial/entirefm-totem-headquarters-2000w.webp',
}: SectorFinalCTAProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    siteLocation: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="enquiry" className="relative py-24 sm:py-32 bg-slate-950 text-white overflow-hidden">
      {/* Dark Photographic Backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt="EntireFM national operations centre and commercial estates engineering"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.25] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Direct Narrative & Contact */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-400">
                  ESTATE CONSULTATION
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-[1.12]">
                {headline}
              </h2>

              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                {subline}
              </p>
            </div>

            {/* Direct Connect Pills */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href={CONTACT_CONFIG.mainPhone.href}
                  className="inline-flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-950 text-xs font-medium uppercase tracking-wider px-6 py-3.5 rounded-sm shadow-md transition-all whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-brand-pink" />
                  <span>Call Operations: {CONTACT_CONFIG.mainPhone.display}</span>
                </a>

                <a
                  href={`mailto:${CONTACT_CONFIG.enquiryEmail}`}
                  className="inline-flex items-center gap-2 text-xs font-light text-slate-300 hover:text-white transition-colors py-2 px-3"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{CONTACT_CONFIG.enquiryEmail}</span>
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-light pt-2">
                <ShieldCheck className="w-4 h-4 text-brand-pink shrink-0" />
                <span>Direct technical triage with an Operations Director or Regional Engineering Lead.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Proposal Request Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-sm p-8 sm:p-10 shadow-2xl">
              {formSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-light text-white">
                    Estate Brief Received
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed max-w-md mx-auto">
                    Thank you. A senior EntireFM technical director will review your estate parameters and respond within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-brand-pink block mb-1">
                      PROPOSAL REQUEST // {serviceName}
                    </span>
                    <h3 className="text-xl font-light text-white">
                      Request a Confidential Estate Review
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-light uppercase tracking-wider text-slate-400 mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full rounded-sm border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-light uppercase tracking-wider text-slate-400 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full rounded-sm border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-pink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-light uppercase tracking-wider text-slate-400 mb-1">
                        Direct Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="07xxx xxxxxx"
                        className="w-full rounded-sm border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-pink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-light uppercase tracking-wider text-slate-400 mb-1">
                        Company / Estate *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company or building name"
                        className="w-full rounded-sm border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-pink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-light uppercase tracking-wider text-slate-400 mb-1">
                      Brief Requirements / Key Challenges
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Multi-site retail portfolio, PPM tender, HVAC overhaul, 24/7 reactive cover..."
                      className="w-full rounded-sm border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-pink focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-sm bg-brand-pink py-3.5 text-center text-xs font-medium uppercase tracking-wider text-white shadow-md transition-all hover:bg-brand-pink/90 flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <span>Submit Estate Consultation Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10.5px] text-slate-500 font-light text-center">
                    Strict confidentiality guaranteed. We never share commercial estate data.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
