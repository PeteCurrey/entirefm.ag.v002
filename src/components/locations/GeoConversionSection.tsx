'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Mail, ShieldCheck, Clock, CheckCircle2, Building2 } from 'lucide-react';
import type { RegionalContact } from '@/config/regional-contacts';

interface GeoConversionSectionProps {
  city: string;
  contact: RegionalContact;
}

export function GeoConversionSection({ city, contact }: GeoConversionSectionProps) {
  return (
    <section id="enquiry" className="section-padding bg-brand-graphite text-white relative overflow-hidden border-t border-white/10">
      {/* Background facet grid pattern */}
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-25" />
      <div
        aria-hidden="true"
        className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-brand-pink/15 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-electric/10 blur-3xl pointer-events-none"
      />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8" data-reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-xs font-light uppercase tracking-wider text-brand-pink-light">
              {contact.coverageLabel}
            </span>
          </div>

          <h2 className="text-display-lg text-white leading-tight">
            Facilities management support for your {city} estate.
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-brand-mist/80 font-light leading-relaxed">
            Whether you manage a single commercial headquarters, an industrial plant, or a multi-tenant {city} portfolio, talk directly to our regional facilities and engineering desk.
          </p>

          {/* Direct Multi-Channel Contact Hub */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="btn-hero-pink px-8 py-4 text-sm font-normal shadow-xl"
            >
              Request a {city} Proposal
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>

            <a
              href={contact.emailHref}
              className="inline-flex items-center gap-2.5 rounded-sm border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-normal text-white backdrop-blur-md hover:bg-white/20 hover:border-brand-pink/50 transition-all duration-300 shadow-lg"
              title={`Direct email to ${contact.email}`}
            >
              <Mail className="h-4 w-4 text-brand-pink-light" />
              <span>{contact.email}</span>
            </a>

            <a
              href={contact.phone.href}
              className="btn-ghost-light px-6 py-3.5 text-sm font-normal"
            >
              <Phone className="h-4 w-4 text-brand-pink-light" />
              {contact.phone.display}
            </a>
          </div>

          {/* Key Assurance Indicators */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto text-xs text-brand-mist/75 font-normal">
            <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-sm border border-white/5">
              <ShieldCheck className="h-4 w-4 text-brand-pink-light shrink-0" />
              <span>Named Technical Account Lead</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-sm border border-white/5">
              <Clock className="h-4 w-4 text-brand-pink-light shrink-0" />
              <span>Contracted Emergency Response</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-sm border border-white/5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Zero-Obligation Site Survey</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
