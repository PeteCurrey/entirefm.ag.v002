# EntireFM Structured Data & Schema Governance

## 1. Allowed Schema Types & Usage Rules
- **`Organization`**: Restricted to canonical sitewide graph. Reflects verified company facts only.
- **`WebSite`**: Root search box and canonical host definition.
- **`WebPage` / `ItemPage`**: General webpage wrapper.
- **`TechArticle` / `Article`**: Reserved for substantial educational guides, AI research, and compliance guides.
- **`Service`**: Used strictly on commercial service and geographic service landing pages. Contains legitimate `serviceType`, `provider`, and `areaServed`.
- **`BreadcrumbList`**: Automatically generated on all nested pages.
- **`DefinedTermSet` & `DefinedTerm`**: Applied to the FM Glossary.
- **`FAQPage`**: Used only when visible question-and-answer pairs exist on the page.

## 2. Strictly Prohibited Schema Patterns
- **No Fake Ratings / Reviews**: Zero `AggregateRating` or fabricated star review schema.
- **No Fake LocalBusiness Offices**: Never emit `LocalBusiness` with non-existent street addresses on remote geographic landing pages.
- **No Misleading HowTo / Dataset Schema**: Only apply if a bona fide downloadable dataset or step-by-step tool is present.
