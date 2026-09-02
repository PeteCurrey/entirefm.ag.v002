'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LobbySubNavProps {
  currentSection?: 'home' | 'know' | 'check' | 'do' | 'find' | 'learn' | 'connect';
  className?: string;
}

export function LobbySubNav({ currentSection, className = '' }: LobbySubNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'LOBBY HOME', href: '/lobby', key: 'home', exact: true },
    { label: 'KNOW', href: '/lobby/know', key: 'know' },
    { label: 'CHECK', href: '/lobby/check', key: 'check' },
    { label: 'DO', href: '/lobby/do', key: 'do' },
    { label: 'FIND', href: '/lobby/find', key: 'find' },
    { label: 'LEARN', href: '/lobby/learn', key: 'learn' },
    { label: 'CONNECT', href: '/lobby/connect', key: 'connect' },
  ];

  const isCurrent = (item: typeof navItems[0]) => {
    if (currentSection) {
      return currentSection === item.key;
    }
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <nav
      aria-label="Lobby Core Areas Navigation"
      className={`w-full bg-white border-b border-neutral-200/90 text-neutral-900 sticky top-16 sm:top-20 z-40 shadow-2xs ${className}`}
    >
      <div className="container-wide flex items-center justify-between gap-4 h-12 overflow-x-auto scrollbar-none">
        
        {/* Sub-nav Links */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {navItems.map((item) => {
            const active = isCurrent(item);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`px-3 py-1.5 text-[11px] sm:text-xs tracking-wider uppercase font-medium whitespace-nowrap rounded-[2px] transition-colors ${
                  active
                    ? 'bg-neutral-900 text-white font-medium shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 font-light'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right contextual quick link: Ask The Lobby Research Desk */}
        <div className="hidden md:flex items-center gap-4 shrink-0 text-xs">
          <Link
            href="/lobby/ask"
            className="inline-flex items-center gap-1.5 text-brand-electric hover:underline font-light"
          >
            <Sparkles className="w-3 h-3 text-brand-electric" />
            <span>Ask The Lobby Research Desk</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}
