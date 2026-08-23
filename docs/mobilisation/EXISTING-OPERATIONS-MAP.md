# EntireOperations Operational Mapping & Mobilisation Preflight Reconciliation

## Executive Summary
This document reconciles all existing operational primitives in EntireCAFM and maps them to the Won Contract &rarr; Mobilisation Engine to ensure **zero duplicate schemas**.

---

## 1. Canonical Operational Models Mapping

| Existing Entity | File / Database Table | Mobilisation Use | Change / Action Required | New Model Needed? |
|---|---|---|---|---|
| **`ClientAccount`** | `src/server/estate/index.ts`<br>`client_accounts` | Master customer account created upon approved commercial handoff. | None. Reused as canonical client record. | **NO** |
| **`Contract`** | `src/server/estate/index.ts`<br>`contracts` | Master operational contract record tracking services, billing, dates, and SLA profiles. | Extended status to support `MOBILISING` &rarr; `READY_FOR_LIVE` &rarr; `LIVE`. | **NO** |
| **`Site`** | `src/server/estate/index.ts`<br>`sites` | Physical site / property on-boarded during Estate Discovery phase. | Reused as canonical site record. Linked to ClientAccount. | **NO** |
| **`Building` / `Space`** | `src/server/estate/index.ts`<br>`buildings`, `spaces` | Sub-locations, plant rooms, and risers. | Reused directly. | **NO** |
| **`Asset`** | `src/server/estate/index.ts`<br>`assets` | Mechanical, electrical, HVAC, and fabric plant imported during Mobilisation. | Reused directly. Asset register onboarding commits rows here. | **NO** |
| **`ComplianceObligation`** | `src/server/compliance/index.ts`<br>`compliance_obligations` | Statutory fire, water, gas, F-Gas, electrical baseline checks. | Reused directly. Gap register maps to compliance exceptions. | **NO** |
| **`PPMPlan` / `PPMTask`** | `src/server/estate/index.ts`<br>`ppm_plans`, `ppm_tasks` | Maintenance routines generated from asset register and SFG20 libraries. | Reused directly. Mobilisation PPM build directly populates these. | **NO** |
| **`WorkOrder` / `ServiceRequest`** | `src/server/work/index.ts`<br>`work_orders`, `service_requests` | Reactive routing and helpdesk triage rules. | Reused directly. Helpdesk configuration binds to these state machines. | **NO** |
| **`Contractor` / `Engineer`** | `src/server/supply-chain/index.ts`<br>`contractors`, `engineers` | Delivery model configuration (direct vs subcontractor coverage). | Reused directly. | **NO** |
| **`CommercialOpportunity`** | `src/server/commercial/pipeline.ts`<br>`commercial_opportunities` | Commercial source deal with pricing, scope, and tender specifications. | Linked via foreign key to `mobilisations`. | **NO** |

---

## 2. Dedicated Mobilisation Lifecycle Models (Migration `0010_operational_mobilisation.sql`)
To manage the transitional period between `WON` and `LIVE (BAU)`, the following dedicated governance tables are introduced:

1. **`mobilisations`**: Master mobilisation container tracking stage (`AWAITING_HANDOFF` &rarr; `HANDOFF_REVIEW` &rarr; `IN_PROGRESS` &rarr; `GO_LIVE_REVIEW` &rarr; `LIVE_STABILISATION` &rarr; `COMPLETE`), commercial owner, operations owner, target go-live, and domain readiness.
2. **`mobilisation_tasks`**: Structured task engine with dependencies, phase groupings (01-12), and evidence gates.
3. **`mobilisation_risks`**: Operational risk register capturing pre-go-live hazards, mitigation strategies, and accepted risks.
4. **`mobilisation_documents`**: Contractual and technical document register (O&M manuals, asset registers, certificates).
