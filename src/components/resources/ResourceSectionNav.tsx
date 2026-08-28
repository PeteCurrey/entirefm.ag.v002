'use client';

import React, { useState, useEffect } from 'react';

interface SectionItem {
  id: string;
  label: string;
  number: string;
}

interface ResourceSectionNavProps {
  sections: SectionItem[];
  currentActive?: string;
}

export function ResourceSectionNav({ sections }: ResourceSectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <aside className="hidden xl:block sticky top-28 w-64 space-y-4 text-xs font-sans shrink-0">
      <div className="p-5 bg-brand-carbon border border-brand-edge-dark rounded-sm shadow-elevated">
        <span className="text-[11px] uppercase tracking-widest text-slate-400 font-medium block mb-3 border-b border-brand-edge-dark pb-2">
          Contents Directory
        </span>
        <nav className="space-y-1">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-sm transition-all group ${
                  isActive
                    ? 'bg-brand-pink/10 text-brand-pink font-medium border-l-2 border-brand-pink'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04] font-light'
                }`}
              >
                <span className={`text-[11px] ${isActive ? 'text-brand-pink font-semibold' : 'text-slate-500'}`}>
                  {sec.number}
                </span>
                <span className="truncate">{sec.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
