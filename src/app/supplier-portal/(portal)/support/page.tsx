import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Supplier Support Desk | EntireFM Partner Network',
  description: 'Get help with supplier onboarding, compliance document reviews, and portal access.',
};

export default function SupplierSupportPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
          SUPPLY CHAIN ASSISTANCE
        </span>
        <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
          Supplier Support &amp; Help Desk
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Have questions about your application, technical assurance, or compliance documentation? Contact our dedicated team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-3">
          <Mail className="h-5 w-5 text-brand-pink" />
          <h3 className="font-bold text-slate-900 font-sans text-sm">Assurance &amp; Vetting Desk</h3>
          <p className="text-slate-600 font-light leading-relaxed">
            For questions regarding required trade accreditations, insurance minimums, or document rejection explanations.
          </p>
          <span className="text-slate-900 font-bold block pt-2">supplier-support@entirefm.com</span>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-3">
          <MessageSquare className="h-5 w-5 text-brand-pink" />
          <h3 className="font-bold text-slate-900 font-sans text-sm">Operational Helpdesk</h3>
          <p className="text-slate-600 font-light leading-relaxed">
            For live work order queries, emergency dispatch acknowledgements, and site access coordination.
          </p>
          <span className="text-slate-900 font-bold block pt-2">operations@entirefm.com</span>
        </div>
      </div>
    </div>
  );
}
