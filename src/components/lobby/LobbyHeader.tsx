'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Sparkles, Menu, X, ShieldCheck, Briefcase, MessageSquare, Clock, BookOpen, Layers } from 'lucide-react';
import { MemberNavControl } from '@/components/member/MemberNavControl';

export function LobbyHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState<string>('Thursday, 27 August 2026');

  useEffect(() => {
    try {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);
      setCurrentDateStr(formatted);
    } catch {
      // Fallback
    }
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    {
      label: 'Ask The Lobby',
      href: '/lobby/ask',
      icon: Sparkles,
      highlight: true,
      active: pathname.startsWith('/lobby/ask'),
    },
    {
      label: 'What Changed Today',
      href: '/lobby/today',
      icon: Clock,
      active: pathname === '/lobby/today',
    },
    {
      label: 'Procurement',
      href: '/lobby/opportunities',
      icon: Briefcase,
      active: pathname.startsWith('/lobby/opportunities'),
    },
    {
      label: 'Compliance Watch',
      href: '/lobby/compliance',
      icon: ShieldCheck,
      active: pathname.startsWith('/lobby/compliance'),
    },
    {
      label: 'Community',
      href: '/lobby/community',
      icon: MessageSquare,
      active: pathname.startsWith('/lobby/community') || pathname.startsWith('/lobby/rooms'),
    },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 font-sans ${
          scrolled || mobileMenuOpen
            ? 'bg-[#080C14]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-b border-white/[0.08]'
        }`}
      >
        {/* Top gradient scrim: Guarantees 100% WCAG AAA contrast over light page backgrounds before scroll */}
        {!scrolled && !mobileMenuOpen && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#060911]/90 via-[#060911]/60 to-transparent"
          />
        )}

        <div className="container-wide flex items-center justify-between h-16 sm:h-20">
          {/* Left: Return to EntireFM & The Lobby brand mark */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-extralight text-brand-mist/85">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extralight text-brand-mist/85 hover:text-white transition-colors group py-1"
              aria-label="Return to EntireFM main site"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>EntireFM.com</span>
            </Link>

            <span className="text-white/20">|</span>

            <Link
              href="/lobby"
              className="flex items-center gap-2 tracking-wider text-sm sm:text-base font-extralight text-white uppercase hover:text-brand-electric-bright transition-colors"
            >
              <span>THE <span className="font-light text-white">LOBBY</span></span>
            </Link>

            <span className="hidden xl:inline-block text-white/20">|</span>
            <time className="hidden xl:inline-block tracking-wide text-brand-mist/70 font-extralight text-xs">
              {currentDateStr}
            </time>
          </div>

          {/* Right: Primary Lobby Navigation & Member Access */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav aria-label="Lobby Section Navigation" className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs sm:text-sm font-extralight">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors flex items-center gap-1.5 py-1 ${
                      link.active
                        ? link.highlight
                          ? 'text-brand-electric font-medium border-b border-brand-electric'
                          : 'text-white font-medium border-b border-white'
                        : link.highlight
                        ? 'text-brand-electric hover:text-white font-light'
                        : 'text-brand-mist/80 hover:text-white font-extralight'
                    }`}
                  >
                    {link.highlight && <Icon className="w-3.5 h-3.5 text-brand-electric" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <MemberNavControl />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-brand-mist hover:text-white hover:bg-white/10 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle Lobby navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#080C14] border-t border-white/10 px-4 pt-4 pb-8 space-y-4 shadow-2xl animate-fadeIn">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 px-2 pb-1 border-b border-white/10">
              Lobby Intelligence &amp; Desk
            </div>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm font-extralight transition-colors ${
                      link.active
                        ? 'bg-white/10 text-white font-light'
                        : 'text-brand-mist hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${link.highlight ? 'text-brand-electric' : 'text-neutral-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-white/10 mt-2">
                <Link
                  href="/lobby/me/research"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm font-extralight text-brand-mist hover:bg-white/5 hover:text-white"
                >
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>My Research Library</span>
                </Link>
                <Link
                  href="/lobby/me"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm font-extralight text-brand-mist hover:bg-white/5 hover:text-white"
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>My Workspace</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
