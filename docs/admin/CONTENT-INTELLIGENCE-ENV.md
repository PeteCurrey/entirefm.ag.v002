# Content Intelligence Environment Variables

This document lists the required environment variable names for connecting external analytics and Google Search Console data sources to the EntireFM Content Intelligence Engine.

## Google Search Console
- `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL`: Service account email with read-only access to property `https://www.entirefm.com`
- `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY`: Service account private key string (formatted with `\n` linebreaks)

## Google Analytics 4
- `GA4_PROPERTY_ID`: Google Analytics 4 numeric Property ID (e.g. `123456789`)
- `GA4_SERVICE_ACCOUNT_KEY`: Service account private key JSON or encoded string for Measurement Protocol/Data API

## Security & Rules
- **No Mock Data**: When these keys are absent, admin surfaces explicitly display `NOT CONNECTED` with zero artificial numbers.
- **Read-Only**: The integration performs read-only operations and does not modify GSC site properties or mass-request index removals.
