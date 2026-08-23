/**
 * Credit Notes Desk — Phase 0H
 * Supplier and Client credit note ledger.
 */
import { getCurrentSession, hasPermission } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listCreditNotes } from '@/server/finance';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import EmptyState from '@/components/admin/EmptyState';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CreditNotesPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');
  if (!hasPermission(session, 'finance:read')) redirect('/admin');

  const creditNotes = await listCreditNotes().catch(() => []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Finance"
        title="Credit Notes"
        description="Supplier and client credit notes preserving historical invoice provenance."
      />

      {creditNotes.length === 0 ? (
        <EmptyState
          title="No Credit Notes"
          description="Issued credit notes against supplier or client invoices will be tracked here."
          icon="TrendingDown"
        />
      ) : (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs font-mono text-brand-mist">
            <thead className="bg-brand-void uppercase text-[10.5px] font-semibold text-brand-mist/70 border-b border-brand-edge-dark">
              <tr>
                <th className="p-3.5">Ref</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Linked Invoice</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5">Net (£)</th>
                <th className="p-3.5">Total (£)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {creditNotes.map((cn: any) => (
                <tr key={cn.id} className="hover:bg-brand-edge-dark/20 transition-colors">
                  <td className="p-3.5 font-bold text-white">{cn.credit_note_ref}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${cn.credit_note_type === 'CLIENT' ? 'bg-blue-950/60 text-blue-300' : 'bg-purple-950/60 text-purple-300'}`}>
                      {cn.credit_note_type}
                    </span>
                  </td>
                  <td className="p-3.5 text-white/80">{cn.supplier_invoice_id || cn.client_invoice_id ? (cn.supplier_invoice_id || cn.client_invoice_id).slice(0, 8) : '—'}</td>
                  <td className="p-3.5 text-white/90">{cn.reason}</td>
                  <td className="p-3.5">£{(Number(cn.subtotal_gbp) || 0).toFixed(2)}</td>
                  <td className="p-3.5 font-bold text-brand-electric">£{(Number(cn.total_amount_gbp) || 0).toFixed(2)}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-brand-edge-dark text-white">{cn.status}</span>
                  </td>
                  <td className="p-3.5">{cn.created_at ? new Date(cn.created_at).toLocaleDateString('en-GB') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
