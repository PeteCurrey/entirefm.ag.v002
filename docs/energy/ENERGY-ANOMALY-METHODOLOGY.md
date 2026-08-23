# EntireFM Energy Anomaly Detection Methodology

## 1. Multi-Method Anomaly Engine
Anomalies are explicitly categorised by origin to prevent false confidence:
- **`RULE_BASED`**: Out-of-hours operation, simultaneous heating & cooling valve signals.
- **`STATISTICAL`**: Overnight baseload >3 standard deviations above 30-day moving median.
- **`MODEL_BASED`**: Weather-normalised degree day deviations.
- **`MANUAL`**: Surveyor discovery during technical site walk.

## 2. Operational Linkage
Every verified anomaly can directly generate an engineering inspection or `work_order` with full lineage preserved.
