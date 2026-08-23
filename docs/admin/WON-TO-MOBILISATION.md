# EntireFM Won Opportunity to Operations Mobilisation Handoff

## 1. Handoff Architecture

When an opportunity moves to `WON`, the system automatically executes a structured mobilisation handoff:

1. **State Mutation**: Opportunity transitions to `WON` and `mobilisation_status` is updated to `HANDED_OFF`.
2. **Operations Task Creation**: An urgent mobilisation onboarding task is generated for the Operations Director:
   - Contract creation in EntireCAFM
   - Site profile generation
   - Asset register intake and SFG20 PPM schedule setup
   - 24/7 Helpdesk triage rules and client portal invitation
3. **Traceability**: The source lead, attribution path, and proposal records remain linked to the permanent operational contract record.
