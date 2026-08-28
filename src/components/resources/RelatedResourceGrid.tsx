'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface ResourceCardItem {
  title: string;
  href: string;
  category: string;
  description: string;
  imageSrc?: string;
  readingTime?: string;
}

interface RelatedResourceGridProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  resources: ResourceCardItem[];
}

export function RelatedResourceGrid({
  eyebrow = 'Knowledge & Intelligence',
  title = 'Related Technical Guides & Intelligence',
  intro = 'Explore supporting technical documentation, operational standards, and engineering frameworks.',
  resources,
}: RelatedResourceGridProps) {
  return (
    <section className="my-16 py-16 bg-brand-carbon/40 border-t border-brand-edge-dark font-sans">
      <div className="container-custom">
        <div className="max-w-2xl mb-10 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
              {eyebrow}
            </span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extralight text-white tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-300 font-light leading-relaxed">{intro}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res, idx) => (
            <Link
              key={idx}
              href={res.href}
              className="group p-6 rounded-sm bg-brand-carbon border border-brand-edge-dark hover:border-brand-pink/60 transition-all flex flex-col justify-between shadow-sm space-y-6"
            >
              <div className="space-y-4">
                {res.imageSrc && (
                  <div className="relative aspect-[16/9] rounded-sm overflow-hidden border border-brand-edge-dark bg-brand-void">
                    <Image
                      src={res.imageSrc}
                      alt={res.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-brand-pink">
                    {res.category}
                  </span>
                  {res.readingTime && (
                    <span className="text-[11px] text-slate-400 font-light">
                      {res.readingTime}
                    </span>
                  )}
                </div>

                <h4 className="text-base sm:text-lg font-light text-white group-hover:text-brand-pink transition-colors leading-snug">
                  {res.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light line-clamp-3">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-edge-dark flex items-center justify-between text-xs text-brand-pink font-medium group-hover:translate-x-0.5 transition-transform">
                <span>Read Technical Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
