# Content Decay Detection Rules

## Thresholds
- Meaningful period comparisons: Last 28 Days vs Previous 28 Days.
- Minimum data thresholds required to flag decay (prevents noisy low-volume alerts):
  - Minimum 50 impressions in the previous period.
  - Drop in clicks > 25% OR worsening of average position by > 4.0 positions.

## Safeguards
- Zero mock metrics when Search Console credentials are not present.
- Decay alerts generate refresh recommendations in admin; they never silently overwrite live content.
