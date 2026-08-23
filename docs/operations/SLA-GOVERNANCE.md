# EntireFM SLA Engine & Pause Governance Standard

## 1. SLA Clock Timing & At-Risk Thresholds
- **Response Target**: Acknowledgment and initial triage.
- **Attendance Target**: Physical arrival on site by qualified engineer.
- **Resolution Target**: Permanent fix or safe containment.
- **At-Risk Warning**: Automatically triggered when 75% of allotted contractual window has elapsed without arrival.

## 2. Auditable SLA Pause Conditions
SLA clocks may only be paused under contractually verified conditions:
- `AWAITING_CLIENT_ACCESS` (Site closed or escort unavailable).
- `AWAITING_CLIENT_APPROVAL` (Quote above approval threshold).
- `AWAITING_PARTS` (Specialist components on verified back-order).
- `THIRD_PARTY_DEPENDENCY` (Utility provider outage).

Every pause requires a logged actor, timestamp, and supporting operational note.
