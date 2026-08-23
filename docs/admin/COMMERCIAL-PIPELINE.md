# EntireFM Commercial Sales Pipeline Architecture

## 1. Overview & Stage Lifecycle

The EntireFM commercial pipeline manages inbound enquiries from initial web submission through to operational mobilisation:

```
  Website Inbound Lead
          │
          ▼
  1. Lead Qualification (/admin/growth/leads)
          │
          ▼  [CONVERT TO OPPORTUNITY]
  2. Discovery & Scope Review (/admin/commercial/pipeline)
          │
          ▼  [TASK: CONDUCT DISCOVERY CALL]
  3. Site Survey & Asset Inspection (/admin/commercial/site-surveys)
          │
          ▼  [GENERATE PROPOSAL]
  4. Proposal Preparation & Approvals (/admin/commercial/quotes)
          │
          ▼  [CLIENT PROPOSAL SENT]
  5. Negotiation & Tender Clarification
          │
          ├──► [LOST] ──► Loss Reason Categorisation (/admin/commercial/lost)
          │
          ▼  [WON]
  6. EntireCAFM Mobilisation Handoff (Contracts, Sites, Helpdesk)
```

---

## 2. Pipeline Stages & Exit Criteria
1. **QUALIFIED**: Verified service, location, and requirement fit.
2. **DISCOVERY**: Requirements gathered, pain points understood.
3. **SITE_SURVEY**: Engineering walkthrough scheduled or completed.
4. **PROPOSAL_PREPARATION**: Quote / tender document drafted.
5. **PROPOSAL_SENT**: Proposal formally submitted with scheduled follow-up date.
6. **NEGOTIATION**: Scope refinements and pricing finalisation.
7. **WON**: Contract agreed; initiates operations handoff.
8. **LOST**: Closed with recorded loss reason.
