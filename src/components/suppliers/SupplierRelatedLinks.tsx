import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, ShieldCheck, Wrench, Users, Calendar, Award, HelpCircle, Leaf, Cpu } from 'lucide-react';

export interface RelatedLink {
  title: string;
  href: string;
  description: string;
  tag?: string;
}

interface SupplierRelatedLinksProps {
  heading?: string;
  eyebrow?: string;
  links: RelatedLink[];
}

export function SupplierRelatedLinks({
  heading = 'Related supplier information',
  eyebrow = 'EXPLORE THE SUPPLIER ECOSYSTEM',
  links,
}: SupplierRelatedLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <section className="py-14 bg-white border-t border-slate-200">
      <div className="container-custom max-w-5xl">
        <div className="mb-8">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            {eyebrow}
          </span>
          <h2 className="text-xl sm:text-2xl font-light text-slate-900">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group p-5 bg-[#FAF9FB] border border-slate-200/90 rounded-sm hover:border-brand-pink hover:bg-white transition-all duration-200 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                {link.tag && (
                  <span className="text-[9.5px] font-mono uppercase text-brand-pink tracking-wider">
                    {link.tag}
                  </span>
                )}
                <h3 className="text-sm font-normal text-slate-900 group-hover:text-brand-pink transition-colors flex items-center justify-between">
                  <span>{link.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-pink" />
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {link.description}
                </p>
              </div>
              <span className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-normal text-slate-500 group-hover:text-slate-800 transition-colors inline-flex items-center gap-1">
                Explore page →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
