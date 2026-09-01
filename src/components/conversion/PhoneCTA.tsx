import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { EnquiryForm } from './EnquiryForm';
import { CONTACT_CONFIG } from '@/config/contact';

export function PhoneCTA({
  location = 'National',
  phone = CONTACT_CONFIG.mainPhone.display,
  tel = CONTACT_CONFIG.mainPhone.href,
}: {
  location?: string;
  phone?: string;
  tel?: string;
}) {
  return (
    <div className="bg-brand-carbon border border-brand-edge-dark p-6 rounded-sm text-white flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-sm bg-brand-electric/20 text-brand-electric flex items-center justify-center shrink-0 border border-brand-electric/30">
          <Phone className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-brand-electric block">{location} Engineering & Helpdesk</span>
          <span className="text-lg font-light text-white block mt-0.5">Speak with our Operations Team</span>
          <span className="text-xs text-slate-400">Direct technical triage and emergency contractor dispatch</span>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <a href={tel} className="btn-phone w-full sm:w-auto text-center">
          <Phone className="w-3.5 h-3.5" />
          <span>{phone}</span>
        </a>
      </div>
    </div>
  );
}

export function InlineCTA({
  title = 'Ready to review your estate maintenance or compliance?',
  description = 'Get a comprehensive facilities management proposal tailored to your commercial buildings and operational schedules.',
  buttonText = 'Request Site Survey',
  buttonLink = '#enquiry',
}: {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}) {
  return (
    <div className="bg-brand-surface border border-brand-edge p-8 rounded-sm text-brand-graphite my-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="max-w-2xl">
        <span className="badge-technical mb-2">Operational Review</span>
        <h3 className="text-xl font-light tracking-tight text-brand-graphite mt-1">{title}</h3>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>
      <div className="shrink-0 flex flex-wrap gap-3">
        <Link href={buttonLink} className="btn-primary text-xs py-3 px-5">
          {buttonText} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function ProposalSection({
  defaultService,
  defaultLocation,
  headline,
  subheadline,
}: {
  defaultService?: string;
  defaultLocation?: string;
  headline?: string;
  subheadline?: string;
}) {
  return (
    <section id="enquiry" className="py-14 sm:py-20 lg:py-24 bg-brand-graphite border-t border-brand-edge-dark text-white relative">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Commercial Context */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <span className="badge-gold">Commercial Partnership</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white leading-tight">
              Direct Engineering Accountability. No Bureaucratic Delays.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              Whether you require a comprehensive Hard &amp; Soft FM contract, single-site mechanical &amp; electrical maintenance, or an urgent specialist survey, EntireFM deploys certified engineers and dedicated account managers nationwide.
            </p>

            <div className="space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
              <div className="flex items-start gap-3 p-3.5 sm:p-4 bg-brand-carbon border border-brand-edge-dark rounded-sm">
                <ShieldCheck className="w-5 h-5 text-brand-electric shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-light text-white">Comprehensive Statutory Compliance Management</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Structured PPM scheduling, periodic engineering testing, statutory record keeping, and digital audit logs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 sm:p-4 bg-brand-carbon border border-brand-edge-dark rounded-sm">
                <Clock className="w-5 h-5 text-brand-electric shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-light text-white">Central Operations Helpdesk</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Direct helpdesk triage, reactive engineer dispatch, and clear SLA performance tracking.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 border border-dashed border-brand-edge-dark rounded-sm bg-brand-carbon/40 text-xs text-slate-400">
              <span className="text-brand-electric font-light block mb-1">Direct Technical Consultation:</span>
              Speak directly with an operations director or regional engineering manager on <a href={CONTACT_CONFIG.mainPhone.href} className="text-white font-light hover:text-brand-electric">{CONTACT_CONFIG.mainPhone.display}</a>.
            </div>
          </div>

          {/* Right Column: Embedded Conversion Form */}
          <div className="lg:col-span-7">
            <EnquiryForm
              defaultService={defaultService}
              defaultLocation={defaultLocation}
              headline={headline}
              subheadline={subheadline}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
