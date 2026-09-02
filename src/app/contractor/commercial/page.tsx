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
    <div className="space-y-6 font-sans">
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 shadow-xs">
        <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">Commercial &amp; Purchase Orders</h1>
        <p className="text-[#6D6D68] text-xs mt-1 leading-relaxed">
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
        <div className="bg-[#FFFFFF] border border-[#E8E8E5] rounded-[8px] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-[#6D6D68]">
            <thead className="bg-[#FAFAF8] text-[11px] uppercase font-bold text-[#6D6D68] border-b border-[#E8E8E5]">
              <tr>
                <th className="p-4">PO Reference</th>
                <th className="p-4">Work Order</th>
                <th className="p-4">Amount (£)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {purchaseOrders.map(po => (
                <tr key={po.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="p-4 font-mono font-medium text-[#111111]">{po.po_number || po.id.slice(0, 8)}</td>
                  <td className="p-4 font-normal text-[#111111]">{po.work_order_id ? po.work_order_id.slice(0, 8) : '—'}</td>
                  <td className="p-4 text-[#EA580C] font-semibold">
                    £{(po.amount_net_gbp || po.total_amount_gbp || 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-[4px] font-medium bg-[#FAFAF8] text-[#111111] border border-[#E8E8E5]">
                      {po.status || 'ISSUED'}
                    </span>
                  </td>
                  <td className="p-4 text-[11.5px] text-[#6D6D68]">
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
