'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, ArrowDown } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';
import { MarkCanvas } from '@/components/brand/MarkCanvas';

/**
 * HOME HERO — FULL VIEWPORT
 * =========================
 * A full-height opening built around the mark rendered in 3D. The mark
 * assembles from fragments on load, then drifts slowly and leans toward the
 * pointer.
 *
 * Height is `100svh` rather than `100vh` so mobile browsers do not push the
 * call to action under the address bar, with a `min-height` floor so the copy
 * never crushes on a short laptop screen.
 *
 * If WebGL2 is unavailable the canvas reports back and the supplied logo image
 * takes its place — the hero is never empty.
 */

const PROOF = [
  { figure: 'Hard FM', label: 'M&E, HVAC and building plant' },
  { figure: 'PPM', label: 'Schedules built from real asset surveys' },
  { figure: 'Compliance', label: 'Statutory testing, certified and recorded' },
];

export function HomeHero() {
  const [webglFailed, setWebglFailed] = useState(false);

  return (
    <section className="on-dark grain relative isolate flex min-h-[42rem] w-full flex-col overflow-hidden bg-brand-graphite [height:100svh]">
      {/* Ambient light pools in the brand hues. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[18%] -top-[30%] h-[46rem] w-[46rem] animate-drift rounded-full opacity-[0.32] blur-[120px]"
        style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 68%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[30%] right-[-12%] h-[42rem] w-[42rem] animate-drift rounded-full opacity-[0.28] blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #7C3AED 0%, transparent 68%)',
          animationDelay: '-13s',
        }}
      />
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-70" />

      <div className="container-custom relative flex flex-1 items-center py-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          {/* Copy */}
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-dark" data-reveal>
              Total Facilities Management
            </p>

            <h1
              className="mt-6 text-display-xl text-white"
              data-reveal
              style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
            >
              Facilities management,
              <br />
              <span className="text-spectrum">without the friction.</span>
            </h1>

            <p
              className="prose-brand mt-7 max-w-xl text-[1.0625rem]"
              data-reveal
              style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
            >
              EntireFM maintains commercial property across the UK — planned maintenance,
              mechanical and electrical engineering, statutory compliance and reactive
              cover, held under one contract so responsibility never moves between
              suppliers while a building sits unusable.
            </p>

            <div
              className="mt-10 flex flex-wrap items-center gap-3"
              data-reveal
              style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
            >
              <Link href="/contact-us" className="btn-primary">
                Request a proposal
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
              <a href={CONTACT_CONFIG.mainPhone.href} className="btn-ghost-light">
                <Phone className="h-4 w-4 text-brand-electric-bright" />
                {CONTACT_CONFIG.mainPhone.display}
              </a>
            </div>

            <dl
              className="mt-12 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge-dark bg-brand-edge-dark sm:grid-cols-3"
              data-reveal
              style={{ '--reveal-delay': '320ms' } as React.CSSProperties}
            >
              {PROOF.map((item) => (
                <div
                  key={item.figure}
                  className="group bg-brand-graphite/80 px-5 py-4 backdrop-blur-sm transition-colors duration-500 ease-brand hover:bg-brand-carbon"
                >
                  <dt className="text-[14px] font-bold tracking-tight text-white">{item.figure}</dt>
                  <dd className="mt-1 text-[11.5px] leading-snug text-brand-mist/55 transition-colors duration-500 group-hover:text-brand-mist/85">
                    {item.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The mark, in 3D */}
          <div className="relative hidden h-[34rem] lg:block">
            <div
              aria-hidden="true"
              className="absolute inset-[14%] rounded-full opacity-40 blur-[80px]"
              style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
            />
            {webglFailed ? (
              <Image
                src="/logos/06-crystalline-colour-mark.webp"
                alt="The EntireFM mark — a faceted infinity form"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 34rem"
                className="relative object-contain drop-shadow-[0_0_60px_rgba(124,58,237,0.35)]"
              />
            ) : (
              <MarkCanvas delay={0.35} onFallback={() => setWebglFailed(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="container-custom relative pb-8">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.2em] text-brand-mist/35">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" style={{ animationDuration: '2.4s' }} />
          Scroll
        </div>
      </div>

      <div aria-hidden="true" className="rule-spectrum absolute inset-x-0 bottom-0" />
    </section>
  );
}
