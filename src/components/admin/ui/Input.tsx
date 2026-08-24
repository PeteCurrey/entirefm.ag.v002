import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-mono text-[11px] font-medium uppercase tracking-wider text-[#686866]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-[#9B9B97]">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-[8px] border bg-[#FFFFFF] px-3 py-1.5 text-[13px] text-[#101010] placeholder-[#9B9B97] transition-all duration-150 focus:border-[#FF6B24] focus:outline-none focus:ring-2 focus:ring-[#FF6B24]/10 disabled:bg-[#F0F0EE] disabled:text-[#9B9B97] ${
              icon ? 'pl-9' : ''
            } ${rightElement ? 'pr-9' : ''} ${
              error ? 'border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/10' : 'border-[#E4E4E1]'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2.5 flex items-center">{rightElement}</div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] text-[#B91C1C]">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#686866]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
