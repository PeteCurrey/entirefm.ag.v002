# EntireFM Mobilisation Data Model Reconciliation

## 1. Zero Duplicate Models Guarantee
- **Client**: Stored strictly in `client_accounts`.
- **Contract**: Stored strictly in `contracts`.
- **Site**: Stored strictly in `sites`.
- **Asset**: Stored strictly in `assets`.
- **PPM**: Stored strictly in `ppm_plans` and `ppm_tasks`.
- **Helpdesk**: Stored strictly in `service_requests` and `work_orders`.

## 2. Mobilisation Governance Models
- `mobilisations` (Dossier state and domain readiness).
- `mobilisation_tasks` (12-phase operational checklist with blocking gates).
- `mobilisation_risks` (Pre-go-live risk register).
