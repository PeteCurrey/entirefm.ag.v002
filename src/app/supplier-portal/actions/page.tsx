import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { listSupplierRfis } from '@/server/suppliers/rfi-store';
import { SupplierRfiActionCentreClient } from '@/components/supplier-portal/SupplierRfiActionCentreClient';

export const metadata: Metadata = {
  title: 'Compliance Actions & Clarifications | EntireFM Supplier Portal',
  description: 'Respond to EntireFM assurance clarification requests, upload requested evidence, and track review status.',
};

export default async function SupplierPortalActionCentrePage() {
  const supplierId = 'sup-test-01';
  const rfis = await listSupplierRfis(supplierId);

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                SUPPLIER ASSURANCE &bull; CLARIFICATION CENTRE
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Requests For Information (RFI)
              </h1>
              <p className="text-xs text-slate-500 font-light mt-1">
                Submit requested policy schedules, trade credentials, or operational clarifications directly to the EntireFM assurance desk.
              </p>
            </div>
          </div>

          <SupplierRfiActionCentreClient initialRfis={rfis} supplierId={supplierId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
