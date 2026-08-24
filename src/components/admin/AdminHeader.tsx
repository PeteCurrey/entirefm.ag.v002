'use client';

import React from 'react';
import Link from 'next/link';
import { UserSession } from '@/server/identity';
import { Search, Plus, ExternalLink } from 'lucide-react';
import { AnalyticsTopNavButton } from './AnalyticsTopNavButton';
import { LeadInboxButton } from './LeadInboxButton';
import { NotificationCentreDropdown } from './NotificationCentreDropdown';

export function AdminHeader({ session }: { session: UserSession }) {
  const triggerCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    );
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#E4E4E1] bg-[#FFFFFF]/95 px-6 backdrop-blur-md">
      {/* Global Search & Telemetry */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button
          onClick={triggerCommandPalette}
          className="flex items-center gap-3 w-full max-w-md rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] px-3 py-1.5 text-left text-[12.5px] text-[#686866] transition-all hover:border-[#D1D1CD] hover:bg-[#FFFFFF] hover:text-[#101010] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          <Search className="h-3.5 w-3.5 text-[#9B9B97] shrink-0" />
          <span className="truncate">Search sites, assets, jobs, engineers, documents…</span>
          <kbd className="ml-auto shrink-0 rounded-[4px] border border-[#E4E4E1] bg-[#FFFFFF] px-1.5 py-0.5 font-mono text-[10px] text-[#9B9B97]">
            ⌘K
          </kbd>
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 font-mono text-[10px] text-[#15803D] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            TELEMETRY ACTIVE
          </span>
        </div>
      </div>

      {/* Right Controls, Analytics, Leads & Notifications */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Real Website Analytics */}
        <AnalyticsTopNavButton />

        {/* Inbound Leads / Enquiry Inbox */}
        <LeadInboxButton />

        {/* Central Notification Centre */}
        <NotificationCentreDropdown />

        <div className="h-4 w-px bg-[#E4E4E1]" />

        {/* Quick Create Link */}
        <Link
          href="/admin/operations/work-orders"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-[8px] bg-[#FF6B24] px-3 py-1.5 text-[12px] font-medium text-white shadow-[0_1px_2px_rgba(255,107,36,0.2)] hover:bg-[#E9540F] transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Work Order</span>
        </Link>

        {/* Public Site Link */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#686866] hover:text-[#101010] transition-colors"
        >
          <span className="hidden md:inline">Public Site</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#9B9B97]" />
        </Link>

        <div className="h-4 w-px bg-[#E4E4E1]" />

        {/* User Role Badge */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FF6B24]" />
          <span className="font-mono text-[11px] text-[#686866]">
            {session.role}
          </span>
        </div>
      </div>
    </header>
  );
}
