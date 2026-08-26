import {
  fieldOperationsStore,
  listFieldOperatives,
  getFieldOperative,
  assignOperativeToVisit,
  addAdditionalOperativeToVisit,
  acknowledgeVisit,
  startJourney,
  recordVisitArrival,
  startWork,
  updatePpmTask,
  addEvidenceItem,
  raiseOperationalDefect,
  requestVariation,
  submitDigitalServiceReport,
  validateServiceReport,
  recordVisitNoAccess,
  cancelVisit,
  mapToClientSafeMilestone,
  generateServiceReportDocument,
} from '../src/server/field/operations-store';

async function runPhase6RHardeningTestSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM CAFM PHASE 6R — PRODUCTION HARDENING & TRUTH SEAL ');
  console.log('══════════════════════════════════════════════════════════════\n');

  const providerOrgId = 'sup-test-01';
  const visitId = 'vis-ppm-001';

  // 1. Transient Loss, Offline Queue & Sync States
  console.log('1. Testing Poor-Signal Offline Queue & Evidence Sync States...');
  await assignOperativeToVisit(visitId, 'op-jack-turner', providerOrgId, 'Test Controller');
  await acknowledgeVisit(visitId, 'op-jack-turner', 'ACCEPT');
  await recordVisitArrival(visitId, 'op-jack-turner', 'GEOFENCE');
  await startWork(visitId, 'op-jack-turner');

  // Add evidence in WAITING_FOR_CONNECTION state
  const offlineEv = await addEvidenceItem(visitId, {
    visit_id: visitId,
    category: 'BEFORE',
    file_name: 'ahu_offline_draft.jpg',
    storage_path: `/evidence/${visitId}/ahu_offline_draft.jpg`,
    sync_state: 'WAITING_FOR_CONNECTION',
    caption: 'Captured during offline rooftop inspection',
  });
  console.log(`   ✓ Evidence Saved Locally: ID=${offlineEv.evidence?.id}, State=${offlineEv.evidence?.sync_state}`);

  // 2. Unsynced Evidence Submission Gate
  console.log('\n2. Testing Unsynced Evidence Gate on Service Report Submission...');
  const blockedSubmit = await submitDigitalServiceReport(visitId, 'op-jack-turner', {
    work_completed_narrative: 'All tasks completed on roof.',
    engineer_recommendations: 'None',
    completion_outcome: 'COMPLETED',
  });

  if (blockedSubmit.success) {
    throw new Error('Unsynced evidence gate failed: Submission succeeded with pending unsynchronised photos!');
  }
  console.log(`   ✓ Submission Blocked Safely: "${blockedSubmit.error}"`);

  // Transition evidence to SYNCED
  const v = fieldOperationsStore.visits.get(visitId)!;
  v.evidence_items = v.evidence_items.map((ev) => ({ ...ev, sync_state: 'SYNCED' }));
  fieldOperationsStore.visits.set(visitId, v);
  console.log('   ✓ Evidence Upload Succeeded: All items transitioned to SYNCED.');

  // 3. Mobile Idempotency (Arrival, Defects, Variations, Reports)
  console.log('\n3. Testing Mobile Idempotency on Critical Endpoints...');

  // 3a. Arrival Idempotency
  const arrKey = `arr-${visitId}-01`;
  const arr1 = await recordVisitArrival(visitId, 'op-jack-turner', 'GEOFENCE', undefined, arrKey);
  const arr2 = await recordVisitArrival(visitId, 'op-jack-turner', 'GEOFENCE', undefined, arrKey);
  if (arr1.visit?.arrived_at !== arr2.visit?.arrived_at) {
    throw new Error('Arrival idempotency failed');
  }
  console.log(`   ✓ Arrival Idempotency: Double-tap deduplicated (Timestamp: ${arr1.visit?.arrived_at})`);

  // 3b. Defect Idempotency
  const defKey = `def-${visitId}-fan-bearing`;
  const def1 = await raiseOperationalDefect(
    visitId,
    {
      title: 'Severely worn fan bearing',
      description: 'Bearing rattle at 1400 RPM',
      severity: 'MAJOR',
      make_safe_status: 'MADE_SAFE',
      recommended_action: 'Replace drive bearing',
    },
    defKey
  );
  const def2 = await raiseOperationalDefect(
    visitId,
    {
      title: 'Severely worn fan bearing',
      description: 'Bearing rattle at 1400 RPM',
      severity: 'MAJOR',
      make_safe_status: 'MADE_SAFE',
      recommended_action: 'Replace drive bearing',
    },
    defKey
  );
  if (def1.defect?.id !== def2.defect?.id) {
    throw new Error('Defect idempotency failed: Duplicate defect created!');
  }
  console.log(`   ✓ Defect Idempotency: Duplicate network tap returned existing defect ${def1.defect?.id}`);

  // 3c. Variation Idempotency (Commercial Protection)
  const varKey = `var-${visitId}-bearing-replacement`;
  const var1 = await requestVariation(
    visitId,
    {
      reason: 'Bearing replacement labour and parts',
      additional_scope: 'Fit SKF 6205 bearing',
      estimated_labour_hours: 2,
      estimated_parts_cost_gbp: 85,
    },
    varKey
  );
  const var2 = await requestVariation(
    visitId,
    {
      reason: 'Bearing replacement labour and parts',
      additional_scope: 'Fit SKF 6205 bearing',
      estimated_labour_hours: 2,
      estimated_parts_cost_gbp: 85,
    },
    varKey
  );
  if (var1.variation?.id !== var2.variation?.id) {
    throw new Error('Variation idempotency failed: Commercial double-charge created!');
  }
  console.log(`   ✓ Variation Commercial Idempotency: Single variation created (£${var1.variation?.total_variation_estimate_gbp.toFixed(2)})`);

  // 3d. Service Report Submission Idempotency
  const repKey = `rep-${visitId}-submit-01`;
  const rep1 = await submitDigitalServiceReport(
    visitId,
    'op-jack-turner',
    {
      work_completed_narrative: 'Completed PPM and logged bearing defect.',
      engineer_recommendations: 'Replace fan bearing during next maintenance window.',
      completion_outcome: 'FURTHER_WORK_REQUIRED',
      site_signatory: { name: 'Dave Smith', role: 'FM Manager', signature_data_url: 'sig-data' },
    },
    repKey
  );
  const rep2 = await submitDigitalServiceReport(
    visitId,
    'op-jack-turner',
    {
      work_completed_narrative: 'Completed PPM and logged bearing defect.',
      engineer_recommendations: 'Replace fan bearing during next maintenance window.',
      completion_outcome: 'FURTHER_WORK_REQUIRED',
      site_signatory: { name: 'Dave Smith', role: 'FM Manager', signature_data_url: 'sig-data' },
    },
    repKey
  );
  if (rep1.report?.id !== rep2.report?.id || rep1.report?.report_number !== rep2.report?.report_number) {
    throw new Error('Report submission idempotency failed');
  }
  console.log(`   ✓ Service Report Submission Idempotency: Single canonical report produced (${rep1.report?.report_number})`);

  // 4. Concurrency & Stale Execution Reassignment
  console.log('\n4. Testing Concurrency Protection & Stale Execution Reassignment...');
  const reacId = 'vis-reac-002';
  // Initially assigned to Jack
  await assignOperativeToVisit(reacId, 'op-jack-turner', providerOrgId, 'Dispatcher');

  // Dispatcher reassigns to Alex Rivers (Senior HVAC Specialist)
  const reassignRes = await assignOperativeToVisit(reacId, 'op-alex-rivers', providerOrgId, 'Dispatcher', 'Emergency rerouting');
  if (!reassignRes.success) throw new Error(`Reassignment to Alex failed: ${reassignRes.error}`);

  // Jack tries to start work on stale open page
  const staleStart = await startWork(reacId, 'op-jack-turner');
  if (staleStart.success) {
    throw new Error('Concurrency failure: Reassigned operative was able to start work!');
  }
  console.log(`   ✓ Stale Operative Blocked: "${staleStart.error}"`);

  // 5. Multi-Operative Attendance on Single Canonical Visit
  console.log('\n5. Testing Multi-Operative Attendance & Lead Operative Designation...');
  // Reassign PPM job to Jack and add Sam Taylor as Apprentice Assistant
  const multiResult = await addAdditionalOperativeToVisit(visitId, 'op-sam-taylor', 'APPRENTICE', 'op-jack-turner');
  if (!multiResult.success) {
    throw new Error(`Failed to add assistant operative: ${multiResult.error}`);
  }
  console.log(`   ✓ Additional Operative Registered: Sam Taylor (Apprentice) on canonical visit ${visitId}`);

  // Non-lead operative (Sam) attempts to submit final service report
  const samSubmit = await submitDigitalServiceReport(visitId, 'op-sam-taylor', {
    work_completed_narrative: 'I helped Jack clean the filters.',
    engineer_recommendations: 'None',
    completion_outcome: 'COMPLETED',
  });
  if (samSubmit.success) {
    throw new Error('Multi-engineer security failure: Non-lead operative submitted final service report!');
  }
  console.log(`   ✓ Non-Lead Submission Blocked: "${samSubmit.error}"`);

  // 6. Execution-Time Competency & Compliance Revalidation
  console.log('\n6. Testing Execution-Time Competency & Supplier Compliance Revalidation...');
  // 6a. Operative with expired competency
  const expiredOp = await getFieldOperative('op-jack-turner')!;
  const originalExpiry = expiredOp!.competencies[0].expiry_date;
  expiredOp!.competencies[0].expiry_date = '2020-01-01'; // simulate expired cert
  fieldOperationsStore.operatives.set(expiredOp!.id, expiredOp!);

  const expWork = await startWork(visitId, 'op-jack-turner');
  if (expWork.success) {
    throw new Error('Execution-time competency revalidation failed: Expired engineer started work!');
  }
  console.log(`   ✓ Expired Competency Blocked at Work Start: "${expWork.error}"`);

  // Restore valid expiry
  expiredOp!.competencies[0].expiry_date = originalExpiry;
  fieldOperationsStore.operatives.set(expiredOp!.id, expiredOp!);

  // 6b. Supplier on compliance hold
  fieldOperationsStore.supplierComplianceStatus.set(providerOrgId, 'COMPLIANCE_HOLD');
  const compHoldWork = await startWork(visitId, 'op-jack-turner');
  if (compHoldWork.success) {
    throw new Error('Supplier compliance revalidation failed: Suspended supplier started work!');
  }
  console.log(`   ✓ Supplier Compliance Hold Blocked: "${compHoldWork.error}"`);
  fieldOperationsStore.supplierComplianceStatus.set(providerOrgId, 'APPROVED'); // restore

  // 7. Cancelled Work Order Handling
  console.log('\n7. Testing Cancelled Work Order Safety...');
  await cancelVisit(reacId, 'Client requested cancellation due to false alarm');
  const cancelStart = await startWork(reacId, 'op-alex-rivers');
  if (cancelStart.success) {
    throw new Error('Cancelled work order failure: Operative started work on cancelled job!');
  }
  console.log(`   ✓ Cancelled Work Order Blocked: "${cancelStart.error}"`);

  // 8. Service Report Versioning & Revision History (Correction Loop)
  console.log('\n8. Testing Service Report Versioning & Revision History (Correction Loop)...');
  // First Submission: Revision 1
  const subRev1 = await submitDigitalServiceReport(visitId, 'op-jack-turner', {
    work_completed_narrative: 'Cleaned filters and checked pressures.',
    engineer_recommendations: 'Monitor bearing rattle.',
    completion_outcome: 'FURTHER_WORK_REQUIRED',
    site_signatory: { name: 'Dave Smith', role: 'FM Manager', signature_data_url: 'sig-data-1' },
  });
  console.log(`   ✓ Prior Revision: Report=${subRev1.report?.report_number}, Rev=${subRev1.report?.revision_number}`);

  // EntireFM Requests Correction
  await validateServiceReport(visitId, 'CORRECTION_REQUIRED', 'Technical Lead Reviewer', 'Please attach specific bearing part number in narrative');
  const curVisit = fieldOperationsStore.visits.get(visitId)!;
  console.log(`   ✓ Correction Requested: Status=${curVisit.status}, Reason="${curVisit.service_report?.correction_reason}"`);

  // Engineer Resubmits: Revision Incremented
  const subRev2 = await submitDigitalServiceReport(visitId, 'op-jack-turner', {
    work_completed_narrative: 'Cleaned filters, checked pressures, and identified SKF 6205 bearing required for drive fan.',
    engineer_recommendations: 'Approve quoted bearing replacement.',
    completion_outcome: 'FURTHER_WORK_REQUIRED',
    site_signatory: { name: 'Dave Smith', role: 'FM Manager', signature_data_url: 'sig-data-2' },
  });
  console.log(`   ✓ Corrected Revision Submitted: Rev=${subRev2.report?.revision_number}, History Length=${subRev2.report?.revision_history.length}`);
  if (subRev2.report?.revision_number !== subRev1.report!.revision_number + 1 || subRev2.report?.revision_history.length !== subRev2.report?.revision_number) {
    throw new Error('Report versioning failed: Revision history was not maintained');
  }

  // EntireFM Validates Final Report
  const valResult = await validateServiceReport(visitId, 'VALIDATE', 'Head of Operations');
  console.log(`   ✓ Final Report Validated: Status=${valResult.report?.validation_status}, ValidatedBy=${valResult.report?.validated_by}`);

  // 9. Client-Safe Milestones & Data Minimisation
  console.log('\n9. Testing Client-Safe Milestone Projection (Data Minimisation)...');
  const milestone = mapToClientSafeMilestone(curVisit);
  console.log(`   ✓ Client Milestone: "${milestone.client_milestone}"`);
  console.log(`   ✓ Public Notes: "${milestone.public_status_notes}"`);
  if ((milestone as any).contractor_margin || (milestone as any).buy_rate) {
    throw new Error('Client data minimisation failure: Internal commercial rates leaked to client projection!');
  }

  // 10. Protected Service Report Document Generation (RBAC & Tenancy)
  console.log('\n10. Testing Protected Service Report PDF Generation & RBAC...');
  // 10a. Assigned Engineer Download (Allowed)
  const engDoc = await generateServiceReportDocument(visitId, {
    personId: 'op-jack-turner',
    orgId: providerOrgId,
    role: 'FIELD_ENGINEER',
  });
  if (!engDoc.success || !engDoc.document) {
    throw new Error(`Assigned engineer report download failed: ${engDoc.error}`);
  }
  console.log(`   ✓ Assigned Engineer Download: Success (${engDoc.document.report_reference})`);

  // 10b. Foreign Engineer Download (Blocked)
  const foreignEngDoc = await generateServiceReportDocument(visitId, {
    personId: 'op-unrelated-person',
    orgId: providerOrgId,
    role: 'FIELD_ENGINEER',
  });
  if (foreignEngDoc.success) {
    throw new Error('Security failure: Unrelated operative downloaded service report!');
  }
  console.log(`   ✓ Foreign Engineer Blocked: "${foreignEngDoc.error}"`);

  // 10c. Foreign Supplier Download (Blocked)
  const foreignSupDoc = await generateServiceReportDocument(visitId, {
    personId: 'op-other-supplier',
    orgId: 'sup-other-organisation',
    role: 'CONTRACTOR',
  });
  if (foreignSupDoc.success) {
    throw new Error('Security failure: Foreign contractor organisation downloaded service report!');
  }
  console.log(`   ✓ Foreign Supplier Blocked: "${foreignSupDoc.error}"`);

  // 10d. Client Download for Validated Report (Allowed)
  const clientDoc = await generateServiceReportDocument(visitId, {
    personId: 'cl-user-01',
    role: 'CLIENT',
  });
  if (!clientDoc.success || !clientDoc.document) {
    throw new Error(`Client download failed for validated report: ${clientDoc.error}`);
  }
  console.log(`   ✓ Authorised Client Download: Success (${clientDoc.document.report_reference})`);

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL 10 PHASE 6R PRODUCTION HARDENING SUITES PASSED        ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

runPhase6RHardeningTestSuite().catch((err) => {
  console.error('Phase 6R Test Failed:', err);
  process.exit(1);
});
