# EntireFM Conversion Intelligence Architecture

## System Architecture

The EntireFM Conversion Intelligence engine links marketing traffic, content consumption, interactive tools, and inbound lead qualification into a closed commercial loop:

```
  Search Console / Organic Search
                │
                ▼
  High-Intent Landing Page (/facilities-management-manchester)
                │
                ▼
  Educational & Tool Interactivity (/ppm, /tools/ppm-schedule-builder)
                │
                ▼
  Multi-Touch Attribution Memory (SessionStorage)
                │
                ▼
  Server-Side Form Submission (/api/enquiry)
                │
                ▼
  Supabase Leads & Opportunities Table
                │
                ▼
  Admin Growth Intelligence Suite (/admin/growth)
```

---

## Key Modules
1. **`src/lib/analytics/tracker.ts`**: Non-invasive client-side event tracker and journey accumulator.
2. **`src/server/growth/store.ts`**: Database repository with resilient fallback providing real metrics for 14 admin analytics dashboards.
3. **`src/app/admin/growth/`**: Full commercial control center.
