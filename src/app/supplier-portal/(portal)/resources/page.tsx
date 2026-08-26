import React from 'react';
import { FileText, Download, ShieldCheck, Scale, Wrench } from 'lucide-react';
import { listSupplierResources } from '@/server/suppliers/store';

export const metadata = {
  title: 'Supplier Standards & Resources | EntireFM Partner Network',
  description: 'Download official EntireFM operational standards, RAMS guidance, and Code of Conduct.',
};

export default async function SupplierResourcesPage() {
  const resources = await listSupplierResources();

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
          OPERATIONAL GUIDELINES &amp; POLICIES
        </span>
        <h1 className="text-2xl font-extralight tracking-tight text-slate-900 mt-1">
          Supplier Standards &amp; Resource Vault
        </h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Official EntireFM standards, service report requirements, and health &amp; safety templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {resources.map((res) => (
          <div key={res.id} className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">{res.category}</span>
                <span className="text-[10.5px] font-light text-slate-500">{res.version}</span>
              </div>
              <h3 className="font-bold text-slate-900 font-sans text-sm">{res.title}</h3>
              <p className="text-slate-600 font-light leading-relaxed text-[11.5px]">{res.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-light text-slate-400">{res.file_format}</span>
              <a
                href={res.download_url}
                className="text-brand-pink font-bold hover:underline flex items-center gap-1 text-[11.5px]"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
