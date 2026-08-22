# PRODUCTION ROLLBACK & CONTINGENCY PLAN
## EntireFM SEO Rebuild — Phase 08
**Authority:** Emergency protocol in the event of an unrecoverable P0 issue during live deployment.

---

## 1. Rollback Triggers (Immediate Abort Conditions)

* Any critical 5xx server crash on core entry routes (`/`, `/fm-london`, `/mechanical-electrical`) exceeding 5 minutes.
* SSL certificate failure or persistent DNS resolution failure.
* Form submission fatal exception causing leads to be silently dropped.
* Production environment broadcasting `noindex` across indexable routes that cannot be corrected within 10 minutes.

---

## 2. Step-by-Step Rollback Procedure

1. **Hosting Platform Rollback:** Instant redeployment of previous stable deployment alias via hosting dashboard (1-click redeploy).
2. **DNS Reversion:** If DNS records were modified, revert A/CNAME records to the previous origin server IP.
3. **Cache Purge:** Purge edge CDN cache globally.
4. **Post-Rollback Verification:** Test `https://entirefm.com/` returns HTTP 200 with previous stable version.
5. **Incident Logging:** Document the failure mechanism in `docs/migration/INCIDENT-LOG.md` before attempting a re-cutover.
