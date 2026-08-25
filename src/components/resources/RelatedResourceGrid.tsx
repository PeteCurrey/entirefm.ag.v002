import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

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
  eyebrow = 'Knowledge & Research',
  title = 'Related Technical Guides & Intelligence',
  intro = 'Explore supporting technical documentation, operational standards, and engineering frameworks.',
  resources,
}: RelatedResourceGridProps) {
  return (
    <section className="my-16 py-12 bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-light block mb-1">
            {eyebrow}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extralight text-white mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">{intro}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res, idx) => (
            <Link
              key={idx}
              href={res.href}
              className="group p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                {res.imageSrc && (
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4 border border-slate-800 bg-slate-950">
                    <Image
                      src={res.imageSrc}
                      alt={res.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-transparent transition-colors" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-light uppercase tracking-wider text-pink-400">
                    {res.category}
                  </span>
                  {res.readingTime && (
                    <span className="text-[10px] font-mono text-slate-500">
                      {res.readingTime}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-light text-white mb-2 group-hover:text-pink-300 transition-colors leading-snug">
                  {res.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                  {res.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-pink-400 font-light group-hover:translate-x-1 transition-transform">
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
