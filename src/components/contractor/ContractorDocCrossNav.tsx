import React from 'react';
import Link from 'next/link';
import { Shield, FileText, CheckSquare, FolderLock, ArrowRight } from 'lucide-react';

export type ContractorDocSection = 'rams' | 'templates' | 'forms' | 'documents';

interface CrossNavLink {
  id: ContractorDocSection;
  href: string;
  name: string;
  contextText: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ALL_LINKS: CrossNavLink[] = [
  {
    id: 'rams',
    href: '/contractor/rams',
    name: 'RAMS & Safety',
    contextText: 'Looking for a live RAMS for a specific job?',
    icon: Shield,
  },
  {
    id: 'templates',
    href: '/contractor/templates',
    name: 'Business Documents',
    contextText: 'Need reusable business & trade templates?',
    icon: FileText,
  },
  {
    id: 'forms',
    href: '/contractor/forms',
    name: 'Forms',
    contextText: 'Need to submit digital field records & reports?',
    icon: CheckSquare,
  },
  {
    id: 'documents',
    href: '/contractor/documents',
    name: 'Document Vault',
    contextText: 'Need to check compliance documents on file?',
    icon: FolderLock,
  },
];

interface ContractorDocCrossNavProps {
  currentSection: ContractorDocSection;
  className?: string;
}

export function ContractorDocCrossNav({ currentSection, className = '' }: ContractorDocCrossNavProps) {
  const relatedLinks = ALL_LINKS.filter((item) => item.id !== currentSection);

  return (
    <div
      className={`rounded-xl border border-brand-edge-dark bg-brand-carbon/50 px-3.5 py-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs ${className}`}
    >
      <span className="text-[10px] font-semibold text-brand-mist/50 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
        Related:
      </span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {relatedLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="text-brand-mist/70 hover:text-white transition-colors flex items-center gap-1.5 group text-[11px]"
            >
              <span>{item.contextText}</span>
              <span className="inline-flex items-center gap-0.5 text-brand-electric-bright font-medium group-hover:underline underline-offset-2">
                <Icon className="w-3 h-3 text-brand-electric inline shrink-0" />
                <span>{item.name}</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
