/**
 * ENTIREFM XERO CONTACT SYNCHRONISATION SERVICE
 * ==============================================
 * Bidirectional, deduplicated mapping between EntireCAFM Clients and Xero Contacts.
 *
 * Mapping Strategy:
 * EntireCAFM Client Account / Organisation -> Xero Contact
 *
 * Deduplication Sequence:
 * 1. Check client_accounts.xero_contact_id (explicit foreign reference)
 * 2. Search Xero by AccountNumber (stable corporate identifier)
 * 3. Search Xero by EmailAddress (primary billing email)
 * 4. Search Xero by Company Name
 * 5. Create new contact only if no match found
 */

import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import { XeroClient } from './client';
import { getActiveConnection } from './oauth';
import { XeroApiError, XeroAuthError } from './errors';
import type { XeroContact, XeroAddress, XeroPhone } from './types';

export interface SyncContactResult {
  contactId: string;
  contactNumber?: string;
  isNew: boolean;
  matchedBy: 'DIRECT_ID' | 'ACCOUNT_NUMBER' | 'EMAIL' | 'COMPANY_NAME' | 'CREATED';
  xeroContact: XeroContact;
}

/**
 * Synchronises an EntireCAFM client account to a verified Xero contact.
 */
export async function syncClientToXeroContact(params: {
  clientAccountId: string;
  xeroClient?: XeroClient;
  actorPersonId?: string;
}): Promise<SyncContactResult> {
  // 1. Fetch Client Account with Organisation and Primary Contact Person
  const { data: clients, error: clientErr } = await dbQuery<any[]>(
    `client_accounts?id=eq.${encodeURIComponent(params.clientAccountId)}&select=*,organisation:organisations(*),primary_contact:persons!client_accounts_primary_contact_id_fkey(*)&limit=1`
  );

  if (clientErr || !clients || clients.length === 0) {
    throw new XeroApiError(404, `Client account ${params.clientAccountId} not found in EntireCAFM.`);
  }

  const ca = clients[0];
  const org = ca.organisation || {};
  const contactPerson = ca.primary_contact || {};

  // 2. Obtain XeroClient
  let client = params.xeroClient;
  if (!client) {
    const connection = await getActiveConnection(org.id);
    if (!connection) {
      throw new XeroAuthError('No active verified Xero connection found for this organisation.');
    }
    client = new XeroClient(connection);
  }

  const companyName = ca.name || org.name || 'Unnamed Client Account';
  const accountNumber = ca.account_number || ca.account_code || '';
  const email = contactPerson.email || org.email || '';
  const phone = contactPerson.phone || org.phone || '';
  const addr = org.address_json || {};

  const addresses: XeroAddress[] = [];
  if (addr.address_line1 || addr.postcode || addr.city) {
    addresses.push({
      AddressType: 'POBOX',
      AddressLine1: addr.address_line1 || '',
      AddressLine2: addr.address_line2 || '',
      City: addr.city || '',
      Region: addr.county || '',
      PostalCode: addr.postcode || '',
      Country: addr.country || 'United Kingdom',
      AttentionTo: contactPerson.first_name ? `${contactPerson.first_name} ${contactPerson.last_name || ''}`.trim() : undefined,
    });
  }

  const phones: XeroPhone[] = [];
  if (phone) {
    phones.push({
      PhoneType: 'DEFAULT',
      PhoneNumber: phone,
    });
  }

  // 3. STEP A: Check existing xero_contact_id
  if (ca.xero_contact_id) {
    try {
      const existingRes = await client.get<{ Contacts: XeroContact[] }>(`Contacts/${ca.xero_contact_id}`);
      if (existingRes?.Contacts && existingRes.Contacts.length > 0) {
        const found = existingRes.Contacts[0];
        // Ensure details stay synchronised
        const updatedContact = await updateExistingXeroContact(client, found.ContactID!, {
          Name: companyName,
          AccountNumber: accountNumber || undefined,
          FirstName: contactPerson.first_name || undefined,
          LastName: contactPerson.last_name || undefined,
          EmailAddress: email || undefined,
          Phones: phones.length > 0 ? phones : undefined,
          Addresses: addresses.length > 0 ? addresses : undefined,
          TaxNumber: org.vat_number || undefined,
          CompanyNumber: org.company_number || undefined,
        });

        await updateClientAccountXeroRef(ca.id, found.ContactID!, found.ContactNumber);

        return {
          contactId: found.ContactID!,
          contactNumber: found.ContactNumber,
          isNew: false,
          matchedBy: 'DIRECT_ID',
          xeroContact: updatedContact || found,
        };
      }
    } catch (err) {
      console.warn(`[XERO_CONTACT_SYNC] Direct ID ${ca.xero_contact_id} not found in Xero, falling back to deduplication search.`);
    }
  }

  // 4. STEP B: Search Xero by AccountNumber (highest fidelity corporate identifier)
  if (accountNumber) {
    try {
      const searchRes = await client.get<{ Contacts: XeroContact[] }>('Contacts', {
        where: `AccountNumber=="${escapeXeroQuery(accountNumber)}"`,
      });
      if (searchRes?.Contacts && searchRes.Contacts.length > 0) {
        const matched = searchRes.Contacts[0];
        await updateClientAccountXeroRef(ca.id, matched.ContactID!, matched.ContactNumber);
        await logContactSyncEvent('XERO_CONTACT_UPDATED', ca.id, matched.ContactID!, params.actorPersonId);
        return {
          contactId: matched.ContactID!,
          contactNumber: matched.ContactNumber,
          isNew: false,
          matchedBy: 'ACCOUNT_NUMBER',
          xeroContact: matched,
        };
      }
    } catch (err) {
      console.warn('[XERO_CONTACT_SYNC] Search by AccountNumber failed, falling back...');
    }
  }

  // 5. STEP C: Search Xero by EmailAddress
  if (email) {
    try {
      const emailRes = await client.get<{ Contacts: XeroContact[] }>('Contacts', {
        where: `EmailAddress=="${escapeXeroQuery(email)}"`,
      });
      if (emailRes?.Contacts && emailRes.Contacts.length > 0) {
        const matched = emailRes.Contacts[0];
        await updateClientAccountXeroRef(ca.id, matched.ContactID!, matched.ContactNumber);
        await logContactSyncEvent('XERO_CONTACT_UPDATED', ca.id, matched.ContactID!, params.actorPersonId);
        return {
          contactId: matched.ContactID!,
          contactNumber: matched.ContactNumber,
          isNew: false,
          matchedBy: 'EMAIL',
          xeroContact: matched,
        };
      }
    } catch (err) {
      console.warn('[XERO_CONTACT_SYNC] Search by EmailAddress failed, falling back...');
    }
  }

  // 6. STEP D: Search Xero by exact Company Name
  try {
    const nameRes = await client.get<{ Contacts: XeroContact[] }>('Contacts', {
      where: `Name=="${escapeXeroQuery(companyName)}"`,
    });
    if (nameRes?.Contacts && nameRes.Contacts.length > 0) {
      const matched = nameRes.Contacts[0];
      await updateClientAccountXeroRef(ca.id, matched.ContactID!, matched.ContactNumber);
      await logContactSyncEvent('XERO_CONTACT_UPDATED', ca.id, matched.ContactID!, params.actorPersonId);
      return {
        contactId: matched.ContactID!,
        contactNumber: matched.ContactNumber,
        isNew: false,
        matchedBy: 'COMPANY_NAME',
        xeroContact: matched,
      };
    }
  } catch (err) {
    console.warn('[XERO_CONTACT_SYNC] Search by Name failed, creating new contact...');
  }

  // 7. STEP E: Create Contact in Xero
  const createPayload: XeroContact = {
    Name: companyName,
    AccountNumber: accountNumber || undefined,
    FirstName: contactPerson.first_name || undefined,
    LastName: contactPerson.last_name || undefined,
    EmailAddress: email || undefined,
    Phones: phones.length > 0 ? phones : undefined,
    Addresses: addresses.length > 0 ? addresses : undefined,
    TaxNumber: org.vat_number || undefined,
    CompanyNumber: org.company_number || undefined,
  };

  const createRes = await client.post<{ Contacts: XeroContact[] }>('Contacts', {
    Contacts: [createPayload],
  });

  if (!createRes?.Contacts || createRes.Contacts.length === 0 || !createRes.Contacts[0].ContactID) {
    throw new XeroApiError(500, 'Xero did not return a valid ContactID upon contact creation.');
  }

  const createdContact = createRes.Contacts[0];
  await updateClientAccountXeroRef(ca.id, createdContact.ContactID!, createdContact.ContactNumber);
  await logContactSyncEvent('XERO_CONTACT_CREATED', ca.id, createdContact.ContactID!, params.actorPersonId);

  return {
    contactId: createdContact.ContactID!,
    contactNumber: createdContact.ContactNumber,
    isNew: true,
    matchedBy: 'CREATED',
    xeroContact: createdContact,
  };
}

async function updateExistingXeroContact(
  client: XeroClient,
  contactId: string,
  payload: Partial<XeroContact>
): Promise<XeroContact | null> {
  try {
    const res = await client.post<{ Contacts: XeroContact[] }>(`Contacts/${contactId}`, {
      Contacts: [{ ContactID: contactId, ...payload }],
    });
    return res?.Contacts?.[0] || null;
  } catch (err) {
    console.warn(`[XERO_CONTACT_SYNC] Non-critical error updating existing contact ${contactId}:`, err);
    return null;
  }
}

async function updateClientAccountXeroRef(
  clientAccountId: string,
  xeroContactId: string,
  xeroContactNumber?: string
): Promise<void> {
  await dbQuery(`client_accounts?id=eq.${encodeURIComponent(clientAccountId)}`, {
    method: 'PATCH',
    body: {
      xero_contact_id: xeroContactId,
      xero_contact_number: xeroContactNumber || null,
      xero_synced_at: new Date().toISOString(),
    },
  });
}

async function logContactSyncEvent(
  eventType: 'XERO_CONTACT_CREATED' | 'XERO_CONTACT_UPDATED',
  clientAccountId: string,
  xeroContactId: string,
  actorPersonId?: string
): Promise<void> {
  await recordAuditEvent({
    event_type: eventType,
    actor_id: actorPersonId,
    actor_type: actorPersonId ? 'HUMAN' : 'SYSTEM',
    object_type: 'client_accounts',
    object_id: clientAccountId,
    after_state: { xero_contact_id: xeroContactId },
    is_ai: false,
  });
}

function escapeXeroQuery(val: string): string {
  return val.replace(/["\\]/g, '');
}
