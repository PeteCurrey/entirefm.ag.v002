# Launch runbook — connecting entirefm.com

Everything below has been verified locally against a production-simulation
build. The steps are in dependency order; steps 1–3 are the ones that decide
whether this launch achieves its purpose.

---

## 1. Set the build-time environment variables — **THE CRITICAL STEP**

The indexing gate is evaluated **when the site is built, not when it is
served**. Setting these after deployment does nothing until the next build.

In Vercel → Project → Settings → Environment Variables, scoped to
**Production**:

| Variable | Value | Why |
|---|---|---|
| `ALLOW_SEARCH_INDEXING` | `true` | Without it every page ships `noindex` and `robots.txt` says `Disallow: /` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.entirefm.com` | Third condition of the gate; also fixes sitemap and canonical hosts |
| `VERCEL_ENV` | *(set by Vercel automatically)* | Second condition — nothing to do |

Then **redeploy**. A redeploy is mandatory; the variables only take effect
through a build.

**Verify immediately after deploy** — this takes ten seconds and is the
difference between a successful launch and a silent failure:

```bash
curl -s https://www.entirefm.com/robots.txt
```

You want `Allow: /`. If you see `Disallow: /`, the gate did not open — the
site is live and invisible to Google. Do not proceed until this is right.

---

## 2. Create the leads table

Supabase → SQL Editor → New query → paste the contents of
`supabase/migrations/0001_leads.sql` → Run.

Without it the enquiry endpoint is fail-closed and returns 503 to every
submission. It refuses rather than pretending, so nothing is lost silently —
but nothing is captured either.

Then set, in Vercel Production:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` |
| `ADMIN_PASSWORD` | a strong password of your choosing, for `/admin` |
| `RESEND_API_KEY` | *optional* — adds an email alert on top of the record |
| `LEAD_DELIVERY_EMAIL` | *optional* — where that alert goes |

**Verify:** submit a test enquiry through `/contact-us`, then open `/admin`
and confirm the row is there with its conversion page recorded.

> The service role key bypasses row level security. It must only ever be a
> server-side variable — never prefixed `NEXT_PUBLIC_`.

---

## 3. Point the domain

Vercel → Project → Settings → Domains → add `www.entirefm.com` and
`entirefm.com`, then follow the DNS instructions Vercel gives you.

Set **`www.entirefm.com` as the primary**, with the apex redirecting to it.
Every canonical URL in the build points at `www`, so making the apex primary
would put the whole site one redirect away from its own canonicals.

---

## 4. Tell Google, the same day

1. Search Console → **Sitemaps** → submit `https://www.entirefm.com/sitemap.xml`
2. Search Console → **URL Inspection** → request indexing on the pages that
   used to earn the traffic, highest value first:
   - `/facilities-management-london`
   - `/facilities-management-manchester`
   - `/facilities-management-sheffield`
   - `/facilities-management-leeds`
   - `/facilities-management-birmingham`
3. Search Console → **Removals** → check nothing is left over from the
   previous site suppressing URLs.

Recovery is not instant. The 138 URLs that were returning hard 404 have to be
recrawled before their history can reassert itself, and that takes days to
weeks depending on crawl budget. What matters today is that the crawler finds
200s where it previously found 404s.

---

## 5. Post-launch verification

```bash
npm run verify:legacy-estate:prod
```

Crawls both Wix estates and checks every historic URL against the live site.
It should report **202 real URLs, 0 uncovered**. Run it the day after launch
and again a week later.

---

## What is deliberately not indexable

`/portfolio` ships `noindex` because it is 97.7% identical to
`/case-studies`. It is still a live 200 page — the legacy floor is intact —
and it goes back into the index the moment it carries distinct content.
127 further legacy pages are in the same state; see
`config/indexation-tiers.json` for the full list and the reason for each.

This is deliberate. Publishing 128 near-identical pages is what tells Google
the site is thin; publishing 131 distinct ones and holding the rest until they
say something different is the recovery.

---

## Known gaps at launch

Stated plainly so nothing is discovered later:

- **Client names and figures.** No case study names a client and none quotes a
  metric. Both need permission and evidence respectively.
- **Accreditations.** NICEIC, Gas Safe, CHAS, SafeContractor, BESA, ISO 9001
  and REFCOM are all `TO_VERIFY` and therefore render nowhere. Supply
  certificate numbers and they can go live.
- **Leeds and Lincoln photography.** Leeds currently has none of its own — the
  source folder is byte-identical to Sheffield — and Lincoln has none at all.
- **Resources.** The hub exists; the interactive tools, guides and knowledge
  articles are not built yet.
- **`/case-studies` detail pages.** The lobby opens each engagement in place.
  Separate pages follow once there is real client detail to put on them.
