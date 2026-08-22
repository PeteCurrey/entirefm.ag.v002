# HTTP HOST & PROTOCOL NORMALISATION POLICY
## EntireFM SEO Rebuild — Phase 08
**Generated:** 2026-08-22  
**Authority:** Single canonical domain policy for DNS and edge routing.

---

## 1. Authoritative Production Destination

```text
https://entirefm.com
```

---

## 2. Inbound Edge Normalisation (1-Hop Redirect Matrix)

| Incoming Request Format | Target Production Response | Redirect Type | Hops |
|---|---|---|---|
| `http://entirefm.com/*` | `https://entirefm.com/*` | 301 Permanent | 1 Hop ✓ |
| `http://www.entirefm.com/*` | `https://entirefm.com/*` | 301 Permanent | 1 Hop ✓ |
| `https://www.entirefm.com/*` | `https://entirefm.com/*` | 301 Permanent | 1 Hop ✓ |
| `https://entirefm.com/*` | Direct Serve (HTTP 200) | 200 OK | 0 Hops ✓ |

---

## 3. Trailing Slash & Case Standard

* **Trailing Slash Policy:** All paths stripped of trailing slashes (e.g. `/mechanical-electrical/` -> `/mechanical-electrical` via 301).
* **Case Standard:** All paths forced to lowercase (e.g. `/FM-London` -> `/fm-london` via 301).
