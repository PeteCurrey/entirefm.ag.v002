import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { createSite, listSites, updateSite, listClientAccounts } from '@/server/estate';

export const dynamic = 'force-dynamic';

function parseCsv(content: string): string[][] {
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

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let rowsToProcess: Array<{
      name: string;
      address_line1?: string;
      city?: string;
      county?: string;
      postcode?: string;
      associated_customer?: string;
    }> = [];

    if (body.csvContent && typeof body.csvContent === 'string') {
      const parsed = parseCsv(body.csvContent);
      if (parsed.length <= 1) {
        return NextResponse.json({ success: false, error: 'CSV has no data rows' }, { status: 400 });
      }
      const header = parsed[0].map((h) => h.trim().toLowerCase());
      const nameIdx = header.findIndex((h) => h === 'site' || h.includes('site name') || h === 'name');
      const addressIdx = header.findIndex((h) => h.includes('site address') || h.includes('address'));
      const townIdx = header.findIndex((h) => h.includes('town') || h.includes('city'));
      const countyIdx = header.findIndex((h) => h.includes('county'));
      const postcodeIdx = header.findIndex((h) => h.includes('postcode') || h.includes('postal') || h.includes('zip'));
      const customerIdx = header.findIndex((h) => h.includes('customer') || h.includes('client') || h.includes('associated'));

      if (nameIdx === -1) {
        return NextResponse.json(
          { success: false, error: 'Could not find a Site or Site Name column in CSV header.' },
          { status: 400 }
        );
      }

      for (const row of parsed.slice(1)) {
        const name = row[nameIdx]?.trim();
        if (!name) continue;
        rowsToProcess.push({
          name,
          address_line1: addressIdx >= 0 ? row[addressIdx]?.trim() || undefined : undefined,
          city: townIdx >= 0 ? row[townIdx]?.trim() || undefined : undefined,
          county: countyIdx >= 0 ? row[countyIdx]?.trim() || undefined : undefined,
          postcode: postcodeIdx >= 0 ? row[postcodeIdx]?.trim() || undefined : undefined,
          associated_customer: customerIdx >= 0 ? row[customerIdx]?.trim() || undefined : undefined,
        });
      }
    } else if (Array.isArray(body.rows)) {
      rowsToProcess = body.rows;
    } else {
      return NextResponse.json(
        { success: false, error: 'Expected either csvContent or rows array in request body.' },
        { status: 400 }
      );
    }

    if (rowsToProcess.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid site rows found to import.' }, { status: 400 });
    }

    // Preload clients to link associated customers
    const clients = await listClientAccounts();
    const clientsByName = new Map<string, typeof clients[0]>();
    for (const c of clients) {
      clientsByName.set(c.name.trim().toLowerCase(), c);
      // Also index stripped alphanumeric
      const alpha = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (alpha) clientsByName.set(alpha, c);
    }

    // Preload existing sites to avoid duplicate duplicates
    const existingSites = await listSites();
    const existingKeySet = new Map<string, typeof existingSites[0]>();
    for (const s of existingSites) {
      const key = `${s.name.trim().toLowerCase()}__${(s.postcode || '').trim().toLowerCase()}`;
      existingKeySet.set(key, s);
    }

    let imported = 0;
    let updated = 0;
    let linked = 0;
    let duplicates_skipped = 0;
    let failed = 0;
    const errors: Array<{ name: string; error: string }> = [];

    // Also track in-batch duplicates so multiple repeated rows in CSV are collapsed
    const seenInBatch = new Set<string>();

    for (const item of rowsToProcess) {
      const cleanName = item.name.trim();
      if (!cleanName) continue;

      const cleanPostcode = (item.postcode || '').trim();
      const batchKey = `${cleanName.toLowerCase()}__${cleanPostcode.toLowerCase()}`;

      // Resolve client account if associated_customer provided
      let clientAccountId: string | undefined = undefined;
      if (item.associated_customer) {
        const rawCust = item.associated_customer.trim().toLowerCase();
        let matched = clientsByName.get(rawCust);
        if (!matched) {
          const alphaCust = rawCust.replace(/[^a-z0-9]/g, '');
          matched = clientsByName.get(alphaCust);
        }
        // Partial search fallback
        if (!matched) {
          for (const c of clients) {
            const cn = c.name.toLowerCase();
            if (rawCust.includes(cn) || cn.includes(rawCust)) {
              matched = c;
              break;
            }
          }
        }
        if (matched) {
          clientAccountId = matched.id;
        }
      }

      if (seenInBatch.has(batchKey)) {
        // If an earlier row in the same batch had no customer but this one has, update it
        const existing = existingKeySet.get(batchKey);
        if (existing && clientAccountId && !existing.client_account_id) {
          await updateSite(existing.id, { client_account_id: clientAccountId });
          linked++;
        } else {
          duplicates_skipped++;
        }
        continue;
      }
      seenInBatch.add(batchKey);

      const existingSite = existingKeySet.get(batchKey);

      try {
        if (existingSite) {
          // If existing site lacks client_account_id but now has one, link it
          if (clientAccountId && !existingSite.client_account_id) {
            await updateSite(existingSite.id, { client_account_id: clientAccountId });
            linked++;
            updated++;
          } else {
            duplicates_skipped++;
          }
        } else {
          const address1 = item.address_line1 || cleanName;
          const city = item.city || 'United Kingdom';
          const postcode = cleanPostcode || 'UK';

          const newSite = await createSite({
            name: cleanName,
            address_line1: address1,
            city,
            county: item.county,
            postcode,
            country: 'United Kingdom',
            client_account_id: clientAccountId,
          });

          existingKeySet.set(batchKey, newSite);
          imported++;
          if (clientAccountId) linked++;
        }
      } catch (err: any) {
        failed++;
        errors.push({ name: cleanName, error: err.message || 'Unknown error' });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: rowsToProcess.length,
        imported,
        updated,
        linked,
        duplicates_skipped,
        failed,
        errors,
      },
    });
  } catch (error: any) {
    console.error('[SITE_BULK_IMPORT_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
