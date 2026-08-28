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

interface MemberNavControlProps {
  theme?: 'light' | 'dark';
}

export function MemberNavControl({ theme = 'dark' }: MemberNavControlProps) {
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

  const isLight = theme === 'light';

  if (loading) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <span className={`h-8 w-24 rounded-sm animate-pulse hidden sm:inline-block ${isLight ? 'bg-neutral-200' : 'bg-white/5'}`} />
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
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-[4px] border transition-all text-xs sm:text-sm font-light whitespace-nowrap shrink-0 ${
            isLight
              ? 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
              : 'border-brand-electric/40 bg-brand-electric/15 hover:bg-brand-electric/25 text-white'
          }`}
          aria-expanded={dropdownOpen}
          aria-label="Member account menu"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-electric text-white text-[10.5px] font-mono font-medium">
            {initials || <User className="w-3.5 h-3.5" />}
          </span>
          <span className={`hidden md:inline-block max-w-[120px] truncate font-normal ${isLight ? 'text-neutral-900' : 'text-white'}`}>
            {state.member.firstName || state.member.displayName}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''} ${isLight ? 'text-neutral-500' : 'text-brand-mist/60'}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-[6px] bg-[#0B1220] border border-white/10 text-white shadow-2xl py-2 z-50 animate-rise">
            <div className="px-4 py-2.5 border-b border-white/10">
              <p className="text-xs font-normal text-white truncate">{state.member.displayName}</p>
              <p className="text-[10.5px] font-light text-neutral-400 truncate">{state.member.email}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-[9.5px] font-mono uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Lobby Member
              </span>
            </div>

            <div className="py-1">
              <Link
                href="/member/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-light text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-brand-electric" />
                <span>My Profile</span>
              </Link>
              <Link
                href="/lobby/me/research"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-light text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>My Research Library</span>
              </Link>
              <Link
                href="/lobby/me"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-light text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>My Workspace</span>
              </Link>
              <Link
                href="/member/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-light text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-neutral-400" />
                <span>Account &amp; Preferences</span>
              </Link>
              <Link
                href="/lobby/archive"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-light text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span className="w-3.5 h-3.5 text-center text-xs text-neutral-400 font-mono">#</span>
                <span>Lobby Archive</span>
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
    <div className="flex items-center gap-3 sm:gap-4 shrink-0 whitespace-nowrap">
      <Link
        href="/sign-in"
        className={`inline-flex items-center text-xs sm:text-sm font-extralight transition-colors px-2 py-1 whitespace-nowrap shrink-0 ${
          isLight ? 'text-neutral-700 hover:text-neutral-900' : 'text-neutral-300 hover:text-white'
        }`}
      >
        Sign In
      </Link>
      <Link
        href="/join"
        className={`inline-flex items-center gap-1.5 rounded-[4px] px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light transition-all duration-200 shadow-sm whitespace-nowrap shrink-0 ${
          isLight
            ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
            : 'bg-brand-electric hover:bg-blue-600 text-white'
        }`}
      >
        <span>Become a Member</span>
      </Link>
    </div>
  );
}
