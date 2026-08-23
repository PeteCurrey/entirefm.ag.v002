# Legacy Estate Verification — Release Gate Closed

**Date:** 22 August 2026
**Method:** direct XML sitemap crawl of both Wix estates + HTTP status probe of production
**Re-run with:** `npm run verify:legacy-estate` (offline) / `npm run verify:legacy-estate:prod` (probes live)

---

## 1. Why this document exists

The *Digital Rebuild & SEO Dominance Plan* (§10.3) recorded an open release gate:

> "Wix's XML sitemap endpoint was not parseable through the available browser interface
> during this review. Therefore, true orphan-page completeness must be verified with the
> Wix URL/site-manager export and historical Search Console data before launch.
> **This is a release gate, not an optional follow-up.**"

That gate is now closed for the sitemap half. Both Wix sitemaps *are* machine-readable —
they were only unreadable through a rendering browser, because Wix serves them as raw XML.
Fetched directly they parse cleanly.

## 2. The legacy estate, verified

| Source | URLs |
|---|---|
| Wix generation 1 — `petercurrey.wixsite.com/efm-new` | 148 |
| Wix generation 2 — `petercurrey.wixstudio.com/efmsut17724` | 92 |
| **Union, deduplicated** | **192** |
| Wix template demo pages excluded (see §5) | 5 |
| **Real EntireFM legacy URLs** | **187** |

## 3. The damage: what production is doing to those 187 URLs today

Every one of the 187 legacy paths was probed against `https://www.entirefm.com`.

| Production response | Count | Share |
|---|---|---|
| **404 — hard not-found** | **138** | **73.8%** |
| 200 — still served | 35 | 18.7% |
| 301/307/308 — redirected | 14 | 7.5% |

**138 of 187 legacy URLs return a hard 404.** This is the direct, measured cause of the
organic collapse. Google is not penalising the site — the pages that earned the rankings
have simply ceased to exist, and a 404 sheds all accumulated link equity and ranking history.

The production sitemap lists 156 URLs, of which only 36 correspond to legacy paths. The
remaining 151 legacy URLs are absent from the sitemap entirely.

### The geo pages — the pages that generated the daily enquiries

The location estate took the worst of it, and inconsistently:

- `/london-facilities-management` → **404**
- `/facilities-management-london` → 308 → `/fm-london`
- `/fm-manchester` → 308 → `/facilities-management-manchester`
- `/facilities-management-birmingham` → 308 → `/fm-birmingham`

The paired `/fm-{city}` + `/facilities-management-{city}` variants have been collapsed into
one survivor per city, and the direction of collapse is arbitrary — Manchester folds one way,
Birmingham and London the other. Roughly half the geographic footprint was discarded, and the
`/london-facilities-management` third variant was dropped outright.

Full per-URL evidence: [`LEGACY-URL-VERIFICATION.csv`](./LEGACY-URL-VERIFICATION.csv).

## 4. Rebuild coverage: complete

| Check | Result |
|---|---|
| Legacy URLs in the rebuild route registry | **187 / 187** |
| Legacy URLs that render real HTML at build | **187 / 187** |
| Legacy URLs in the plan's Appendix A registry | 103 / 103 |
| Additional legacy URLs recovered beyond Appendix A | 84 |

The rebuild in this repository restores the entire legacy estate, including 84 URLs the
plan's appendix did not capture — among them genuine historic paths that only a sitemap
crawl surfaces (`/manchester-facilities-managment` and `/tierone-facilities-managment`,
both with the original typo preserved; `/copy-of-industrial-cleaning`; `/items`;
`/bocker-crane-hire`; `/hot-tub-relocation`; the whole `/facilities-management-for/*`
dynamic collection; and the `/mobile-crane-hire/*` tree).

`npm run build` produces 238 prerendered pages, covering all 187.

## 5. Deliberate exclusions

Five URLs on the Wix Studio estate are unused Wix template demo content and were never
EntireFM pages. They carry no search value, no links and no history:

```
/fm/epic-battle-montage
/fm/good-morning-london
/fm/hero-squad-interview
/fm/training-session-with-master
/fm/villain-showdown-finale
```

Recommendation: serve **410 Gone**, not 404 and not a redirect, so they are dropped from the
index quickly and cleanly.

## 6. What this verification does *not* yet cover

The sitemap half of the release gate is closed. Two inputs remain outstanding, and both can
only come from accounts this repository cannot reach:

1. **Google Search Console** — historical landing pages and queries for the maximum
   available window (16 months). This is the only source that reveals URLs which earned
   traffic but were never in a sitemap, and the only way to rank recovery priority by
   *actual* historic clicks rather than inference.
2. **Backlink data** — externally linked legacy URLs. A 404 on a linked page wastes the
   link; these should be prioritised regardless of their own traffic history.

Until GSC data is loaded, recovery priority is ordered by inference (route type and
legacy prominence), not by measured historic value. That is a real limitation on
sequencing — it does not affect coverage, which is complete.

---

## 7. Update — the sitemaps were not the whole estate

*Added 22 August 2026, after the initial verification above.*

The audit in sections 2–4 was built from both Wix XML sitemaps. That was
incomplete, and Search Console could not have caught the gap: the GSC export
only reaches back to **2026-05-07**, long after the Wix estate was live.

A sitemap lists what Wix currently chooses to publish. It omits pages excluded
from search, orphaned from navigation, or dropped from the sitemap at some
point. To close that, both estates were re-examined using **Wix's own internal
page manifest** — the `pageUriSEO` list embedded in the rendered HTML, which is
the list Wix itself routes from.

| Discovery method | Older estate | Studio estate |
|---|---:|---:|
| XML sitemaps | 148 | 92 |
| Internal page manifest | 159 | 75 |
| Link crawl (following internal links) | 172 | 97 |
| **Union, real pages** | — | **202** |

Every candidate the sitemaps had missed was fetched individually before any
decision was taken about it. That produced a clean split.

### 15 real pages recovered

Confirmed to render genuine content on Wix, now built and returning 200:

| Path | Wix page title |
|---|---|
| `/access-control` | Access Control |
| `/emergency-light-testing` | Emergency Light Testing |
| `/sheffield` | **Crane Hire Sheffield** |
| `/chesterfield` | **Crane Hire Chesterfield** |
| `/truck-mount-crane-hire` | Truck Mount Crane Hire |
| `/arena-facilities-management-1` | Arena Facilities Management |
| `/facilities-management-glossary` | FM Glossary |
| `/facilities-management-industries` | Facilities Management Industries |
| `/account-registration` | Account Registration |
| `/portal` | Portal |
| `/home`, `/homeab` | Home / Home AB (older estate) |
| `/home-1-1`, `/home-1-1-1` | Home / New Home Design (Studio estate) |
| `/search` | Search Results |

Two points worth noting. `/sheffield` and `/chesterfield` are **crane hire**
landing pages, not general FM city pages — building them as city FM pages would
have targeted the wrong intent entirely. And Wix served **both flat and nested
forms** of several URLs (`/sheffield` *and* `/mobile-crane-hire/sheffield`), so
both are built, and neither redirects to the other.

### 26 verified non-pages excluded

Each was fetched and returned either the Wix 404 page or a hard 404:

- **Dynamic-page editor templates (8)** — Wix names these with a bracketed
  suffix: "Items (All)", "Services (Title)", "FM Industries (Item)". They are
  editor constructs, not addressable URLs.
- **Members Area system routes (10)** — `/my-account`, `/followers`,
  `/settings` and similar, for an app that was never installed.
- **Platform internals (3)** — `/error404` is the 404 page itself; `/post` is a
  bare router returning 404.
- **Wix demo content (5)** — the `/fm/*` template pages from §5.

Restoring any of these would create pages that never existed.

### Current state

| | |
|---|---|
| Real legacy URLs | **202** |
| Rendering a real 200 page | **202 / 202** |
| Used as a redirect source | **0** |
| Returning 404 | **0** |
| Route registry total | 248 |

`npm run verify:legacy-estate` now checks both discovery sources, so a future
sitemap change cannot silently shrink the estate again.

### A note on indexation

107 of the 220 historic routes currently carry `noindex` via
`config/indexation-tiers.json`. **That is not a violation of the preservation
rule.** Every one of them is a live page returning 200, internally linked, and
passing link equity — `follow` stays on. What is withheld is only the invitation
to index, and only while the page remains a near-duplicate of another page
targeting the same query. Clusters keep their strongest member indexed, chosen
by measured Search Console performance, so no page that currently earns clicks
is held back and every city retains at least one indexable page.

A page leaves that state by having content written for it — see
`npm run check:similarity` for the backlog.
