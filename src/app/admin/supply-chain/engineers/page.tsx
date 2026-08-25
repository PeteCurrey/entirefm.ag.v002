import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function EngineersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Supply Chain"
        title="Field Engineers & Resources"
        description="Internal and subcontracted trade engineers, active certifications, skills matrix, and live job capacity."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-brand-indigo">
            + Add Engineer Resource
          </button>
        }
      />

      <EmptyState
        title="No Field Engineers Registered"
        description="Add internal field technicians or certified subcontractor engineers to enable direct mobile dispatch."
        actionText="Register Engineer"
        actionHref="/admin/supply-chain/engineers"
      />
    </div>
  );
}
