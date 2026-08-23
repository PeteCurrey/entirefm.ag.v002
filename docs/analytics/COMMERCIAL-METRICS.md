# EntireFM Commercial Metrics Definitions

| Metric Name | Formula / Definition | Purpose |
|---|---|---|
| **Total Enquiries** | Count of all inbound form submissions in `leads` table | Gross inbound volume |
| **Qualified Leads** | Leads marked `QUALIFIED`, `OPPORTUNITY`, `PROPOSAL`, or `WON` | Real commercial viability |
| **Qualification Rate (%)** | `(Qualified Leads / Total Enquiries) * 100` | Traffic & lead quality index |
| **Lead Conversion Rate (%)** | `(Total Leads / Unique Sessions) * 100` | Landing page efficiency |
| **Assisted Lead** | A lead whose journey trail included this URL prior to the conversion page | Measures content assist power |
| **Tool Completion Rate (%)** | `(Tool Completed / Tool Starts) * 100` | Usability and utility of calculators |
| **Pipeline Value (£)** | Sum of `estimated_value_gbp` for open opportunities | Forward commercial revenue |
| **Won Revenue (£)** | Sum of `estimated_value_gbp` for closed/won proposals | Real closed business |
