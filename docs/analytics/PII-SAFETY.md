# EntireFM Analytics PII Safety Specification

## Prohibited Data
The following fields MUST NEVER be included in client-side analytics event dispatches:

1. **Personal Identifiers**:
   - Full names
   - Email addresses
   - Telephone numbers
   - Physical estate addresses
2. **Form Message Payloads**:
   - Free-text enquiry messages
   - RFQ notes
   - File attachment names
3. **Sensitive Corporate Data**:
   - Non-public contract values
   - Employee headcounts
   - Security access PINs or passwords

---

## Safe Parameter Whitelist
Only approved non-PII attributes may be attached to analytics events:
- `page_type`, `path`, `service`, `location`, `sector`, `position`, `cta_type`, `tool_id`.
