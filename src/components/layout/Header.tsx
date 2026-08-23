'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, ChevronDown, Menu, X, ArrowRight, ArrowUpRight } from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';
import { PRIMARY_NAV, SECONDARY_NAV } from '@/config/navigation';

/**
 * SITE HEADER
 * ===========
 * Dark, restrained, and quiet until used — the header should feel like the
 * frame around the content rather than competing with it.
 *
 * Behaviour worth knowing about:
 *
 *  · The header keeps a solid graphite ground and gains blur plus elevation
 *    once the page scrolls. It is sticky rather than fixed, so it sits above
 *    the hero rather than over it — a transparent ground would simply show
 *    the white page behind it.
 *
 *  · Mega-menus open on hover for pointer users and on click for everyone
 *    else. Hover-only menus are unusable by keyboard and touch, so the
 *    trigger is a real <button> with aria-expanded and the panel closes on
 *    Escape and on focus leaving it.
 *
 *  · The close-on-leave is delayed slightly. Menus that vanish the instant
 *    the cursor crosses a gap feel broken, and the diagonal path from trigger
 *    to panel content crosses exactly such a gap.
 */

const CLOSE_DELAY_MS = 140;

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route change closes everything.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes the open menu and returns focus to its trigger.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openMenu) {
        const trigger = navRef.current?.querySelector<HTMLButtonElement>(
          `[data-menu-trigger="${openMenu}"]`
        );
        setOpenMenu(null);
        trigger?.focus();
      }
      setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openMenu]);

  // The mobile drawer is a full-screen overlay; the page beneath must not scroll.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <header
      className={`on-dark sticky top-0 z-50 bg-brand-graphite transition-all duration-500 ease-brand ${
        scrolled
          ? 'bg-brand-graphite/92 shadow-elevated backdrop-blur-xl'
          : ''
      } border-b border-brand-edge-dark`}
    >
      {/* Utility bar — collapses away on scroll to give the nav more presence. */}
      <div
        className={`hidden lg:block overflow-hidden border-b border-white/[0.06] transition-all duration-500 ease-brand ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        }`}
      >
        <div className="container-custom flex h-9 items-center justify-between text-[11px] tracking-wide text-brand-mist/60">
          <p>Facilities Management. Evolved.</p>
          <div className="flex items-center gap-5">
            <span>Out-of-hours support for contracted sites</span>
            <span className="h-3 w-px bg-white/15" />
            <Link href="/client-login" className="transition-colors hover:text-white">
              Client Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="container-wide" ref={navRef}>
        <div className="flex h-[72px] items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="EntireFM — home">
            <span className="relative block h-9 w-9">
              <Image
                src="/logos/06-crystalline-colour-mark.webp"
                alt=""
                fill
                sizes="36px"
                priority
                className="object-contain transition-transform duration-500 ease-brand group-hover:scale-105"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[19px] font-extrabold tracking-[-0.02em] text-white">
                ENTIRE<span className="text-spectrum">FM</span>
              </span>
              <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.18em] text-brand-mist/45 2xl:block">
                Facilities Management. Evolved.
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden min-w-0 items-center lg:flex" aria-label="Main">
            {PRIMARY_NAV.map((section) => {
              const open = openMenu === section.label;
              return (
                <div
                  key={section.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(section.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    data-menu-trigger={section.label}
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(open ? null : section.label)}
                    className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      open || isActive(section.href) ? 'text-white' : 'text-brand-mist/75 hover:text-white'
                    }`}
                  >
                    {section.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ease-brand ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <MegaMenu section={section} open={open} onClose={() => setOpenMenu(null)} />
                </div>
              );
            })}

            {SECONDARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive(link.href)}
                className="nav-link whitespace-nowrap px-3 py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={CONTACT_CONFIG.mainPhone.href}
              className="hidden items-center gap-2 rounded-sm border border-white/12 px-3.5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-brand hover:border-brand-electric/60 hover:bg-white/[0.05] 2xl:inline-flex"
            >
              <Phone className="h-3.5 w-3.5 text-brand-electric-bright" />
              {CONTACT_CONFIG.mainPhone.display}
            </a>
            <Link href="/contact-us" className="btn-primary hidden py-2.5 text-[13px] sm:inline-flex">
              Get a proposal
              <ArrowRight className="btn-arrow h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/12 text-white transition-colors hover:bg-white/[0.06] lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

/* ── Mega-menu ─────────────────────────────────────────────────────────── */

function MegaMenu({
  section,
  open,
  onClose,
}: {
  section: (typeof PRIMARY_NAV)[number];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      // Kept mounted so the close transition can run and so the links remain
      // in the document for crawlers; visibility is what changes.
      className={`absolute left-1/2 top-full z-50 w-[min(56rem,calc(100vw-3rem))] -translate-x-1/2 pt-3 transition-all duration-300 ease-brand ${
        open
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-1 opacity-0'
      }`}
      aria-hidden={!open}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose();
      }}
    >
      <div className="grain relative overflow-hidden rounded-md border border-brand-edge-dark bg-brand-carbon shadow-glow-lg">
        <div className="facet-rule pointer-events-none absolute inset-0 opacity-60" />
        <div className="rule-spectrum absolute inset-x-0 top-0" />

        <div className="relative grid gap-8 p-8 md:grid-cols-[1fr_1fr_minmax(200px,240px)]">
          {section.columns.map((column) => (
            <div key={column.heading}>
              <p className="eyebrow eyebrow-dark mb-5">{column.heading}</p>
              <ul className="space-y-0.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      tabIndex={open ? 0 : -1}
                      className="group/item block rounded-sm px-3 py-2 -mx-3 transition-colors duration-200 hover:bg-white/[0.04]"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[13.5px] font-medium text-brand-mist transition-colors duration-200 group-hover/item:text-white">
                          {link.label}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-brand-electric-bright opacity-0 transition-all duration-300 ease-brand group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                      </span>
                      {link.detail && (
                        <span className="mt-0.5 block text-[11.5px] leading-snug text-brand-silver transition-colors duration-200 group-hover/item:text-brand-mist/70">
                          {link.detail}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {section.feature && (
            <Link
              href={section.feature.href}
              tabIndex={open ? 0 : -1}
              className="edge-lit group/feature relative flex flex-col justify-between overflow-hidden rounded-sm border border-brand-edge-dark bg-brand-graphite p-6"
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover/feature:opacity-70"
                style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
              />
              <div className="relative">
                <p className="eyebrow eyebrow-dark mb-4">{section.feature.eyebrow}</p>
                <p className="text-[15px] font-semibold leading-snug text-white">
                  {section.feature.title}
                </p>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-brand-mist/60">
                  {section.feature.body}
                </p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-electric-bright">
                {section.feature.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover/feature:translate-x-1" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile drawer ─────────────────────────────────────────────────────── */

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [section, setSection] = useState<string | null>(null);

  return (
    <div
      className={`on-dark fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto border-t border-brand-edge-dark bg-brand-graphite transition-all duration-400 ease-brand lg:hidden ${
        open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
      }`}
      aria-hidden={!open}
    >
      <div className="container-custom py-7">
        <nav aria-label="Mobile">
          {PRIMARY_NAV.map((item) => {
            const expanded = section === item.label;
            return (
              <div key={item.label} className="border-b border-brand-edge-dark">
                <button
                  type="button"
                  onClick={() => setSection(expanded ? null : item.label)}
                  aria-expanded={expanded}
                  tabIndex={open ? 0 : -1}
                  className="flex w-full items-center justify-between py-4 text-left text-base font-semibold text-white"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 text-brand-mist/50 transition-transform duration-300 ease-brand ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-400 ease-brand ${
                    expanded ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    {item.columns.map((column) => (
                      <div key={column.heading} className="mb-4">
                        <p className="eyebrow eyebrow-dark mb-3">{column.heading}</p>
                        <ul className="space-y-1">
                          {column.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={onClose}
                                tabIndex={open && expanded ? 0 : -1}
                                className="block py-1.5 text-sm text-brand-mist/80"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {SECONDARY_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="block border-b border-brand-edge-dark py-4 text-base font-semibold text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 space-y-3">
          <Link href="/contact-us" onClick={onClose} tabIndex={open ? 0 : -1} className="btn-primary w-full">
            Request a proposal
            <ArrowRight className="btn-arrow h-4 w-4" />
          </Link>
          <a
            href={CONTACT_CONFIG.mainPhone.href}
            tabIndex={open ? 0 : -1}
            className="btn-ghost-light w-full"
          >
            <Phone className="h-4 w-4 text-brand-electric-bright" />
            {CONTACT_CONFIG.mainPhone.display}
          </a>
        </div>
      </div>
    </div>
  );
}
