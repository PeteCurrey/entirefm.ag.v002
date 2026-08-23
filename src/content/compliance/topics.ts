/**
 * COMPLIANCE CENTRE — TOPIC DATA
 * ==============================
 * The distinction this whole section exists to make:
 *
 *   LEGAL       what legislation actually requires
 *   STANDARD    the recognised technical basis (a BS, an ACOP, a code)
 *   PRACTICE    the interval the industry commonly works to
 *   RISK        where the answer genuinely depends on context
 *
 * Almost every FM website states an interval as though it were the law.
 * Usually it is not. "Emergency lighting must be tested annually" is a
 * standard, not a statute. "PAT testing every year" is neither — it is a
 * habit. Buyers get caught out by this, and being the site that separates the
 * four is worth more than being the site with the most pages.
 *
 * ACCURACY NOTES
 * --------------
 * Legislation cited is England and Wales unless stated; Scotland and Northern
 * Ireland differ on fire safety in particular, and each topic says so where it
 * matters. Frequencies described as PRACTICE are what competent providers
 * commonly do, not obligations.
 *
 * This is general information, not legal advice — every page carries that
 * notice, and it is not boilerplate: a duty holder who relies on a web page
 * instead of a competent assessment has not discharged anything.
 */

export type RequirementLevel = 'LEGAL' | 'STANDARD' | 'PRACTICE' | 'RISK';

export interface Requirement {
  level: RequirementLevel;
  /** The obligation or interval, stated plainly. */
  statement: string;
  /** Where it comes from — the Act, Regulation, ACOP or standard. */
  source: string;
  /** Why it is at this level rather than the one above. */
  note?: string;
}

export interface ComplianceTopic {
  slug: string;
  /** Page title fragment and H1 subject. */
  name: string;
  /** Short label for cards and navigation. */
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** One-sentence answer, placed first — extractable for snippets and AI. */
  answer: string;
  intro: string;
  /** Who carries the duty in law. */
  dutyHolder: string;
  requirements: Requirement[];
  /** What actually proves the work was done. */
  evidence: string[];
  /** The consequences of getting it wrong, stated without scaremongering. */
  consequences: string;
  /** Where duty holders most often come unstuck. */
  commonFailings: string[];
  faqs: Array<{ question: string; answer: string }>;
  /** Related EntireFM service pages. */
  relatedServices: string[];
  /** Editorial image key for the hero. */
  imageKey?: string;
}

export const COMPLIANCE_TOPICS: ComplianceTopic[] = [
  // ── Fire safety ─────────────────────────────────────────────────────────
  {
    slug: 'fire-risk-assessment',
    name: 'Fire Risk Assessment',
    shortName: 'Fire risk assessment',
    metaTitle: 'Fire Risk Assessment Requirements | Frequency & Duties | EntireFM',
    metaDescription:
      'What the law actually requires for fire risk assessment in commercial buildings — who is responsible, how often to review, what records prove compliance.',
    h1: 'Fire risk assessment: what the law requires',
    answer:
      'A suitable and sufficient fire risk assessment is a legal requirement for virtually every non-domestic building in England and Wales. There is no statutory review interval — the assessment must be kept up to date, and reviewed whenever there is reason to suspect it is no longer valid or the premises have changed significantly.',
    intro:
      'Fire safety is the compliance area where the gap between what people believe and what the law says is widest. The most common belief — that a fire risk assessment must be redone annually — appears nowhere in the legislation. What the law requires is that the assessment remains valid, which is a higher bar than an annual tick.',
    dutyHolder:
      'The Responsible Person under the Regulatory Reform (Fire Safety) Order 2005 — in most commercial premises the employer, or whoever has control of the premises. In multi-occupied buildings there can be more than one, and they must co-operate.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'Carry out and keep up to date a fire risk assessment covering the premises and everyone who might be affected.',
        source: 'Regulatory Reform (Fire Safety) Order 2005, Article 9',
        note: 'Since the Fire Safety Act 2021 this expressly includes the structure, external walls and flat entrance doors of multi-occupied residential buildings.',
      },
      {
        level: 'LEGAL',
        statement:
          'Record the significant findings. All premises with five or more employees must keep a written record; in practice a written assessment is expected everywhere.',
        source: 'Regulatory Reform (Fire Safety) Order 2005, Article 9(7)',
      },
      {
        level: 'LEGAL',
        statement:
          'Review the assessment where there is reason to suspect it is no longer valid, or if there has been a significant change.',
        source: 'Regulatory Reform (Fire Safety) Order 2005, Article 9(3)',
        note: 'This is the actual trigger. It is event-driven, not calendar-driven.',
      },
      {
        level: 'PRACTICE',
        statement:
          'Most competent providers review annually and reassess fully every three to five years, or sooner on change.',
        source: 'Common industry practice',
        note: 'Widely done, sensible, and frequently mistaken for a legal requirement. It is not one.',
      },
      {
        level: 'RISK',
        statement:
          'Complex, high-risk or sleeping-accommodation premises justify more frequent review than a small low-risk office.',
        source: 'Risk-proportionate approach, HM Government fire safety guidance',
      },
    ],
    evidence: [
      'The written fire risk assessment, dated and attributable to a named assessor',
      'A record of the significant findings and the action plan arising from them',
      'Evidence that actions were closed out, not merely listed',
      'Review records showing the assessment was reconsidered after changes',
      'Supporting logs: alarm tests, emergency lighting, extinguisher servicing, drills',
    ],
    consequences:
      'Enforcement sits with the local fire and rescue authority, which can issue alterations, enforcement or prohibition notices — the last of which can close a building immediately. Offences under the Order can carry unlimited fines and, for serious breaches, imprisonment. Insurers also treat a missing or stale assessment as a material issue.',
    commonFailings: [
      'An assessment that exists but was never acted on — findings listed, actions never closed',
      'No review after a layout change, a change of use, or new occupancy',
      'Assessor competence not evidenced, particularly in complex or higher-risk buildings',
      'Multi-occupied buildings where each Responsible Person assumes another has done it',
      'External wall systems and compartmentation not covered in residential blocks',
    ],
    faqs: [
      {
        question: 'How often must a fire risk assessment be carried out by law?',
        answer:
          'There is no statutory interval. The Fire Safety Order requires the assessment to be kept up to date and reviewed if there is reason to suspect it is no longer valid or the premises have changed significantly. Annual review is common practice and sensible, but it is practice, not law.',
      },
      {
        question: 'Who is legally responsible for the fire risk assessment?',
        answer:
          'The Responsible Person — usually the employer or whoever controls the premises. The duty can be delegated in practice to a competent assessor, but the legal responsibility cannot be transferred.',
      },
      {
        question: 'Does the assessment have to be written down?',
        answer:
          'The significant findings must be recorded where five or more people are employed, and in licensed premises. In practice a written assessment is expected in any commercial building, and an unwritten one is very difficult to defend after an incident.',
      },
      {
        question: 'Is the law the same across the UK?',
        answer:
          'No. The Regulatory Reform (Fire Safety) Order 2005 covers England and Wales. Scotland works under the Fire (Scotland) Act 2005 and associated regulations, and Northern Ireland under the Fire and Rescue Services (Northern Ireland) Order 2006. The duties are broadly similar but the detail and terminology differ.',
      },
    ],
    relatedServices: ['/fire-emergency-systems', '/safety-critical-emergency-systems', '/ppm'],
    imageKey: 'switchroom-survey',
  },

  // ── Emergency lighting ──────────────────────────────────────────────────
  {
    slug: 'emergency-lighting-testing',
    name: 'Emergency Lighting Testing',
    shortName: 'Emergency lighting',
    metaTitle: 'Emergency Lighting Testing Frequency | BS 5266 | EntireFM',
    metaDescription:
      'Emergency lighting testing explained — monthly function tests, annual full-duration tests, what BS 5266 requires and what the law requires.',
    h1: 'Emergency lighting testing: monthly, annual, and why both',
    answer:
      'Emergency lighting should be function-tested monthly and given a full rated-duration test — normally three hours — annually, under BS 5266-1. The law requires the system to be maintained in efficient working order; the testing regime is how that duty is discharged and evidenced.',
    intro:
      'Emergency lighting is where the difference between a standard and a statute is most useful to understand. No Act names a monthly test. What the law demands is that safety equipment works; BS 5266 is the recognised way of proving it does, and departing from it means explaining what you did instead.',
    dutyHolder:
      'The Responsible Person under the Fire Safety Order, and the employer under the Health and Safety at Work etc. Act 1974 and the Workplace (Health, Safety and Welfare) Regulations 1992.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'Fire safety equipment, including emergency lighting, must be subject to a suitable system of maintenance and kept in efficient working order and good repair.',
        source: 'Regulatory Reform (Fire Safety) Order 2005, Article 17',
        note: 'The Order sets the outcome. It does not set the interval.',
      },
      {
        level: 'STANDARD',
        statement:
          'Monthly: a short function test of every luminaire and exit sign, confirming it illuminates on loss of supply.',
        source: 'BS 5266-1',
      },
      {
        level: 'STANDARD',
        statement:
          'Annually: a full-duration discharge test for the system\'s rated period — three hours in most commercial premises.',
        source: 'BS 5266-1',
        note: 'This is the test that actually proves the batteries. A monthly flick test does not.',
      },
      {
        level: 'STANDARD',
        statement:
          'Results, defects and remedial action recorded in the emergency lighting logbook.',
        source: 'BS 5266-1',
      },
      {
        level: 'RISK',
        statement:
          'Duration testing should be scheduled so the system is not left discharged before a high-occupancy period, and recharge time allowed before the premises are relied upon.',
        source: 'Risk-proportionate scheduling',
      },
    ],
    evidence: [
      'Emergency lighting logbook with monthly and annual entries',
      'Certification following the annual duration test',
      'Defect records showing what failed and when it was rectified',
      'Design documentation showing the required duration and coverage',
      'For automatic test systems, the exported results — and evidence someone reviewed them',
    ],
    consequences:
      'Enforcement mirrors fire safety generally: alterations, enforcement and prohibition notices, and prosecution for serious breaches. The practical consequence is worse — emergency lighting is only ever needed in the minutes when nothing else is working.',
    commonFailings: [
      'Monthly tests recorded but the annual duration test skipped, so degraded batteries go undetected',
      'Duration test cut short once luminaires are seen to illuminate, which proves nothing about the rated period',
      'Automatic test systems installed and then never reviewed — the data exists, nobody reads it',
      'Alterations and partitioning that leave escape routes without coverage, with no re-design',
      'Failed luminaires logged repeatedly across visits and never replaced',
    ],
    faqs: [
      {
        question: 'How often should emergency lighting be tested?',
        answer:
          'Monthly function tests and an annual full-duration test, under BS 5266-1. The monthly test is brief; the annual test runs the system for its full rated duration, normally three hours.',
      },
      {
        question: 'Is annual emergency lighting testing a legal requirement?',
        answer:
          'The legal requirement is that the system is maintained in efficient working order under Article 17 of the Fire Safety Order. BS 5266-1 sets out the recognised way to achieve and evidence that. Departing from the standard is possible but you would need to justify the alternative.',
      },
      {
        question: 'What is the point of the three-hour test?',
        answer:
          'It is the only test that proves the batteries. Batteries degrade steadily and typically need replacement every four to five years, so a system that passes every monthly test can still fail forty minutes into a three-hour discharge.',
      },
      {
        question: 'Do self-testing systems remove the need for manual testing?',
        answer:
          'They reduce the labour, not the duty. Results still have to be reviewed, recorded and acted on, and the hardware itself still needs maintaining.',
      },
    ],
    relatedServices: ['/mechanical-electrical/emergency-light-testing', '/emergency-light-testing', '/fire-emergency-systems'],
    imageKey: 'distribution-board-testing',
  },

  // ── Fixed wire / EICR ───────────────────────────────────────────────────
  {
    slug: 'fixed-wire-testing-eicr',
    name: 'Fixed Wire Testing and EICR',
    shortName: 'Fixed wire testing (EICR)',
    metaTitle: 'EICR & Fixed Wire Testing Frequency | Commercial | EntireFM',
    metaDescription:
      'How often commercial fixed wire testing and EICR are needed, what the law actually requires, and what an EICR report has to show.',
    h1: 'Fixed wire testing and EICR: what the interval really depends on',
    answer:
      'There is no single legal interval for commercial fixed wire testing. The law requires electrical systems to be maintained so as to prevent danger; an Electrical Installation Condition Report is the recognised means of assessing that, and IET guidance suggests a maximum of five years for most commercial premises — shorter for higher-risk environments.',
    intro:
      'Most FM providers will tell you commercial EICR is "every five years". That is a guidance maximum for many premises, not a statute, and for some environments it is far too long. Getting the interval right means starting from the installation and its use, not from a number.',
    dutyHolder:
      'The duty holder under the Electricity at Work Regulations 1989 — normally the employer or whoever controls the installation. In let property the responsibility follows the terms of the lease and should be confirmed in writing.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'All electrical systems must be maintained so far as reasonably practicable to prevent danger.',
        source: 'Electricity at Work Regulations 1989, Regulation 4(2)',
        note: 'No interval, no method, no report format is specified. The obligation is the outcome.',
      },
      {
        level: 'STANDARD',
        statement:
          'Periodic inspection and testing to BS 7671, reported as an Electrical Installation Condition Report with observations classified C1, C2, C3 or FI.',
        source: 'BS 7671 (IET Wiring Regulations)',
      },
      {
        level: 'PRACTICE',
        statement:
          'Commercial premises are commonly inspected at intervals of up to five years, or on change of occupancy.',
        source: 'IET Guidance Note 3, common practice',
        note: 'A maximum for many premises rather than a target, and not a legal deadline.',
      },
      {
        level: 'RISK',
        statement:
          'Shorter intervals apply where the environment demands it — industrial installations, wet or corrosive conditions, construction sites, swimming pools, and premises open to the public.',
        source: 'IET Guidance Note 3, risk-based assessment',
      },
      {
        level: 'LEGAL',
        statement:
          'C1 (danger present) and C2 (potentially dangerous) observations require action; an EICR with unresolved C1 or C2 items is an unsatisfactory report.',
        source: 'BS 7671 classification, read with EAWR Regulation 4(2)',
      },
    ],
    evidence: [
      'The EICR itself, with schedules of inspections and test results — not just the summary page',
      'A clear satisfactory or unsatisfactory outcome',
      'Remedial records closing out every C1 and C2 observation',
      'Minor works or installation certificates for subsequent alterations',
      'The inspector\'s competence and scheme registration',
    ],
    consequences:
      'Breaches of the Electricity at Work Regulations are prosecuted by the HSE and can carry unlimited fines and imprisonment. Commercially, an unsatisfactory EICR left unresolved tends to surface at the worst moment — during a sale, a lease renewal or an insurance claim.',
    commonFailings: [
      'Treating five years as a default rather than assessing the installation and its environment',
      'Accepting a summary page without the schedules of test results behind it',
      'C2 observations recorded and then left open until the next inspection',
      'No certification for alterations made between periodic inspections',
      'Sampling percentages not stated, so nobody knows how much was actually inspected',
    ],
    faqs: [
      {
        question: 'How often is an EICR required for commercial premises?',
        answer:
          'There is no fixed legal interval. IET guidance suggests a maximum of five years for many commercial installations, and shorter where the environment is harsher or the public is present. The correct interval comes from an assessment of the installation, its use and its condition.',
      },
      {
        question: 'Is an EICR a legal requirement?',
        answer:
          'The legal requirement is to maintain electrical systems to prevent danger, under Regulation 4(2) of the Electricity at Work Regulations 1989. An EICR is the recognised way to assess and evidence that. In practice, if you cannot produce one, you will struggle to show you have complied.',
      },
      {
        question: 'What do C1, C2 and C3 mean?',
        answer:
          'C1 means danger is present and immediate action is required. C2 means potentially dangerous and urgent remedial action is required. C3 means improvement is recommended but the installation is not unsafe. C1 or C2 observations make a report unsatisfactory until they are resolved.',
      },
      {
        question: 'Who is responsible in a leased building?',
        answer:
          'It depends on the lease and on who controls the installation. Landlord and tenant frequently each assume the other holds the duty for the same distribution board — which is exactly how installations go untested for a decade. Confirm it in writing.',
      },
    ],
    relatedServices: ['/mechanical-electrical', '/ppm', '/building-inspecting-testing'],
    imageKey: 'switchgear-inspection',
  },

  // ── Water hygiene / Legionella ──────────────────────────────────────────
  {
    slug: 'legionella-water-hygiene',
    name: 'Legionella and Water Hygiene',
    shortName: 'Legionella (L8)',
    metaTitle: 'Legionella Risk Assessment & Water Hygiene | ACOP L8 | EntireFM',
    metaDescription:
      'Legionella control explained — what ACOP L8 requires, how often to assess and monitor, who holds the duty and what records prove control.',
    h1: 'Legionella control: the duty, the assessment and the records',
    answer:
      'Anyone in control of premises must assess and control the risk of exposure to Legionella. There is no statutory testing interval; the risk assessment sets the monitoring regime, and ACOP L8 with HSG274 sets out how to do it. Monthly temperature monitoring is common practice in many systems, not a legal frequency.',
    intro:
      'Legionella is the compliance area where a generic schedule is most obviously inadequate. Two buildings of the same size can need entirely different regimes depending on their water systems, occupancy pattern and dead legs. The assessment is not paperwork before the work — it is the thing that determines the work.',
    dutyHolder:
      'The employer or person in control of the premises, under the Health and Safety at Work etc. Act 1974 and COSHH Regulation 6. A named Responsible Person for water safety should be appointed and competent.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'Identify and assess sources of risk from Legionella, and prevent or control the risk of exposure.',
        source: 'Health and Safety at Work etc. Act 1974; COSHH Regulations 2002, Regulation 6',
      },
      {
        level: 'STANDARD',
        statement:
          'Follow the Approved Code of Practice: appoint a responsible person, prepare a written scheme of control, monitor it, and keep records for at least five years.',
        source: 'ACOP L8, with technical guidance in HSG274 Parts 1–3',
        note: 'An ACOP has special legal status — depart from it and you must show you achieved compliance another way.',
      },
      {
        level: 'PRACTICE',
        statement:
          'Monthly temperature monitoring of sentinel outlets, quarterly checks on lesser-used outlets, annual calorifier inspection and tank checks are typical in hot and cold water systems.',
        source: 'HSG274 Part 2, common practice',
        note: 'Typical, not universal. The written scheme, not a template, sets what applies.',
      },
      {
        level: 'RISK',
        statement:
          'Review the risk assessment when the system, its use or occupancy changes, or if there is reason to believe it is no longer valid. Intermittently occupied buildings need particular attention to flushing.',
        source: 'ACOP L8, risk-based review',
      },
      {
        level: 'RISK',
        statement:
          'Cooling towers and evaporative condensers carry substantially higher risk and must additionally be notified to the local authority.',
        source: 'Notification of Cooling Towers and Evaporative Condensers Regulations 1992',
      },
    ],
    evidence: [
      'A current written Legionella risk assessment naming its author and date',
      'The written scheme of control, describing what is monitored and at what frequency',
      'Temperature monitoring records against sentinel and representative outlets',
      'Tank, calorifier and shower head inspection and cleaning records',
      'Records of remedial action where readings fell outside control parameters',
      'Records retained for at least five years',
    ],
    consequences:
      'Legionnaires\' disease is potentially fatal and outbreaks are investigated rigorously. Prosecutions under health and safety legislation carry unlimited fines and, in the most serious cases, custodial sentences. Corporate manslaughter charges have followed outbreaks linked to poorly managed systems.',
    commonFailings: [
      'A risk assessment carried out once and never reviewed after the system changed',
      'Monitoring performed but out-of-parameter readings not acted on — records that prove non-compliance rather than compliance',
      'Buildings left intermittently occupied without a flushing regime',
      'Dead legs created by refurbishment and never removed or recorded',
      'Responsibility assumed to sit with the water hygiene contractor rather than the duty holder',
    ],
    faqs: [
      {
        question: 'How often is Legionella testing required by law?',
        answer:
          'The law does not set an interval. It requires you to assess the risk and control it. The written scheme of control produced from your risk assessment sets the monitoring frequencies, and those will differ between buildings.',
      },
      {
        question: 'Is a Legionella risk assessment a legal requirement?',
        answer:
          'Yes in effect. The duty to assess the risk arises under health and safety legislation and COSHH, and ACOP L8 sets out how. Without an assessment you cannot show you have identified or controlled the risk.',
      },
      {
        question: 'How long must water hygiene records be kept?',
        answer:
          'ACOP L8 expects records of the risk assessment, the control scheme and monitoring to be retained for at least five years.',
      },
      {
        question: 'Does the contractor take on the legal duty?',
        answer:
          'No. The duty stays with the employer or person in control of the premises. A competent contractor discharges the work and provides the evidence; the responsibility for it being adequate remains with the duty holder.',
      },
    ],
    relatedServices: ['/plumbing-gas', '/ppm', '/building-inspecting-testing'],
    imageKey: 'rooftop-plant-night',
  },

  // ── LOLER ───────────────────────────────────────────────────────────────
  {
    slug: 'lifting-equipment-loler',
    name: 'Lifting Equipment and LOLER',
    shortName: 'Lifting equipment (LOLER)',
    metaTitle: 'LOLER Thorough Examination Intervals | Lifts & Lifting | EntireFM',
    metaDescription:
      'LOLER explained — thorough examination intervals for passenger lifts and lifting equipment, who holds the duty, and what a report must contain.',
    h1: 'LOLER: thorough examination, and the two intervals that matter',
    answer:
      'Lifting equipment must undergo thorough examination at least every six months where it lifts people, and at least every twelve months otherwise — or in accordance with an examination scheme drawn up by a competent person. These intervals are set in law, which makes LOLER unusual among the compliance areas on this site.',
    intro:
      'LOLER is the exception that proves the rule. Where most compliance intervals are guidance dressed up as law, here the frequency really is statutory — and a passenger lift examined annually rather than six-monthly is straightforwardly in breach.',
    dutyHolder:
      'The employer or person in control of the lifting equipment, under LOLER 1998. In multi-tenanted buildings this normally falls to the landlord or managing agent for common-parts lifts.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'Lifting equipment used to lift people must undergo thorough examination at least every six months.',
        source: 'LOLER 1998, Regulation 9(3)',
      },
      {
        level: 'LEGAL',
        statement:
          'Other lifting equipment and accessories must undergo thorough examination at least every twelve months.',
        source: 'LOLER 1998, Regulation 9(3)',
      },
      {
        level: 'LEGAL',
        statement:
          'Alternatively, examinations may follow an examination scheme drawn up by a competent person, which may set different intervals.',
        source: 'LOLER 1998, Regulation 9(3)',
      },
      {
        level: 'LEGAL',
        statement:
          'A report of thorough examination must be provided, and defects presenting an existing or imminent danger must be reported to the enforcing authority.',
        source: 'LOLER 1998, Regulations 10 and 11',
      },
      {
        level: 'PRACTICE',
        statement:
          'Thorough examination is not maintenance. Servicing to keep the equipment in good working order is a separate activity under PUWER and is usually more frequent.',
        source: 'HSE guidance; PUWER 1998',
        note: 'Confusing the two is the most common LOLER failing in commercial property.',
      },
    ],
    evidence: [
      'Reports of thorough examination for every item, within the applicable interval',
      'The written examination scheme where one is being relied upon',
      'Records showing defects were rectified, with dates',
      'Separate servicing and maintenance records under PUWER',
      'Evidence of the examiner\'s competence and independence',
    ],
    consequences:
      'LOLER is enforced by the HSE and, in some premises, the local authority. Operating a passenger lift outside its examination interval is a clear breach and, following an incident, an indefensible one. Reports identifying imminent danger must be notified to the enforcing authority by the examiner.',
    commonFailings: [
      'Passenger lifts examined every twelve months instead of every six',
      'Treating the maintenance contractor\'s service visit as the thorough examination',
      'Lifting accessories — slings, eyebolts, beams — omitted from the register entirely',
      'Defects in reports not tracked to closure',
      'No register of lifting equipment, so nobody knows what should be examined',
    ],
    faqs: [
      {
        question: 'How often does a passenger lift need a LOLER examination?',
        answer:
          'At least every six months, because it lifts people. Goods-only lifting equipment is at least every twelve months. Both can instead follow an examination scheme drawn up by a competent person.',
      },
      {
        question: 'Is a LOLER examination the same as a lift service?',
        answer:
          'No, and conflating them is the most common failing here. Thorough examination is an independent assessment of safety under LOLER. Servicing is maintenance under PUWER. You need both, and a service visit does not satisfy LOLER.',
      },
      {
        question: 'Does LOLER apply to lifting accessories?',
        answer:
          'Yes. Slings, shackles, eyebolts, chains and lifting beams are lifting accessories and require thorough examination at least every six months.',
      },
      {
        question: 'Who is responsible in a multi-tenanted building?',
        answer:
          'Whoever controls the equipment — typically the landlord or managing agent for common-parts lifts, and the tenant for lifting equipment within their demise. As always, confirm it against the lease rather than assuming.',
      },
    ],
    relatedServices: ['/mechanical-electrical', '/ppm', '/mobile-crane-hire'],
    imageKey: 'site-arrival',
  },

  // ── Asbestos ────────────────────────────────────────────────────────────
  {
    slug: 'asbestos-management',
    name: 'Asbestos Management',
    shortName: 'Asbestos',
    metaTitle: 'Duty to Manage Asbestos | Surveys & Registers | EntireFM',
    metaDescription:
      'The duty to manage asbestos in non-domestic premises — surveys, the asbestos register, management plans, re-inspection and who holds the duty.',
    h1: 'The duty to manage asbestos, and what it actually involves',
    answer:
      'Anyone with responsibility for the maintenance or repair of non-domestic premises has a legal duty to manage asbestos. That means finding out whether asbestos is present, recording it, assessing the risk, preparing a written management plan, and keeping the information up to date and available to anyone who might disturb it.',
    intro:
      'Asbestos is the compliance area most often reduced to a single document sitting in a drawer. The register is necessary but it is not the duty — the duty is that the information is current, acted upon, and in the hands of the people about to drill into a wall.',
    dutyHolder:
      'The dutyholder under Regulation 4 of the Control of Asbestos Regulations 2012 — whoever has an obligation for the maintenance or repair of the premises, whether by contract, tenancy or ownership. Where nobody has that obligation, it falls to whoever controls the premises.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'Take reasonable steps to determine whether asbestos is present, its location, amount and condition — and presume it is present unless there is strong evidence otherwise.',
        source: 'Control of Asbestos Regulations 2012, Regulation 4',
      },
      {
        level: 'LEGAL',
        statement:
          'Record the findings, assess the risk, and prepare and implement a written plan to manage that risk.',
        source: 'Control of Asbestos Regulations 2012, Regulation 4',
      },
      {
        level: 'LEGAL',
        statement:
          'Review and monitor the plan, and make the information available to anyone liable to disturb the asbestos.',
        source: 'Control of Asbestos Regulations 2012, Regulation 4',
        note: 'This last part is the one most often missed — a register nobody gives to the contractor achieves nothing.',
      },
      {
        level: 'PRACTICE',
        statement:
          'Condition of known asbestos-containing materials is commonly re-inspected at least annually, and a refurbishment or demolition survey commissioned before intrusive work.',
        source: 'HSG264, common practice',
      },
      {
        level: 'LEGAL',
        statement:
          'Work with most asbestos-containing materials requires a licensed contractor; some lower-risk work is notifiable non-licensed work with its own requirements.',
        source: 'Control of Asbestos Regulations 2012, Regulations 8 and 3',
      },
    ],
    evidence: [
      'The asbestos survey report — management, refurbishment or demolition as appropriate',
      'A current asbestos register naming locations, materials and condition',
      'The written asbestos management plan, with named responsibilities',
      'Re-inspection records tracking material condition over time',
      'Evidence the register was issued to contractors before work began',
      'Air clearance certificates and consignment notes following removal',
    ],
    consequences:
      'Asbestos remains the single largest cause of work-related deaths in the UK. Breaches are prosecuted by the HSE and carry unlimited fines and potential imprisonment. Uncontrolled disturbance also triggers immediate closure of the affected area and substantial remediation cost.',
    commonFailings: [
      'A management survey relied upon before intrusive work, when a refurbishment survey was required',
      'Register never issued to the contractor who then drilled through an ACM',
      'No re-inspection, so material condition is recorded as it was years ago',
      'Presumed ACMs never resolved either way, leaving the position permanently ambiguous',
      'Management plan naming a responsible person who has since left',
    ],
    faqs: [
      {
        question: 'Which buildings does the duty to manage apply to?',
        answer:
          'All non-domestic premises, and the common parts of domestic premises such as blocks of flats. Age matters for likelihood, not for the duty: asbestos was banned in the UK in 1999, so buildings built or refurbished before then may contain it.',
      },
      {
        question: 'What is the difference between a management survey and a refurbishment survey?',
        answer:
          'A management survey locates asbestos likely to be disturbed during normal occupancy and maintenance. A refurbishment or demolition survey is fully intrusive and is required before any work that will disturb the fabric. Using the former in place of the latter is a serious and common error.',
      },
      {
        question: 'How often should asbestos be re-inspected?',
        answer:
          'The Regulations require the plan to be reviewed and monitored rather than setting an interval. Annual re-inspection of known ACMs is common practice, with more frequent checks where material is damaged or in a high-traffic area.',
      },
      {
        question: 'Do I have to remove asbestos that is found?',
        answer:
          'Not necessarily. Asbestos in good condition and unlikely to be disturbed is often safer managed in place, with its condition monitored. Removal itself creates risk and is a decision that should follow the assessment, not precede it.',
      },
    ],
    relatedServices: ['/building-maintenance', '/building-inspecting-testing', '/ppm'],
    imageKey: 'access-control-install',
  },
];

export const COMPLIANCE_TOPIC_BY_SLUG: Record<string, ComplianceTopic> = Object.fromEntries(
  COMPLIANCE_TOPICS.map((t) => [t.slug, t])
);

/** Labels and explanations for the four requirement levels. */
export const REQUIREMENT_LEVELS: Record<
  RequirementLevel,
  { label: string; description: string; tone: string }
> = {
  LEGAL: {
    label: 'Legal requirement',
    description: 'Set out in legislation. Not optional, and not open to interpretation on whether it applies.',
    tone: 'legal',
  },
  STANDARD: {
    label: 'Standard or approved code',
    description:
      'The recognised technical basis. Departing from it is possible but you must be able to show you achieved the same outcome another way.',
    tone: 'standard',
  },
  PRACTICE: {
    label: 'Typical practice',
    description:
      'What competent providers commonly do. Sensible, widely adopted — and frequently mistaken for law.',
    tone: 'practice',
  },
  RISK: {
    label: 'Risk-based',
    description: 'Genuinely depends on the building, its use and its condition. No single correct answer.',
    tone: 'risk',
  },
};

/**
 * Shown on every compliance page. Not boilerplate: the entire value of this
 * section is that it distinguishes law from habit, and it would be
 * self-defeating to then imply a web page can replace a competent assessment.
 */
export const COMPLIANCE_DISCLAIMER =
  'This page is general information about compliance obligations in commercial property, not legal advice. Legislation cited applies to England and Wales unless stated; Scotland and Northern Ireland differ, particularly on fire safety. Duty holders should confirm their position against current legislation and a competent assessment of their own premises.';
