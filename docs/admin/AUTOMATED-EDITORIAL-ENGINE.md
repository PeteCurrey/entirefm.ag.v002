# Automated FM Editorial Engine

## Overview
The EntireFM Automated Editorial Engine discovers, scores, verifies, and drafts 3–5 high-quality FM trade articles every week.

## Quality Gate: `WEEKLY_QUALITY_GATE_NOT_MET`
If the topic discovery engine cannot find at least 3 genuine, highly relevant, and collision-free industry topics, the cycle logs `WEEKLY_QUALITY_GATE_NOT_MET` and halts execution.
**No low-quality AI filler content is ever published to hit an arbitrary quota.**

## Emergency Controls
- **Emergency Hold**: When activated in `/admin/blog/automation`, all automated generation and scheduled publication is immediately paused.
- **Kill Switches**: Research, Draft, and Publish stages can be individually enabled/disabled.

## Regulatory Verification
Drafts are verified against:
- Health and Safety Executive (HSE) & ACOP L8
- Building Safety Regulator & Building Safety Act 2022
- BS 7671 (IET Wiring Regulations)
- BS 5266-1 (Emergency Lighting)
- BESA SFG20 Standard Maintenance Specification
- CIBSE Technical Codes
