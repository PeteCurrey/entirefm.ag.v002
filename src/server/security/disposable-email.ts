/**
 * ENTIREFM REGISTRATION SECURITY — DISPOSABLE EMAIL DOMAIN CHECK
 * ================================================================
 * Checks whether an email address uses a known disposable/temporary
 * email service. Does NOT block legitimate free providers (Gmail, Outlook,
 * Yahoo, iCloud, etc.).
 *
 * The list is curated rather than exhaustive. Expand as needed.
 * Do NOT use this as the sole registration gate — it is one signal among many.
 */

/**
 * Known disposable / temporary email service domains.
 * Sources: common spam registrations + public disposable-email-domains lists.
 * Mainstream free providers (gmail, outlook, yahoo, icloud, etc.) are
 * intentionally NOT included.
 */
const DISPOSABLE_DOMAINS = new Set([
  // Major temp-mail services
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'guerrillamail.biz', 'guerrillamail.info',
  'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'temp-mail.net',
  'throwam.com', 'throwam.net', 'trashmail.com', 'trashmail.at',
  'trashmail.io', 'trashmail.me', 'trashmail.net', 'trashmail.org',
  'mailnull.com', 'spamgourmet.com', 'spamgourmet.org', 'spamgourmet.net',
  'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.st',
  'nospam.ze.tc', 'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr',
  'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf',
  'monmail.fr.nf', 'maildrop.cc', 'sharklasers.com', 'guerrillamailblock.com',
  'grr.la', 'guerrillamail.info', 'spam4.me', 'dispostable.com',
  'mailnesia.com', 'discard.email', 'fakeinbox.com',
  'mailforspam.com', 'spamfree24.org', 'spamfree24.de', 'spamfree24.eu',
  'spamfree24.info', 'spamfree24.net', 'spam.la', 'spamgrap.com',
  'spamherelots.com', 'spamhereplease.com', 'mailscrap.com',
  'spam-be-gone.com', 'spamex.com', 'mailin8r.com', 'mailinator2.com',
  'mailinator.net', 'mailinator.org', 'sogetthis.com', 'notmailinator.com',
  'suremail.info', 'spamcorpse.com', 'spamfree.eu', 'spam.su',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.de',
  '10minutemail.co.uk', '10minutemail.co.za', '10minutemail.info',
  '10minutemail.nl', '10minutemail.ru', '10minemail.com', 'tenminutemail.com',
  'tempr.email', 'discard.email', 'discardmail.com', 'discardmail.de',
  'throwam.com', 'throwam.net', 'spamgourmet.com', 'jetable.net',
  'jetable.org', 'netcrazy.de', 'objectmail.com', 'getairmail.com',
  'filzmail.com', 'filzmail.de', 'trashmail.de', 'cuvox.de',
  'dayrep.com', 'einrot.com', 'fleckens.hu', 'gustr.com',
  'jourrapide.com', 'rhyta.com', 'superrito.com', 'teleworm.us',
  'armyspy.com', 'cuvox.de', 'dayrep.com', 'einrot.com',
  'fleckens.hu', 'gustr.com', 'jourrapide.com', 'rhyta.com',
  'superrito.com', 'teleworm.us', 'armyspy.com', 'einrot.de',
  'fakemailgenerator.com', 'mailgen.biz', 'mailgen.info',
  'nwldx.com', 'otherinbox.com', 'spamevader.com',
  'spamfree24.org', 'spamify.com', 'spamthisplease.com',
  'throam.com', 'throwam.com', 'throwam.net',
  'notmailinator.com', 'vomoto.com', 'wegwerfmail.de',
  'wegwerfmail.net', 'wegwerfmail.org', 'spamfree24.com',
  'mailnull.com', 'spamkornet.com', 'objectmail.com',
  'mailbucket.org', 'mailin8r.com', 'spamcero.com',
  'tempinbox.com', 'tempinbox.co.uk', 'anonbox.net',
  'anonymail.dk', 'binkmail.com', 'bobmail.info', 'chatmeet.me',
  'chong-mail.com', 'clixser.com', 'coieo.com', 'compositemail.com',
  'correo.blogos.net', 'csh.ro', 'curryworld.de', 'dacoolest.com',
  'dandikmail.com', 'dayrep.com', 'deadaddress.com',
  'deadspam.com', 'despam.it', 'despammed.com', 'devnullmail.com',
  'dfgh.net', 'digitalsanctuary.com', 'dingbone.com', 'disposableaddress.com',
  'disposableemailaddresses.com', 'dispostable.com',
  'dm.w3internet.co.uk', 'dodgeit.com', 'dodgemail.de',
  'dontreg.com', 'dontsendmespam.de', 'drdrb.com', 'dump-email.info',
  'dumpandfuck.com', 'dumpmail.de', 'dumpyemail.com',
  'e4ward.com', 'email60.com', 'emailias.com', 'emailinfive.com',
  'emailmiser.com', 'emailsensei.com', 'emailtemporario.com.br',
  'emailthe.net', 'emailtmp.com', 'emailwarden.com', 'emailxfer.com',
  'emkei.cz', 'enterto.com', 'ephemail.net', 'etranquil.com',
  'etranquil.net', 'etranquil.org', 'evopo.com', 'explodemail.com',
  'expressindia.com', 'eyepaste.com', 'fakedemail.com',
  'fakeinformation.com', 'fast-email.com', 'fast-mail.fr',
  'fastem.com', 'fastemail.us', 'fastemailer.com', 'fastemails.us',
  'fastermail.com', 'fastest.cc', 'fastimap.com', 'fatflap.com',
  'fdcserver.net', 'fightallspam.com', 'fiifke.de', 'filestring.com',
  'fingermailaddress.com', 'fizmail.com', 'fleckens.hu', 'fo.kz',
  'frapmail.com', 'front14.org', 'fudgerub.com',
]);

export type EmailRiskLevel = 'low' | 'medium' | 'high';

export interface EmailDomainCheckResult {
  domain: string;
  riskLevel: EmailRiskLevel;
  isDisposable: boolean;
  /** Signal codes for logging */
  flags: string[];
}

/**
 * Checks an email domain for disposable / suspicious signals.
 * Returns a risk assessment without making any external API calls.
 */
export function checkEmailDomain(email: string): EmailDomainCheckResult {
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2 || !parts[1]) {
    return { domain: '', riskLevel: 'high', isDisposable: false, flags: ['INVALID_FORMAT'] };
  }

  const domain = parts[1];
  const flags: string[] = [];

  // Direct match
  if (DISPOSABLE_DOMAINS.has(domain)) {
    flags.push('DISPOSABLE_DOMAIN');
    return { domain, riskLevel: 'high', isDisposable: true, flags };
  }

  // TLD-based suspicious patterns (very short domains with suspicious TLDs)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  const sld = domainParts[domainParts.length - 2] || '';

  // Domains with no recognisable SLD (single-label or purely numeric)
  if (domainParts.length === 1 || /^\d+$/.test(sld)) {
    flags.push('SUSPICIOUS_DOMAIN_STRUCTURE');
    return { domain, riskLevel: 'medium', isDisposable: false, flags };
  }

  // Suspicious keywords in domain
  const suspiciousKeywords = [
    'temp', 'trash', 'spam', 'fake', 'junk', 'nospam', 'discard',
    'throwaway', 'throwam', 'disposable', 'mailinator', 'guerrilla',
    'burner', 'nomail', 'tempmail', 'trashmail', 'deadmail',
  ];
  for (const kw of suspiciousKeywords) {
    if (domain.includes(kw)) {
      flags.push('SUSPICIOUS_KEYWORD');
      return { domain, riskLevel: 'medium', isDisposable: false, flags };
    }
  }

  return { domain, riskLevel: 'low', isDisposable: false, flags };
}
