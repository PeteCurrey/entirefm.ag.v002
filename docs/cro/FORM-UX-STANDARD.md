# EntireFM Form UX & Progressive Disclosure Standards

## 1. Minimal Initial Friction
Initial commercial enquiry forms capture only strictly necessary information:
- **Full Name**
- **Company / Organisation**
- **Work Email**
- **Direct Telephone**
- **Estate Location / Postcode**
- **Requirement Summary / Service Scope**

## 2. Context Preservation
- Forms automatically ingest hidden contextual metadata from the URL and referrer (e.g. `service: "PPM"`, `location: "Manchester"`, `landingPage: "/ppm"`).
- The user is never asked to re-select obvious context they arrived from.

## 3. Server-Side Reliability & State
- Clear inline validation without blocking input.
- Meaningful loading states during submission.
- Reassuring confirmation state detailing next steps and offering an optional relevant guide while waiting.
- Zero silent failures.
