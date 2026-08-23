import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';
import { ORGANIZATION_CONFIG } from '@/config/organization';
import { FOOTER_NAV, LEGAL_NAV } from '@/config/navigation';

/**
 * SITE FOOTER
 * ===========
 * Two parts: a closing call to action on the brand spectrum, then a quiet
 * graphite sitemap. The CTA carries the only strong colour below the fold,
 * so the footer proper can stay restrained.
 *
 * CLAIM GOVERNANCE
 * ----------------
 * The previous footer stated "National Coverage · Regional Engineering
 * Depots", listed "KEY REGIONAL HUBS" including a "Manchester FM Hub" and a
 * "Lincoln Regional Centre", and offered "24/7 reactive service". Premises in
 * those cities are exactly what GEO_REGIONAL_CENTRES marks DO_NOT_USE, and
 * unqualified 24/7 availability is TO_VERIFY. It also advertised "All 22+
 * Locations" — a countable claim that was simply wrong.
 *
 * Coverage is now described as what it is: mobile teams working nationally,
 * with response times agreed per site.
 */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark">
      {/* Closing call to action */}
      <section className="relative overflow-hidden bg-brand-graphite">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[10%] -top-[60%] h-[36rem] w-[36rem] rounded-full opacity-25 blur-[110px]"
          style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 68%)' }}
        />
        <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-50" />

        <div className="container-custom relative py-20 sm:py-24">
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div data-reveal>
              <p className="eyebrow eyebrow-dark">Start a conversation</p>
              <h2 className="mt-5 max-w-2xl text-display-md text-white">
                Tell us what the estate is, and we will tell you what it needs
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-brand-mist/60">
                Every proposal starts with an asset survey rather than a price. Until the
                assets, their condition and their statutory obligations are known, any
                maintenance schedule is guesswork.
              </p>
            </div>

            <div
              className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end"
              data-reveal
              style={{ '--reveal-delay': '100ms' } as React.CSSProperties}
            >
              <Link href="/contact-us" className="btn-primary w-full sm:w-auto">
                Request a proposal
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
              <a href={CONTACT_CONFIG.mainPhone.href} className="btn-ghost-light w-full sm:w-auto">
                <Phone className="h-4 w-4 text-brand-electric-bright" />
                {CONTACT_CONFIG.mainPhone.display}
              </a>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="rule-spectrum absolute inset-x-0 bottom-0" />
      </section>

      {/* Sitemap */}
      <div className="bg-brand-void">
        <div className="container-custom py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_2.4fr]">
            {/* Identity */}
            <div>
              <Link href="/" className="group inline-flex items-center gap-3" aria-label="EntireFM — home">
                <span className="relative block h-9 w-9">
                  <Image
                    src="/logos/06-crystalline-colour-mark.webp"
                    alt=""
                    fill
                    sizes="36px"
                    className="object-contain transition-transform duration-500 ease-brand group-hover:scale-105"
                  />
                </span>
                <span className="text-[19px] font-extrabold tracking-[-0.02em] text-white">
                  ENTIRE<span className="text-spectrum">FM</span>
                </span>
              </Link>

              <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-brand-mist/50">
                {ORGANIZATION_CONFIG.legalName} provides total facilities management,
                mechanical and electrical engineering, planned maintenance and statutory
                compliance for UK commercial property.
              </p>

              <ul className="mt-7 space-y-3 text-[13px]">
                <li className="flex items-start gap-2.5 text-brand-mist/50">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-silver" />
                  <span>
                    Nationwide coverage
                    <span className="mt-0.5 block text-[11.5px] text-brand-mist/35">
                      Mobile engineering teams · response agreed per site
                    </span>
                  </span>
                </li>
                <li>
                  <a
                    href={CONTACT_CONFIG.mainPhone.href}
                    className="group flex items-center gap-2.5 text-brand-mist/70 transition-colors hover:text-white"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-brand-silver transition-colors group-hover:text-brand-electric-bright" />
                    {CONTACT_CONFIG.mainPhone.display}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${CONTACT_CONFIG.enquiryEmail}`}
                    className="group flex items-center gap-2.5 text-brand-mist/70 transition-colors hover:text-white"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-brand-silver transition-colors group-hover:text-brand-electric-bright" />
                    {CONTACT_CONFIG.enquiryEmail}
                  </a>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {FOOTER_NAV.map((column) => (
                <div key={column.heading}>
                  <p className="eyebrow eyebrow-dark">{column.heading}</p>
                  <ul className="mt-5 space-y-2.5">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group inline-flex items-center gap-1 text-[13px] text-brand-mist/55 transition-colors duration-200 hover:text-white"
                        >
                          {link.label}
                          <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 ease-brand group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="mt-14 border-t border-brand-edge-dark pt-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-[12px] text-brand-mist/35">
                © {year} {ORGANIZATION_CONFIG.legalName}. All rights reserved.
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {LEGAL_NAV.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-brand-mist/40 transition-colors hover:text-brand-mist/80"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-5 max-w-4xl text-[11.5px] leading-relaxed text-brand-mist/25">
              EntireFM operates under a managed quality framework covering statutory
              compliance, planned maintenance scheduling and building services delivery.
              Accreditation and certification details are available on request during
              procurement.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
