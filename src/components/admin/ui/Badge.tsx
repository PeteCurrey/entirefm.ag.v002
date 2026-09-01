import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'orange' | 'neutral' | 'dark';
  size?: 'xs' | 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  pulse = false,
  className = '',
}: BadgeProps) {
  const variantStyles = {
    green: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
    amber: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    red: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
    blue: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    orange: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
    neutral: 'bg-[#FAFAF8] text-[#6D6D68] border-[#E8E8E5]',
    dark: 'bg-[#111111] text-[#FFFFFF] border-[#111111]',
  };

  const dotStyles = {
    green: 'bg-[#16A34A]',
    amber: 'bg-[#D97706]',
    red: 'bg-[#DC2626]',
    blue: 'bg-[#2563EB]',
    orange: 'bg-[#EA580C]',
    neutral: 'bg-[#9A9A95]',
    dark: 'bg-[#FFFFFF]',
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[9.5px] rounded-[3px]',
    sm: 'px-2 py-0.5 text-[11px] rounded-[4px]',
    md: 'px-2.5 py-1 text-[12px] rounded-[4px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 uppercase tracking-wider font-medium border${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotStyles[variant]}`}
          />
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dotStyles[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
