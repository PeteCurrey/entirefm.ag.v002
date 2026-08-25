import React from 'react';
import { SupplierHeaderNav } from '@/components/admin/suppliers/SupplierHeaderNav';

export default function SupplierAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {/* Sub-navigation bar across all 20 supplier strategy & commercial sections */}
      <SupplierHeaderNav />
      {children}
    </div>
  );
}
