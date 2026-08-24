'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface LegalPrintButtonProps {
  className?: string;
}

export function LegalPrintButton({
  className = 'mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20',
}: LegalPrintButtonProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={className}
      aria-label="Print or save as PDF"
    >
      <Printer className="h-3.5 w-3.5" />
      Print / Save PDF
    </button>
  );
}
