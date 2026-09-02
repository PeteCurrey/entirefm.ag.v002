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
  const [currentDateStr, setCurrentDateStr] = useState<string>('Friday, 28 August 2026');

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
      label: 'KNOW',
      href: '/lobby/know',
      icon: BookOpen,
      active: pathname.startsWith('/lobby/know'),
    },
    {
      label: 'CHECK',
      href: '/lobby/check',
      icon: ShieldCheck,
      active: pathname.startsWith('/lobby/check'),
    },
    {
      label: 'DO',
      href: '/lobby/do',
      icon: Layers,
      active: pathname.startsWith('/lobby/do'),
    },
    {
      label: 'FIND',
      href: '/lobby/find',
      icon: Briefcase,
      active: pathname.startsWith('/lobby/find'),
    },
    {
      label: 'LEARN',
      href: '/lobby/learn',
      icon: Clock,
      active: pathname.startsWith('/lobby/learn'),
    },
    {
      label: 'CONNECT',
      href: '/lobby/connect',
      icon: MessageSquare,
      active: pathname.startsWith('/lobby/connect') || pathname.startsWith('/lobby/community') || pathname.startsWith('/lobby/rooms'),
    },
    {
      label: 'Ask The Lobby',
      href: '/lobby/ask',
      icon: Sparkles,
      highlight: true,
      active: pathname.startsWith('/lobby/ask'),
    },
  ];

  // Route canvas detection: Dark hero pages vs Light canvas pages
  const isDarkHeroPage = pathname === '/lobby' || pathname.startsWith('/lobby/rooms');

  // Scrolled state styles
  const isScrolled = scrolled || mobileMenuOpen;

  // Active theme: 'dark' on dark hero pages; 'light' on light canvas pages
  const theme = isDarkHeroPage ? 'dark' : 'light';
  const isLight = theme === 'light';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 font-sans ${
          !isScrolled
            ? 'bg-transparent border-b border-transparent'
            : isLight
            ? 'bg-white/80 backdrop-blur-xl border-b border-neutral-200/80 shadow-2xs text-neutral-900'
            : 'bg-[#07090E]/85 backdrop-blur-xl border-b border-white/10 shadow-md text-white'
        }`}
      >
        {/* Top subtle gradient scrim only on dark hero home when at very top of page */}
        {isDarkHeroPage && !isScrolled && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
          />
        )}

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Left: Return to EntireFM & The Lobby brand mark */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-light shrink-0 whitespace-nowrap">
            <Link
              href="/"
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-light transition-colors group py-1 whitespace-nowrap shrink-0 ${
                isLight
                  ? 'text-neutral-600 hover:text-neutral-900'
                  : 'text-neutral-300 hover:text-white'
              }`}
              aria-label="Return to EntireFM main site"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>EntireFM.com</span>
            </Link>

            <span className={isLight ? 'text-neutral-300' : 'text-white/20'}>|</span>

            <Link
              href="/lobby"
              className={`inline-flex items-center gap-1.5 tracking-wider text-sm sm:text-base font-light uppercase transition-colors whitespace-nowrap shrink-0 ${
                isLight
                  ? 'text-neutral-900 hover:text-brand-electric'
                  : 'text-white hover:text-brand-electric-bright'
              }`}
            >
              <span>THE <span className={`font-normal ${isLight ? 'text-neutral-900' : 'text-white'}`}>LOBBY</span></span>
            </Link>

            <span className={`hidden 2xl:inline-block ${isLight ? 'text-neutral-300' : 'text-white/20'}`}>|</span>
            <time className={`hidden 2xl:inline-block tracking-wide font-extralight text-xs whitespace-nowrap ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              {currentDateStr}
            </time>
          </div>

          {/* Right: Primary Lobby Navigation & Member Access */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0 whitespace-nowrap">
            <nav aria-label="Lobby Section Navigation" className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs sm:text-sm font-light shrink-0 whitespace-nowrap">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors inline-flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 ${
                      link.active
                        ? link.highlight
                          ? 'text-brand-electric font-medium border-b-2 border-brand-electric'
                          : isLight
                          ? 'text-neutral-900 font-medium border-b-2 border-neutral-900'
                          : 'text-white font-medium border-b-2 border-white'
                        : link.highlight
                        ? 'text-brand-electric hover:underline font-light'
                        : isLight
                        ? 'text-neutral-600 hover:text-neutral-900 font-light'
                        : 'text-neutral-300 hover:text-white font-light'
                    }`}
                  >
                    {link.highlight && <Icon className="w-3.5 h-3.5 text-brand-electric shrink-0" />}
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
              <MemberNavControl theme={theme} />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-md transition-colors shrink-0 ${
                  isLight
                    ? 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
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
          <div
            className={`lg:hidden border-t px-4 pt-4 pb-8 space-y-4 shadow-2xl animate-fadeIn ${
              isLight
                ? 'bg-white/95 backdrop-blur-xl border-neutral-200 text-neutral-900'
                : 'bg-[#080C14]/95 backdrop-blur-xl border-white/10 text-white'
            }`}
          >
            <div className={`text-xs font-medium uppercase tracking-wider px-2 pb-1 border-b${isLight ? 'text-neutral-400 border-neutral-100' : 'text-neutral-400 border-white/10'}`}>
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
                        ? isLight
                          ? 'bg-neutral-100 text-neutral-900 font-light'
                          : 'bg-white/10 text-white font-light'
                        : isLight
                        ? 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${link.highlight ? 'text-brand-electric' : 'text-neutral-400'}`} />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}

              <div className={`pt-2 border-t mt-2 ${isLight ? 'border-neutral-100' : 'border-white/10'}`}>
                <Link
                  href="/lobby/me/research"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm font-extralight ${
                    isLight
                      ? 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="whitespace-nowrap">My Research Library</span>
                </Link>
                <Link
                  href="/lobby/me"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm font-extralight ${
                    isLight
                      ? 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="whitespace-nowrap">My Workspace</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
