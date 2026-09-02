import React, { useState } from "react";
import { Copy, Check, Download, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export interface TemplateSection {
  number: string;
  title: string;
  purpose: string;
  fields: Array<{ label: string; description: string; example?: string }>;
}

interface ContractorTemplateViewerProps {
  templateName: string;
  description: string;
  version?: string;
  sections: TemplateSection[];
  rawTemplateText?: string;
}

export function ContractorTemplateViewer({
  templateName,
  description,
  version = "2026 Commercial Standard",
  sections,
  rawTemplateText,
}: ContractorTemplateViewerProps) {
  const [copied, setCopied] = useState(false);

  const generateDefaultText = () => {
    let output = `============================================================\n`;
    output += `${templateName.toUpperCase()} — ENTIREFM CONTRACTOR STANDARD\n`;
    output += `Version: ${version}\n`;
    output += `============================================================\n\n`;
    output += `${description}\n\n`;

    sections.forEach((s) => {
      output += `------------------------------------------------------------\n`;
      output += `SECTION ${s.number}: ${s.title.toUpperCase()}\n`;
      output += `Purpose: ${s.purpose}\n`;
      output += `------------------------------------------------------------\n`;
      s.fields.forEach((f) => {
        output += `[ ] ${f.label}: ${f.description}\n`;
        if (f.example) {
          output += `    Example: ${f.example}\n`;
        }
      });
      output += `\n`;
    });
    return output;
  };

  const templateContent = rawTemplateText || generateDefaultText();

  const handleCopy = () => {
    navigator.clipboard.writeText(templateContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([templateContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${templateName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-template.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-sm border border-slate-300 bg-white shadow-card overflow-hidden">
      {/* Template Header Bar */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#EA580C]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#EA580C]">
              OFFICIAL TEMPLATE STRUCTURE
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-light text-white">{templateName}</h3>
          <p className="text-xs text-slate-300 font-light">{description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied Structure</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="btn-primary text-xs py-2 px-3.5 font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download (.TXT)</span>
          </button>
        </div>
      </div>

      {/* Sections Accordion / Preview */}
      <div className="divide-y divide-slate-200">
        {sections.map((section) => (
          <div key={section.number} className="p-5 sm:p-6 bg-white space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs font-bold text-[#EA580C]">
                SECTION {section.number}
              </span>
              <h4 className="text-sm sm:text-base font-semibold text-slate-900">
                {section.title}
              </h4>
            </div>

            <p className="text-xs text-slate-500 font-light leading-relaxed">
              <strong className="text-slate-700 font-medium">Why required: </strong>
              {section.purpose}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {section.fields.map((field, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-sm bg-[#FAFAF8] border border-slate-200/80 text-xs space-y-1"
                >
                  <div className="font-medium text-slate-900">{field.label}</div>
                  <div className="text-slate-600 font-light text-[11.5px] leading-relaxed">
                    {field.description}
                  </div>
                  {field.example && (
                    <div className="text-[11px] text-slate-400 font-mono pt-1">
                      e.g. {field.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Compliance advisory footer */}
      <div className="p-4 bg-amber-50/60 border-t border-amber-200/70 text-xs text-amber-900 font-light flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Operational Notice:</strong> Using a template provides a structured starting point but does not automatically ensure statutory compliance. All risk assessments, RAMS and method statements must be adapted to actual site conditions, specific equipment, operative competencies and client constraints.
        </span>
      </div>
    </div>
  );
}
