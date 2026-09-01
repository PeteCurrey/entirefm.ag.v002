import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { listMappingTemplates, SYSTEM_PRESET_MAPPINGS } from '@/server/data-import';
import { ArrowLeft, BookOpen, FileSpreadsheet, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ImportTemplatesPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const userTemplates = await listMappingTemplates(undefined, session).catch(() => []);
  const presets = Object.values(SYSTEM_PRESET_MAPPINGS);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/admin/platform/imports" className="text-[12px] text-[#686866] hover:text-[#101010] flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Migration Centre
          </Link>
        </div>
        <h1 className="text-[22px] font-normal text-[#101010]">Import Mapping Presets & Templates</h1>
        <p className="text-[13.5px] text-[#686866] mt-0.5">
          Pre-built column mappings for SimPRO standard exports and custom saved mappings.
        </p>
      </div>

      {/* System Presets */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-normal uppercase tracking-wider text-[#686866]">
          SYSTEM PRESETS (SIMPRO STANDARD FORMATS)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <div key={preset.name} className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#101010] text-white">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <div>
                  <span className="rounded-[4px] bg-[#F0F0EE] px-1.5 py-0.5 font-normal text-[10px] text-[#686866]">
                    {preset.entityType}
                  </span>
                  <h3 className="font-light text-[13.5px] text-[#101010] mt-0.5">{preset.name}</h3>
                </div>
              </div>
              <p className="text-[12px] text-[#686866]">
                {Object.keys(preset.mappings).length} mapped columns configured.
              </p>
              <div className="pt-2 border-t border-[#E4E4E1] flex items-center justify-between">
                <span className="font-normal text-[10.5px] text-[#9B9B97]">Source: {preset.sourceSystem}</span>
                <Link
                  href={`/admin/platform/imports/new?type=${preset.entityType}`}
                  className="inline-flex items-center gap-1 text-[12px] font-normal text-[#FF6B24] hover:underline"
                >
                  Use <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Templates */}
      {userTemplates.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-[11px] font-normal uppercase tracking-wider text-[#686866]">
            SAVED CUSTOM TEMPLATES
          </h2>
          <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] overflow-hidden">
            <div className="divide-y divide-[#E4E4E1]">
              {userTemplates.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-light text-[13px] text-[#101010]">{t.name}</h4>
                    <p className="text-[11.5px] text-[#686866] mt-0.5">{t.entity_type} · {t.source_system}</p>
                  </div>
                  <Link
                    href={`/admin/platform/imports/new?type=${t.entity_type}`}
                    className="text-[12px] font-normal text-[#FF6B24] hover:underline"
                  >
                    Start Import →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
