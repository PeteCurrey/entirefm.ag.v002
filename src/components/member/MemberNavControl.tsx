'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, UserCheck, ChevronDown, Sparkles } from 'lucide-react';

interface MemberState {
  authenticated: boolean;
  member: {
    id: string;
    displayName: string;
    firstName: string;
    username: string;
    email: string;
    avatarUrl?: string;
    headline?: string;
  } | null;
}

export function MemberNavControl() {
  const [state, setState] = useState<MemberState>({ authenticated: false, member: null });
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/member/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.member) {
          setState({ authenticated: true, member: data.member });
        } else {
          setState({ authenticated: false, member: null });
        }
      })
      .catch(() => {
        setState({ authenticated: false, member: null });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-8 w-24 rounded-sm bg-white/5 animate-pulse hidden sm:inline-block" />
      </div>
    );
  }

  if (state.authenticated && state.member) {
    const initials = state.member.displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-sm border border-brand-electric/40 bg-brand-electric/15 hover:bg-brand-electric/25 text-white transition-all text-xs sm:text-sm font-light"
          aria-expanded={dropdownOpen}
          aria-label="Member account menu"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-electric text-white text-[10.5px] font-mono font-medium">
            {initials || <User className="w-3.5 h-3.5" />}
          </span>
          <span className="hidden md:inline-block max-w-[120px] truncate text-white font-normal">
            {state.member.firstName || state.member.displayName}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-brand-mist/60 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-sm bg-brand-carbon border border-brand-edge-dark text-white shadow-elevated py-2 z-50 animate-rise">
            <div className="px-4 py-2.5 border-b border-white/10">
              <p className="text-xs font-normal text-white truncate">{state.member.displayName}</p>
              <p className="text-[10.5px] font-light text-brand-mist/60 truncate">{state.member.email}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-[9.5px] font-mono uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Lobby Member
              </span>
            </div>

            <div className="py-1">
              <Link
                href="/member/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-light text-brand-mist hover:text-white hover:bg-white/5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-brand-electric" />
                <span>My Profile</span>
              </Link>
              <Link
                href="/member/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-light text-brand-mist hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-brand-silver" />
                <span>Account &amp; Preferences</span>
              </Link>
              <Link
                href="/lobby/archive"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-light text-brand-mist hover:text-white hover:bg-white/5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Lobby Intelligence Archive</span>
              </Link>
            </div>

            <div className="border-t border-white/10 pt-1">
              <a
                href="/api/member/signout"
                className="flex items-center gap-2 px-4 py-2 text-xs font-light text-rose-300 hover:text-rose-200 hover:bg-rose-950/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Logged-out Visitor CTAs
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Link
        href="/sign-in"
        className="inline-flex items-center text-xs sm:text-sm font-normal text-brand-mist/90 hover:text-white transition-colors px-2 py-1"
      >
        Sign In
      </Link>
      <Link
        href="/join"
        className="inline-flex items-center gap-1.5 rounded-sm bg-brand-electric hover:bg-brand-indigo px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white shadow-sm transition-all duration-200"
      >
        <span>Become a Member</span>
      </Link>
    </div>
  );
}
