import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Layers, BookOpen } from 'lucide-react';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  activeRoute?: 'sign-in' | 'join' | 'forgot-password' | 'verify-email' | 'reset-password';
  imageSrc?: string;
  imageAlt?: string;
  badgeText?: string;
  headline?: string;
  subheadline?: string;
}

export function AuthSplitLayout({
  children,
  activeRoute = 'sign-in',
  imageSrc = '/images/editorial/entirefm-rooftop-plant-night-1200w.webp',
  imageAlt = 'Commercial rooftop building safety and engineering plant room at twilight',
  badgeText = 'THE LOBBY · MEMBER ACCESS',
  headline = "A professional intelligence network for the people running Britain's buildings.",
  subheadline = 'Stay ahead of statutory changes, research with verified citations, and connect with commercial facilities leaders.',
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 font-sans flex flex-col selection:bg-brand-electric selection:text-white">
      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: EntireFM & The Lobby Marks */}
          <div className="flex items-center gap-3 text-xs font-extralight text-neutral-600">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-light text-neutral-600 hover:text-neutral-900 transition-colors group"
              aria-label="Return to EntireFM homepage"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>EntireFM.com</span>
            </Link>

            <span className="text-neutral-300">|</span>

            <Link
              href="/lobby"
              className="font-light tracking-wide text-xs sm:text-sm text-neutral-900 uppercase hover:text-brand-electric transition-colors"
            >
              <span>THE <span className="font-normal">LOBBY</span></span>
            </Link>
          </div>

          {/* Right: Quick Context Switcher */}
          <div className="flex items-center gap-4 text-xs font-extralight">
            {activeRoute === 'sign-in' ? (
              <span className="text-neutral-500">
                New to The Lobby?{' '}
                <Link
                  href="/join"
                  className="text-brand-electric hover:underline font-light ml-1"
                >
                  Become a Member &rarr;
                </Link>
              </span>
            ) : activeRoute === 'join' ? (
              <span className="text-neutral-500">
                Already a Member?{' '}
                <Link
                  href="/sign-in"
                  className="text-brand-electric hover:underline font-light ml-1"
                >
                  Sign in &rarr;
                </Link>
              </span>
            ) : (
              <Link
                href="/lobby"
                className="text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Return to Lobby &rarr;
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Split Viewport ───────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-57px)]">
        
        {/* ── LEFT PANEL: Brand / Atmosphere / Editorial Identity (48-50%) ── */}
        <aside className="relative lg:col-span-5 xl:col-span-5 bg-[#060911] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden min-h-[280px] lg:min-h-full">
          {/* Background Photography with dark editorial gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center brightness-75 scale-100"
            />
            {/* Dark gradient overlay with blue/indigo ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/75 to-[#060911]/40" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 bottom-0 h-96 w-96 rounded-full opacity-20 blur-[100px]"
              style={{ background: 'radial-gradient(circle, #2563eb 0%, #7c3aed 70%, transparent 100%)' }}
            />
          </div>

          {/* Top of Left Panel */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-5 bg-brand-electric" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric-bright font-light">
                {badgeText}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight tracking-tight text-white leading-tight">
                THE <span className="font-light text-white">LOBBY</span>
              </h2>
              <p className="text-xs sm:text-sm font-extralight text-brand-mist/85 max-w-md leading-relaxed">
                {headline}
              </p>
            </div>
          </div>

          {/* Middle: 3 Restrained Value Statements (Desktop only) */}
          <div className="relative z-10 hidden lg:flex flex-col space-y-4 my-auto py-8">
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-electric/20 text-brand-electric text-xs mt-0.5 border border-brand-electric/30">
                <ShieldCheck className="w-3 h-3" />
              </span>
              <div>
                <h4 className="text-xs font-light text-white">Stay ahead of what is changing</h4>
                <p className="text-[11px] font-extralight text-brand-mist/70 leading-relaxed">
                  Real-time statutory directives, Building Safety Act alerts, and duty-holder requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 text-xs mt-0.5 border border-purple-500/30">
                <Sparkles className="w-3 h-3" />
              </span>
              <div>
                <h4 className="text-xs font-light text-white">Ask The Lobby and research with sources</h4>
                <p className="text-[11px] font-extralight text-brand-mist/70 leading-relaxed">
                  Ground technical queries directly against primary legislation, British Standards, and statutory guidance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs mt-0.5 border border-emerald-500/30">
                <Layers className="w-3 h-3" />
              </span>
              <div>
                <h4 className="text-xs font-light text-white">Join the FM professional community</h4>
                <p className="text-[11px] font-extralight text-brand-mist/70 leading-relaxed">
                  Engage in technical roundtables, access peer discussions, and bookmark verified research briefs.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom of Left Panel */}
          <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] font-extralight text-brand-mist/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>The Lobby by EntireFM</span>
            <span className="text-brand-mist/40 hidden sm:inline">·</span>
            <span>Know what&apos;s changed. Understand what matters.</span>
          </div>
        </aside>

        {/* ── RIGHT PANEL: Light / Off-White Authentication Area (50-52%) ── */}
        <main className="lg:col-span-7 xl:col-span-7 bg-[#FAF9F7] flex flex-col justify-center px-4 sm:px-10 lg:px-16 xl:px-24 py-10 sm:py-16">
          <div className="w-full max-w-lg mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
