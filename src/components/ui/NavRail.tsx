'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavRailItemConfig {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  highlight?: boolean;
}

export interface NavRailProps {
  items: NavRailItemConfig[];
  orientation?: 'horizontal' | 'vertical';
  brandMark?: React.ReactNode;
  userSlot?: React.ReactNode;
  className?: string;
}

/**
 * CAFM Shared Navigation Rail Component
 * =====================================
 * Standardised icon-rail / navigation shell component used across
 * Admin, Contractor, and Client portals. Supports horizontal top-rail
 * or vertical side-rail orientation with active orange indicators.
 */
export function NavRail({
  items,
  orientation = 'horizontal',
  brandMark,
  userSlot,
  className = '',
}: NavRailProps) {
  const pathname = usePathname();

  if (orientation === 'vertical') {
    return (
      <aside
        className={`w-64 bg-cafm-surface-card border-r border-cafm-border flex flex-col justify-between shrink-0 h-full ${className}`}
      >
        <div className="flex flex-col">
          {brandMark && (
            <div className="p-5 border-b border-cafm-border flex items-center justify-between">
              {brandMark}
            </div>
          )}
          <nav className="p-3 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin' || item.href === '/supplier-portal' || item.href === '/clients'
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-[6px] text-[12px] font-normal transition-all group ${
                    isActive
                      ? 'bg-cafm-orange text-white font-medium shadow-xs'
                      : 'text-cafm-text-secondary hover:text-cafm-text-primary hover:bg-cafm-surface-muted'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-cafm-text-muted group-hover:text-cafm-text-primary'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[9.5px] rounded-[3px] font-medium uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-cafm-orange-light text-cafm-orange-hover border border-cafm-orange-border'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        {userSlot && <div className="p-4 border-t border-cafm-border">{userSlot}</div>}
      </aside>
    );
  }

  // Horizontal top-bar rail
  return (
    <nav
      className={`flex items-center gap-1 overflow-x-auto py-1 ${className}`}
      aria-label="Primary Navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/admin' || item.href === '/supplier-portal' || item.href === '/clients'
            ? pathname === item.href
            : pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[12px] transition-all whitespace-nowrap group ${
              isActive
                ? 'bg-cafm-orange text-white font-medium shadow-xs'
                : item.highlight
                ? 'bg-cafm-orange-light text-cafm-orange-hover border border-cafm-orange-border font-medium hover:bg-cafm-orange hover:text-white'
                : 'text-cafm-text-secondary hover:text-cafm-text-primary hover:bg-cafm-surface-subtle font-normal'
            }`}
          >
            <Icon
              className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                isActive
                  ? 'text-white'
                  : item.highlight
                  ? 'text-cafm-orange group-hover:text-white'
                  : 'text-cafm-text-muted group-hover:text-cafm-text-primary'
              }`}
            />
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[9px] rounded-[3px] font-medium uppercase tracking-wider ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-cafm-orange-light text-cafm-orange-hover'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
