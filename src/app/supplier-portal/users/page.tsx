import React from 'react';
import { Users, UserPlus, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Supplier Team & Users | EntireFM Partner Network',
  description: 'Manage authorised portal users for your supplier organisation.',
};

export default function SupplierUsersPage() {
  const users = [
    { id: 'usr-01', name: 'David Patterson', email: 'd.patterson@midlandshvac.example.co.uk', role: 'SUPPLIER_ADMIN', status: 'ACTIVE', lastLogin: '25 Aug 2026, 21:45' },
    { id: 'usr-02', name: 'Sarah Jenkins', email: 's.jenkins@midlandshvac.example.co.uk', role: 'OPERATIONS', status: 'ACTIVE', lastLogin: '25 Aug 2026, 21:30' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            TEAM &amp; ACCESS CONTROL
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Authorised Supplier Users
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            Manage colleagues authorized to view jobs, submit quotes, and upload compliance documents.
          </p>
        </div>

        <button className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto">
          <UserPlus className="h-3.5 w-3.5" /> Invite User
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-900 text-white font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Full Name</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Last Login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                <td className="p-3.5 font-mono text-[11px] text-slate-600">{u.email}</td>
                <td className="p-3.5 font-mono text-[11px] font-bold text-slate-800">{u.role}</td>
                <td className="p-3.5">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    {u.status}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-[11px] text-slate-500">{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
