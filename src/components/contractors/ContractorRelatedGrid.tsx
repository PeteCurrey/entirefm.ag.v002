import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Shield, Wrench, Building2 } from 'lucide-react';

export interface RelatedLinkItem {
  title: string;
  description: string;
  href: string;
  badge?: string;
  category?: 'Commercial' | 'Compliance' | 'RAMS' | 'PPM' | 'Guide';
}

export interface ContractorRelatedGridProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  links: RelatedLinkItem[];
}

export function ContractorRelatedGrid({
  eyebrow = 'RELATED CONTRACTOR INTELLIGENCE',
  title = 'Further Resources & Network Guidance',
  subtitle = 'Explore supporting compliance templates, facilities management definitions, and contractor network hubs.',
  links,
}: ContractorRelatedGridProps) {
  const getIcon = (category?: string) => {
    switch (category) {
      case 'Commercial':
        return Building2;
      case 'Compliance':
        return Shield;
      case 'RAMS':
        return BookOpen;
      default:
        return Wrench;
    }
  };

  return (
    <section className="py-12 bg-white border-t border-slate-200">
      <div className="space-y-6">
        <div className="space-y-1.5">
          {eyebrow && <span className="eyebrow eyebrow-light">{eyebrow}</span>}
          <h3 className="text-xl sm:text-2xl font-extralight text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((item, idx) => {
            const Icon = getIcon(item.category);
            return (
              <Link
                key={idx}
                href={item.href}
                className="p-5 bg-[#FAFAF8] border border-slate-200 rounded-sm hover:border-[#EA580C]/40 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="p-1.5 bg-slate-100 text-slate-700 rounded-sm group-hover:bg-[#EA580C] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-mono text-slate-500 font-medium uppercase">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1 text-xs font-medium text-[#EA580C]">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
