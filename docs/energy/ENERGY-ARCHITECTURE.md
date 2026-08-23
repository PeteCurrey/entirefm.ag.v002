# EntireFM Energy & Building Performance Architecture

## 1. Overview
The Energy, Utilities & Building Performance Intelligence engine connects live utility feeds, BMS points, and asset registries directly into EntireCAFM operations:

```
  Meters / BMS Sensors / Utility Tariffs
                   │
                   ▼
  1. Multi-Resolution Ingestion (Half-Hourly, 15m, Daily)
                   │
                   ▼
  2. Data Quality & Sanity Validation (Missing, Flatline, Resets)
                   │
                   ▼
  3. Operating Schedule & Baseload Normalisation
                   │
                   ▼
  4. Operational Anomaly Detection (Rule, Statistical, Model)
                   │
                   ├──► [POTENTIAL_CONTROL_CONFLICT] ──► WorkOrder Investigation
                   │
                   ▼
  5. Measurement & Verification (M&V) Project Tracking
                   │
                   ▼
  6. Verified Client Reporting & UK GHG Carbon Accounts
```
