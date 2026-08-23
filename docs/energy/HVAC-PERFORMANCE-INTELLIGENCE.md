# EntireFM HVAC Performance & Control Conflict Intelligence

## 1. Simultaneous Heating and Cooling Detection
- Triggered only when supporting BMS point telemetry exists:
  - Heating control valve command >20%
  - Cooling control valve command >20%
  - Concurrently active within the same thermal zone for >15 continuous minutes.
- Labelled strictly as `POTENTIAL_CONTROL_CONFLICT` until physical valve actuation is confirmed on site by an engineer.
