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
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#E8E8E5] bg-[#FFFFFF] px-6">

      {/* Global Search & Telemetry */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button
          onClick={triggerCommandPalette}
          className="flex items-center gap-3 w-full max-w-md rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] px-3 py-1.5 text-left text-[12.5px] text-[#6D6D68] transition-all hover:border-[#D4D4D0] hover:bg-[#FFFFFF] hover:text-[#111111]"
        >
          <Search className="h-3.5 w-3.5 text-[#9A9A95] shrink-0" />
          <span className="truncate">Search sites, assets, jobs, engineers, documents…</span>
          <kbd className="ml-auto shrink-0 rounded-[4px] border border-[#E8E8E5] bg-[#FFFFFF] px-1.5 py-0.5 font-mono text-[10px] text-[#9A9A95]">
            ⌘K
          </kbd>
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 font-mono text-[10px] text-[#15803D] font-medium">
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

        <div className="h-4 w-px bg-[#E8E8E5]" />

        {/* Quick Create Link */}
        <Link
          href="/admin/operations/work-orders"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-[6px] bg-[#EA580C] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#C2410C] transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Work Order</span>
        </Link>

        {/* Public Site Link */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#6D6D68] hover:text-[#111111] transition-colors"
        >
          <span className="hidden md:inline">Public Site</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#9A9A95]" />
        </Link>

        <div className="h-4 w-px bg-[#E8E8E5]" />

        {/* User Role Badge */}
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#EA580C]" />
          <span className="text-[11.5px] font-medium text-[#6D6D68]">
            {session.role}
          </span>
        </div>
      </div>
    </header>
  );
}
