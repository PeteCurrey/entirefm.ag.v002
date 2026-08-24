'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  width = 'md',
}: DrawerProps) {
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

  const widthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`w-screen ${widthStyles[width]} transform bg-[#FFFFFF] shadow-2xl border-l border-[#E4E4E1] transition-transform duration-250 ease-out flex flex-col`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E4E4E1] px-6 py-4 bg-[#FFFFFF]">
            <div className="min-w-0 flex-1 pr-4">
              <div className="flex items-center gap-2">
                {title && (
                  <h2 className="text-[16px] font-medium tracking-tight text-[#101010] truncate">
                    {title}
                  </h2>
                )}
                {badge}
              </div>
              {subtitle && (
                <div className="mt-0.5 text-[12px] text-[#686866] truncate">{subtitle}</div>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-[8px] p-1.5 text-[#9B9B97] hover:bg-[#F0F0EE] hover:text-[#101010] transition-colors"
              title="Close drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 cafm-scroll bg-[#FFFFFF]">
            {children}
          </div>

          {/* Drawer Footer */}
          {footer && (
            <div className="border-t border-[#E4E4E1] bg-[#F5F5F3] px-6 py-3.5 flex items-center justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
