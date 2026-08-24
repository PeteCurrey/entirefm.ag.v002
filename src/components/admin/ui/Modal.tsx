'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[3px] transition-opacity duration-200"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-2xl overflow-hidden z-10 transition-all duration-200 transform`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4E4E1] px-6 py-4 bg-[#FFFFFF]">
          <div>
            {title && (
              <h3 className="text-[16px] font-medium tracking-tight text-[#101010]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[12px] text-[#686866]">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-[8px] p-1.5 text-[#9B9B97] hover:bg-[#F0F0EE] hover:text-[#101010] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-[#E4E4E1] bg-[#F5F5F3] px-6 py-3.5 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
