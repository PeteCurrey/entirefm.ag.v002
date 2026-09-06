import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { createClientAccount, listClientAccounts, updateClientAccount } from '@/server/estate';

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
      email?: string;
      phone?: string;
      postcode?: string;
      account_tier?: string;
    }> = [];

    if (body.csvContent && typeof body.csvContent === 'string') {
      const parsed = parseCsv(body.csvContent);
      if (parsed.length <= 1) {
        return NextResponse.json({ success: false, error: 'CSV has no data rows' }, { status: 400 });
      }
      const header = parsed[0].map((h) => h.trim().toLowerCase());
      const nameIdx = header.findIndex((h) => h.includes('customer') || h.includes('client') || h.includes('company') || h === 'name');
      const emailIdx = header.findIndex((h) => h.includes('email') || h.includes('mail'));
      const phoneIdx = header.findIndex((h) => h.includes('phone') || h.includes('tel') || h.includes('mobile'));
      const postcodeIdx = header.findIndex((h) => h.includes('postcode') || h.includes('zip'));
      const tierIdx = header.findIndex((h) => h.includes('tier') || h.includes('type'));

      if (nameIdx === -1) {
        return NextResponse.json(
          { success: false, error: 'Could not find a Customer or Client Name column in CSV header.' },
          { status: 400 }
        );
      }

      for (const row of parsed.slice(1)) {
        const name = row[nameIdx]?.trim();
        if (!name) continue;
        rowsToProcess.push({
          name,
          email: emailIdx >= 0 ? row[emailIdx]?.trim() || undefined : undefined,
          phone: phoneIdx >= 0 ? row[phoneIdx]?.trim() || undefined : undefined,
          postcode: postcodeIdx >= 0 ? row[postcodeIdx]?.trim() || undefined : undefined,
          account_tier: tierIdx >= 0 ? row[tierIdx]?.trim() || undefined : undefined,
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
      return NextResponse.json({ success: false, error: 'No valid client rows found to import.' }, { status: 400 });
    }

    // Fetch existing clients to deduplicate by name
    const existingClients = await listClientAccounts();
    const existingByName = new Map<string, typeof existingClients[0]>();
    for (const c of existingClients) {
      existingByName.set(c.name.trim().toLowerCase(), c);
    }

    let imported = 0;
    let updated = 0;
    let failed = 0;
    const errors: Array<{ name: string; error: string }> = [];

    for (const item of rowsToProcess) {
      const cleanName = item.name.trim();
      if (!cleanName) continue;

      const normName = cleanName.toLowerCase();
      const existing = existingByName.get(normName);

      try {
        if (existing) {
          // Update existing with additional email/phone if provided
          await updateClientAccount(existing.id, {
            email: item.email || undefined,
            phone: item.phone || undefined,
          });
          updated++;
        } else {
          // Create new client
          const newClient = await createClientAccount({
            name: cleanName,
            account_tier: (item.account_tier as any) || 'CORPORATE',
            account_status: 'ACTIVE',
            email: item.email,
            phone: item.phone,
          });
          existingByName.set(normName, newClient);
          imported++;
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
        failed,
        errors,
      },
    });
  } catch (error: any) {
    console.error('[CLIENT_BULK_IMPORT_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
