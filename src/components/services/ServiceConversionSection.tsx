'use client';

import React from 'react';
import { EnquiryForm } from '@/components/conversion/EnquiryForm';
import { CONTACT_CONFIG } from '@/config/contact';
import { Phone, Mail, ShieldCheck, CheckCircle2, Headphones } from 'lucide-react';
import Link from 'next/link';

export interface ServiceConversionSectionProps {
  serviceName: string;
  headline: string;
  subheadline: string;
  badgeText?: string;
  ctaButtonText?: string;
  directDeskNote?: string;
}

export function ServiceConversionSection({
  serviceName,
  headline,
  subheadline,
  badgeText = 'COMMERCIAL CONSULTATION',
  ctaButtonText = 'Submit Proposal Request',
  directDeskNote = 'Speak directly with an operations director or regional engineering manager.',
}: ServiceConversionSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-200" id="enquiry">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Column: Commercial Context & Direct Access */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
                  {badgeText}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                {headline}
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                {subheadline}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-sm bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0 border border-brand-pink/20">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-normal text-slate-500 uppercase tracking-wider block">
                      Direct Technical Consultation
                    </span>
                    <a
                      href={CONTACT_CONFIG.mainPhone.href}
                      className="text-lg font-light text-slate-900 hover:text-brand-pink transition-colors inline-block mt-0.5"
                    >
                      {CONTACT_CONFIG.mainPhone.display}
                    </a>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {directDeskNote}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-sm bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 border border-slate-300">
                    <Mail className="w-5 h-5 text-brand-pink" />
                  </div>
                  <div>
                    <span className="text-xs font-normal text-slate-500 uppercase tracking-wider block">
                      Commercial Inquiries Desk
                    </span>
                    <a
                      href={`mailto:${CONTACT_CONFIG.enquiryEmail}`}
                      className="text-sm font-normal text-slate-900 hover:text-brand-pink transition-colors inline-block mt-0.5 break-all"
                    >
                      {CONTACT_CONFIG.enquiryEmail}
                    </a>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tender documents, RFQ schedules, and bespoke contract specifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-sm text-xs text-slate-600 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-pink shrink-0" />
              <span>
                No obligation technical survey and transparent contract schedule quotation.
              </span>
            </div>
          </div>

          {/* Right Column: Embedded Conversion Form */}
          <div className="lg:col-span-7">
            <EnquiryForm
              variant="light"
              defaultService={serviceName}
              headline="Tell Us About Your Requirement"
              subheadline="Provide brief estate details below and a regional engineering manager will review your requirement."
              ctaText={ctaButtonText}
              badgeText={serviceName}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
