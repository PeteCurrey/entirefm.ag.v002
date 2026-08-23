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
  // ── Gas safety ──────────────────────────────────────────────────────────
  {
    slug: 'commercial-gas-safety',
    name: 'Commercial Gas Safety',
    shortName: 'Commercial gas safety',
    metaTitle: 'Commercial Gas Safety Requirements | Duties & Frequency | EntireFM',
    metaDescription:
      'What the law requires for gas safety in commercial premises — why the annual certificate is a domestic letting duty, and what non-domestic buildings must actually do.',
    h1: 'Commercial gas safety: the certificate that is not required',
    answer:
      'In non-domestic premises there is no statutory annual gas certificate. The legal duty is that gas appliances, pipework and flues under your control are maintained in a safe condition, and that anyone working on them is registered. The familiar annual check with a dated record is a duty on landlords of domestic rented property, and it is routinely assumed to apply to commercial buildings when it does not.',
    intro:
      'Gas is where a duty that genuinely exists gets attached to the wrong buildings. Almost everyone in property has heard of the annual gas safety certificate, and almost everyone assumes it covers their office, factory or retail unit. What actually applies to commercial premises is a continuing duty to maintain — harder to evidence than a dated certificate, and far easier to let slip, because nothing arrives in the post to prompt it.',
    dutyHolder:
      'Under the Gas Safety (Installation and Use) Regulations 1998 the duty to maintain non-domestic gas fittings falls on the employer or self-employed person in control of the premises. Where a building is let, the duty follows control rather than title, so a full repairing lease can move it to the tenant — the lease has to be read, not assumed. The separate annual duty under regulation 36 sits with landlords of relevant domestic premises, which catches mixed-use estates with flats above.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'Ensure gas appliances, installation pipework and flues in non-domestic premises under your control are maintained in a safe condition.',
        source: 'Gas Safety (Installation and Use) Regulations 1998, Regulation 35',
        note: 'A continuing duty with no interval attached to it. This is the core commercial obligation, and the one most often missed precisely because nothing prompts it.',
      },
      {
        level: 'LEGAL',
        statement:
          'Anyone carrying out work on a gas fitting must be competent and registered with the approved body — currently Gas Safe Register.',
        source: 'Gas Safety (Installation and Use) Regulations 1998, Regulation 3',
        note: 'This is a duty on the person or business doing the work. It says nothing about the building owner holding any registration themselves.',
      },
      {
        level: 'LEGAL',
        statement:
          'Landlords of relevant domestic premises must have an annual safety check on gas appliances and flues, and give the record to the tenant within 28 days.',
        source: 'Gas Safety (Installation and Use) Regulations 1998, Regulation 36',
        note: 'This is the annual certificate everyone has heard of. It is a domestic letting duty, not a commercial building duty.',
      },
      {
        level: 'LEGAL',
        statement:
          'Where gas creates a risk of fire or explosion, assess it, control it, and classify hazardous areas where the assessment calls for it.',
        source: 'Dangerous Substances and Explosive Atmospheres Regulations 2002, Regulations 5 to 7',
      },
      {
        level: 'STANDARD',
        statement:
          'Commercial installation, testing, purging and commissioning work follows the IGEM Utilization Procedures — principally IGEM/UP/1B for testing and purging and IGEM/UP/2 for installation pipework.',
        source: 'IGEM Utilization Procedures',
      },
      {
        level: 'PRACTICE',
        statement:
          'An annual commercial gas inspection, recorded on the relevant CP-series certificate, is what most competent providers do and what most insurers expect to see.',
        source: 'Common industry practice',
        note: 'Sensible and near-universal — and not the same thing as a legal interval. The law asks whether the installation is safe, not whether it was inspected within the last twelve months.',
      },
      {
        level: 'RISK',
        statement:
          'Catering kitchens, boiler houses and process plant justify more attention than a single office boiler, particularly where ventilation and gas interlocks are involved.',
        source: 'Risk-proportionate approach, HSE guidance',
      },
    ],
    evidence: [
      'An inventory of gas appliances, pipework runs, meters and isolation points',
      'Inspection and service records naming the engineer and their registration number',
      'Soundness test and commissioning records for any new or altered installation',
      'Ventilation, interlock and gas detection test records in catering kitchens and plant rooms',
      'Evidence that defects raised at inspection were rectified, with the date each was closed',
      'For any residential element on a mixed-use site, the annual record issued under regulation 36',
    ],
    consequences:
      'The Health and Safety Executive enforces, and gas offences are treated seriously because the failure mode is fatal rather than expensive. Improvement and prohibition notices can take an installation out of use immediately, and offences carry unlimited fines and, in serious cases, imprisonment. Gas escapes and carbon monoxide incidents are reportable under RIDDOR, and an appliance a registered engineer classifies as immediately dangerous will be disconnected on the spot, whatever it is serving.',
    commonFailings: [
      'Assuming the annual domestic certificate applies to a commercial building, and doing nothing else',
      'Assuming it applies nowhere, on a mixed-use site that contains residential flats',
      'A lease that moved the duty to or from the tenant which nobody has actually read',
      'Catering ventilation and gas interlocks treated as separate from gas safety when they are part of it',
      'Work done by a competent-looking contractor whose registration was never checked or recorded',
      'Appliances left in service after an inspection classified them at risk, because nobody owned the follow-up',
    ],
    faqs: [
      {
        question: 'Do commercial premises need an annual gas safety certificate?',
        answer:
          'Not as a matter of law. The annual check and record is a duty on landlords of domestic rented property. In commercial premises the duty is to keep gas fittings maintained in a safe condition, with no stated interval. Annual inspection is a sensible way to discharge that and is what most insurers expect, but it is practice rather than statute.',
      },
      {
        question: 'Who is responsible for gas safety in a leased commercial building?',
        answer:
          'Whoever has control of the premises or the relevant plant, which the lease determines. A full repairing and insuring lease commonly places it with the tenant; a managed multi-let building commonly leaves central plant with the landlord and appliances with the occupier. The duty follows control, so the document has to be read rather than assumed.',
      },
      {
        question: 'Does the engineer have to be registered?',
        answer:
          'Yes. Anyone carrying out work on a gas fitting must be competent and registered with the approved body. That is a duty on the person or business doing the work, and the registration number belongs on every certificate you keep — a certificate without one proves very little.',
      },
      {
        question: 'What about commercial catering equipment?',
        answer:
          'It falls under the same maintenance duty, and it is where most commercial gas risk actually sits. Ventilation, gas interlocks and the condition of flexible connections matter as much as the appliance, and a kitchen inspection that ignores them has not covered the risk.',
      },
    ],
    relatedServices: ['/plumbing-gas', '/ppm', '/building-inspecting-testing'],
    imageKey: 'entirefm-premises-vans',
  },

  // ── F-Gas ───────────────────────────────────────────────────────────────
  {
    slug: 'f-gas-regulations',
    name: 'F-Gas and Refrigerant Compliance',
    shortName: 'F-Gas compliance',
    metaTitle: 'F-Gas Regulations UK | Leak Check Frequency & Duties | EntireFM',
    metaDescription:
      'F-Gas duties for air conditioning and refrigeration in Great Britain — who counts as the operator, how leak check intervals follow CO2 equivalent, and what records to keep.',
    h1: 'F-Gas: an interval that genuinely is the law',
    answer:
      'F-Gas leak checking is one of the few compliance intervals set by legislation rather than guidance, and it is not a fixed period — it is calculated from the CO2 equivalent of the refrigerant charge in each individual system. Five tonnes CO2e or more requires a check at least every twelve months, fifty tonnes at least every six, and five hundred tonnes at least every three with an automatic leak detection system fitted. Where such a system is installed, each of those periods doubles. The duty sits with the operator of the equipment, which is normally the building owner or occupier — not the maintenance contractor.',
    intro:
      'F-Gas is the mirror image of the rest of this section. Elsewhere the problem is guidance being quoted as law; here a genuine legal interval gets treated as somebody else’s business. Two things follow. The duty stays with you when the maintenance contract changes hands, and an interval you cannot state from memory is an interval you probably are not meeting — because it depends on a charge figure most duty holders have never been given.',
    dutyHolder:
      'The operator: the person with actual power over the technical functioning of the equipment. In practice that is the building owner, or the occupier who controls the plant. It is not transferred by employing an air conditioning contractor, however well certificated they are. Where no one with actual control can be identified, the duty falls back to the owner.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'Check equipment containing five tonnes CO2 equivalent or more of fluorinated gas for leaks at least every twelve months.',
        source: 'Retained Regulation (EU) No 517/2014, Article 4; Fluorinated Greenhouse Gases Regulations 2015',
        note: 'Extending to twenty-four months where a working automatic leak detection system is fitted.',
      },
      {
        level: 'LEGAL',
        statement:
          'Fifty tonnes CO2 equivalent or more: at least every six months. Five hundred tonnes or more: at least every three months, and an automatic leak detection system is mandatory.',
        source: 'Retained Regulation (EU) No 517/2014, Articles 4 and 5',
        note: 'Each interval doubles where a leak detection system is fitted — and the detection system itself must then be checked at least every twelve months.',
      },
      {
        level: 'LEGAL',
        statement:
          'Hermetically sealed equipment holding less than ten tonnes CO2 equivalent and labelled as hermetically sealed is outside the leak checking requirement.',
        source: 'Retained Regulation (EU) No 517/2014, Article 4(2)',
        note: 'An exemption in the legislation, not an assumption to start from. You still need the charge figure to know it applies.',
      },
      {
        level: 'LEGAL',
        statement:
          'Repair any detected leak without undue delay, and re-check the system within one month of the repair.',
        source: 'Retained Regulation (EU) No 517/2014, Article 3',
      },
      {
        level: 'LEGAL',
        statement:
          'Keep records for each system: charge quantity and type, gas added or recovered, checks carried out and by whom. Retain them for at least five years.',
        source: 'Retained Regulation (EU) No 517/2014, Article 6',
      },
      {
        level: 'LEGAL',
        statement:
          'Installation, servicing, leak checking and recovery must be carried out by certificated personnel, and companies doing this work on stationary equipment must hold company certification.',
        source: 'Retained Regulation (EU) No 517/2014, Article 10; Fluorinated Greenhouse Gases Regulations 2015',
      },
      {
        level: 'LEGAL',
        statement:
          'Recover refrigerant properly when equipment is decommissioned, rather than venting it.',
        source: 'Retained Regulation (EU) No 517/2014, Article 8',
      },
      {
        level: 'PRACTICE',
        statement:
          'Leak checks are usually run on the same visit as planned maintenance, which is efficient but lets the interval drift past its legal maximum whenever a visit slips.',
        source: 'Common industry practice',
        note: 'The legal interval is a ceiling, not a target. A schedule that aims exactly at it has no margin.',
      },
      {
        level: 'RISK',
        statement:
          'Great Britain retains the 2014 regime. The European Union replaced it in 2024 and Northern Ireland follows the EU rules, so an estate spanning both needs its Northern Irish sites assessed separately.',
        source: 'Assimilated law position, Great Britain',
        note: 'Worth confirming before assuming one refrigerant policy covers the whole of the UK.',
      },
    ],
    evidence: [
      'An asset register listing every system, its refrigerant type, and its charge in both kilograms and tonnes CO2e',
      'The F-Gas logbook or equivalent record for each system, retained for at least five years',
      'Certification details for the personnel and the company carrying out the work',
      'Test records for any leak detection system relied on to extend an interval',
      'Repair records showing the one-month re-check was carried out',
      'End-of-life recovery documentation for decommissioned plant',
    ],
    consequences:
      'The Environment Agency regulates in England, with SEPA in Scotland and Natural Resources Wales in Wales. Enforcement runs from information notices through to civil penalties, and published guidance puts the maximum civil penalty at £200,000. The commercial exposure is usually larger than the regulatory one: an uncontrolled leak is a plant failure in progress, refrigerant is expensive to replace, and a system that keeps losing charge is telling you something about its remaining life.',
    commonFailings: [
      'Assuming the duty sits with the air conditioning contractor because they hold the certification',
      'No charge figures on record, so nobody can say which interval applies to which system',
      'One interval set for a whole site, when the calculation is made system by system',
      'A leak detection system used to justify a longer interval, but never itself tested',
      'Leaks topped up repeatedly rather than repaired, which is a breach as well as a false economy',
      'Records not handed over when the maintenance contract changes provider, breaking the five-year trail',
    ],
    faqs: [
      {
        question: 'How often must F-Gas leak checks be carried out?',
        answer:
          'It depends on the CO2 equivalent charge of each system rather than on the calendar. Five tonnes CO2e or more requires checks at least every twelve months, fifty tonnes at least every six months, and five hundred tonnes at least every three months with an automatic leak detection system fitted. Where a working leak detection system is installed, each of those periods doubles.',
      },
      {
        question: 'Who is legally responsible — us or our maintenance contractor?',
        answer:
          'The operator, meaning whoever has actual power over the technical functioning of the equipment. That is normally the building owner or the occupier controlling the plant. Employing a certificated contractor is how the duty gets discharged; it is not how it gets transferred.',
      },
      {
        question: 'How do I work out the CO2 equivalent of a system?',
        answer:
          'Multiply the refrigerant charge in tonnes by the global warming potential of that refrigerant. A system holding 10kg of R410A, which has a GWP of 2088, is 0.01 x 2088 = 20.88 tonnes CO2e — above the five tonne threshold, so at least twelve-monthly checking, and below fifty tonnes, so not six-monthly. The charge should be on the equipment label or the commissioning record.',
      },
      {
        question: 'Is R22 covered by the F-Gas rules?',
        answer:
          'No. R22 is an HCFC controlled under the ozone-depleting substances regime rather than F-Gas, and its use in servicing has been banned since 2015. Systems still running on it cannot lawfully be topped up, which in practice turns any significant leak into a replacement decision.',
      },
      {
        question: 'Do small split air conditioning units need leak checks?',
        answer:
          'Only where they reach the five tonne CO2e threshold, and hermetically sealed equipment below ten tonnes CO2e that is labelled as such is exempt. Plenty of small splits fall below the line — but that is a conclusion you reach from the charge figure, not a starting assumption.',
      },
    ],
    relatedServices: ['/hvac-contractor', '/mechanical-electrical', '/ppm'],
    imageKey: 'rooftop-plant-night',
  },

  // ── Work at height ──────────────────────────────────────────────────────
  {
    slug: 'work-at-height',
    name: 'Work at Height',
    shortName: 'Work at height',
    metaTitle: 'Work at Height Regulations | Duties, Myths & Inspection | EntireFM',
    metaDescription:
      'What the Work at Height Regulations 2005 actually require — there is no two-metre rule, ladders are not banned, and the duty reaches whoever controls the work.',
    h1: 'Work at height: there is no two-metre rule',
    answer:
      'The Work at Height Regulations 2005 apply wherever a person could fall a distance liable to cause personal injury. There is no minimum height, no two-metre threshold, and no ban on ladders. What the law requires is a hierarchy: avoid work at height where the job can be done another way, prevent falls where it cannot, and minimise the distance and consequences of a fall where a risk still remains.',
    intro:
      'Two beliefs do most of the damage here. The first is that the Regulations start at two metres, which leaves low-level work — standing on a chair to change a lamp, stepping onto a loading bay edge — treated as outside the rules entirely. The second is that ladders are banned, which is not only untrue but counterproductive, because it pushes people into hiring access equipment for two-minute jobs and improvising when they cannot get it. Neither belief appears anywhere in the legislation.',
    dutyHolder:
      'Employers, the self-employed, and — the part that matters most in facilities management — any person who controls the work of others. Instructing a contractor to clear a gutter or survey a roof makes you a duty holder to the extent of what you control, including the information you give them about the building. Premises duties for roof access and fragile surfaces sit alongside this under the Workplace Regulations and occupiers’ liability.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'Avoid work at height where it is reasonably practicable to carry out the work safely other than at height.',
        source: 'Work at Height Regulations 2005, Regulation 6(2)',
        note: 'The first question is not which equipment to use. It is whether anyone needs to go up at all.',
      },
      {
        level: 'LEGAL',
        statement:
          'Where work at height cannot be avoided, prevent falls using an existing safe place of work or suitable work equipment; where a risk of a fall remains, minimise the distance and the consequences.',
        source: 'Work at Height Regulations 2005, Regulation 6(3) to (5)',
      },
      {
        level: 'LEGAL',
        statement:
          'Plan and supervise the work, have it carried out by competent people, and do not work in weather conditions that endanger health or safety.',
        source: 'Work at Height Regulations 2005, Regulations 4 and 5',
      },
      {
        level: 'LEGAL',
        statement:
          'Take suitable and sufficient steps to prevent anyone falling through a fragile surface, including warning notices where a fragile surface is approached.',
        source: 'Work at Height Regulations 2005, Regulation 9',
        note: 'Rooflights and cement sheet roofs account for a persistent share of fatal falls in building maintenance.',
      },
      {
        level: 'LEGAL',
        statement:
          'Scaffolding must be inspected before first use, at intervals not exceeding seven days while it remains in place, and after anything liable to affect its strength or stability.',
        source: 'Work at Height Regulations 2005, Regulation 12 and Schedule 7',
        note: 'One of the few genuine calendar intervals in this area, and one that is regularly allowed to lapse partway through a long job.',
      },
      {
        level: 'LEGAL',
        statement:
          'A mobile elevating work platform used to lift people requires a thorough examination at least every six months.',
        source: 'Lifting Operations and Lifting Equipment Regulations 1998, Regulation 9(3)',
        note: 'Genuinely statutory, and set out in full on the LOLER page.',
      },
      {
        level: 'STANDARD',
        statement:
          'Fall arrest harnesses and lanyards need a pre-use check every time they are worn, plus a detailed inspection by a competent person at the interval the manufacturer sets — commonly no more than twelve months, and shorter in arduous use.',
        source: 'Manufacturer instructions; HSE guidance INDG367',
      },
      {
        level: 'PRACTICE',
        statement:
          'A permit-to-work system for roof access, and a roof plan naming fragile areas and anchor points, are standard on managed estates.',
        source: 'Common industry practice',
        note: 'Not named in the Regulations, but the most reliable way to discharge the planning duty on a building other people visit.',
      },
      {
        level: 'RISK',
        statement:
          'Ladders and step ladders remain lawful for low-risk, short-duration work where the assessment shows heavier access equipment is not justified.',
        source: 'Work at Height Regulations 2005, Schedule 6; HSE ladder guidance',
        note: 'HSE has said repeatedly that ladders are not banned. Blanket bans tend to produce worse improvisation, not safer work.',
      },
    ],
    evidence: [
      'A work at height risk assessment for the actual task and location, not a generic template',
      'A roof plan identifying fragile surfaces, anchor points and safe access routes',
      'Scaffold inspection records at intervals not exceeding seven days, and after any alteration',
      'Thorough examination reports for MEWPs and anything else used to lift people',
      'Harness and lanyard inspection records, with pre-use checks recorded where the system requires it',
      'Test and certification records for anchor points and mansafe systems',
      'Contractor competence records — and evidence they were told what is on the roof before they went up',
    ],
    consequences:
      'Falls from height remain the single largest cause of workplace fatalities in Great Britain, and enforcement reflects that. HSE can issue improvement and prohibition notices, and sentencing guidelines set fines against turnover rather than against the harm that happened to be avoided. Where a client controlled the work and told a contractor nothing about a fragile roof, liability does not stop at the contractor.',
    commonFailings: [
      'A two-metre threshold applied in practice, leaving step ladders and low-level work unassessed',
      'A blanket ladder ban that gets quietly ignored whenever access equipment is not available',
      'Fragile rooflights not identified to the contractor who was sent up there',
      'Anchor points and mansafe lines installed once and never re-tested',
      'Scaffold inspection records that stop partway through a longer job',
      'Harnesses in use with no inspection history, or stored badly between uses',
      'Roof access handed to a contractor with no permit, no plan and no induction',
    ],
    faqs: [
      {
        question: 'Is there a minimum height for the Work at Height Regulations?',
        answer:
          'No. The Regulations apply wherever a person could fall a distance liable to cause personal injury. The two-metre rule is a myth carried over from older legislation, and it has left a great deal of genuinely risky low-level work unassessed.',
      },
      {
        question: 'Are ladders banned?',
        answer:
          'No, and HSE has said so repeatedly. Ladders and step ladders are lawful for low-risk, short-duration work where a risk assessment shows heavier access equipment is not justified. The duty is to select equipment appropriate to the task, not to escalate every task to the largest available platform.',
      },
      {
        question: 'How often must scaffolding be inspected?',
        answer:
          'Before it is first used, at intervals not exceeding seven days while it remains in place, and after any event liable to have affected its strength or stability — severe weather, an impact, or an alteration. That seven-day interval is written into the Regulations, which makes it unusual in this field.',
      },
      {
        question: 'Does the duty apply to us if a contractor does the work?',
        answer:
          'Yes, to the extent that you control it. Anyone who controls the work of others carries duties under the Regulations, and in facilities management that means the information you give about the building, the access arrangements you set, and the competence you checked before letting anyone onto the roof.',
      },
      {
        question: 'How often should a safety harness be inspected?',
        answer:
          'A pre-use check every time it is worn, plus a detailed inspection by a competent person at the interval the manufacturer specifies — commonly no more than twelve months, and shortened for frequent or arduous use. That comes from the manufacturer and from guidance, not from a stated legal interval.',
      },
    ],
    relatedServices: ['/aerial-drone-building-inspection', '/building-maintenance', '/mobile-crane-hire'],
    imageKey: 'sheffield-rooftop-survey',
  },

  // ── PAT testing ─────────────────────────────────────────────────────────
  {
    slug: 'pat-testing',
    name: 'PAT Testing and In-Service Inspection',
    shortName: 'PAT testing',
    metaTitle: 'Is PAT Testing a Legal Requirement? | What the Law Says | EntireFM',
    metaDescription:
      'PAT testing is not named in UK legislation and has no legal interval. What the Electricity at Work Regulations actually require, and how intervals should be set by risk.',
    h1: 'PAT testing: the requirement that is not in the law',
    answer:
      'The phrase "PAT testing" appears in no UK legislation, and no statute sets an interval for it. What the law requires is that electrical systems and work equipment are maintained so as to prevent danger. Inspection and testing is one recognised way of demonstrating that, and the intervals everyone quotes come from an IET code of practice which sets them by risk — with HSE stating plainly that in low-risk offices, routine testing of every appliance is rarely necessary.',
    intro:
      'This is the clearest example in the whole section of habit hardening into assumed law. Annual testing of everything in the building is widely purchased, widely invoiced, and required by no statute. Meanwhile the checks that actually find faults — someone looking at a cable before plugging it in, a formal visual inspection of the plug and flex — cost almost nothing, catch most defects, and are the part most often skipped.',
    dutyHolder:
      'The employer, and any person in control of premises to the extent of matters within their control, under the Electricity at Work Regulations 1989. In a multi-let building that divides: the landlord for common parts and for equipment supplied to tenants, each occupier for their own. Equipment brought in by a contractor stays their employer’s responsibility, though a building can reasonably require evidence before it comes through the door.',
    requirements: [
      {
        level: 'LEGAL',
        statement:
          'Maintain electrical systems, so far as is reasonably practicable, so as to prevent danger.',
        source: 'Electricity at Work Regulations 1989, Regulation 4(2)',
        note: 'The entire legal basis for what the industry calls PAT testing. It names no appliance, no test and no interval.',
      },
      {
        level: 'LEGAL',
        statement:
          'Ensure work equipment is maintained in an efficient state, in efficient working order and in good repair.',
        source: 'Provision and Use of Work Equipment Regulations 1998, Regulation 5',
      },
      {
        level: 'LEGAL',
        statement:
          'In Scotland, the private rented sector repairing standard requires landlord-supplied appliances to be tested, with the associated guidance setting a five-yearly interval alongside the electrical installation report.',
        source: 'Housing (Scotland) Act 2006, repairing standard',
        note: 'A genuine statutory difference. There is no equivalent appliance-testing requirement in England and Wales.',
      },
      {
        level: 'STANDARD',
        statement:
          'Suggested starting intervals for user checks, formal visual inspection, and combined inspection and testing come from the IET Code of Practice for In-Service Inspection and Testing of Electrical Equipment.',
        source: 'IET Code of Practice for In-Service Inspection and Testing of Electrical Equipment',
        note: 'Explicitly a starting point to be adjusted by risk and by what the results keep showing — not a schedule to be applied unchanged for a decade.',
      },
      {
        level: 'RISK',
        statement:
          'Frequency should follow the environment and the equipment. A construction site transformer, a hired floor scrubber and a desktop monitor do not belong on the same schedule.',
        source: 'Risk-based approach, HSE guidance INDG236',
        note: 'HSE has stated that in low-risk environments such as offices, routine testing of every item is rarely required and visual inspection finds most faults.',
      },
      {
        level: 'PRACTICE',
        statement:
          'Annual testing of all portable equipment, with a dated label applied to each item.',
        source: 'Common industry practice',
        note: 'Neither the interval nor the label is a legal requirement. Labels are useful management information and nothing more than that.',
      },
    ],
    evidence: [
      'An equipment register, so it is possible to say what was covered and what was not',
      'A record of the interval chosen for each category of equipment, and the reasoning behind it',
      'Formal visual inspection records — the part that finds the majority of faults',
      'Combined inspection and test results showing measured values, not simply pass or fail',
      'Fault, repair and removal-from-service records',
      'For hired or contractor-supplied equipment, evidence obtained at the point it arrived on site',
    ],
    consequences:
      'HSE and local authorities enforce, and an electrical injury traced to unmaintained equipment is investigated against the duty to maintain rather than against a testing schedule. The realistic exposure runs both ways: under-inspecting misses the damaged flexes and poor connections that cause most incidents, while over-testing spends money across a low-risk estate to produce a label that proves less than the visual inspection did.',
    commonFailings: [
      'A schedule set once and never adjusted, whatever the results kept showing',
      'Testing carried out diligently while user checks and visual inspection were never established',
      'Fixed equipment tested as though portable, or genuinely high-risk portable equipment missed entirely',
      'No equipment register, so coverage cannot be demonstrated and new items never enter the cycle',
      'Failed items labelled and left in place, because nobody owned removal from service',
      'Hired-in and contractor equipment sitting outside the system altogether',
    ],
    faqs: [
      {
        question: 'Is PAT testing a legal requirement?',
        answer:
          'Not as such. No UK legislation mentions PAT testing and no statute sets an interval for it. The Electricity at Work Regulations 1989 require electrical systems to be maintained so as to prevent danger, and inspection and testing is one recognised way of showing that duty was met. Scotland’s private rented sector is the notable exception, where testing of landlord-supplied appliances is required.',
      },
      {
        question: 'How often should PAT testing be done?',
        answer:
          'At an interval justified by risk. The IET Code of Practice suggests starting points by equipment type and environment, and those should then be adjusted according to what the results show. An office estate returning no faults across three cycles is being tested more often than it needs; a site with repeat failures is not being tested often enough.',
      },
      {
        question: 'Do we need to label every appliance?',
        answer:
          'No. Labelling is not a legal requirement. It is useful management information, and a label showing a passed test proves very little on its own if there is no underlying record and no register saying what should have been covered in the first place.',
      },
      {
        question: 'Does it apply in a low-risk office?',
        answer:
          'The duty to maintain applies everywhere. HSE has been explicit that in low-risk environments such as offices, routine testing of every item is rarely necessary, and that user checks plus periodic visual inspection will find most faults. Testing everything annually in an office is a purchasing decision rather than a compliance one.',
      },
      {
        question: 'Who is responsible in a multi-let building?',
        answer:
          'It divides with control. The landlord holds it for common parts and any equipment supplied to tenants, each occupier holds it for their own equipment, and contractors remain responsible for what they bring on site — though the building can require evidence before it arrives.',
      },
    ],
    relatedServices: ['/mechanical-electrical', '/building-inspecting-testing', '/ppm'],
    imageKey: 'distribution-board-testing',
  },];

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
