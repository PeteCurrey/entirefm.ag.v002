import React from 'react';
import { getCurrentSession } from '@/server/identity';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  CreditCard,
  ArrowRight,
  Wrench,
  Users,
  Building2,
  Phone,
  Mail,
  HelpCircle,
  ClipboardList,
} from 'lucide-react';
import {
  getSupplierRelationshipOverview,
  getSupplierComplianceRadar,
  getSupplierServicesScope,
} from '@/server/suppliers/store';
import {
  getSupplierOrganisationById,
  getApplicationDraft,
  getPortalStatusDisplay,
} from '@/server/suppliers/supplier-auth-store';
import { Card, Badge, Button, StatTile } from '@/components/ui';

export const metadata = {
  title: 'Supplier Portal | EntireFM Partner Network',
  description: 'Manage your EntireFM supplier application, compliance documentation, and partner relationship.',
};

export default async function SupplierPortalDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ notice?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const org = orgId ? await getSupplierOrganisationById(orgId) : null;
  const draft = orgId ? await getApplicationDraft(orgId) : null;
  const statusDisplay = getPortalStatusDisplay(org);
  const isApproved = statusDisplay.isApproved;

  const relationship = await getSupplierRelationshipOverview(orgId);
  const radar = await getSupplierComplianceRadar(orgId);
  const expiringItems = radar.filter((r) => r.status.startsWith('EXPIRING'));
  const services = await getSupplierServicesScope(orgId);

  const companyName = org?.tradingName || org?.legalName || draft?.legalCompanyName || 'Your Supplier Organisation';
  const appRef = org?.applicationReference || draft?.applicationReference || '—';

  return (
    <div className="space-y-6 lg:space-y-8 w-full min-w-0 font-cafm">
      {/* Informative Notice */}
      {resolvedParams.notice === 'under_review' && (
        <div className="bg-cafm-warning-surface border border-cafm-warning-border p-4 rounded-[8px] shadow-xs flex items-start gap-3 text-xs text-cafm-warning-text">
          <AlertCircle className="h-5 w-5 text-cafm-warning-dot shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-medium text-cafm-warning-darkText block">Application Under Technical Review</span>
            <p className="text-cafm-warning-text leading-relaxed font-normal text-[11.5px]">
              Your supplier application is currently under review by the EntireFM Technical Assurance desk. The full <strong>EntireFM Contractor Platform</strong> becomes available once your organisation has been verified and approved.
            </p>
          </div>
        </div>
      )}

      {/* 1. Header & Status Banner in CAFM Style */}
      <Card className="p-6 sm:p-8 space-y-6 w-full shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-normal uppercase tracking-wider text-cafm-orange font-medium">
                {isApproved ? 'PARTNER RELATIONSHIP CENTRE' : 'SUPPLIER ASSURANCE HUB'}
              </span>
              <Badge variant={isApproved ? 'nominal' : 'orange'} size="xs" pulse={!isApproved}>
                {statusDisplay.statusLabel}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-cafm-text-primary">
              {companyName}
            </h1>
            <p className="text-xs text-cafm-text-secondary">
              Application Reference: <strong className="text-cafm-text-primary font-medium">{appRef}</strong> &middot; EntireFM Partner Network
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {!isApproved ? (
              <>
                <Link href="/supplier-portal/onboarding">
                  <Button variant="primary" size="sm" icon={<ArrowRight className="h-3.5 w-3.5" />}>
                    Continue Application
                  </Button>
                </Link>
                <Link href="/supplier-portal/documents">
                  <Button variant="outline" size="sm" icon={<FileText className="h-3.5 w-3.5" />}>
                    Document Vault
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/contractor">
                  <Button variant="primary" size="sm" icon={<ArrowRight className="h-3.5 w-3.5" />}>
                    Launch Contractor Operations
                  </Button>
                </Link>
                <Link href="/supplier-portal/documents">
                  <Button variant="outline" size="sm">
                    Document Vault
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Status Strip — 4 Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-cafm-border">
          <StatTile
            label="Assurance State"
            value={org?.lifecycleStatus || 'DRAFT'}
            variant={isApproved ? 'nominal' : 'warning'}
          />
          <StatTile
            label="Declared Trades"
            value={draft?.selectedServices?.length ? draft.selectedServices.length : 0}
            sublabel="Specialist capabilities"
          />
          <StatTile
            label="Declared Regions"
            value={draft?.selectedRegions?.length ? draft.selectedRegions.length : 0}
            sublabel="Operating territories"
          />
          <StatTile
            label="Application Stage"
            value={statusDisplay.statusLabel.replace('● ', '')}
            sublabel="Assurance pipeline"
          />
        </div>
      </Card>

      {/* 2. Action Required / Compliance Expiry Radar (if any items) */}
      {expiringItems.length > 0 && (
        <div className="bg-cafm-warning-surface border border-cafm-warning-border p-5 rounded-[10px] flex items-start gap-4 text-xs text-cafm-warning-text w-full shadow-xs">
          <AlertCircle className="h-5 w-5 text-cafm-warning-dot shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-cafm-text-primary text-[13px]">
                Action Required: {expiringItems.length} Compliance Document Expiring Soon
              </span>
              <Badge variant="warning" size="xs">
                {expiringItems[0].days_remaining} Days Remaining
              </Badge>
            </div>
            <p className="text-cafm-text-secondary text-[12px] leading-relaxed">
              {expiringItems[0].action_required}
            </p>
            <Link
              href="/supplier-portal/documents"
              className="text-cafm-orange font-medium hover:underline inline-flex items-center gap-1 pt-1 text-[12px]"
            >
              <span>Upload Renewal Certificate to Vault</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* 3. Core Workspace Modules — Responsive 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full min-w-0">
        {/* Left Column (Main Content Area) */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {/* Trade Capabilities / Scope Card */}
          <Card
            title={isApproved ? 'Authorized EntireFM Scope' : 'Application Trade Declarations'}
            subtitle="Registered trades and capability classifications"
            icon={<Wrench className="h-3.5 w-3.5" />}
            actions={
              <Link
                href="/supplier-portal/onboarding"
                className="text-xs text-cafm-orange font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>{isApproved ? 'Request Expansion' : 'Edit Declarations'}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            {services.length > 0 ? (
              <div className="space-y-2.5 text-xs">
                {services.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-cafm-surface-muted border border-cafm-border rounded-[8px] flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-medium text-cafm-text-primary block text-[13px] truncate">
                        {s.name}
                      </span>
                      <span className="text-[11.5px] text-cafm-text-secondary block truncate">
                        {s.capability_notes || 'Declared trade capability awaiting technical assurance'}
                      </span>
                    </div>
                    <Badge
                      variant={s.approval_status === 'APPROVED' ? 'nominal' : 'warning'}
                      size="xs"
                    >
                      {s.approval_status === 'APPROVED' ? 'APPROVED' : 'DECLARED'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-cafm-text-secondary space-y-3 bg-cafm-surface-muted/50 border border-dashed border-cafm-border rounded-[8px]">
                <Wrench className="h-8 w-8 text-cafm-text-muted mx-auto" />
                <p className="text-[13px] text-cafm-text-primary">No service trades declared yet.</p>
                <p className="text-[11.5px] text-cafm-text-secondary max-w-sm mx-auto">
                  Declare your primary and secondary commercial trades to qualify for dispatch opportunities.
                </p>
                <Link href="/supplier-portal/onboarding" className="inline-block mt-1">
                  <Button variant="primary" size="xs">
                    Complete Trade Profile →
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Quick Hub Grid — 2-Column Grid of Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              hoverable
              compact
              className="group"
              onClick={() => {}}
            >
              <Link href="/supplier-portal/documents" className="block space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cafm-orange" />
                    <span className="font-medium text-[13px] text-cafm-text-primary group-hover:text-cafm-orange transition-colors">
                      Document Vault
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-cafm-text-muted group-hover:text-cafm-orange group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-cafm-text-secondary text-[11.5px] leading-relaxed">
                  Upload statutory compliance policies, public liability insurance, and RAMS evidence.
                </p>
              </Link>
            </Card>

            <Card
              hoverable
              compact
              className="group"
            >
              <Link href="/supplier-portal/actions" className="block space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-cafm-orange" />
                    <span className="font-medium text-[13px] text-cafm-text-primary group-hover:text-cafm-orange transition-colors">
                      Actions &amp; Requests
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-cafm-text-muted group-hover:text-cafm-orange group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-cafm-text-secondary text-[11.5px] leading-relaxed">
                  Respond to Requests for Information (RFI) from the EntireFM Assurance review team.
                </p>
              </Link>
            </Card>

            <Card
              hoverable
              compact
              className="group"
            >
              <Link href="/supplier-portal/company" className="block space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-cafm-orange" />
                    <span className="font-medium text-[13px] text-cafm-text-primary group-hover:text-cafm-orange transition-colors">
                      Company Profile
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-cafm-text-muted group-hover:text-cafm-orange group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-cafm-text-secondary text-[11.5px] leading-relaxed">
                  Maintain registered office, trading address, Companies House details, and contacts.
                </p>
              </Link>
            </Card>

            <Card
              hoverable
              compact
              className="group"
            >
              <Link href="/supplier-portal/resources" className="block space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cafm-orange" />
                    <span className="font-medium text-[13px] text-cafm-text-primary group-hover:text-cafm-orange transition-colors">
                      Standards &amp; Guides
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-cafm-text-muted group-hover:text-cafm-orange group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-cafm-text-secondary text-[11.5px] leading-relaxed">
                  Download official EntireFM Service Report standards, codes of practice, and RAMS guidelines.
                </p>
              </Link>
            </Card>
          </div>
        </div>

        {/* Right Column (Support Rail) */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          <Card
            title={relationship.assigned_entirefm_team.length > 0 ? 'Relationship Manager' : 'Supplier Support Desk'}
            subtitle="Dedicated EntireFM account liaison"
            icon={<Users className="h-3.5 w-3.5" />}
          >
            {relationship.assigned_entirefm_team.length > 0 ? (
              <div className="space-y-4 text-xs">
                {relationship.assigned_entirefm_team.map((contact, idx) => (
                  <div key={idx} className="space-y-1.5 pb-3 border-b border-cafm-border last:border-0 last:pb-0">
                    <span className="text-[10px] uppercase tracking-wider text-cafm-text-muted block">
                      {contact.role}
                    </span>
                    <span className="font-medium text-cafm-text-primary block text-[13px]">
                      {contact.name}
                    </span>
                    <div className="text-[11.5px] text-cafm-text-secondary space-y-1">
                      {contact.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-cafm-text-muted" />
                          <a href={`mailto:${contact.email}`} className="hover:underline text-cafm-text-primary">
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-cafm-text-muted" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 text-xs text-cafm-text-secondary">
                <p className="leading-relaxed">
                  A dedicated Relationship Manager is assigned upon successful completion of your technical assurance review.
                </p>
                <div className="pt-2 border-t border-cafm-border space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-cafm-text-muted block">
                    General Assurance Enquiries
                  </span>
                  <a
                    href="mailto:supplier-support@entirefm.com"
                    className="text-xs text-cafm-orange font-medium hover:underline block"
                  >
                    supplier-support@entirefm.com
                  </a>
                </div>
              </div>
            )}
          </Card>

          <Card compact className="bg-cafm-surface-muted border-cafm-border">
            <span className="font-medium text-cafm-text-primary block text-[13px] mb-1">Need Assistance?</span>
            <p className="text-cafm-text-secondary text-[11.5px] leading-relaxed">
              Contact the EntireFM Supply Chain Support Desk for technical assistance with onboarding, document verification, or assurance review.
            </p>
            <Link
              href="/supplier-portal/support"
              className="text-cafm-orange font-medium hover:underline inline-flex items-center gap-1 pt-2 text-[12px]"
            >
              <span>Contact Support Desk</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
