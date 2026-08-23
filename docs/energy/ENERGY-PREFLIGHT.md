# EntireOperations Energy, Utilities & Building Performance Preflight Reconciliation

## Executive Summary
This document audits and maps existing operational entities to the **Phase 9 Energy, Utilities & Building Performance Intelligence** engine, ensuring **zero duplicate models**.

---

## 1. Canonical Capability & Model Reconciliation

| Capability | Existing Model & Source | Reuse / Extend | New Model Required? | Rationale |
|---|---|---|---|---|
| **Meters & Sub-meters** | `Asset`<br>`src/server/estate/index.ts` | **EXTEND** | **YES (`meters`, `meter_readings`)** | Connects physical meters to canonical `sites`, `buildings`, and parent `assets` (e.g. AHU sub-meter). |
| **BMS & Telemetry** | `FieldReading`<br>`src/server/field/index.ts` | **EXTEND** | **YES (`bms_telemetry_points`)** | Links BMS sensors (valve positions, temperatures, run states) directly to assets and spaces. |
| **Energy Baselines & M&V** | `CommercialSummary`<br>`src/server/commercial/index.ts` | **EXTEND** | **YES (`energy_baselines`, `energy_projects`)** | Tracks IPMVP-aligned baseline models and post-project measurement & verification. |
| **Energy Anomalies** | `OperationalException`<br>`src/server/work/live-control.ts` | **REUSE / EXTEND** | **NO** | Energy anomalies (Baseload spikes, Out-of-hours run, Control conflict) map directly to `operational_exceptions` and link to `work_orders`. |
| **Tariffs & Costs** | `CommercialWIP`<br>`src/server/commercial/index.ts` | **EXTEND** | **YES (`utility_tariffs`)** | Captures standing charges, unit rates, and time-of-use tariffs to separate price spikes from volume spikes. |
| **Carbon Factors** | `ComplianceObligation`<br>`src/server/compliance/index.ts` | **EXTEND** | **YES (`carbon_factors`)** | Stores versioned UK Government GHG conversion factors by reporting year. |

---

## 2. Dedicated Energy Tables (`0012_energy_utilities_intelligence.sql`)
1. **`meters`**: Master meter register (Electricity, Gas, Water, Heat, Chilled Water) with hierarchy (`MAIN`, `SUB`, `ASSET`, `TENANT`).
2. **`meter_readings`**: High-resolution interval readings (half-hourly, 15-min, daily) with data-quality flags.
3. **`utility_tariffs`**: Versioned tariff structures.
4. **`energy_projects`**: Tracked energy-efficiency interventions with measurement & verification (M&V) states.
5. **`carbon_factors`**: Official emission factor library.
