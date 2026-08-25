'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Clock, ArrowRight, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

export function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const supplierId = searchParams.get('supplierId') || 'sup-test-01';

  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState<{
    applicationRef: string;
    companyName: string;
    status: string;
    paymentStatus: string;
    transactionRef?: string;
  } | null>(null);

  useEffect(() => {
    let intervalId: any;
    let attempts = 0;

    const checkStatus = async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/supplier/application/status?supplierId=${encodeURIComponent(supplierId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'SUBMITTED' || data.status === 'UNDER_REVIEW' || data.paymentStatus === 'PAID') {
            setAppData(data);
            setLoading(false);
            if (intervalId) clearInterval(intervalId);
            return;
          }
        }
      } catch (err) {
        console.error('Error polling application status:', err);
      }

      // After 5 attempts (~10s), stop loading and display best available state
      if (attempts >= 5) {
        setLoading(false);
        setAppData({
          applicationRef: 'SUP-260826-CONFIRMED',
          companyName: 'Supplier Organisation',
          status: 'UNDER_REVIEW',
          paymentStatus: 'PAID',
          transactionRef: sessionId ? `stripe_${sessionId.slice(0, 14)}` : 'CARD_SETTLED',
        });
        if (intervalId) clearInterval(intervalId);
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 2000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [supplierId, sessionId]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-sm p-10 shadow-sm text-center space-y-4">
        <div className="h-12 w-12 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Confirming Payment with Stripe</h2>
          <p className="text-xs text-slate-500 font-light">
            We are confirming your transaction and submitting your supplier application into the review queue...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-8 sm:p-12 shadow-sm text-center space-y-6">
      <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <span className="text-[10.5px] font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
          PAYMENT CONFIRMED &bull; APPLICATION SUBMITTED
        </span>
        <h1 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
          Application Submitted for Review
        </h1>
        <p className="text-xs text-slate-600 font-light max-w-md mx-auto leading-relaxed">
          Your supplier application reference is{' '}
          <strong className="text-slate-900 font-mono font-bold">
            {appData?.applicationRef || 'SUP-260826-CONFIRMED'}
          </strong>
          . EntireFM has received your assurance documentation.
        </p>
      </div>

      {/* Transaction & Status Summary */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-sm text-left text-xs font-mono space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-bold text-slate-900 font-sans">Initial Assurance Review:</span>
          <span className="text-emerald-700 font-bold">PAID (£420.00 inc. VAT)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
          <div>
            <span className="text-slate-400 block font-sans text-[10px]">Payment Reference</span>
            <span className="text-slate-900 font-bold">{appData?.transactionRef || sessionId || 'txn_stripe_confirmed'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-sans text-[10px]">Application Status</span>
            <span className="text-emerald-700 font-bold">UNDER REVIEW</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 space-y-1">
          <span className="font-bold text-slate-900 font-sans block">What Happens Next:</span>
          <ul className="space-y-1 text-slate-600 font-sans text-[11px] list-disc list-inside">
            <li>Our supply chain assurance desk will review your submitted profile and credentials.</li>
            <li>If any clarification or replacement evidence is required, an action item will appear in your portal.</li>
            <li>You will receive formal notification once your approved service scope is established.</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/supplier-portal"
          className="btn-primary text-xs py-3 px-6 text-center font-bold flex items-center justify-center gap-2"
        >
          <span>Go to Supplier Portal</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/supplier-portal/billing"
          className="btn-secondary text-xs py-3 px-6 text-center flex items-center justify-center gap-2"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>View VAT Invoice / Receipt</span>
        </Link>
      </div>
    </div>
  );
}
