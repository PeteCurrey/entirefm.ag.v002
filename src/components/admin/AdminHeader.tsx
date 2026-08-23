'use client';

import React from 'react';
import Link from 'next/link';
import { UserSession } from '@/server/identity';

export function AdminHeader({ session }: { session: UserSession }) {
  const triggerCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    );
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-brand-edge-dark bg-brand-carbon/90 px-6 backdrop-blur-md">
      {/* Search trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={triggerCommandPalette}
          className="flex items-center gap-3 rounded border border-brand-edge-dark bg-brand-void/80 px-3 py-1.5 text-left text-[12.5px] text-brand-mist/60 transition-colors hover:border-brand-mist/30 hover:text-white"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Search or Ask EntireFM...</span>
          <kbd className="rounded border border-brand-edge-dark bg-brand-carbon px-1.5 py-0.5 font-mono text-[10px] text-brand-mist/50">
            ⌘K
          </kbd>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            OPERATIONAL LEDGER ACTIVE
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="text-[12px] font-medium text-brand-mist/60 transition-colors hover:text-white"
        >
          Public Site ↗
        </Link>
        <div className="h-4 w-px bg-brand-edge-dark" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-brand-electric" />
          <span className="font-mono text-[11px] text-brand-mist/70">
            {session.role}
          </span>
        </div>
      </div>
    </header>
  );
}
