# EntireFM Live Contract Control Architecture

## 1. Exception-First Control Room Operating Philosophy
The Live Contract Control Centre operates on an **Exception-First** model. Operations managers do not manually inspect thousands of green jobs; instead, the system dynamically surfaces records requiring intervention:

1. **SLA At-Risk**: Jobs approaching response or attendance thresholds (configurable at 75% elapsed time).
2. **PPM Overdue**: Scheduled statutory maintenance routines past their target delivery window.
3. **Evidence Gaps**: Completed field visits missing required engineer photographs, meter readings, or sign-offs.
4. **Client Bottlenecks**: High-value quotes or access requests awaiting client decision for >5 days.
5. **Recurring Asset Failures**: Assets experiencing >3 reactive work orders within a rolling 60-day window.
