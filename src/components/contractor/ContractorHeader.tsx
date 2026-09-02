'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CafmBrandMark } from '@/components/brand/CafmBrandMark';
import {
  Building2,
  ChevronDown,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export interface ContractorHeaderProps {
  user: {
    name: string;
    email: string;
  };
  contractorOrg: {
    id: string;
    legalName: string;
    tradingName: string;
    companyNumber?: string;
    status: string;
    fullDisplayName: string;
    shortDisplayName: string;
  };
  isViewAs?: boolean;
  operatorEmail?: string;
}

const NAV_LINKS = [
  { name: 'Dashboard', href: '/contractor' },
  { name: 'Work Queue', href: '/contractor/work' },
  { name: 'Job Packs', href: '/contractor/job-packs' },
  { name: 'Customers', href: '/contractor/customers' },
  { name: 'Business Documents', href: '/contractor/templates' },
  { name: 'Workforce & Matrix', href: '/contractor/workforce' },
  { name: 'Compliance', href: '/contractor/compliance' },
  { name: 'Intelligence', href: '/contractor/intelligence' },
  { name: 'Document Vault', href: '/contractor/documents' },
  { name: 'RAMS & Safety', href: '/contractor/rams' },
  { name: 'Forms', href: '/contractor/forms' },
  { name: 'Performance', href: '/contractor/performance' },
  { name: 'Calculators & Tools', href: '/contractor/tools' },
  { name: 'Benefits', href: '/contractor/benefits' },
  { name: 'Schedule', href: '/contractor/schedule' },
  { name: 'Commercial', href: '/contractor/commercial' },
  { name: 'Company Profile', href: '/contractor/profile' },
  { name: 'Settings', href: '/contractor/settings' },
];

export function ContractorHeader({
  user,
  contractorOrg,
  isViewAs = false,
  operatorEmail = '',
}: ContractorHeaderProps) {
  const pathname = usePathname();
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOrgDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[#E8E8E5] bg-[#FFFFFF] shadow-xs">
      {/* View-As Banner */}
      {isViewAs && (
        <div className="bg-[#FEF3C7] border-b border-[#FDE68A] px-6 py-2 text-center text-[12px] font-medium text-[#92400E]">
          ⚠️ AUDITED SUPPORT VIEW-AS: {contractorOrg.fullDisplayName} · Operator: {operatorEmail}
        </div>
      )}

      {/* Main Top Header */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Canonical Brand Logo + CONTRACTOR Context + Company Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/contractor" className="flex items-center gap-2.5 shrink-0 group">
            <CafmBrandMark size="sm" />
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-normal tracking-tight text-[#111111]">
                Entire<span className="text-[#EA580C]">FM</span>
              </span>
              <span className="rounded-[4px] border border-[#E8E8E5] bg-[#FAFAF8] px-1.5 py-0.5 text-[9.5px] uppercase font-bold tracking-wider text-[#6D6D68]">
                Contractor
              </span>
            </div>
          </Link>

          <div className="h-4 w-px bg-[#E8E8E5] hidden sm:block" />

          {/* Company Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="flex items-center gap-1.5 rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] px-2.5 py-1 text-left text-[12px] font-normal text-[#111111] hover:border-[#D4D4D0] hover:bg-[#FFFFFF] transition-all"
              aria-expanded={isOrgDropdownOpen}
            >
              <Building2 className="h-3.5 w-3.5 text-[#EA580C] shrink-0" />
              <span className="font-medium truncate max-w-[140px] sm:max-w-[200px]">
                {contractorOrg.shortDisplayName}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-[#9A9A95] transition-transform duration-150 ${isOrgDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Company Info Popover */}
            {isOrgDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-80 rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-3.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-start justify-between pb-2.5 border-b border-[#E8E8E5]">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9A9A95]">
                      Active Contractor Account
                    </span>
                    <h4 className="text-[13px] font-semibold text-[#111111] mt-0.5">
                      {contractorOrg.tradingName || contractorOrg.legalName}
                    </h4>
                    {contractorOrg.tradingName && contractorOrg.tradingName !== contractorOrg.legalName && (
                      <p className="text-[11px] text-[#6D6D68] mt-0.5">
                        {contractorOrg.legalName}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-1.5 py-0.5 text-[10px] font-medium text-[#15803D]">
                    <CheckCircle2 className="h-3 w-3" />
                    {contractorOrg.status}
                  </span>
                </div>

                <div className="py-2.5 space-y-1.5 text-[11.5px] border-b border-[#E8E8E5]">
                  <div className="flex items-center justify-between text-[#6D6D68]">
                    <span>Companies House #</span>
                    <span className="font-medium text-[#111111] font-mono text-[11px]">
                      {contractorOrg.companyNumber || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#6D6D68]">
                    <span>Canonical Identity</span>
                    <span className="font-medium text-[#111111] text-[11px] truncate max-w-[160px]">
                      {contractorOrg.fullDisplayName}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href="/contractor/profile"
                    onClick={() => setIsOrgDropdownOpen(false)}
                    className="text-[11.5px] text-[#EA580C] hover:underline font-medium flex items-center gap-1"
                  >
                    View Company Profile &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Authenticated User & Sign Out */}
        <div className="flex items-center gap-3 sm:gap-4 text-[12.5px]">
          {/* User Name (strictly without raw RBAC code) */}
          <div className="hidden md:flex flex-col text-right">
            <span className="font-medium text-[#111111] leading-tight">
              {user.name}
            </span>
            <span className="text-[11px] text-[#6D6D68] leading-tight mt-0.5">
              {contractorOrg.shortDisplayName}
            </span>
          </div>

          <div className="h-4 w-px bg-[#E8E8E5] hidden md:block" />

          {/* Sign Out Form */}
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] px-2.5 py-1 text-[12px] font-normal text-[#6D6D68] hover:border-[#D4D4D0] hover:bg-[#FAFAF8] hover:text-[#111111] transition-all"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5 text-[#9A9A95]" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 rounded-[4px] text-[#6D6D68] hover:text-[#111111] lg:hidden"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Secondary Horizontal Navigation Bar */}
      <nav aria-label="Contractor Sub-navigation" className="hidden lg:block border-t border-[#E8E8E5] bg-[#FFFFFF]">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8 py-0 scrollbar-none">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === '/contractor'
                ? pathname === '/contractor'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2.5 text-[12px] font-normal transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#111111] font-medium'
                    : 'text-[#6D6D68] hover:text-[#111111]'
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#EA580C] rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Nav Collapse */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          <div className="pb-2 mb-2 border-b border-[#E8E8E5] flex items-center justify-between text-xs text-[#6D6D68]">
            <span>Signed in as <strong className="text-[#111111]">{user.name}</strong></span>
            <span>{contractorOrg.shortDisplayName}</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === '/contractor'
                  ? pathname === '/contractor'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-[6px] text-[12px] transition-colors ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#EA580C] font-semibold border border-[#E8E8E5] shadow-xs'
                      : 'text-[#6D6D68] hover:bg-[#FFFFFF] hover:text-[#111111]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
