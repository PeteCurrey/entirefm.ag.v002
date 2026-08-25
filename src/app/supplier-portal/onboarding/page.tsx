import React from 'react';
import { OnboardingWizardClient } from '@/components/supplier-portal/OnboardingWizardClient';

export const metadata = {
  title: 'Supplier Onboarding Wizard | EntireFM Partner Network',
  description: 'Complete your 15-stage supplier qualification, trade accreditation, and company assurance profile.',
};

export default function OnboardingWizardPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          SELF-SERVICE QUALIFICATION // PHASE 2A
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Supplier Onboarding &amp; Partner Profile Wizard
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Complete the 15-step structured application. Progress is automatically saved at every stage.
        </p>
      </div>

      <OnboardingWizardClient />
    </div>
  );
}
