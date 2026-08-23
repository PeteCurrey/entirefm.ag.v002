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
    <aside className="hidden xl:block sticky top-28 w-64 space-y-4 text-xs font-mono shrink-0">
      <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl backdrop-blur-md">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-3 border-b border-slate-800/80 pb-2">
          Page Navigation
        </span>
        <nav className="space-y-1.5">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded transition-all group ${
                  isActive
                    ? 'bg-pink-950/60 text-pink-300 border border-pink-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className={`text-[10px] ${isActive ? 'text-pink-400' : 'text-slate-600'}`}>
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
