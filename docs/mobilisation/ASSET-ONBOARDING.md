# EntireFM Asset Register Ingestion & Data Quality Standard

## 1. Multi-Format Asset Ingestion
- Supports spreadsheet uploads, existing CAFM exports, and surveyor discovery logs.
- Validation checks ensure mandatory fields (Asset Category, Location, Criticality) are present before commit into canonical `assets` table.

## 2. AI-Assisted Normalisation
- AI suggests standardized asset naming conventions and manufacturer classifications.
- All AI suggestions require human approval prior to canonical write.
