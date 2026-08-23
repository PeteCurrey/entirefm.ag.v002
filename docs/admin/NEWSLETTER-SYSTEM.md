# EntireFM Newsletter & Audience Growth System Documentation

## 1. System Architecture

The **The FM Briefing** audience and distribution engine provides a fully integrated, database-backed newsletter system inside EntireFM Admin:

```
                      ┌────────────────────────────────────────┐
                      │     Published EntireFM Content         │
                      │  (Articles, AI Guides, Tools, Glossaries)│
                      └───────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┼───────────────────────┐
                  ▼                       ▼                       ▼
      ┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────┐
      │ Weekly Auto-Briefing  │ │ LinkedIn Drafts   │ │  Website Placements   │
      │  (The FM Briefing)    │ │ (Technical Posts) │ │ (Blog / Resource Hub) │
      └───────────┬───────────┘ └───────────────────┘ └───────────────────────┘
                  ▼
      ┌───────────────────────┐
      │   Pre-Send QA Gate    │ (Broken link verification, placeholder check)
      └───────────┬───────────┘
                  ▼
      ┌───────────────────────┐
      │  Suppression Filter   │ (Strict PECR / GDPR exclusion)
      └───────────┬───────────┘
                  ▼
      ┌───────────────────────┐
      │ Email Delivery Engine │ (Resend / Postmark Adapter with Safe Mock)
      └───────────────────────┘
```

---

## 2. Core Entities & Database Tables

1. **`newsletter_subscribers`**: Stores verified opt-in records, consent text version, signup URL, UTM attribution, and unique unsubscribe security token.
2. **`newsletter_campaigns`**: Stores campaign metadata, structured component blocks, QA check results, and engagement statistics.
3. **`newsletter_suppressions`**: Permanent isolation registry of unsubscribed users, hard bounces, and spam complaints.
4. **`newsletter_automation_settings`**: Controls toggles for auto-drafting, auto-scheduling, and emergency kill-switches.
5. **`social_distribution_drafts`**: Stores technical B2B LinkedIn posts generated from published articles.

---

## 3. Weekly Briefing Structure

The automated briefing engine constructs a structured, 5-minute read for estate custodians:
1. **This Week in FM**: Short editorial overview of regulatory and market movements.
2. **Featured Article**: Top recent published piece with key engineering considerations.
3. **AI & Technology Watch**: Practical guide from the AI in FM Resource Centre.
4. **Practical Tool Spotlight**: Rotating calculator, PPM schedule builder, or compliance planner.
5. **One Thing to Think About**: Authoritative takeaway on building risk.
6. **Commercial Review CTA**: Restrained callout to discuss estate maintenance.
