import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import EmptyState from '@/components/admin/EmptyState';
import { Receipt, CreditCard, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ContractorCommercialPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const orgId = session.orgId || session.personId;
  const { data: pos } = await dbQuery<any[]>(
    `purchase_orders?provider_org_id=eq.${orgId}&order=created_at.desc&limit=50&select=*`
  );

  const purchaseOrders = pos || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extralight text-white tracking-tight">Commercial & Purchase Orders</h1>
        <p className="text-brand-mist text-sm mt-1">
          Track approved purchase orders, committed expenditure, and billing readiness for completed works.
        </p>
      </div>

      {purchaseOrders.length === 0 ? (
        <EmptyState
          title="No Purchase Orders"
          description="Purchase orders issued by EntireFM for accepted works will appear here."
          icon="Receipt"
        />
      ) : (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-brand-mist">
            <thead className="bg-brand-void text-xs uppercase font-light text-brand-mist border-b border-brand-edge-dark">
              <tr>
                <th className="p-4">PO Reference</th>
                <th className="p-4">Work Order</th>
                <th className="p-4">Amount (£)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark">
              {purchaseOrders.map(po => (
                <tr key={po.id} className="hover:bg-brand-edge-dark/30 transition-colors">
                  <td className="p-4 font-mono font-light text-white">{po.po_number || po.id.slice(0, 8)}</td>
                  <td className="p-4 font-mono text-white">{po.work_order_id ? po.work_order_id.slice(0, 8) : '—'}</td>
                  <td className="p-4 font-mono text-brand-electric font-light">
                    £{(po.amount_net_gbp || po.total_amount_gbp || 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2.5 py-0.5 rounded font-mono bg-brand-void text-brand-mist border border-brand-edge-dark">
                      {po.status || 'ISSUED'}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono">
                    {new Date(po.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
