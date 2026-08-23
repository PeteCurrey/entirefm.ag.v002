# EntireOperations Live Contract Control & Operations Preflight Reconciliation

## Executive Summary
This document reconciles all existing operational primitives in EntireCAFM and maps them to the **Phase 7 Live Contract Control Centre, Operational Health & Exception Management** engine with **zero duplicate models**.

---

## 1. Canonical Capability & Model Reconciliation

| Required Capability | Existing Model & Source | Reuse / Extend | New Model Required? | Rationale |
|---|---|---|---|---|
| **Contract Health & Control** | `Contract`<br>`src/server/estate/index.ts` | **EXTEND** | **NO** | Reuses canonical `contracts` table and associates multi-domain health telemetry (SLA, PPM, Compliance, Remedials, Contractors, Costs). |
| **Site Health & Workload** | `Site`<br>`src/server/estate/index.ts` | **EXTEND** | **NO** | Reuses canonical `sites` table and associates active job queues, SLA risks, and compliance gaps. |
| **SLA Engine & At-Risk Timing** | `WorkOrder`, `ServiceRequest`<br>`src/server/work/index.ts` | **EXTEND** | **NO** | Extends existing SLA clocks with pre-breach at-risk thresholds (e.g. 75% elapsed) and auditable pause governance (`AWAITING_PARTS`, `AWAITING_CLIENT_APPROVAL`, `AWAITING_ACCESS`). |
| **PPM Control & Evidence Gates** | `PPMPlan`, `PPMTask`<br>`src/server/estate/index.ts` | **EXTEND** | **NO** | Reuses existing SFG20 PPM routines; enforces evidence gates (readings, photos, engineer notes) before completion. |
| **Reactive Triage & Repeat Issues** | `ServiceRequest`, `WorkOrder`<br>`src/server/work/index.ts` | **EXTEND** | **NO** | Implements automated recurring failure detection on same asset/location over 60-day windows. |
| **Defects & Remedial Lineage** | `Defect`, `Quote`<br>`src/server/commercial/index.ts` | **EXTEND** | **NO** | Retains full chain: WorkOrder &rarr; Defect &rarr; Quote &rarr; Client Approval &rarr; Remedial WorkOrder &rarr; Evidence. |
| **Compliance Evidence Monitoring** | `ComplianceObligation`<br>`src/server/compliance/index.ts` | **EXTEND** | **NO** | Categorises responsibilities (EntireFM, Client, Landlord, Third Party) and tracks certificate review schedules. |
| **Contractor & Supply Chain QA** | `Contractor`, `Engineer`<br>`src/server/supply-chain/index.ts` | **EXTEND** | **NO** | Component performance metrics (acceptance, attendance, completion, evidence rejection) with low-sample safeguards. |
| **Cost & Commitment Exceptions** | `CommercialSummary`, `Quote`<br>`src/server/commercial/index.ts` | **EXTEND** | **NO** | Monitors committed vs actual costs, unapproved quote ageing, and cost variances against configured contract baselines. |
| **Client Actions Register** | `commercial_tasks`<br>`src/server/commercial/pipeline.ts` | **EXTEND** | **NO** | Centralises quote approvals, access authorizations, and document requests awaiting client action. |
| **Operational Incidents & Risks** | `mobilisation_risks`<br>`src/server/estate/mobilisation.ts` | **EXTEND** | **NO** | Extends risk model into live BAU operations for plant outages and escalations. |
| **Client Monthly Reporting** | `reporting`<br>`src/server/reporting/index.ts` | **EXTEND** | **NO** | Builds authentic, drillable monthly PDF/web reports grounded strictly in live database records. |

---

## 2. Dedicated Live Operations Governance Tables (`0011_live_operations_control.sql`)
1. **`operational_exceptions`**: Centralised exception registry (SLA At-Risk, SLA Breached, Overdue PPM, Missing Compliance Evidence, Critical Defect, Contractor No-Show, Cost Variance) with acknowledgement, ownership, and audit trail.
2. **`client_actions`**: Dedicated register tracking items awaiting client decision or input (Quote Approval, Access, PO, Shutdowns).
3. **`operational_incidents`**: Critical plant and building outage escalation records.
