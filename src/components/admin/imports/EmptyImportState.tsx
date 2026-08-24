'use client';

import React from 'react';
import { FileUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function EmptyImportState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#D0D0CD] bg-[#FAFAF9] py-20 px-8 text-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#FF6B24] text-white shadow-lg">
        <FileUp className="h-7 w-7" />
      </div>
      <div>
        <h3 className="font-semibold text-[#101010] text-[15px]">No imports in progress</h3>
        <p className="text-[13px] text-[#686866] mt-1 max-w-sm">
          Upload a SimPRO CSV export or generic data file to begin migrating clients, sites, or contractors into EntireCAFM.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link
          href="/admin/platform/imports/new"
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#FF6B24] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E9540F] transition-colors shadow-sm"
        >
          <FileUp className="h-4 w-4" />
          Start New Import
        </Link>
        <Link
          href="/admin/platform/imports/templates"
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] px-5 py-2.5 text-[13px] font-medium text-[#101010] hover:bg-[#F5F5F3] transition-colors"
        >
          Browse Templates
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
