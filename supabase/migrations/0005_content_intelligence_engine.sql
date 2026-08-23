-- EntireFM Phase 2: Content Intelligence, SEO Feedback Loop & Performance Engine
-- Database Migration: 0005_content_intelligence_engine.sql

-- 1. Integration Status & Sync Runs
CREATE TABLE IF NOT EXISTS integration_sync_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service VARCHAR(50) NOT NULL, -- 'GSC', 'GA4', 'COMPETITOR_FEED'
    status VARCHAR(30) NOT NULL,  -- 'CONNECTED', 'SYNCING', 'SUCCESS', 'FAILED', 'NOT_CONNECTED'
    rows_imported INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. SEO Query Performance (Real GSC aggregated data)
CREATE TABLE IF NOT EXISTS seo_query_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    page_path TEXT NOT NULL,
    clicks INT NOT NULL DEFAULT 0,
    impressions INT NOT NULL DEFAULT 0,
    ctr NUMERIC(5,4) NOT NULL DEFAULT 0,
    position NUMERIC(5,2) NOT NULL DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    country VARCHAR(10) DEFAULT 'GBR',
    device VARCHAR(20) DEFAULT 'ALL',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_seo_query_path ON seo_query_performance(page_path);
CREATE INDEX IF NOT EXISTS idx_seo_query_str ON seo_query_performance(query);

-- 3. Content Performance Daily (Aggregated GSC & GA4 Metrics per URL)
CREATE TABLE IF NOT EXISTS content_performance_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    date DATE NOT NULL,
    organic_clicks INT DEFAULT 0,
    impressions INT DEFAULT 0,
    ctr NUMERIC(5,4) DEFAULT 0,
    avg_position NUMERIC(5,2) DEFAULT 0,
    sessions INT DEFAULT 0,
    engaged_sessions INT DEFAULT 0,
    avg_engagement_time_sec NUMERIC(8,2) DEFAULT 0,
    service_clicks INT DEFAULT 0,
    tool_clicks INT DEFAULT 0,
    cta_clicks INT DEFAULT 0,
    contact_starts INT DEFAULT 0,
    lead_submissions INT DEFAULT 0,
    assisted_leads INT DEFAULT 0,
    UNIQUE(page_path, date)
);

-- 4. Content Query & Search Intent Ownership
CREATE TABLE IF NOT EXISTS content_query_ownership (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL UNIQUE,
    primary_query_family TEXT NOT NULL,
    search_intent TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'service', 'compliance', 'location', 'glossary', 'article', 'tool'
    topic_cluster VARCHAR(50) NOT NULL, -- 'AI_TECHNOLOGY', 'PPM_MAINTENANCE', 'COMPLIANCE', 'ME_ENGINEERING', etc.
    commercial_parent TEXT,
    is_evergreen BOOLEAN NOT NULL DEFAULT true,
    is_protected_url BOOLEAN NOT NULL DEFAULT true,
    last_verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Content Opportunities & Decision Engine
CREATE TABLE IF NOT EXISTS content_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_type VARCHAR(50) NOT NULL, -- 'HIGH_IMP_LOW_POS', 'HIGH_IMP_LOW_CTR', 'CONTENT_DECAY', 'NEW_GAP', 'CANNIBALISATION', 'REGULATORY_CHANGE'
    query TEXT,
    target_page_path TEXT,
    origin_source VARCHAR(50) NOT NULL, -- 'SEARCH_CONSOLE', 'ANALYTICS', 'REGULATORY_WATCH', 'COMPETITOR_GAP', 'CONTENT_DECAY', 'EDITOR_IDEA'
    decision VARCHAR(50) NOT NULL, -- 'UPDATE_EXISTING', 'EXPAND_EXISTING', 'IMPROVE_METADATA', 'IMPROVE_INTERNAL_LINKING', 'ADD_FAQ', 'CREATE_NEW_ARTICLE', 'NO_ACTION', 'HUMAN_REVIEW'
    priority VARCHAR(10) NOT NULL DEFAULT 'P2', -- 'P0', 'P1', 'P2', 'P3'
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED', 'SNOOZED'
    current_clicks INT DEFAULT 0,
    current_impressions INT DEFAULT 0,
    current_ctr NUMERIC(5,4) DEFAULT 0,
    current_position NUMERIC(5,2) DEFAULT 0,
    recommended_action TEXT NOT NULL,
    suggested_title TEXT,
    suggested_meta TEXT,
    suggested_faq_json JSONB,
    snoozed_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Content Refresh & Audit Jobs
CREATE TABLE IF NOT EXISTS content_refresh_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    opportunity_id UUID REFERENCES content_opportunities(id),
    status VARCHAR(30) NOT NULL DEFAULT 'IN_REVIEW', -- 'IN_REVIEW', 'CHANGES_PROPOSED', 'APPROVED', 'PUBLISHED', 'REJECTED'
    current_copy_snapshot TEXT,
    proposed_copy_diff TEXT,
    outdated_statements JSONB,
    missing_subtopics JSONB,
    added_internal_links JSONB,
    created_by VARCHAR(100) DEFAULT 'intelligence_engine',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. Content Distribution Queue
CREATE TABLE IF NOT EXISTS content_distribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL, -- 'RSS', 'LINKEDIN', 'NEWSLETTER', 'FEATURED_HOMEPAGE', 'FEATURED_AI_HUB', 'FEATURED_COMPLIANCE'
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'CANCELLED'
    copy_draft TEXT,
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
