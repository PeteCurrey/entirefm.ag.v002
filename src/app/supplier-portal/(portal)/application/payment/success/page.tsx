import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PaymentSuccessClient } from '@/components/supplier-portal/PaymentSuccessClient';

export const metadata: Metadata = {
  title: 'Payment Confirmed & Application Submitted | EntireFM Supplier Portal',
  description: 'Your Initial Supplier Assurance Review payment has been received and your application is now under review.',
};

export default function SupplierPaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div className="p-8 text-center text-xs font-light">Verifying payment session...</div>}>
            <PaymentSuccessClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
