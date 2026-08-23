/**
 * ENTIREFM COMMERCIAL DOMAIN MODULE
 * =================================
 * Quotes, Purchase Orders, Supplier Invoices, Client Billing, and WIP.
 */

import { dbQuery } from '../db/client';

export interface Quote {
  id: string;
  quote_number: string;
  work_order_id?: string;
  client_account_id: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  subtotal_gbp: number;
  tax_amount_gbp: number;
  total_amount_gbp: number;
  submitted_at?: string;
  valid_until?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  work_order_id?: string;
  supplier_org_id: string;
  status: 'DRAFT' | 'ISSUED' | 'ACCEPTED' | 'INVOICED' | 'CANCELLED';
  total_amount_gbp: number;
  issued_at?: string;
  created_at: string;
  supplier?: { name: string };
}

export interface ClientInvoice {
  id: string;
  invoice_number: string;
  client_account_id: string;
  contract_id?: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issue_date: string;
  due_date: string;
  subtotal_gbp: number;
  tax_amount_gbp: number;
  total_amount_gbp: number;
  paid_at?: string;
  created_at: string;
}

export async function listQuotes(status?: string): Promise<Quote[]> {
  let endpoint = 'quotes?select=*&order=created_at.desc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<Quote[]>(endpoint);
  return data || [];
}

export async function listPurchaseOrders(status?: string): Promise<PurchaseOrder[]> {
  let endpoint = 'purchase_orders?select=*,supplier:organisations(name)&order=created_at.desc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<PurchaseOrder[]>(endpoint);
  return data || [];
}

export async function listClientInvoices(status?: string): Promise<ClientInvoice[]> {
  let endpoint = 'client_invoices?select=*&order=created_at.desc';
  if (status) endpoint += `&status=eq.${encodeURIComponent(status)}`;
  const { data } = await dbQuery<ClientInvoice[]>(endpoint);
  return data || [];
}
