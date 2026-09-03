'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { SUPPLIER_MEMBERSHIP } from '@/config/supplier-membership';

export function StickyMembershipCta() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 600px
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside aria-label="Quick Application Actions" className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl py-3 px-4 transition-all duration-300 animate-in slide-in-from-bottom-3">
      <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex h-8 w-8 rounded-sm bg-orange-50 border border-orange-200 items-center justify-center text-[#EA580C]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">EntireFM Supplier Membership</span>
              <span className="text-[11px] font-bold text-[#EA580C] bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-sm">
                {SUPPLIER_MEMBERSHIP.displayPrice}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-light">
              Digital operating platform, compliance vault, RAMS, workforce matrix &amp; Partner Network.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link
            href="/suppliers/membership"
            className="text-xs text-slate-600 hover:text-slate-900 px-3 py-2 font-medium hidden lg:inline-block"
          >
            Membership Details
          </Link>
          <Link
            href="/suppliers/apply"
            className="btn-primary text-xs py-2 px-4 whitespace-nowrap w-full sm:w-auto text-center"
          >
            Apply to Join <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
