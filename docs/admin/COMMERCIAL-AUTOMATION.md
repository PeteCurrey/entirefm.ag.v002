# EntireFM Commercial Automation & Guardrails

## 1. Automation Principles
- **No Uncontrolled Emailing**: The system creates internal follow-up tasks and draft copy. Human approval is strictly required prior to any external communication.
- **No Dead-End Records**: Active opportunities are audited to ensure a future `next_action` and `next_action_at` date exist.
- **Stale Deal Alerts**: Deals with no activity for >10 days automatically generate a priority alert.
- **Tender Deadlines**: Approaching tender deadlines (7-day and 3-day milestones) trigger high-priority alerts.
