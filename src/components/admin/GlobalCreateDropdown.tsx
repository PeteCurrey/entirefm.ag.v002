'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserSession } from '@/server/identity';
import {
  Plus,
  ChevronDown,
  Wrench,
  Headphones,
  FileText,
  Receipt,
  Building2,
  MapPin,
  Layers,
  Truck,
} from 'lucide-react';

interface Props {
  session: UserSession;
}

export function GlobalCreateDropdown({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click or ESC
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const perms = (session.permissions as string[]) || [];
  const isSuper = session.role === 'SUPER_ADMIN' || session.role === 'CEO' || session.role === 'ADMINISTRATOR';

  const items = [
    {
      label: 'New Work Order',
      href: '/admin/operations/work-orders?create=true',
      icon: Wrench,
      description: 'Reactive repair or planned job order',
      visible: true,
    },
    {
      label: 'New Service Request',
      href: '/admin/operations/service-requests',
      icon: Headphones,
      description: 'Helpdesk ticket & triage log',
      visible: true,
    },
    {
      label: 'New Quote',
      href: '/admin/commercial/quotes?create=true',
      icon: FileText,
      description: 'Client proposal or variation estimate',
      visible: isSuper || perms.includes('commercial:quotes') || perms.includes('commercial:edit'),
    },
    {
      label: 'New Client Invoice',
      href: '/admin/finance/client-invoices?create=true',
      icon: Receipt,
      description: 'Direct billing or batch invoice',
      visible: isSuper || perms.includes('finance:billing') || perms.includes('finance:view'),
    },
    {
      label: 'New Client Account',
      href: '/admin/estate/clients',
      icon: Building2,
      description: 'Corporate client registration',
      visible: isSuper || perms.includes('estate:edit'),
    },
    {
      label: 'New Managed Site',
      href: '/admin/estate/sites',
      icon: MapPin,
      description: 'Physical property, building or campus',
      visible: isSuper || perms.includes('estate:edit'),
    },
    {
      label: 'New Asset',
      href: '/admin/estate/assets',
      icon: Layers,
      description: 'Plant equipment, M&E, or fabric asset',
      visible: isSuper || perms.includes('estate:edit'),
    },
    {
      label: 'New Contractor / Supplier',
      href: '/admin/suppliers',
      icon: Truck,
      description: 'Supply chain partner onboarding',
      visible: isSuper || perms.includes('supply_chain:edit'),
    },
  ].filter((item) => item.visible);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="inline-flex rounded-[6px] shadow-xs">
        <Link
          href="/admin/operations/work-orders?create=true"
          className="inline-flex items-center gap-1.5 rounded-l-[6px] bg-[#EA580C] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#C2410C] transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create</span>
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center rounded-r-[6px] bg-[#EA580C] px-1.5 py-1.5 text-white border-l border-white/20 hover:bg-[#C2410C] transition-all"
          title="Open creation menu"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-[#E8E8E5] bg-white p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[#9A9A95] border-b border-[#E8E8E5]">
            Quick Actions
          </div>
          <div className="py-1 space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#F5F5F3] transition-colors"
                >
                  <div className="mt-0.5 rounded-md p-1 bg-[#FAFAF8] border border-[#E8E8E5] text-[#111111] group-hover:border-[#EA580C] group-hover:text-[#EA580C] transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-[#111111] group-hover:text-[#EA580C] transition-colors">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#6D6D68] truncate">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
