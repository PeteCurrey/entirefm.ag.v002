# EntireFM Operational Exception Lifecycle Model

## 1. Exception Lifecycle States
Every operational exception progresses through an auditable state machine:

```
[ACTIVE] ──► Detected automatically (SLA, PPM, Evidence, Defect)
   │
   ├──► [ACKNOWLEDGED] ──► Duty Manager reviews and assigns owner
   │
   ├──► [ACTION_ASSIGNED] ──► Assigned to Field Engineer / Subcontractor
   │
   ├──► [SNOOZED] ──► Valid operational hold with reason (e.g. Awaiting Access)
   │
   ▼
[RESOLVED] ──► Underlying operational condition satisfied and logged
```
