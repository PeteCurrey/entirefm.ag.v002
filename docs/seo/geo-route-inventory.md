# EntireFM Geo SEO Route Estate Inventory & Audit

## 1. Overall Route Estate Summary
- **Total Indexable Routes in Application**: `374`
- **Total Protected Routes**: `374` (100% protected against deletion/redirect)
- **Total Status 200 OK Routes**: `374` (0 redirects, 0 broken, 0 404s)
- **Total Self-Referencing Canonical Routes**: `374` (`canonical: 'self'`)
- **Total Geo-Related Routes**: `166`
  - **Flat Legacy Primary Geo Routes** (`/fm-[city]`): `21`
  - **Flat Legacy Secondary Geo Routes** (`/facilities-management-[city]`): `21`
  - **Flat Legacy Third Geo Routes** (`/[city]-facilities-management`): `18`
  - **Flat Regional / Area / Legacy Alias Routes**: `6`
  - **Flat Geographic Service Permutations** (`/commercial-cleaning-[city]`, etc.): `34`
  - **Lincoln Specialized Sector Routes** (`/commercial-fm-lincoln`, etc.): `4`
  - **Glossary Location Routes** (`/facilities-management-glossary-[city]`): `21`
  - **Local Blog Post Routes**: `2`
  - **Location Hubs** (`/locations/[city]`): `21`
  - **Location Services Overview Hubs** (`/locations/[city]/services`): `21`
  - **National Location Directory** (`/locations`): `1`

---

## 2. Location Hub Status Matrix (`/locations/{city}`)

All 21 location hubs return HTTP 200, have self-referencing canonicals, and are indexed in sitemaps:

| City | Route Path | HTTP Response | Redirect? | Canonical | Indexable | Template / Component | Sitemap Group |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **London** | `/locations/london` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Manchester** | `/locations/manchester` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Birmingham** | `/locations/birmingham` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Leeds** | `/locations/leeds` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Sheffield** | `/locations/sheffield` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Liverpool** | `/locations/liverpool` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Nottingham** | `/locations/nottingham` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Derby** | `/locations/derby` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Oxford** | `/locations/oxford` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Chesterfield** | `/locations/chesterfield` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Doncaster** | `/locations/doncaster` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Rotherham** | `/locations/rotherham` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Lincoln** | `/locations/lincoln` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Bradford** | `/locations/bradford` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Bolton** | `/locations/bolton` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Bury** | `/locations/bury` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Preston** | `/locations/preston` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Wigan** | `/locations/wigan` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Grimsby** | `/locations/grimsby` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Telford** | `/locations/telford` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |
| **Matlock** | `/locations/matlock` | `200` | No | `self` | `true` | `TemplatePrimaryLocation` | `locations` |

---

## 3. Location Services Status Matrix (`/locations/{city}/services`)

All 21 location services overview pages are live, self-referencing, and indexed:

| City | Route Path | Exists? | HTTP | Canonical | Indexable | Template / Component | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| **London** | `/locations/london/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Manchester** | `/locations/manchester/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Birmingham** | `/locations/birmingham/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Leeds** | `/locations/leeds/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Sheffield** | `/locations/sheffield/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Liverpool** | `/locations/liverpool/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Nottingham** | `/locations/nottingham/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Derby** | `/locations/derby/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Oxford** | `/locations/oxford/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Chesterfield** | `/locations/chesterfield/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Doncaster** | `/locations/doncaster/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Rotherham** | `/locations/rotherham/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Lincoln** | `/locations/lincoln/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Bradford** | `/locations/bradford/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Bolton** | `/locations/bolton/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Bury** | `/locations/bury/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Preston** | `/locations/preston/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Wigan** | `/locations/wigan/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Grimsby** | `/locations/grimsby/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Telford** | `/locations/telford/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |
| **Matlock** | `/locations/matlock/services` | Yes | `200` | `self` | `true` | `TemplateLocalService` | **LIVE** |

---

## 4. Complete Inventory of Existing Geo URLs Grouped by City

### 1. London (13 Routes)
- `/fm-london`
- `/facilities-management-london`
- `/london-facilities-management`
- `/london-facilities-management-areas`
- `/commercial-cleaning-london`
- `/contract-cleaning-london`
- `/office-cleaning-london`
- `/industrial-cleaning-london`
- `/external-cleaning-london`
- `/pressure-washing-london`
- `/facilities-management-glossary-london`
- `/locations/london`
- `/locations/london/services`

### 2. Manchester (13 Routes)
- `/fm-manchester`
- `/facilities-management-manchester`
- `/manchester-facilities-management`
- `/manchester-facilities-managment` (Protected legacy spelling alias)
- `/commercial-cleaning-manchester`
- `/contract-cleaning-manchester`
- `/manchester-office-cleaning`
- `/industrial-cleaning-manchester`
- `/external-cleaning-manchester`
- `/pressure-washing-manchester`
- `/facilities-management-glossary-manchester`
- `/locations/manchester`
- `/locations/manchester/services`

### 3. Birmingham (11 Routes)
- `/fm-birmingham`
- `/facilities-management-birmingham`
- `/birmingham-facilities-management`
- `/commercial-cleaning-birmingham`
- `/industrial-cleaning-birmingham`
- `/external-cleaning-birmingham`
- `/pressure-washing-birmingham`
- `/facilities-management-glossary-birmingham`
- `/post/facilities-management-to-birmingham`
- `/locations/birmingham`
- `/locations/birmingham/services`

### 4. Leeds (9 Routes)
- `/fm-leeds`
- `/facilities-management-leeds`
- `/leeds-facilities-management`
- `/commercial-cleaning-leeds`
- `/contract-cleaning-leeds`
- `/industrial-cleaning-leeds`
- `/facilities-management-glossary-leeds`
- `/locations/leeds`
- `/locations/leeds/services`

### 5. Sheffield (13 Routes)
- `/fm-sheffield`
- `/facilities-management-sheffield`
- `/sheffield-facilities-management`
- `/fm-services-sheffield`
- `/sheffield`
- `/commercial-cleaning-sheffield`
- `/contract-cleaning-sheffield`
- `/industrial-cleaning-sheffield`
- `/pressure-washing-sheffield`
- `/mobile-crane-hire/sheffield`
- `/facilities-management-glossary-sheffield`
- `/locations/sheffield`
- `/locations/sheffield/services`

### 6. Liverpool (6 Routes)
- `/fm-liverpool`
- `/facilities-management-liverpool`
- `/liverpool-facilities-management`
- `/facilities-management-glossary-liverpool`
- `/locations/liverpool`
- `/locations/liverpool/services`

### 7. Nottingham (8 Routes)
- `/fm-nottingham`
- `/facilities-management-nottingham`
- `/nottingham-facilities-management`
- `/commercial-cleaning-nottingham`
- `/industrial-cleaning-nottingham`
- `/facilities-management-glossary-nottingham`
- `/locations/nottingham`
- `/locations/nottingham/services`

### 8. Derby (7 Routes)
- `/fm-derby`
- `/facilities-management-derby`
- `/derby-facilities-management`
- `/industrial-cleaning-derby`
- `/facilities-management-glossary-derby`
- `/locations/derby`
- `/locations/derby/services`

### 9. Oxford (6 Routes)
- `/fm-oxford`
- `/facilities-management-oxford`
- `/oxford-facilities-management`
- `/facilities-management-glossary-oxford`
- `/locations/oxford`
- `/locations/oxford/services`

### 10. Chesterfield (11 Routes)
- `/fm-chesterfield`
- `/facilities-management-chesterfield`
- `/chesterfield-facilities-management`
- `/chesterfield`
- `/commercial-cleaning-chesterfield`
- `/contract-cleaning-chesterfield`
- `/industrial-cleaning-chesterfield`
- `/mobile-crane-hire/chesterfield`
- `/facilities-management-glossary-chesterfield`
- `/locations/chesterfield`
- `/locations/chesterfield/services`

### 11. Doncaster (6 Routes)
- `/fm-doncaster`
- `/facilities-management-doncaster`
- `/doncaster-facilities-management`
- `/facilities-management-glossary-doncaster`
- `/locations/doncaster`
- `/locations/doncaster/services`

### 12. Rotherham (6 Routes)
- `/fm-rotherham`
- `/facilities-management-rotherham`
- `/rotherham-facilities-management`
- `/facilities-management-glossary-rotherham`
- `/locations/rotherham`
- `/locations/rotherham/services`

### 13. Lincoln (18 Routes)
- `/fm-lincoln`
- `/facilities-management-lincoln`
- `/lincoln-facilities-management`
- `/lincoln-facilities-management-areas`
- `/commercial-fm-lincoln`
- `/industrial-fm-lincoln`
- `/residential-fm-lincoln`
- `/retail-fm-lincoln`
- `/commercial-cleaning-lincoln`
- `/contract-cleaning-lincoln`
- `/office-cleaning-lincoln`
- `/industrial-cleaning-lincoln`
- `/external-cleaning-lincoln`
- `/pressure-washing-lincoln`
- `/facilities-management-glossary-lincoln`
- `/post/facilities-management-services-in-lincoln`
- `/locations/lincoln`
- `/locations/lincoln/services`

### 14. Bradford (6 Routes)
- `/fm-bradford`
- `/facilities-management-bradford`
- `/bradford-facilities-management`
- `/facilities-management-glossary-bradford`
- `/locations/bradford`
- `/locations/bradford/services`

### 15. Bolton (6 Routes)
- `/fm-bolton`
- `/facilities-management-bolton`
- `/bolton-facilities-management`
- `/facilities-management-glossary-bolton`
- `/locations/bolton`
- `/locations/bolton/services`

### 16. Bury (6 Routes)
- `/fm-bury`
- `/facilities-management-bury`
- `/bury-facilities-management`
- `/facilities-management-glossary-bury`
- `/locations/bury`
- `/locations/bury/services`

### 17. Preston (6 Routes)
- `/fm-preston`
- `/facilities-management-preston`
- `/preston-facilities-management`
- `/facilities-management-glossary-preston`
- `/locations/preston`
- `/locations/preston/services`

### 18. Wigan (6 Routes)
- `/fm-wigan`
- `/facilities-management-wigan`
- `/wigan-facilities-management`
- `/facilities-management-glossary-wigan`
- `/locations/wigan`
- `/locations/wigan/services`

### 19. Grimsby (6 Routes)
- `/fm-grimsby`
- `/facilities-management-grimsby`
- `/grimsby-facilities-management`
- `/facilities-management-glossary-grimsby`
- `/locations/grimsby`
- `/locations/grimsby/services`

### 20. Telford (7 Routes)
- `/fm-telford`
- `/facilities-management-telford`
- `/facilities-management-in-telford`
- `/telford-facilities-management`
- `/facilities-management-glossary-telford`
- `/locations/telford`
- `/locations/telford/services`

### 21. Matlock (4 Routes)
- `/fm-matlock`
- `/facilities-management-glossary-matlock`
- `/locations/matlock`
- `/locations/matlock/services`

### 22. Regional Hubs (3 Routes)
- `/locations`
- `/facilities-management-midlands`
- `/facilities-management-in-the-midlands`
