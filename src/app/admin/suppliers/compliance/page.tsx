import React from 'react';
import { listSupplierOrganisations } from '@/server/suppliers/store';
import { listComplianceHolds, listRemediationActions } from '@/server/suppliers/assurance-store';
import { dbQuery } from '@/server/db/client';
import { AdminComplianceControlClient } from '@/components/admin/AdminComplianceControlClient';

export const dynamic = 'force-dynamic';

export default async function ComplianceControlCentrePage() {
  const [suppliers, holds, remediation, pendingDocsRes] = await Promise.all([
    listSupplierOrganisations(),
    listComplianceHolds(),
    listRemediationActions(),
    dbQuery<any[]>(`supplier_documents?status=in.(UPLOADED,UNDER_REVIEW,PENDING)&order=created_at.desc&limit=50`),
  ]);

  const activeHolds = holds.filter((h) => h.is_active);
  const openRemediation = remediation.filter((r) => r.status === 'OPEN' || r.status === 'SUPPLIER_ACTION');
  const pendingDocs = pendingDocsRes.data || [];

  return (
    <AdminComplianceControlClient
      suppliers={suppliers}
      activeHolds={activeHolds}
      openRemediation={openRemediation}
      pendingDocuments={pendingDocs}
    />
  );
}
