import {
  fieldOperationsStore,
  listFieldOperatives,
  getFieldOperative,
  evaluateOperativeCompetencyForJob,
  listVisitsForProvider,
  listTodayVisitsForEngineer,
  getVisitById,
  assignOperativeToVisit,
  acknowledgeVisit,
  startJourney,
  recordVisitArrival,
  recordVisitNoAccess,
  startWork,
  updatePpmTask,
  addEvidenceItem,
  raiseOperationalDefect,
  requestVariation,
  recordOperationalPart,
  submitDigitalServiceReport,
  validateServiceReport,
} from '../src/server/field/operations-store';

async function runPhase6FieldOperationsTestSuite() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM CAFM PHASE 6 — FIELD OPERATIONS & EXECUTION SUITE ');
  console.log('══════════════════════════════════════════════════════════════\n');

  const providerOrgId = 'sup-test-01';
  const visitId = 'vis-ppm-001';

  // 1. Person vs Organisation Architecture
  console.log('1. Testing Person vs Supplier Organisation Separation...');
  const operatives = await listFieldOperatives(providerOrgId);
  console.log(`   ✓ Supplier Organisation: ${providerOrgId} has ${operatives.length} registered field operatives.`);
  const jack = await getFieldOperative('op-jack-turner');
  const dave = await getFieldOperative('op-dave-miller');
  if (!jack || !dave) throw new Error('Failed to load registered operatives');
  console.log(`   ✓ Operative 1: ${jack.first_name} ${jack.last_name} (${jack.role}) — Trades: ${jack.assigned_trades.join(', ')}`);
  console.log(`   ✓ Operative 2: ${dave.first_name} ${dave.last_name} (${dave.role}) — Trades: ${dave.assigned_trades.join(', ')}`);

  // 2. Strict Competency Gating Engine
  console.log('\n2. Testing Competency Gating Engine during Dispatcher Assignment...');
  const hvacEvalDave = evaluateOperativeCompetencyForJob(dave, 'HVAC');
  console.log(`   ✓ Dave Miller (Building Fabric) evaluated for HVAC: Competent=${hvacEvalDave.competent}`);
  if (hvacEvalDave.competent) {
    throw new Error('Competency gating failed: Dave was evaluated as competent for HVAC without F-Gas!');
  }
  console.log(`   ✓ Competency Block Reason: "${hvacEvalDave.reason}"`);

  const assignDaveResult = await assignOperativeToVisit(visitId, dave.id, providerOrgId, 'Test Controller');
  if (assignDaveResult.success) {
    throw new Error('Competency gating failed: Dave was successfully assigned to HVAC job!');
  }
  console.log(`   ✓ Dispatcher Block: "${assignDaveResult.error}"`);

  const assignJackResult = await assignOperativeToVisit(visitId, jack.id, providerOrgId, 'Test Controller');
  if (!assignJackResult.success) {
    throw new Error(`Failed to assign competent operative Jack: ${assignJackResult.error}`);
  }
  console.log(`   ✓ Dispatcher Success: ${assignJackResult.visit?.assigned_engineer_name} assigned with verified F-Gas competency.`);

  // 3. Job Acknowledgement & Decline
  console.log('\n3. Testing Field Operative Job Acknowledgement & Decline Workflow...');
  const ackResult = await acknowledgeVisit(visitId, jack.id, 'ACCEPT');
  if (!ackResult.success || ackResult.visit?.status !== 'ACKNOWLEDGED') {
    throw new Error('Job acknowledgement failed');
  }
  console.log(`   ✓ Job Acknowledged: Status=${ackResult.visit?.status}`);

  // Test Decline on reactive job
  const reacVisitId = 'vis-reac-002';
  const declineResult = await acknowledgeVisit(reacVisitId, jack.id, 'DECLINE', 'Emergency attendance on another site');
  if (!declineResult.success || declineResult.visit?.status !== 'AWARDED') {
    throw new Error('Job decline workflow failed');
  }
  console.log(`   ✓ Job Declined & Returned to Pool: Status=${declineResult.visit?.status}`);

  // Reassign reactive job back to Jack for execution
  await assignOperativeToVisit(reacVisitId, jack.id, providerOrgId, 'Test Controller');
  await acknowledgeVisit(reacVisitId, jack.id, 'ACCEPT');

  // 4. Digital Job Pack Assembly
  console.log('\n4. Testing Digital Job Pack Assembly (Site, Asset, RAMS)...');
  const visit = await getVisitById(visitId);
  if (!visit) throw new Error('Visit not found');
  const jp = visit.job_pack;
  console.log(`   ✓ Work Order: ${jp.work_order_number} (${jp.title})`);
  console.log(`   ✓ Site: ${jp.site.name} (Access Tel: ${jp.site.access_telephone})`);
  console.log(`   ✓ Hazards: ${jp.site.known_hazards.join('; ')}`);
  console.log(`   ✓ Asset: ${jp.asset?.name} (Tag: ${jp.asset?.asset_tag}, Criticality: ${jp.asset?.criticality})`);
  console.log(`   ✓ RAMS: ${jp.rams.title} (${jp.rams.version})`);

  // 5. Journey Start & Live ETA
  console.log('\n5. Testing Journey Start & Live ETA Transmission...');
  const journeyResult = await startJourney(visitId, jack.id, '08:45');
  if (!journeyResult.success || journeyResult.visit?.status !== 'TRAVELLING') {
    throw new Error('Journey start failed');
  }
  console.log(`   ✓ Journey Started: Status=${journeyResult.visit?.status}, ETA=${journeyResult.visit?.eta_time}`);

  // 6. Multi-Modal Check-In (Geofence / QR / NFC / Manual)
  console.log('\n6. Testing Multi-Modal Arrival & Site Check-In...');
  const arrivalResult = await recordVisitArrival(visitId, jack.id, 'GEOFENCE', { lat: 52.4862, lng: -1.8904 });
  if (!arrivalResult.success || arrivalResult.visit?.status !== 'ARRIVED') {
    throw new Error('Arrival check-in failed');
  }
  console.log(`   ✓ Arrived on Site: Status=${arrivalResult.visit?.status}, Method=${arrivalResult.visit?.arrival_method}`);

  // 7. Work Start & Adaptive PPM Execution
  console.log('\n7. Testing Work Start & Adaptive PPM Task Measurements...');
  const workResult = await startWork(visitId, jack.id);
  if (!workResult.success || workResult.visit?.status !== 'IN_PROGRESS') {
    throw new Error('Work start failed');
  }
  console.log(`   ✓ Work Started: Status=${workResult.visit?.status}, StartedAt=${workResult.visit?.work_started_at}`);

  // Update PPM Task 1 (Pass/Fail)
  await updatePpmTask(visitId, 'tsk-01', { recorded_status: 'PASS' });
  await updatePpmTask(visitId, 'tsk-02', { recorded_status: 'PASS' });

  // Update PPM Task 3 (Measurement in tolerance)
  const tempTask = await updatePpmTask(visitId, 'tsk-03', { recorded_measurement: 18.5 });
  const t3 = tempTask.visit?.ppm_tasks.find((t) => t.id === 'tsk-03');
  console.log(`   ✓ Measurement Recorded: Supply Temp=${t3?.recorded_measurement}°C, OutOfTolerance=${t3?.is_out_of_tolerance}`);

  // Update PPM Task 4 (Measurement out of tolerance)
  const pressTask = await updatePpmTask(visitId, 'tsk-04', { recorded_measurement: 6.8 });
  const t4 = pressTask.visit?.ppm_tasks.find((t) => t.id === 'tsk-04');
  console.log(`   ✓ Tolerance Breach Detected: Pressure=${t4?.recorded_measurement} bar, OutOfTolerance=${t4?.is_out_of_tolerance}`);
  if (!t4?.is_out_of_tolerance) throw new Error('Tolerance breach check failed');

  await updatePpmTask(visitId, 'tsk-05', { recorded_status: 'PASS' });

  // 8. Photo Evidence Capture & Offline Sync State
  console.log('\n8. Testing Camera-First Evidence Capture & Sync State...');
  const evBefore = await addEvidenceItem(visitId, {
    visit_id: visitId,
    category: 'BEFORE',
    file_name: 'ahu_roof_before_work.jpg',
    storage_path: `/evidence/${visitId}/ahu_roof_before_work.jpg`,
    caption: 'Initial condition of AHU filter and coil bank',
  });
  const evAfter = await addEvidenceItem(visitId, {
    visit_id: visitId,
    category: 'AFTER',
    file_name: 'ahu_roof_after_work.jpg',
    storage_path: `/evidence/${visitId}/ahu_roof_after_work.jpg`,
    caption: 'Cleaned coil bank and new filters installed',
  });
  console.log(`   ✓ Evidence Captured: Before (${evBefore.evidence?.id}, Sync: ${evBefore.evidence?.sync_state})`);
  console.log(`   ✓ Evidence Captured: After (${evAfter.evidence?.id}, Sync: ${evAfter.evidence?.sync_state})`);

  // 9. Defect & Make-Safe Protocol
  console.log('\n9. Testing Defect Capture, Make-Safe & Stop-Work Protocol...');
  const defectResult = await raiseOperationalDefect(visitId, {
    title: 'High discharge refrigerant pressure',
    description: 'Compressor discharge pressure elevated to 6.8 bar due to partially restricted expansion valve.',
    severity: 'MAJOR',
    make_safe_status: 'MADE_SAFE',
    recommended_action: 'Replace thermostatic expansion valve on next service cycle.',
    stop_work_triggered: false,
  });
  console.log(`   ✓ Defect Raised: ${defectResult.defect?.id} (Severity: ${defectResult.defect?.severity}, MakeSafe: ${defectResult.defect?.make_safe_status})`);

  // 10. Variation & NTE Limit Controls
  console.log('\n10. Testing Variation Request & NTE Limit Enforcement...');
  const varResult = await requestVariation(visitId, {
    reason: 'Expansion valve replacement remedial work',
    additional_scope: 'Supply and fit genuine Danfoss TXV, evacuate circuit, and recharge R410A.',
    estimated_labour_hours: 3.0,
    estimated_parts_cost_gbp: 220.0,
  });
  console.log(`   ✓ Variation Calculated: Est=£${varResult.variation?.total_variation_estimate_gbp.toFixed(2)}, NTE Breached=${varResult.variation?.nte_breached}`);

  // 11. Parts Recording & Awaiting Delivery
  console.log('\n11. Testing Parts Recording & Awaiting Parts State...');
  const partResult = await recordOperationalPart(visitId, {
    part_name: 'Danfoss Thermostatic Expansion Valve R410A',
    manufacturer: 'Danfoss',
    part_number: 'TXV-410-02',
    quantity: 1,
    is_installed: false,
    is_awaiting_delivery: true,
    expected_arrival_date: '2026-09-02',
  });
  console.log(`   ✓ Part Logged: ${partResult.part?.part_name} (Awaiting Delivery=${partResult.part?.is_awaiting_delivery})`);

  // 12. Digital Service Report Assembly (EFM-FSR-YYYY-NNNNNN)
  console.log('\n12. Testing Digital Service Report Assembly & Submission...');
  const reportResult = await submitDigitalServiceReport(visitId, jack.id, {
    work_completed_narrative: 'Completed planned quarterly maintenance on Daikin AHU. Replaced filter media and logged TXV defect.',
    engineer_recommendations: 'Approve quoted TXV replacement to restore optimal refrigerant pressures.',
    completion_outcome: 'FURTHER_WORK_REQUIRED',
    site_signatory: {
      name: 'Dave Smith',
      role: 'Facilities Coordinator',
      signature_data_url: 'data:image/svg+xml;utf8,<svg>Dave_Smith_SignOff</svg>',
    },
  });

  if (!reportResult.success || !reportResult.report) {
    throw new Error(`Report submission failed: ${reportResult.error}`);
  }
  console.log(`   ✓ Service Report Submitted: ${reportResult.report.report_number}`);
  console.log(`   ✓ Signatory: ${reportResult.report.site_signatory?.name} (${reportResult.report.site_signatory?.role})`);
  console.log(`   ✓ Outcome: ${reportResult.report.completion_outcome}`);
  console.log(`   ✓ Status: ${reportResult.report.validation_status}`);

  // 13. EntireFM Operations Validation & Correction Loop
  console.log('\n13. Testing EntireFM Operations Review & Validation...');
  const valResult = await validateServiceReport(visitId, 'VALIDATE', 'Head of Facilities Operations');
  if (!valResult.success || valResult.report?.validation_status !== 'VALIDATED') {
    throw new Error('EntireFM report validation failed');
  }
  console.log(`   ✓ Report Validated by EntireFM: Status=${valResult.report?.validation_status}, Reviewer=${valResult.report?.validated_by}`);

  // 14. No Access Scenario on Separate Job
  console.log('\n14. Testing No Access Workflow & SLA Pause on Reactive Visit...');
  const noAccessResult = await recordVisitNoAccess(reacVisitId, jack.id, {
    reason: 'Access denied by tenant / Server room locked',
    contact_attempted: true,
    contact_notes: 'Spoke with reception; keyholder Dave Smith off site until 14:00.',
  });
  console.log(`   ✓ No Access Recorded: Status=${noAccessResult.visit?.status}, SLA Paused=${noAccessResult.visit?.no_access?.sla_paused}`);
  if (!noAccessResult.visit?.no_access?.sla_paused) {
    throw new Error('SLA pause attribution failed on No Access event');
  }

  // 15. Cross-Tenant Security & Isolation
  console.log('\n15. Testing Cross-Tenant Security & Data Isolation...');
  const foreignVisit = await getVisitById(visitId, 'sup-other-organisation');
  if (foreignVisit !== null) {
    throw new Error('Cross-tenant data leakage: Foreign supplier retrieved visit belonging to another organisation!');
  }
  console.log(`   ✓ Verified: Cross-tenant access strictly blocked (Returns null).`);

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ✓ ALL 15 PHASE 6 FIELD OPERATIONS TEST SUITES PASSED        ');
  console.log('══════════════════════════════════════════════════════════════\n');
}

runPhase6FieldOperationsTestSuite().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
