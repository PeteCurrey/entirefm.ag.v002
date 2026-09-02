import React from 'react';
import { Quote } from 'lucide-react';

/**
 * CONTRACTOR TESTIMONIALS — HONEST PLACEHOLDER
 * ============================================
 * This component is wired up and ready to render genuine testimonials.
 * Until real, verified testimonials are collected and confirmed, the section
 * renders nothing at all (returns null).
 *
 * To activate: populate the TESTIMONIALS array below with real quotes,
 * names, companies and trades. The component will render automatically.
 *
 * DO NOT add fabricated, invented or composite testimonials.
 */

interface Testimonial {
  quote: string;
  name: string;
  company: string;
  trade: string;
  memberSince?: string;
}

/**
 * Populate with genuine testimonials from real, verified contractor members.
 * Leave empty to suppress the section entirely.
 */
const TESTIMONIALS: Testimonial[] = [
  // Example structure — replace with real content:
  //
  // {
  //   quote: "...",
  //   name: "...",
  //   company: "... Ltd",
  //   trade: "Commercial HVAC",
  //   memberSince: "2024",
  // },
];

export function ContractorTestimonialPlaceholder() {
  // Section is intentionally suppressed until real testimonials are available.
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide space-y-12">

        <div className="max-w-3xl" data-reveal>
          <span className="eyebrow eyebrow-light">CONTRACTOR TESTIMONIALS</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            What contractors say about the platform.
          </h2>
          <p className="mt-4 text-sm text-slate-600 font-light leading-relaxed">
            From verified EntireFM contractor network members.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          data-reveal
          style={{ '--reveal-delay': '100ms' } as React.CSSProperties}
        >
          {TESTIMONIALS.map((t, idx) => (
            <figure
              key={idx}
              className="bg-white border border-slate-200 rounded-sm p-7 space-y-4 shadow-xs flex flex-col"
            >
              <Quote className="w-5 h-5 text-slate-200 shrink-0" aria-hidden="true" />

              <blockquote className="text-sm text-slate-700 font-light leading-relaxed flex-grow">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="pt-4 border-t border-slate-100">
                <span className="block text-[12.5px] font-semibold text-slate-900">{t.name}</span>
                <span className="block text-[11.5px] text-slate-500 mt-0.5">
                  {t.company}
                  {t.trade && ` · ${t.trade}`}
                  {t.memberSince && ` · Member since ${t.memberSince}`}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
}
