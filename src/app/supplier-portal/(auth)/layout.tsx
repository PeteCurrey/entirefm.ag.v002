import React from 'react';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function SupplierPortalAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-brand-pink selection:text-white">
      {children}
    </div>
  );
}
