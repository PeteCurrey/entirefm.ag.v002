# How to Publish to The Lobby

This runbook guides EntireFM editorial and engineering staff on how to create, edit, curate, and maintain content in **The Lobby** (`/lobby`).

---

## Architecture Overview

The Lobby cleanly separates three layers:

1. **Content Store** (`src/lib/lobby/content-store.ts`): Typed article objects holding all narrative, diagnostic, and structured franchise data.
2. **Homepage Curation** (`src/lib/lobby/curation.ts`): Explicit slot assignments determining what appears on the Lobby homepage.
3. **Presentation & Templates** (`src/templates/lobby/`): Reusable UI layouts that consume content without embedding hard-coded copy.

---

## 1. How to Create a New Lobby Item

Open `src/lib/lobby/content-store.ts` and add a new object to the `LOBBY_ARTICLES` array.

```typescript
{
  id: 'art-your-unique-id',
  slug: 'human-readable-url-slug',
  title: 'Clear, Authoritative Headline',
  standfirst: 'A 2-3 sentence summary explaining why this matters to FM practitioners.',
  contentType: 'briefing', // 'analysis' | 'briefing' | 'technical-note' | 'q-and-a' | 'field-note' | 'event' | 'resource-feature' | 'update'
  franchise: 'compliance-watch', // See Franchises below
  topics: ['building-safety', 'compliance'], // See Topics below
  author: LOBBY_AUTHORS['entirefm-compliance'],
  publishedAt: '2026-08-27',
  status: 'published', // 'draft' | 'published' | 'archived'
  contentLifecycle: 'time-sensitive', // 'evergreen' | 'time-sensitive'
  readingTimeMinutes: 4,
  bodyBlocks: [
    {
      type: 'paragraph',
      content: 'Main editorial text...',
    },
    {
      type: 'heading2',
      content: '1. Key Operational Impact',
    },
  ],
}
```

---

## 2. Required Fields

| Field | Description | Example |
|---|---|---|
| `id` | Unique string identifier | `'art-bsa-update-2026'` |
| `slug` | Clean URL slug for `/lobby/[slug]` | `'building-safety-update-2026'` |
| `title` | Editorial headline | `'Building Safety Act Secondary Legislation'` |
| `standfirst` | Concise opening summary | `'The transition period for digital occurrence reporting...'` |
| `contentType` | Editorial format | `'briefing'` |
| `franchise` | Recognisable Lobby series | `'compliance-watch'` |
| `topics` | Array of topic slugs | `['building-safety', 'compliance']` |
| `author` | Author object | `LOBBY_AUTHORS['entirefm-compliance']` |
| `publishedAt` | Publication date | `'2026-08-27'` |
| `status` | Visibility status | `'published'` (or `'draft'` to hide from public) |
| `contentLifecycle` | Lifecycle classification | `'time-sensitive'` or `'evergreen'` |
| `readingTimeMinutes` | Estimated read time | `4` |
| `bodyBlocks` | Array of content blocks | `[{ type: 'paragraph', content: '...' }]` |

---

## 3. How to Assign a Franchise

The Lobby features 7 core editorial franchises:

- `'week-that-matters'`: 3–5 key industry developments, prioritised.
- `'compliance-watch'`: Regulatory translation. Requires `complianceData` object.
- `'engineers-note'`: Practical technical diagnostic. Requires `engineersNoteData` object.
- `'useful-thing'`: Downloadable asset/tool CTA. Requires `usefulThingData` object.
- `'ask-entirefm'`: Professional Q&A. Requires `askEntireFMData` object.
- `'from-the-field'`: Photography-led defect observation. Requires `fromTheFieldData` object.
- `'worth-attending'`: Curated CPD event or webinar. Requires `worthAttendingData` object.

### Specialist Fields Example (Compliance Watch)

```typescript
complianceData: {
  statute: 'Building Safety Act 2022 / Golden Thread Regulations',
  governingBody: 'Building Safety Regulator (HSE)',
  urgency: 'HIGH', // 'HIGH' | 'MEDIUM' | 'MONITORING'
  effectiveDate: 'Enforced Q4 2026',
  actionDeadline: 'Immediate for active PPM contracts',
  whatChanged: 'Mandatory 48-hour digital occurrence logging...',
  whoItAffects: 'Duty holders and Responsible Persons...',
  whatYouNeedToDo: 'Audit CAFM change-logs and contractor accreditations...',
  whenItMatters: 'Immediate action required for active PPM cycles...',
  complianceClassification: 'LEGAL DUTY', // See Classification below
  officialSourceUrl: 'https://www.hse.gov.uk',
}
```

### Compliance Classifications

Always distinguish accurately between:
- `LEGAL DUTY` (Direct parliamentary legislation)
- `REGULATION` (Statutory instrument)
- `APPROVED CODE / GUIDANCE` (HSE ACOP / Guidance)
- `BRITISH STANDARD` (e.g. BS 7671, BS 5266)
- `INDUSTRY STANDARD` (e.g. SFG20)
- `MANUFACTURER REQUIREMENT` (Warranty conditions)
- `BEST PRACTICE` (Professional recommendation)
- `RISK-BASED REQUIREMENT` (Site risk assessment outcome)

---

## 4. How to Assign Topics

Assign one or more slugs from `src/lib/lobby/topics.ts`:

- `building-safety`
- `fire-safety`
- `electrical`
- `water-hygiene`
- `hvac`
- `ppm`
- `asset-management`
- `cafm-technology`
- `ai-automation`
- `procurement`
- `mobilisation`
- `contract-management`
- `sustainability`
- `health-safety`
- `compliance`

---

## 5. How to Assign an Author

Use predefined author identities from `src/lib/lobby/authors.ts`:

- `LOBBY_AUTHORS['entirefm-technical']`
- `LOBBY_AUTHORS['entirefm-compliance']`
- `LOBBY_AUTHORS['entirefm-operations']`
- `LOBBY_AUTHORS['entirefm-editorial']`

---

## 6. How to Add Imagery

Place high-resolution WebP images in `public/images/editorial/` and reference the path:

```typescript
heroImage: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
heroImageAlt: 'Descriptive alt text for accessibility and SEO',
```

---

## 7. How to Add Sources

Add primary legal, technical, or regulatory citations in the `sources` array:

```typescript
sources: [
  {
    title: 'Building Safety Act 2022 Statutory Guidance',
    authority: 'Building Safety Regulator / HSE',
    url: 'https://www.hse.gov.uk/building-safety/',
    publishedDate: '2024 (Updated 2026)',
  },
]
```

---

## 8. How to Link an Existing Resource

Add contextual links to existing EntireFM guides or pages:

```typescript
relatedResources: [
  {
    title: 'Fire Risk Assessment Compliance Guide',
    description: 'RRO 2005 obligations and review triggers.',
    url: '/compliance/fire-risk-assessment',
    type: 'compliance',
    badge: 'Statutory Authority',
  },
]
```

---

## 9. How to Link an Existing FM Tool

Link directly to existing interactive tools:

```typescript
relatedResources: [
  {
    title: 'PPM Schedule Builder',
    description: 'Generate an asset-led 52-week maintenance matrix.',
    url: '/tools/ppm-schedule-builder',
    type: 'tool',
    badge: 'Planning Suite',
  },
]
```

---

## 10. How to Publish / Unpublish

- Set `status: 'published'` to make the article publicly accessible, indexable, and eligible for homepage curation.
- Set `status: 'draft'` to hide the article from the public, archive, topics, and sitemaps.
- Set `status: 'archived'` for retired material.

---

## 11. How to Change Homepage Curation (Monday Morning Workflow)

To change which story appears on the `/lobby` homepage, open `src/lib/lobby/curation.ts` and update the slug for the desired slot:

```typescript
export const LOBBY_HOMEPAGE_CURATION: LobbyHomepageCuration = {
  updatedAt: '2026-08-27',
  editionLabel: 'Edition 2026.35',

  leadStorySlug: 'building-safety-act-what-fm-teams-need-to-know-now',
  complianceWatchSlug: 'mandatory-digital-occurrence-reporting-duty-holder-rules',
  engineersNoteSlug: 'condenser-airflow-starvation-on-enclosed-rooftops',
  usefulThingSlug: 'fm-mobilisation-handover-audit-matrix',
  fromTheFieldSlug: 'rooftop-condenser-vibration-resonance-defect',
  askEntireFMSlug: 'mobilisation-handover-what-compliance-data-to-demand',
  worthAttendingSlug: 'building-decarbonisation-hard-fm-summit-2026',
  
  featuredToolkitUrls: [
    '/tools/ppm-schedule-builder',
    '/tools/compliance-checker',
    '/tools/tender-brief',
  ],

  activeQuestionId: 'lq-2026-w35',
  activePulseId: 'pulse-2026-08',
};
```

---

## 12. How to Update an Article

1. Edit the article in `src/lib/lobby/content-store.ts`.
2. Update `updatedAt: 'YYYY-MM-DD'`.
3. If statutory review was performed, update `reviewedAt: 'YYYY-MM-DD'` and `reviewBy: 'Name/Role'`.

---

## 13. How to Mark Time-Sensitive Content for Review

For regulatory shifts or deadlines:
1. Set `contentLifecycle: 'time-sensitive'`.
2. Add `effectiveDate` and optional `actionDeadline` in the `complianceData` block.
3. Schedule periodic quarterly review of all items where `contentLifecycle === 'time-sensitive'`.

---

## 14. Curated Slot Cadence & Staleness Guardrails

While the **Briefing Wire** and **Compliance Watch** are powered by automated live data pipelines from `intelligence_items`, the long-form editorial modules on `/lobby` are human-curated. To prevent these slots from becoming stale, the platform enforces an observability guardrail.

### Refresh Cadence

| Editorial Slot | Franchise | Minimum Cadence | Rationale |
|---|---|---|---|
| **Lead Briefing** | `week-that-matters` | **Weekly (every Monday)** | Sets the dominant news hook for the current edition cycle. Must rotate every week. |
| **The Engineer's Note** | `engineers-note` | **Bi-weekly (fortnightly)** | Technical diagnostics and field engineering best practices. |
| **One Useful Thing** | `useful-thing` | **Monthly** | High-utility downloadable spreadsheets, checklists, or calculators. |
| **From The Field** | `from-the-field` | **Bi-weekly** | Photographic site defect challenge and resolution. |
| **Ask EntireFM** | `ask-entirefm` | **Bi-weekly** | Practical operational Q&A addressing duty-holder questions. |
| **Worth Attending** | `worth-attending` | **Monthly / Per Event** | Upcoming CPD webinars, seminars, and technical conferences. |

### How to Publish and Rotate Curated Content

Publishing a new editorial rotation requires editing only **two files**:

1. **`src/lib/lobby/content-store.ts`**:
   Add the new article object to `LOBBY_ARTICLES` with current `publishedAt: 'YYYY-MM-DD'` and `status: 'published'`.

2. **`src/lib/lobby/curation.ts`**:
   Update `LOBBY_HOMEPAGE_CURATION` (or the `lobby_homepage_curation` database table via Admin Curation):
   - Set `updatedAt: 'YYYY-MM-DD'` to today's date.
   - Point the corresponding slot slug (e.g. `leadStorySlug`, `engineersNoteSlug`, etc.) to the new article's slug.

### Automated Staleness Warnings

The server-side data resolver (`src/lib/lobby/repository.ts`) inspects the `publishedAt` date of all resolved editorial items at request time:
- If the resolved **Lead Story** (or any curated slot) exceeds **7 days** since publication, a server warning is emitted to Vercel/production logs:
  ```
  [Lobby] Lead story is 11 days stale: building-safety-act-what-fm-teams-need-to-know-now
  ```
- This warning does not break or hide content on the page—it provides operational visibility so editors and developers know a scheduled content refresh is overdue.

