# EntireFM Content Distribution System

## Multi-Channel Syndication Map

Every substantive article published on EntireFM is connected to multiple downstream channels:

| Channel | Trigger / Mode | Format | Attribution / UTM |
|---|---|---|---|
| **The FM Briefing** | Automated Weekly or Manual Selection | Structured HTML component blocks | `utm_source=entirefm_briefing&utm_medium=email` |
| **LinkedIn** | On-Demand Generator (`/admin/blog/distribution`) | Technical B2B post with 3 key considerations | `utm_source=linkedin&utm_medium=social` |
| **Live RSS / Atom** | Instant on Publish | `<item>` entry in `/rss.xml` and `/feed.xml` | Direct canonical link |
| **Website Features** | Dynamic Feature Placement | Card highlight in Blog Index & Resource Hubs | Internal route link |

---

## LinkedIn Post Generation Principles
1. **Zero Emoji Spam**: Avoid `🚀🔥💡` clichés.
2. **Actionable Operations Perspective**: Highlight real engineering dilemmas (e.g. LOLER competent-person requirements vs IoT telemetry).
3. **Structured Format**: Opening thesis &rarr; 3 bulleted considerations &rarr; direct reading link.
