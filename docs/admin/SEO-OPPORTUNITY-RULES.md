# SEO Opportunity Decision Rules

## 1. Evaluation Hierarchy
For any detected query opportunity:
1. **Does an existing page already own this search intent?**
   - **YES** → Classify as `UPDATE_EXISTING`, `EXPAND_EXISTING`, `IMPROVE_METADATA`, or `ADD_FAQ`.
   - **NO** → Check if query represents a distinct informational or commercial topic.
2. **Is it a true gap?**
   - **YES** → Classify as `CREATE_NEW_ARTICLE` or `CREATE_NEW_RESOURCE`.
3. **Is it a duplicate or cannibalisation risk?**
   - **YES** → Flag as `CANNIBALISATION` / `HUMAN_REVIEW`.

## 2. Protected Historic Route Safety
- No automatic consolidation can delete, redirect, canonicalise away, or noindex any protected historic Wix route.
