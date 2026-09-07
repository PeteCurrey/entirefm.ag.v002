/**
 * ENTIREFM GLOBAL COMMAND & SEARCH SERVICE
 * ========================================
 * Powers the Cmd+K Spotlight Command Bar and the future "Ask EntireFM" AI assistant.
 * Queries across canonical database entities.
 */

import { dbQuery } from '../db/client';

export interface SearchResultItem {
  id: string;
  type: 'SITE' | 'ASSET' | 'WORK_ORDER' | 'CLIENT' | 'CONTRACTOR' | 'INVOICE' | 'QUOTE' | 'DOCUMENT' | 'NAVIGATION';
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
}

export async function searchEntities(query: string): Promise<SearchResultItem[]> {
  const q = query.trim();
  if (!q || q.length < 2) return [];

  const encoded = encodeURIComponent(`*${q}*`);

  // Parallel lookup across key canonical entities
  const [sitesRes, assetsRes, workOrdersRes, orgsRes, quotesRes, invoicesRes] = await Promise.all([
    dbQuery<any[]>(`sites?or=(name.ilike.${encoded},site_code.ilike.${encoded},city.ilike.${encoded})&limit=5&select=id,site_code,name,city`),
    dbQuery<any[]>(`assets?or=(name.ilike.${encoded},asset_reference.ilike.${encoded},category.ilike.${encoded})&limit=5&select=id,asset_reference,name,category`),
    dbQuery<any[]>(`work_orders?or=(work_order_number.ilike.${encoded},title.ilike.${encoded})&limit=5&select=id,work_order_number,title,status,priority`),
    dbQuery<any[]>(`organisations?or=(name.ilike.${encoded},code.ilike.${encoded})&limit=5&select=id,code,name,org_type`),
    dbQuery<any[]>(`quotes?or=(quote_number.ilike.${encoded},title.ilike.${encoded})&limit=5&select=id,quote_number,title,status,total_sell_gbp`),
    dbQuery<any[]>(`client_invoices?or=(invoice_number.ilike.${encoded},client_po_ref.ilike.${encoded})&limit=5&select=id,invoice_number,total_amount_gbp,status,payment_status`),
  ]);

  const results: SearchResultItem[] = [];

  // Sites
  if (sitesRes.data) {
    for (const s of sitesRes.data) {
      results.push({
        id: s.id,
        type: 'SITE',
        title: s.name,
        subtitle: `${s.site_code} · ${s.city || 'UK'}`,
        href: `/admin/estate/sites`,
        badge: 'Site',
      });
    }
  }

  // Assets
  if (assetsRes.data) {
    for (const a of assetsRes.data) {
      results.push({
        id: a.id,
        type: 'ASSET',
        title: a.name,
        subtitle: `${a.asset_reference} · ${a.category}`,
        href: `/admin/estate/assets`,
        badge: 'Asset',
      });
    }
  }

  // Work Orders
  if (workOrdersRes.data) {
    for (const wo of workOrdersRes.data) {
      results.push({
        id: wo.id,
        type: 'WORK_ORDER',
        title: wo.title || `Work Order ${wo.work_order_number}`,
        subtitle: `${wo.work_order_number} · ${wo.status} · ${wo.priority}`,
        href: `/admin/operations/work-orders`,
        badge: 'Work Order',
      });
    }
  }

  // Quotes
  if (quotesRes.data) {
    for (const q of quotesRes.data) {
      results.push({
        id: q.id,
        type: 'QUOTE',
        title: q.title || `Quote ${q.quote_number}`,
        subtitle: `${q.quote_number} · ${q.status} · £${(Number(q.total_sell_gbp) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
        href: `/admin/commercial/quotes/${q.id}`,
        badge: 'Quote',
      });
    }
  }

  // Client Invoices
  if (invoicesRes.data) {
    for (const inv of invoicesRes.data) {
      results.push({
        id: inv.id,
        type: 'INVOICE',
        title: `Invoice ${inv.invoice_number}`,
        subtitle: `${inv.status} · ${inv.payment_status || 'NOT DUE'} · £${(Number(inv.total_amount_gbp) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
        href: `/admin/finance/client-invoices/${inv.id}`,
        badge: 'Invoice',
      });
    }
  }

  return results;
}
