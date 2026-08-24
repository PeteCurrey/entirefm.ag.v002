'use client';

import React from 'react';
import { UserSession } from '@/server/identity';
import { Button } from '../ui/Button';
import { Plus, SlidersHorizontal, ChevronDown, Calendar, Building, Filter } from 'lucide-react';

interface CommandHeaderProps {
  session: UserSession | null;
  activePersona: string;
  onPersonaChange: (persona: string) => void;
  selectedPortfolio: string;
  onPortfolioChange: (portfolio: string) => void;
  timeContext: string;
  onTimeContextChange: (time: string) => void;
  onCreateClick?: () => void;
}

export const PERSONA_PRESETS = [
  { id: 'FM_DIRECTOR', label: 'FM Director' },
  { id: 'HELPDESK', label: 'Helpdesk' },
  { id: 'COMPLIANCE', label: 'Compliance' },
  { id: 'CONTRACT_MGR', label: 'Contract Manager' },
  { id: 'FINANCE', label: 'Finance' },
  { id: 'ENGINEER_MGR', label: 'Engineer Ops' },
];

export function CommandHeader({
  session,
  activePersona,
  onPersonaChange,
  selectedPortfolio,
  onPortfolioChange,
  timeContext,
  onTimeContextChange,
  onCreateClick,
}: CommandHeaderProps) {
  const firstName = session?.name ? session.name.split(' ')[0] : 'Operations';

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4 border-b border-[#E4E4E1] pb-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Greeting & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl lg:text-3xl font-light tracking-tight text-[#101010]">
            Good morning, <span className="font-normal">{firstName}</span>
          </h1>
          <span className="inline-flex items-center gap-1 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2 py-0.5 font-mono text-[10px] text-[#C2410C] font-semibold">
            LIVE DESK
          </span>
        </div>
        <p className="mt-1 text-[13px] text-[#686866]">
          Here&apos;s what is happening across your estate.
        </p>
      </div>

      {/* Action Controls & Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Persona Preset View Switcher */}
        <div className="flex items-center rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] p-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {PERSONA_PRESETS.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => onPersonaChange(p.id)}
              className={`rounded-[6px] px-2.5 py-1 text-[11.5px] font-medium transition-all ${
                activePersona === p.id
                  ? 'bg-[#101010] text-white shadow-sm'
                  : 'text-[#686866] hover:text-[#101010] hover:bg-[#F5F5F3]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Date Context Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] px-3 py-1.5 text-[12px] text-[#686866]">
          <Calendar className="h-3.5 w-3.5 text-[#9B9B97]" />
          <span className="font-mono text-[11.5px] text-[#101010]">{todayFormatted}</span>
        </div>

        {/* Organisation/Portfolio Selector */}
        <div className="flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] px-3 py-1.5 text-[12px] text-[#101010]">
          <Building className="h-3.5 w-3.5 text-[#9B9B97]" />
          <span className="font-medium truncate max-w-[140px]">
            {session?.orgName || 'All Portfolios'}
          </span>
        </div>

        {/* Primary Action Button */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="h-3.5 w-3.5" />}
          onClick={onCreateClick}
        >
          Create Work Order
        </Button>
      </div>
    </div>
  );
}
