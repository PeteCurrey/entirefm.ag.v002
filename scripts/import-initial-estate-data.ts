/**
 * INITIAL ESTATE DATA INGESTION SCRIPT
 * ====================================
 * Ingests:
 *   1. CSV's/Clients One.csv
 *   2. CSV's/Clients Two.csv
 *   3. CSV's/Sites.csv
 *
 * Establishes canonical deduplicated client accounts and links associated sites.
 */

import fs from 'fs';
import path from 'path';
import { dbQuery, isDbConfigured } from '../src/server/db/client';

function parseFullCsv(content: string): string[][] {
  const rows: string[][] = [];
  let currentField = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && content[i + 1] === '\n') {
        i++;
      }
      currentRow.push(currentField);
      if (currentRow.some((f) => f.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((f) => f.trim().length > 0)) {
      rows.push(currentRow);
    }
  }
  return rows;
}

interface ClientRecord {
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  postcode?: string;
}

interface SiteRecord {
  name: string;
  addressLine1?: string;
  city?: string;
  county?: string;
  postcode?: string;
  associatedCustomer?: string;
}

function normalizeClientKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(limited|ltd|plc|llp|group|uk)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function run() {
  console.log('====================================================');
  console.log('STARTING ENTIREFM ESTATE DATA INGESTION');
  console.log('====================================================\n');

  if (!isDbConfigured()) {
    console.error('FATAL: Database configuration not found in environment.');
    process.exit(1);
  }

  const workspaceRoot = path.resolve(__dirname, '..');
  const c1Path = path.join(workspaceRoot, "CSV's", 'Clients One.csv');
  const c2Path = path.join(workspaceRoot, "CSV's", 'Clients Two.csv');
  const sitesPath = path.join(workspaceRoot, "CSV's", 'Sites.csv');

  const c1Rows = parseFullCsv(fs.readFileSync(c1Path, 'utf8'));
  const c2Rows = parseFullCsv(fs.readFileSync(c2Path, 'utf8'));
  const siteRows = parseFullCsv(fs.readFileSync(sitesPath, 'utf8'));

  console.log(`Read ${c1Rows.length - 1} rows from Clients One.csv`);
  console.log(`Read ${c2Rows.length - 1} rows from Clients Two.csv`);
  console.log(`Read ${siteRows.length - 1} rows from Sites.csv\n`);

  // 1. Ingest & Deduplicate Clients
  const clientMap = new Map<string, ClientRecord>();

  const processClientRow = (row: string[]) => {
    const rawName = row[0]?.trim();
    if (!rawName || rawName === 'Customer') return;

    const normKey = normalizeClientKey(rawName);
    const existing = clientMap.get(normKey);

    const firstName = row[1]?.trim() || undefined;
    const lastName = row[2]?.trim() || undefined;
    const phone = row[3]?.trim() || undefined;
    const email = row[5]?.trim() || undefined;
    const postcode = row[7]?.trim() || undefined;

    if (!existing) {
      clientMap.set(normKey, {
        name: rawName,
        firstName,
        lastName,
        phone,
        email,
        postcode,
      });
    } else {
      // Merge best fields
      if (!existing.phone && phone) existing.phone = phone;
      if (!existing.email && email) existing.email = email;
      if (!existing.firstName && firstName) existing.firstName = firstName;
      if (!existing.lastName && lastName) existing.lastName = lastName;
      if (!existing.postcode && postcode) existing.postcode = postcode;
      // Prefer the longer, more formal company name if available
      if (rawName.length > existing.name.length) existing.name = rawName;
    }
  };

  for (const r of c1Rows.slice(1)) processClientRow(r);
  for (const r of c2Rows.slice(1)) processClientRow(r);

  console.log(`Identified ${clientMap.size} unique client organisations across both files.\n`);

  // Fetch Default/Fallback EntireFM Org
  const { data: defaultOrgs } = await dbQuery<any[]>('organisations?org_type=eq.ENTIREFM&limit=1');
  const defaultOrgId = defaultOrgs?.[0]?.id || '8df8e98e-49b8-4d57-b087-8df7dca223a2';

  // Fetch existing client accounts to avoid duplicate insertions
  const { data: existingClients } = await dbQuery<any[]>('client_accounts?select=id,name,account_number,organisation_id');
  const existingClientsByName = new Map<string, any>();
  if (existingClients) {
    for (const ec of existingClients) {
      existingClientsByName.set(normalizeClientKey(ec.name), ec);
    }
  }

  const clientIdMap = new Map<string, { id: string; orgId: string; name: string }>();

  let clientsCreated = 0;
  let clientsUpdated = 0;

  for (const [key, client] of clientMap.entries()) {
    const existing = existingClientsByName.get(key);

    if (existing) {
      // Update phone/email on organisation if missing
      if (client.email || client.phone) {
        await dbQuery(`organisations?id=eq.${encodeURIComponent(existing.organisation_id)}`, {
          method: 'PATCH',
          body: {
            email: client.email || undefined,
            phone: client.phone || undefined,
          },
        });
      }
      clientIdMap.set(key, { id: existing.id, orgId: existing.organisation_id, name: existing.name });
      clientsUpdated++;
    } else {
      // Create organisation first
      const rawCode = client.name.substring(0, 6).toUpperCase().replace(/[^A-Z0-9]/g, '') || 'ORG';
      const cleanCode = `${rawCode}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: orgData, error: orgErr } = await dbQuery<any[]>('organisations', {
        method: 'POST',
        body: {
          name: client.name,
          code: cleanCode,
          org_type: 'CLIENT',
          email: client.email || null,
          phone: client.phone || null,
          status: 'ACTIVE',
        },
      });

      if (orgErr || !orgData?.[0]) {
        console.error(`Failed to create organisation for "${client.name}":`, orgErr);
        continue;
      }
      const orgId = orgData[0].id;

      // Create contact person if email exists
      let contactPersonId: string | null = null;
      if (client.email) {
        const { data: personData } = await dbQuery<any[]>('persons', {
          method: 'POST',
          body: {
            first_name: client.firstName || 'Client',
            last_name: client.lastName || 'Administrator',
            email: client.email.toLowerCase(),
            phone: client.phone || null,
            job_title: 'Client Contact',
            status: 'ACTIVE',
          },
        });
        if (personData?.[0]) {
          contactPersonId = personData[0].id;
        }
      }

      // Create client_account
      const accNum = `CLA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const { data: clientAccData, error: accErr } = await dbQuery<any[]>('client_accounts', {
        method: 'POST',
        body: {
          organisation_id: orgId,
          account_code: accNum,
          account_number: accNum,
          name: client.name,
          account_status: 'ACTIVE',
          account_tier: 'CORPORATE',
          primary_contact_id: contactPersonId,
        },
      });

      if (accErr || !clientAccData?.[0]) {
        console.error(`Failed to create client account for "${client.name}":`, accErr);
        continue;
      }

      const createdClient = clientAccData[0];
      clientIdMap.set(key, { id: createdClient.id, orgId, name: client.name });
      existingClientsByName.set(key, createdClient);
      clientsCreated++;
    }
  }

  console.log(`\nClient Ingestion Complete:`);
  console.log(`- Created: ${clientsCreated}`);
  console.log(`- Existing/Updated: ${clientsUpdated}`);
  console.log(`- Total In-Memory Catalog: ${clientIdMap.size}\n`);

  // 2. Ingest & Deduplicate Sites
  const siteMap = new Map<string, SiteRecord>();

  for (const r of siteRows.slice(1)) {
    const rawName = r[0]?.trim();
    if (!rawName) continue;

    const addressLine1 = r[1]?.trim() || undefined;
    const city = r[2]?.trim() || undefined;
    const county = r[3]?.trim() || undefined;
    const postcode = r[4]?.trim() || undefined;
    const associatedCustomer = r[5]?.trim() || undefined;

    // Deduplicate by name and postcode
    const siteKey = `${rawName.toLowerCase()}__${(postcode || '').toLowerCase()}`;
    const existing = siteMap.get(siteKey);

    if (!existing) {
      siteMap.set(siteKey, {
        name: rawName,
        addressLine1,
        city,
        county,
        postcode,
        associatedCustomer,
      });
    } else {
      // If previous entry had no associatedCustomer but this one does, keep it
      if (!existing.associatedCustomer && associatedCustomer) {
        existing.associatedCustomer = associatedCustomer;
      }
      if (!existing.addressLine1 && addressLine1) existing.addressLine1 = addressLine1;
      if (!existing.city && city) existing.city = city;
      if (!existing.county && county) existing.county = county;
    }
  }

  console.log(`Identified ${siteMap.size} unique sites out of ${siteRows.length - 1} rows in Sites.csv.\n`);

  // Fetch existing sites to avoid re-inserting
  const { data: existingSites } = await dbQuery<any[]>('sites?select=id,name,site_code,postcode,client_account_id');
  const existingSitesByKey = new Map<string, any>();
  if (existingSites) {
    for (const es of existingSites) {
      const k = `${es.name.toLowerCase()}__${(es.postcode || '').toLowerCase()}`;
      existingSitesByKey.set(k, es);
    }
  }

  let sitesCreated = 0;
  let sitesUpdated = 0;
  let sitesLinked = 0;

  for (const [key, site] of siteMap.entries()) {
    // Resolve client if associatedCustomer exists
    let clientAccount: { id: string; orgId: string; name: string } | undefined;
    if (site.associatedCustomer) {
      const custNorm = normalizeClientKey(site.associatedCustomer);
      clientAccount = clientIdMap.get(custNorm);
      if (!clientAccount) {
        // Fallback partial matching
        for (const [cKey, val] of clientIdMap.entries()) {
          if (custNorm.includes(cKey) || cKey.includes(custNorm)) {
            clientAccount = val;
            break;
          }
        }
      }
    }

    const orgId = clientAccount?.orgId || defaultOrgId;
    const clientAccountId = clientAccount?.id || null;

    const existing = existingSitesByKey.get(key);

    if (existing) {
      // Update linkage if site was not linked previously but now has a client
      if (!existing.client_account_id && clientAccountId) {
        await dbQuery(`sites?id=eq.${encodeURIComponent(existing.id)}`, {
          method: 'PATCH',
          body: {
            client_account_id: clientAccountId,
            organisation_id: orgId,
          },
        });
        sitesLinked++;
        sitesUpdated++;
      }
    } else {
      const codePrefix = site.name.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, '') || 'SITE';
      const siteCode = `STE-${codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: createdSite, error: siteErr } = await dbQuery<any[]>('sites', {
        method: 'POST',
        body: {
          organisation_id: orgId,
          client_account_id: clientAccountId,
          site_code: siteCode,
          name: site.name,
          site_type: 'COMMERCIAL_OFFICE',
          address_line1: site.addressLine1 || site.name,
          city: site.city || 'United Kingdom',
          county: site.county || null,
          postcode: site.postcode || 'UK',
          country: 'United Kingdom',
          status: 'ACTIVE',
        },
      });

      if (siteErr || !createdSite?.[0]) {
        console.error(`Failed to insert site "${site.name}":`, siteErr);
      } else {
        sitesCreated++;
        if (clientAccountId) sitesLinked++;
        existingSitesByKey.set(key, createdSite[0]);
      }
    }
  }

  console.log('====================================================');
  console.log('ESTATE INGESTION SUMMARY REPORT');
  console.log('====================================================');
  console.log(`Clients Created:         ${clientsCreated}`);
  console.log(`Clients Existing:        ${clientsUpdated}`);
  console.log(`Sites Created:           ${sitesCreated}`);
  console.log(`Sites Linked to Clients: ${sitesLinked}`);
  console.log(`Sites Existing/Updated:  ${sitesUpdated}`);
  console.log('====================================================\n');
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
