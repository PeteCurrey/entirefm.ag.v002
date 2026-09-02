'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronDown, Check, Briefcase, ArrowRightLeft } from 'lucide-react';
import type { ClientLinkSummary } from '@/server/member/types';

interface ClientContextSwitcherProps {
  clientLinks: ClientLinkSummary[];
  currentContext?: 'lobby' | 'client';
  currentOrgName?: string;
  theme?: 'light' | 'dark';
}

export function ClientContextSwitcher({
  clientLinks,
  currentContext = 'lobby',
  currentOrgName,
  theme = 'dark',
}: ClientContextSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Requirement: If zero client links, render nothing (no clutter)
  if (!clientLinks || clientLinks.length === 0) {
    return null;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchToClient = async (clientAccountId: string) => {
    setSwitching(true);
    setOpen(false);
    try {
      const res = await fetch('/api/member/switch-to-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientAccountId }),
      });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        router.push(data.redirectUrl);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to switch context to client:', err);
    } finally {
      setSwitching(false);
    }
  };

  const handleSwitchToLobby = () => {
    setOpen(false);
    router.push('/lobby');
    router.refresh();
  };

  const isLight = theme === 'light';
  const isLobby = currentContext === 'lobby';

  const label = isLobby
    ? 'The Lobby'
    : currentOrgName || clientLinks[0]?.clientOrgName || 'Client Portal';

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={switching}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all border ${
          isLobby
            ? isLight
              ? 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
              : 'bg-white/10 border-white/20 text-neutral-200 hover:bg-white/15 hover:text-white'
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
        }`}
        aria-label="Switch organisation or community context"
      >
        <ArrowRightLeft className="w-3 h-3 text-brand-electric shrink-0" />
        <span className="font-medium max-w-[140px] truncate">{label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-md bg-[#0B1220] border border-white/15 text-white shadow-2xl py-2 z-50 text-xs animate-rise">
          <div className="px-3 py-1.5 border-b border-white/10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Active Context
            </span>
          </div>

          {/* Lobby Option */}
          <button
            type="button"
            onClick={handleSwitchToLobby}
            className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/5 transition-colors ${
              isLobby ? 'text-brand-electric font-medium' : 'text-neutral-300'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-brand-electric shrink-0" />
              <span className="truncate">The Lobby (Community)</span>
            </div>
            {isLobby && <Check className="w-3.5 h-3.5 text-brand-electric shrink-0" />}
          </button>

          <div className="my-1 border-t border-white/10" />

          <div className="px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Client Organisations
            </span>
          </div>

          {/* Distinct Client Organisation Links */}
          {clientLinks.map((link) => {
            const isSelected = !isLobby && (currentOrgName === link.clientOrgName || clientLinks.length === 1);
            return (
              <button
                key={link.clientAccountId}
                type="button"
                onClick={() => handleSwitchToClient(link.clientAccountId)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/5 transition-colors ${
                  isSelected ? 'text-emerald-400 font-medium' : 'text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <p className="truncate text-xs">{link.clientOrgName}</p>
                    <p className="text-[10px] text-neutral-400 font-normal">
                      Role: {link.roleCode.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
