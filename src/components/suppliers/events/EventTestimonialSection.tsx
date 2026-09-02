'use client';

import React from 'react';
import { Quote } from 'lucide-react';

export interface Testimonial {
  id: string;
  /** Only render this testimonial if approved === true */
  approved: boolean;
  quote: string;
  name: string;
  role: string;
  company: string;
  discipline: string;
  memberSince: number;
}

/**
 * Approved testimonial data.
 * Rule: NEVER fabricate quotes. Only add entries here after receiving
 * explicit written approval from the individual concerned.
 * Set approved: true only on verified entries.
 */
export const TESTIMONIALS: Testimonial[] = [
  // Example structure — no quotes approved at time of initial build.
  // Add approved quotes here as they are confirmed.
  // {
  //   id: 'tc-001',
  //   approved: true,
  //   quote: '...',
  //   name: '...',
  //   role: '...',
  //   company: '...',
  //   discipline: '...',
  //   memberSince: 2023,
  // },
];

const approvedTestimonials = TESTIMONIALS.filter((t) => t.approved === true);

export function EventTestimonialSection() {
  if (approvedTestimonials.length === 0) {
    return null; // No approved testimonials — do not render placeholder section
  }

  return (
    <section className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8E8E5]">
      <div className="container-custom">
        <div className="max-w-2xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
              MEMBER PERSPECTIVES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
            Don&apos;t just take our word for it.
          </h2>
          <p className="text-sm text-[#6D6D68] font-light leading-relaxed">
            The following testimonials are from verified EntireFM members, reproduced with their written permission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedTestimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-[10px] bg-[#FAFAF8] border border-[#E8E8E5] flex flex-col gap-4"
            >
              <Quote className="w-6 h-6 text-[#EA580C] flex-shrink-0" />
              <blockquote className="text-sm text-[#2D2D2D] font-light leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="pt-3 border-t border-[#E8E8E5]">
                <p className="text-xs font-semibold text-[#111111]">{t.name}</p>
                <p className="text-[11px] text-[#6D6D68]">{t.role} &middot; {t.company}</p>
                <p className="text-[11px] text-[#9A9A95]">{t.discipline} &middot; Member since {t.memberSince}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
