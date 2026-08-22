import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { EnquiryForm } from '@/components/conversion/EnquiryForm';
import { Phone, Mail, MapPin, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

export function TemplateContact() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Contact EntireFM', url: '/contact-us' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="bg-brand-navy border-b border-brand-border-dark/60">
          <div className="container-custom">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        {/* Contact Hero */}
        <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark py-14 sm:py-20">
          <div className="container-custom relative z-10">
            <div className="max-w-3xl space-y-4">
              <span className="badge-gold">Commercial & Operational Contact</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Contact Entire Facilities Management
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Connect with our technical engineering directors, regional operations managers, or 24/7 helpdesk for new contract proposals and emergency support.
              </p>
            </div>
          </div>
        </section>

        <TrustBar />

        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Operations & Regional Desks */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4 shadow-command">
                  <span className="badge-gold">Immediate Assistance</span>
                  <h3 className="text-xl font-bold text-white">Direct Operations & Emergency Helpdesk</h3>
                  <div className="space-y-4 text-xs text-slate-300 pt-2 border-t border-brand-border-dark">
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-sm">24/7 Operations Desk</strong>
                        <span className="text-brand-gold font-mono text-sm">[PHONE NUMBER TO VERIFY]</span>
                        <p className="text-slate-400 mt-0.5">For urgent plant breakdowns, emergency M&E triage, and contractor callout.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-sm">Commercial Enquiries</strong>
                        <span className="text-slate-300 font-mono">[OFFICIAL EMAIL TO VERIFY]</span>
                        <p className="text-slate-400 mt-0.5">Tenders, RFQs, framework proposals, and estate surveys.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regional Operations Directory */}
                <div className="p-6 bg-brand-surface border border-brand-border rounded-sm space-y-4">
                  <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    Regional Operations Desks
                  </h4>
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="p-3 bg-white border border-brand-border rounded-sm">
                      <strong className="text-brand-navy block">London & South Operations Desk</strong>
                      <span>Greater London, City, M25 Corridor & Home Counties</span>
                      <span className="block text-slate-400 font-mono mt-1">[LONDON DIRECT LINE TO VERIFY]</span>
                    </div>

                    <div className="p-3 bg-white border border-brand-border rounded-sm">
                      <strong className="text-brand-navy block">North & Midlands Regional Base</strong>
                      <span>Lincoln, Sheffield, Manchester, Birmingham & Leeds</span>
                      <span className="block text-slate-400 font-mono mt-1">[REGIONAL DIRECT LINE TO VERIFY]</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Embedded Conversion Form */}
              <div className="lg:col-span-7" id="proposal">
                <EnquiryForm
                  headline="Request a Facilities Management Proposal"
                  subheadline="Fill in your site details below and an operations director will contact you directly to discuss technical requirements and schedule a survey."
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
