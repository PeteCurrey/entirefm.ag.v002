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

class SupplierPerformanceMemoryStore {
  public scorecards = new Map<string, SupplierScorecard>();
  public qualityDefects = new Map<string, SupplierQualityDefectRecord>();
  public pips = new Map<string, PerformanceImprovementPlan>();
  public reviews = new Map<string, SupplierPerformanceReviewRecord>();
  public benchmarks: ServiceBenchmarkMedian[] = [];

  constructor() {
    this.seedInitialPerformanceData();
  }

  private seedInitialPerformanceData() {
    // 1. Apex HVAC Scorecard (sup-01: High Performing)
    const apexScorecard: SupplierScorecard = {
      supplier_id: 'sup-01',
      supplier_name: 'Apex Mechanical & HVAC Services Ltd',
      measurement_window: '90_DAYS',
      overall_status: 'EXCELLENT',
      overall_performance_index: 93,
      total_completed_jobs: 142,
      sufficiency_status: 'REPORTABLE',
      sla_attendance_rate: {
        metric_code: 'SLA_ATTENDANCE',
        metric_name: 'SLA Attendance Rate',
        value: 94.8,
        unit: '%',
        sample_size: 142,
        sufficiency_status: 'REPORTABLE',
        target_threshold: 90.0,
        is_meeting_target: true,
        trend: 'IMPROVING',
      },
      first_time_fix_rate: {
        metric_code: 'FIRST_TIME_FIX',
        metric_name: 'First-Time Fix Rate',
        value: 88.5,
        unit: '%',
        sample_size: 142,
        sufficiency_status: 'REPORTABLE',
        target_threshold: 80.0,
        is_meeting_target: true,
        trend: 'STABLE',
      },
      attendance_reliability_rate: {
        metric_code: 'ATTENDANCE_RELIABILITY',
        metric_name: 'Attendance Reliability',
        value: 98.2,
        unit: '%',
        sample_size: 142,
        sufficiency_status: 'REPORTABLE',
        target_threshold: 95.0,
        is_meeting_target: true,
        trend: 'STABLE',
      },
      evidence_acceptance_rate: {
        metric_code: 'EVIDENCE_QUALITY',
        metric_name: 'Service Report Acceptance',
        value: 96.0,
        unit: '%',
        sample_size: 142,
        sufficiency_status: 'REPORTABLE',
        target_threshold: 90.0,
        is_meeting_target: true,
        trend: 'IMPROVING',
      },
      invoice_accuracy_rate: {
        metric_code: 'INVOICE_ACCURACY',
        metric_name: 'Invoice First-Time Match',
        value: 99.1,
        unit: '%',
        sample_size: 110,
        sufficiency_status: 'REPORTABLE',
        target_threshold: 95.0,
        is_meeting_target: true,
        trend: 'STABLE',
      },
      client_feedback_rating: {
        metric_code: 'CLIENT_FEEDBACK',
        metric_name: 'Client Feedback Score',
        value: 4.8,
        unit: 'rating',
        sample_size: 38,
        sufficiency_status: 'REPORTABLE',
        target_threshold: 4.0,
        is_meeting_target: true,
        trend: 'IMPROVING',
      },
      safety_incident_count: {
        metric_code: 'SAFETY_INCIDENTS',
        metric_name: 'Recordable H&S Incidents',
        value: 0,
        unit: 'count',
        sample_size: 142,
        sufficiency_status: 'REPORTABLE',
        target_threshold: 0,
        is_meeting_target: true,
        trend: 'STABLE',
      },
      service_breakdowns: [
        {
          service_slug: 'hvac',
          service_name: 'HVAC & Chillers',
          sample_size: 112,
          sla_attendance_rate: 95.5,
          first_time_fix_rate: 89.2,
          evidence_acceptance_rate: 97.0,
          status: 'EXCELLENT',
        },
        {
          service_slug: 'refrigeration',
          service_name: 'Commercial Refrigeration',
          sample_size: 30,
          sla_attendance_rate: 92.0,
          first_time_fix_rate: 85.0,
          evidence_acceptance_rate: 92.5,
          status: 'GOOD',
        },
      ],
      geographic_breakdowns: [
        {
          region_or_city: 'Manchester',
          sample_size: 98,
          sla_attendance_rate: 96.2,
          first_time_fix_rate: 90.1,
          status: 'EXCELLENT',
        },
        {
          region_or_city: 'Leeds',
          sample_size: 44,
          sla_attendance_rate: 91.5,
          first_time_fix_rate: 84.8,
          status: 'GOOD',
        },
      ],
      eligible_for_preferred_review: true,
      last_calculated_at: '2026-08-25T12:00:00.000Z',
    };
    this.scorecards.set('sup-01', apexScorecard);

    // 2. Benchmarks
    this.benchmarks = [
      {
        service_slug: 'hvac',
        service_name: 'HVAC & Chillers',
        region_or_city: 'National UK',
        total_suppliers_measured: 18,
        median_sla_rate: 91.2,
        median_ftf_rate: 83.5,
        median_evidence_rate: 91.0,
        updated_at: '2026-08-25T00:00:00.000Z',
      },
      {
        service_slug: 'electrical',
        service_name: 'Electrical Systems',
        region_or_city: 'National UK',
        total_suppliers_measured: 24,
        median_sla_rate: 93.0,
        median_ftf_rate: 87.0,
        median_evidence_rate: 94.5,
        updated_at: '2026-08-25T00:00:00.000Z',
      },
    ];

    // 3. Sample QBR Review for Apex HVAC
    this.reviews.set('rev-sup-01-q2', {
      id: 'rev-sup-01-q2',
      supplier_id: 'sup-01',
      review_period: 'Q2 2026',
      review_type: 'QUARTERLY',
      reviewer_name: 'David Wright',
      reviewer_role: 'Head of Supply Chain Performance',
      attendees: ['David Wright (EntireFM)', 'Marcus Vance (Apex MD)', 'Sarah Jenkins (Apex Quality)'],
      metrics_snapshot: {
        total_jobs: 142,
        sla_attendance_rate: 94.8,
        first_time_fix_rate: 88.5,
        evidence_quality_rate: 96.0,
        invoice_accuracy_rate: 99.1,
        client_feedback_score: 4.8,
      },
      strengths: ['Flawless invoice accuracy', 'Exemplary service report photographs', 'Fast 24/7 response in Manchester'],
      areas_for_improvement: ['Expand engineer density in Leeds corridor'],
      decisions: ['Approved for Preferred Partner Framework allocation'],
      relationship_tier_recommendation: 'ELEVATE_TO_PREFERRED',
      next_review_date: '2026-11-15',
      conducted_at: '2026-07-15T14:00:00.000Z',
    });
  }
}

const gPerformance = globalThis as unknown as { __efm_supplierPerformanceStore?: SupplierPerformanceMemoryStore };
if (!gPerformance.__efm_supplierPerformanceStore) {
  gPerformance.__efm_supplierPerformanceStore = new SupplierPerformanceMemoryStore();
}
const store = gPerformance.__efm_supplierPerformanceStore;

/**
 * 1. GET OR GENERATE SUPPLIER SCORECARD
 */
export async function getSupplierScorecard(supplierId: string): Promise<SupplierScorecard | null> {
  return store.scorecards.get(supplierId) || null;
}

export async function listSupplierScorecards(): Promise<SupplierScorecard[]> {
  return Array.from(store.scorecards.values());
}

/**
 * 2. QUALITY DEFECT MANAGEMENT
 */
export async function logQualityDefect(defect: Omit<SupplierQualityDefectRecord, 'id' | 'raised_at'>): Promise<SupplierQualityDefectRecord> {
  const id = `def-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const record: SupplierQualityDefectRecord = {
    ...defect,
    id,
    raised_at: new Date().toISOString(),
  };
  store.qualityDefects.set(id, record);
  return record;
}

export async function listQualityDefects(supplierId?: string): Promise<SupplierQualityDefectRecord[]> {
  const all = Array.from(store.qualityDefects.values());
  if (!supplierId) return all;
  return all.filter((d) => d.supplier_id === supplierId);
}

/**
 * 3. PERFORMANCE IMPROVEMENT PLANS (PIPs)
 */
export async function createPerformanceImprovementPlan(pip: Omit<PerformanceImprovementPlan, 'id' | 'status' | 'start_date'>): Promise<PerformanceImprovementPlan> {
  const id = `pip-${Date.now()}`;
  const record: PerformanceImprovementPlan = {
    ...pip,
    id,
    status: 'ACTIVE',
    start_date: new Date().toISOString(),
  };
  store.pips.set(id, record);

  // Link to scorecard
  const sc = store.scorecards.get(pip.supplier_id);
  if (sc) {
    sc.active_pip_id = id;
    sc.overall_status = 'IMPROVEMENT_REQUIRED';
    store.scorecards.set(pip.supplier_id, sc);
  }

  return record;
}

export async function listPerformanceImprovementPlans(supplierId?: string): Promise<PerformanceImprovementPlan[]> {
  const all = Array.from(store.pips.values());
  if (!supplierId) return all;
  return all.filter((p) => p.supplier_id === supplierId);
}

/**
 * 4. PERFORMANCE REVIEWS & QBRs
 */
export async function savePerformanceReview(review: Omit<SupplierPerformanceReviewRecord, 'id' | 'conducted_at'>): Promise<SupplierPerformanceReviewRecord> {
  const id = `rev-${Date.now()}`;
  const record: SupplierPerformanceReviewRecord = {
    ...review,
    id,
    conducted_at: new Date().toISOString(),
  };
  store.reviews.set(id, record);
  return record;
}

export async function listPerformanceReviews(supplierId?: string): Promise<SupplierPerformanceReviewRecord[]> {
  const all = Array.from(store.reviews.values());
  if (!supplierId) return all;
  return all.filter((r) => r.supplier_id === supplierId);
}

/**
 * 5. BENCHMARKS
 */
export async function listServiceBenchmarks(): Promise<ServiceBenchmarkMedian[]> {
  return store.benchmarks;
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
        currentOpenJobsCount: 2,
        distanceMiles: 8.5,
      });
    })
  );

  // Sort: Eligible first, then descending suitability score
  return results.sort((a, b) => {
    if (a.is_eligible && !b.is_eligible) return -1;
    if (!a.is_eligible && b.is_eligible) return 1;
    return b.suitability_score - a.suitability_score;
  });
}
