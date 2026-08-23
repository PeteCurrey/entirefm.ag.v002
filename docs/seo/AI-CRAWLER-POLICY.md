# EntireFM AI Crawler Policy & Access Governance

## 1. Allowed Crawlers (Public Educational & Search Indexing)
- `Googlebot`, `Google-Extended`
- `Bingbot`
- `GPTBot` (OpenAI / ChatGPT Search)
- `PerplexityBot`
- `ClaudeBot` (Anthropic)
- `Applebot`, `Applebot-Extended`

## 2. Enforced Protections (`robots.txt`)
- **Strictly Disallowed Paths**:
  - `/admin/*`
  - `/api/*`
  - `/contractor/*`
  - `/engineer/*`
  - `/client-login/*`
  - `/helpdesk/*`
- All public pages are server-rendered with zero JavaScript paywalls.
