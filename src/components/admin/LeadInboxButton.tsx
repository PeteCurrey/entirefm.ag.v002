'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

interface LeadInboxButtonProps {
  initialCount?: number;
}

export function LeadInboxButton({ initialCount = 0 }: LeadInboxButtonProps) {
  const [newLeadsCount, setNewLeadsCount] = useState<number>(initialCount);

  const fetchLeadsCount = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.newLeadsCount === 'number') {
          setNewLeadsCount(data.newLeadsCount);
        }
      }
    } catch (e) {
      console.warn('[LEAD_COUNT_FETCH_ERR]', e);
    }
  };

  useEffect(() => {
    fetchLeadsCount();
    const interval = setInterval(fetchLeadsCount, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/admin/growth/leads"
      className="relative flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] text-[#686866] hover:bg-white hover:text-[#101010] hover:border-[#D1D1CD] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      aria-label="Inbound Leads & Enquiries Inbox"
      title="Inbound Leads & Enquiries"
    >
      <Mail className="h-4 w-4" />
      {newLeadsCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF3E9D] px-1 text-[10px] font-normal text-white shadow-sm ring-2 ring-white">
          {newLeadsCount > 99 ? '99+' : newLeadsCount}
        </span>
      )}
    </Link>
  );
}
