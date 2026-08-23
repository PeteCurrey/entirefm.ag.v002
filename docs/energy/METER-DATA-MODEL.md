# EntireFM Meter & Ingestion Data Model

## 1. Multi-Utility Meter Schema
- **Utilities**: Electricity, Natural Gas, Mains Water, District Heat, Chilled Water, Solar Generation / Export.
- **Hierarchy**: `MAIN_METER` &rarr; `SUB_METER` &rarr; `ASSET_METER` (e.g. AHU sub-meter) &rarr; `TENANT_METER`.
- **Readings**: Half-hourly, 15-minute, hourly, or daily interval time-series with explicit `data_quality` tracking (`ACTUAL`, `ESTIMATED`, `FLATLINE`, `FAULTY`).
