import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { StatBlock, ClientLogoRail } from '@/components/trust/StatBlock';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ShieldCheck, Award, Users, Wrench, Building2, CheckCircle2 } from 'lucide-react';

export function TemplateAbout() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About EntireFM', url: '/about-entire-facilities-management' },
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

        {/* About Hero */}
        <section className="bg-brand-navy text-white relative overflow-hidden border-b border-brand-border-dark py-14 sm:py-20">
          <div className="container-custom relative z-10">
            <div className="max-w-3xl space-y-4">
              <span className="badge-gold">Engineering & Estate Governance</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                About Entire Facilities Management
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                A serious national facilities management and engineering organization with the systems, certifications, and direct delivery model to manage complex property estates.
              </p>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* Core Narrative & Operating Philosophy */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="badge-technical">Direct Accountability</span>
                  <h2 className="text-3xl font-bold tracking-tight text-brand-navy mt-2">
                    National Scale with Accountable Regional Delivery
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed">
                    EntireFM was built to solve a persistent frustration in commercial property management: the disconnect between massive, impersonal outsourcing conglomerates and small, under-resourced local contractors.
                  </p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    We deliver the rigorous CAFM infrastructure, multi-discipline engineering accreditations, and national scale of a tier-one operator — while maintaining dedicated account managers and direct access to senior leadership so clients deal with accountable people.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-5 bg-brand-surface border border-brand-border rounded-sm">
                    <Wrench className="w-5 h-5 text-brand-gold mb-2" />
                    <h4 className="text-sm font-bold text-brand-navy">Self-Delivered Engineering</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Direct mobile engineering teams, certified electricians, Gas Safe technicians, and specialist cleaning operatives.
                    </p>
                  </div>

                  <div className="p-5 bg-brand-surface border border-brand-border rounded-sm">
                    <ShieldCheck className="w-5 h-5 text-brand-gold mb-2" />
                    <h4 className="text-sm font-bold text-brand-navy">100% Statutory Compliance</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      SFG20 maintenance scheduling, digital audit logs, NICEIC signoffs, and complete insurer compliance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="p-6 bg-brand-charcoal border border-brand-border-dark rounded-sm text-white space-y-4 shadow-command">
                  <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold block">Company Snapshot</span>
                  <h3 className="text-base font-bold text-white">EntireFM at a Glance</h3>
                  <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-brand-border-dark">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Headquarters / Base:</span>
                      <span className="text-white font-semibold">Lincoln & London Hubs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Core Services:</span>
                      <span className="text-white font-semibold">Hard FM, Soft FM, PPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Operating Model:</span>
                      <span className="text-white font-semibold">Direct Self-Delivery</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Helpdesk:</span>
                      <span className="text-brand-gold font-semibold">24/7/365 Central Desk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AccreditationRail />
        <ClientLogoRail />

        <ProposalSection
          headline="Discuss Your Estate Requirements with Our Team"
          subheadline="Consult with our engineering directors regarding single-site or portfolio maintenance scopes, compliance audits, or reactive helpdesk support."
        />
      </main>
      <Footer />
    </div>
  );
}
