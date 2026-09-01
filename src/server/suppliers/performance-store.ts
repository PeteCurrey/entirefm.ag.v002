import {
  SupplierScorecard,
  SupplierQualityDefectRecord,
  PerformanceImprovementPlan,
  SupplierPerformanceReviewRecord,
  ServiceBenchmarkMedian,
  PerformanceStatus,
  SupplierAllocationSuitability,
} from './performance-types';
import { listSupplierOrganisations } from './store';
import { listServiceApprovals, listGeographicApprovals, listComplianceHolds } from './assurance-store';
import { evaluateAllocationSuitability } from './performance-engine';
import { dbQuery, isDbConfigured } from '@/server/db/client';

function isUuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function getOwnerFilter(supplierId: string): string {
  return isUuid(supplierId)
    ? `organisation_id=eq.${supplierId}`
    : `supplier_org_id=eq.${encodeURIComponent(supplierId)}`;
}

function getOwnerInsert(supplierId: string): { organisation_id?: string; supplier_org_id?: string } {
  return isUuid(supplierId)
    ? { organisation_id: supplierId, supplier_org_id: undefined }
    : { supplier_org_id: supplierId, organisation_id: undefined };
}

function mapDbScorecardToRecord(sc: any): SupplierScorecard {
  return {
    supplier_id: sc.organisation_id || sc.supplier_org_id || '',
    supplier_name: sc.supplier_name || 'Contractor',
    measurement_window: sc.measurement_window || '90_DAYS',
    overall_status: sc.overall_status || 'INSUFFICIENT_DATA',
    overall_performance_index: Number(sc.overall_performance_index || 0),
    total_completed_jobs: Number(sc.total_completed_jobs || 0),
    sufficiency_status: sc.sufficiency_status || 'NO_DATA',
    sla_attendance_rate: sc.sla_attendance_rate || {
      metric_code: 'SLA_ATTENDANCE',
      metric_name: 'SLA Attendance Rate',
      value: 0,
      unit: '%',
      sample_size: 0,
      sufficiency_status: 'NO_DATA',
      target_threshold: 90.0,
      is_meeting_target: false,
      trend: 'INSUFFICIENT_HISTORY',
    },
    first_time_fix_rate: sc.first_time_fix_rate || {
      metric_code: 'FIRST_TIME_FIX',
      metric_name: 'First-Time Fix Rate',
      value: 0,
      unit: '%',
      sample_size: 0,
      sufficiency_status: 'NO_DATA',
      target_threshold: 80.0,
      is_meeting_target: false,
      trend: 'INSUFFICIENT_HISTORY',
    },
    attendance_reliability_rate: sc.attendance_reliability_rate || {
      metric_code: 'ATTENDANCE_RELIABILITY',
      metric_name: 'Attendance Reliability',
      value: 0,
      unit: '%',
      sample_size: 0,
      sufficiency_status: 'NO_DATA',
      target_threshold: 95.0,
      is_meeting_target: false,
      trend: 'INSUFFICIENT_HISTORY',
    },
    evidence_acceptance_rate: sc.evidence_acceptance_rate || {
      metric_code: 'EVIDENCE_QUALITY',
      metric_name: 'Service Report Acceptance',
      value: 0,
      unit: '%',
      sample_size: 0,
      sufficiency_status: 'NO_DATA',
      target_threshold: 90.0,
      is_meeting_target: false,
      trend: 'INSUFFICIENT_HISTORY',
    },
    invoice_accuracy_rate: sc.invoice_accuracy_rate || {
      metric_code: 'INVOICE_ACCURACY',
      metric_name: 'Invoice First-Time Match',
      value: 0,
      unit: '%',
      sample_size: 0,
      sufficiency_status: 'NO_DATA',
      target_threshold: 95.0,
      is_meeting_target: false,
      trend: 'INSUFFICIENT_HISTORY',
    },
    client_feedback_rating: sc.client_feedback_rating || {
      metric_code: 'CLIENT_FEEDBACK',
      metric_name: 'Client Feedback Score',
      value: 0,
      unit: 'rating',
      sample_size: 0,
      sufficiency_status: 'NO_DATA',
      target_threshold: 4.0,
      is_meeting_target: false,
      trend: 'INSUFFICIENT_HISTORY',
    },
    safety_incident_count: sc.safety_incident_count || {
      metric_code: 'SAFETY_INCIDENTS',
      metric_name: 'Recordable H&S Incidents',
      value: 0,
      unit: 'count',
      sample_size: 0,
      sufficiency_status: 'REPORTABLE',
      target_threshold: 0,
      is_meeting_target: true,
      trend: 'STABLE',
    },
    service_breakdowns: sc.service_breakdowns || [],
    geographic_breakdowns: sc.geographic_breakdowns || [],
    active_pip_id: sc.active_pip_id || undefined,
    eligible_for_preferred_review: Boolean(sc.eligible_for_preferred_review),
    last_calculated_at: sc.last_calculated_at || sc.updated_at || new Date().toISOString(),
  };
}

/**
 * 1. GET OR GENERATE SUPPLIER SCORECARD
 */
export async function getSupplierScorecard(supplierId: string): Promise<SupplierScorecard | null> {
  if (!isDbConfigured()) return null;

  const { data } = await dbQuery<any[]>(
    `supplier_scorecards?${getOwnerFilter(supplierId)}&limit=1`
  );
  if (!data || data.length === 0) return null;

  return mapDbScorecardToRecord(data[0]);
}

export async function listSupplierScorecards(): Promise<SupplierScorecard[]> {
  if (!isDbConfigured()) return [];

  const { data } = await dbQuery<any[]>('supplier_scorecards?order=overall_performance_index.desc');
  if (!data) return [];

  return data.map(mapDbScorecardToRecord);
}

/**
 * 2. QUALITY DEFECT MANAGEMENT
 */
export async function logQualityDefect(
  defect: Omit<SupplierQualityDefectRecord, 'id' | 'raised_at'>
): Promise<SupplierQualityDefectRecord> {
  const id = `def-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(defect.supplier_id);

  const record: SupplierQualityDefectRecord = {
    ...defect,
    id,
    raised_at: now,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_quality_defects', {
      method: 'POST',
      body: {
        id,
        ...ownerCols,
        work_order_id: defect.work_order_id,
        service_slug: defect.service_slug,
        site_id: defect.site_id || null,
        issue_title: defect.issue_title,
        description: defect.description,
        severity: defect.severity,
        raised_by: defect.raised_by,
        raised_at: now,
        root_cause: defect.root_cause,
        is_supplier_attributable: defect.is_supplier_attributable,
        remediation_required: defect.remediation_required,
        resolved_at: defect.resolved_at || null,
        resolution_notes: defect.resolution_notes || null,
      },
    });
  }

  return record;
}

export async function listQualityDefects(supplierId?: string): Promise<SupplierQualityDefectRecord[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_quality_defects?${getOwnerFilter(supplierId)}&order=raised_at.desc`
    : 'supplier_quality_defects?order=raised_at.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    supplier_id: d.organisation_id || d.supplier_org_id || '',
    work_order_id: d.work_order_id,
    service_slug: d.service_slug,
    site_id: d.site_id || undefined,
    issue_title: d.issue_title,
    description: d.description,
    severity: d.severity,
    raised_by: d.raised_by,
    raised_at: d.raised_at,
    root_cause: d.root_cause,
    is_supplier_attributable: Boolean(d.is_supplier_attributable),
    remediation_required: d.remediation_required,
    resolved_at: d.resolved_at || undefined,
    resolution_notes: d.resolution_notes || undefined,
  }));
}

/**
 * 3. PERFORMANCE IMPROVEMENT PLANS (PIPs)
 */
export async function createPerformanceImprovementPlan(
  pip: Omit<PerformanceImprovementPlan, 'id' | 'status' | 'start_date'>
): Promise<PerformanceImprovementPlan> {
  const id = `pip-${Date.now()}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(pip.supplier_id);

  const record: PerformanceImprovementPlan = {
    ...pip,
    id,
    status: 'ACTIVE',
    start_date: now,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_performance_improvement_plans', {
      method: 'POST',
      body: {
        id,
        ...ownerCols,
        supplier_name: pip.supplier_name,
        reason: pip.reason,
        target_metrics: pip.target_metrics || [],
        action_plan: pip.action_plan,
        owner_role: pip.owner_role,
        supplier_contact: pip.supplier_contact,
        start_date: now,
        target_date: pip.target_date,
        status: 'ACTIVE',
        review_notes: pip.review_notes || null,
        closed_at: pip.closed_at || null,
        closed_by: pip.closed_by || null,
      },
    });

    // Link to scorecard if exists
    await dbQuery(`supplier_scorecards?${getOwnerFilter(pip.supplier_id)}`, {
      method: 'PATCH',
      body: {
        active_pip_id: id,
        overall_status: 'IMPROVEMENT_REQUIRED',
        updated_at: now,
      },
    });
  }

  return record;
}

export async function listPerformanceImprovementPlans(supplierId?: string): Promise<PerformanceImprovementPlan[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_performance_improvement_plans?${getOwnerFilter(supplierId)}&order=start_date.desc`
    : 'supplier_performance_improvement_plans?order=start_date.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((p) => ({
    id: p.id,
    supplier_id: p.organisation_id || p.supplier_org_id || '',
    supplier_name: p.supplier_name,
    reason: p.reason,
    target_metrics: p.target_metrics || [],
    action_plan: p.action_plan,
    owner_role: p.owner_role,
    supplier_contact: p.supplier_contact,
    start_date: p.start_date,
    target_date: p.target_date,
    status: p.status,
    review_notes: p.review_notes || undefined,
    closed_at: p.closed_at || undefined,
    closed_by: p.closed_by || undefined,
  }));
}

/**
 * 4. PERFORMANCE REVIEWS & QBRs
 */
export async function savePerformanceReview(
  review: Omit<SupplierPerformanceReviewRecord, 'id' | 'conducted_at'>
): Promise<SupplierPerformanceReviewRecord> {
  const id = `rev-${Date.now()}`;
  const now = new Date().toISOString();
  const ownerCols = getOwnerInsert(review.supplier_id);

  const record: SupplierPerformanceReviewRecord = {
    ...review,
    id,
    conducted_at: now,
  };

  if (isDbConfigured()) {
    await dbQuery('supplier_performance_reviews', {
      method: 'POST',
      body: {
        id,
        ...ownerCols,
        review_period: review.review_period,
        review_type: review.review_type,
        reviewer_name: review.reviewer_name,
        reviewer_role: review.reviewer_role,
        attendees: review.attendees || [],
        metrics_snapshot: review.metrics_snapshot || {},
        strengths: review.strengths || [],
        areas_for_improvement: review.areas_for_improvement || [],
        decisions: review.decisions || [],
        relationship_tier_recommendation: review.relationship_tier_recommendation || null,
        next_review_date: review.next_review_date,
        conducted_at: now,
      },
    });
  }

  return record;
}

export async function listPerformanceReviews(supplierId?: string): Promise<SupplierPerformanceReviewRecord[]> {
  if (!isDbConfigured()) return [];

  const endpoint = supplierId
    ? `supplier_performance_reviews?${getOwnerFilter(supplierId)}&order=conducted_at.desc`
    : 'supplier_performance_reviews?order=conducted_at.desc';

  const { data } = await dbQuery<any[]>(endpoint);
  if (!data) return [];

  return data.map((r) => ({
    id: r.id,
    supplier_id: r.organisation_id || r.supplier_org_id || '',
    review_period: r.review_period,
    review_type: r.review_type,
    reviewer_name: r.reviewer_name,
    reviewer_role: r.reviewer_role,
    attendees: r.attendees || [],
    metrics_snapshot: r.metrics_snapshot || {
      total_jobs: 0,
      sla_attendance_rate: 0,
      first_time_fix_rate: 0,
      evidence_quality_rate: 0,
      invoice_accuracy_rate: 0,
      client_feedback_score: 0,
    },
    strengths: r.strengths || [],
    areas_for_improvement: r.areas_for_improvement || [],
    decisions: r.decisions || [],
    relationship_tier_recommendation: r.relationship_tier_recommendation || undefined,
    next_review_date: r.next_review_date,
    conducted_at: r.conducted_at,
  }));
}

/**
 * 5. BENCHMARKS
 */
export async function listServiceBenchmarks(): Promise<ServiceBenchmarkMedian[]> {
  if (!isDbConfigured()) return [];

  const { data } = await dbQuery<any[]>('supplier_service_benchmarks?order=service_name.asc');
  if (!data) return [];

  return data.map((b) => ({
    service_slug: b.service_slug,
    service_name: b.service_name,
    region_or_city: b.region_or_city,
    total_suppliers_measured: Number(b.total_suppliers_measured || 0),
    median_sla_rate: Number(b.median_sla_rate || 0),
    median_ftf_rate: Number(b.median_ftf_rate || 0),
    median_evidence_rate: Number(b.median_evidence_rate || 0),
    updated_at: b.updated_at,
  }));
}

/**
 * 6. ALLOCATION SUITABILITY ENGINE QUERY
 */
export async function querySupplierAllocationSuitability(params: {
  serviceSlug: string;
  cityOrRegion: string;
}): Promise<SupplierAllocationSuitability[]> {
  const suppliers = await listSupplierOrganisations();

  const results = await Promise.all(
    suppliers.map(async (supplier) => {
      const [scorecard, srvApprovals, geoApprovals, holds] = await Promise.all([
        getSupplierScorecard(supplier.id),
        listServiceApprovals(supplier.id),
        listGeographicApprovals(supplier.id),
        listComplianceHolds(supplier.id),
      ]);

      return evaluateAllocationSuitability({
        supplier,
        serviceSlug: params.serviceSlug,
        cityOrRegion: params.cityOrRegion,
        scorecard,
        serviceApprovals: srvApprovals,
        geographicApprovals: geoApprovals,
        activeHolds: holds,
        currentOpenJobsCount: 0,
        distanceMiles: 10.0,
      });
    })
  );

  return results.sort((a, b) => {
    if (a.is_eligible && !b.is_eligible) return -1;
    if (!a.is_eligible && b.is_eligible) return 1;
    return b.suitability_score - a.suitability_score;
  });
}
