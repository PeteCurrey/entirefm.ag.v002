# EntireFM Blog & Editorial Management System

## 1. System Architecture
The EntireFM Blog System provides a comprehensive, database-backed management system for editorial articles, technical FM guides, and automated research workflows.

- **Primary URL Structure**: `/post/[slug]` for all public articles.
- **Admin Dashboard**: `/admin/blog` (accessible to authenticated staff via RBAC).
- **Feeds**: `/rss.xml` and `/feed.xml` generated dynamically.
- **Database Schema**: PostgreSQL / Supabase migration `0004_blog_editorial_engine.sql` with fallback memory store.

## 2. Editorial Standards & Tone
- **Audience**: Commercial landlords, asset managers, building directors, estates teams.
- **Tone**: Pragmatic, technical, statutory-grounded, commercially realistic.
- **Stances**:
  - Predictive maintenance does not eliminate PPM; it informs intervention timing.
  - CAFM is only as effective as the field data captured by technicians.
  - Golden Thread compliance requires verified digital records, not static PDF archives.

## 3. SEO Governance & Anti-Cannibalisation
- SERP preview with pixel-length validation.
- Collision engine scans new topics against all 291 EntireFM routes.
- Pre-publication fact-checker detects inaccurate statutory claims or banned AI clichés.
