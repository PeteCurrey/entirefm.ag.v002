/**
 * ENTIREFM CONTRACTOR INDEPENDENT CUSTOMER & JOB ENGINE
 * ======================================================
 * Lightweight customer & job management for non-EntireFM independent work.
 * Complete data isolation per contractor organisation.
 * Supports: Customer -> Sites -> Jobs -> Documents -> History.
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { recordAuditEvent } from '@/server/audit';

export interface ContractorClientRecord {
  id: string;
  contractor_org_id: string;
  client_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  city?: string;
  postcode?: string;
  notes?: string;
  status: string;
  created_at: string;
}

export interface ContractorIndependentJobRecord {
  id: string;
  contractor_org_id: string;
  client_id?: string;
  client_name?: string;
  job_reference: string;
  title: string;
  description?: string;
  site_address?: string;
  trade: string;
  priority: string;
  status: 'DRAFT' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'INVOICED' | 'CANCELLED';
  scheduled_date?: string;
  completed_at?: string;
  total_price_gbp: number;
  sign_off_name?: string;
  sign_off_at?: string;
  created_at: string;
}

export interface ContractorClientDetail extends ContractorClientRecord {
  jobs: ContractorIndependentJobRecord[];
  documents: Array<{
    id: string;
    document_number: string;
    title: string;
    category: string;
    version: string;
    status: string;
    created_at: string;
  }>;
}

export async function listContractorClients(
  contractorOrgId: string,
  session: UserSession
): Promise<ContractorClientRecord[]> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== contractorOrgId) {
    throw new Error('FORBIDDEN: Access denied to contractor client directory');
  }

  const { data: clients, error } = await dbQuery<any[]>(
    `contractor_clients?contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}&order=client_name.asc`
  );

  if (error || !clients) {
    return [];
  }

  return clients;
}

export async function getContractorClientDetail(
  contractorOrgId: string,
  clientId: string,
  session: UserSession
): Promise<ContractorClientDetail | null> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== contractorOrgId) {
    throw new Error('FORBIDDEN: Access denied');
  }

  const { data: clientRes } = await dbQuery<any[]>(
    `contractor_clients?id=eq.${encodeURIComponent(clientId)}&contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}`
  );

  const client = clientRes?.[0];
  if (!client) return null;

  const [jobsRes, docsRes] = await Promise.all([
    dbQuery<any[]>(
      `contractor_independent_jobs?client_id=eq.${encodeURIComponent(clientId)}&contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}&order=created_at.desc`
    ),
    dbQuery<any[]>(
      `contractor_documents?contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}&order=created_at.desc&limit=100`
    ),
  ]);

  const jobs: ContractorIndependentJobRecord[] = (jobsRes.data || []).map((j) => ({
    ...j,
    client_name: client.client_name,
  }));

  // Match documents either by independent_job_id in this client's jobs or client_name match
  const jobIds = new Set(jobs.map((j) => j.id));
  const matchedDocs = (docsRes.data || [])
    .filter(
      (d) =>
        (d.independent_job_id && jobIds.has(d.independent_job_id)) ||
        (d.client_name && d.client_name.trim().toLowerCase() === client.client_name.trim().toLowerCase())
    )
    .map((d) => ({
      id: d.id,
      document_number: d.document_number,
      title: d.title,
      category: d.category,
      version: d.version || '1.0',
      status: d.status,
      created_at: d.created_at,
    }));

  return {
    ...client,
    jobs,
    documents: matchedDocs,
  };
}

export async function createContractorClient(
  payload: Partial<ContractorClientRecord> & { contractor_org_id: string; client_name: string },
  session: UserSession
): Promise<{ success: boolean; client?: ContractorClientRecord; error?: string }> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== payload.contractor_org_id) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await dbQuery<any[]>(`contractor_clients`, {
    method: 'POST',
    body: {
      contractor_org_id: payload.contractor_org_id,
      client_name: payload.client_name.trim(),
      contact_name: payload.contact_name?.trim() || null,
      email: payload.email?.trim() || null,
      phone: payload.phone?.trim() || null,
      address_line1: payload.address_line1?.trim() || null,
      city: payload.city?.trim() || null,
      postcode: payload.postcode?.trim() || null,
      notes: payload.notes?.trim() || null,
      status: 'ACTIVE',
    },
  });

  if (error) {
    return { success: false, error };
  }

  const created = data?.[0];

  await recordAuditEvent({
    object_type: 'CONTRACTOR_CLIENT',
    object_id: created?.id || 'new-client',
    event_type: 'CLIENT_CREATED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    organisation_id: payload.contractor_org_id,
    reason: `Created private client: ${payload.client_name}`,
    after_state: created,
  });

  return { success: true, client: created };
}

export async function listContractorIndependentJobs(
  contractorOrgId: string,
  session: UserSession
): Promise<ContractorIndependentJobRecord[]> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== contractorOrgId) {
    throw new Error('FORBIDDEN: Access denied to contractor job list');
  }

  const { data: jobs, error } = await dbQuery<any[]>(
    `contractor_independent_jobs?contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}&select=*,client:contractor_clients(client_name)&order=created_at.desc&limit=100`
  );

  if (error || !jobs) {
    return [];
  }

  return jobs.map((j) => ({
    ...j,
    client_name: j.client?.client_name,
  }));
}

export async function createContractorIndependentJob(
  payload: Partial<ContractorIndependentJobRecord> & {
    contractor_org_id: string;
    title: string;
  },
  session: UserSession
): Promise<{ success: boolean; job?: ContractorIndependentJobRecord; error?: string }> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== payload.contractor_org_id) {
    return { success: false, error: 'Unauthorized' };
  }

  const jobRef = payload.job_reference || `JOB-${Math.floor(10000 + Math.random() * 90000)}`;

  const body = {
    contractor_org_id: payload.contractor_org_id,
    client_id: payload.client_id || null,
    job_reference: jobRef,
    title: payload.title.trim(),
    description: payload.description?.trim() || null,
    site_address: payload.site_address?.trim() || null,
    trade: payload.trade || 'GENERAL',
    priority: payload.priority || 'MEDIUM',
    status: payload.status || 'SCHEDULED',
    scheduled_date: payload.scheduled_date || null,
    total_price_gbp: Number(payload.total_price_gbp || 0),
    sign_off_name: payload.sign_off_name?.trim() || null,
    sign_off_at: payload.sign_off_name ? new Date().toISOString() : null,
  };

  const { data, error } = await dbQuery<any[]>(`contractor_independent_jobs`, {
    method: 'POST',
    body,
  });

  if (error) {
    return { success: false, error };
  }

  const createdJob = data?.[0];

  await recordAuditEvent({
    object_type: 'INDEPENDENT_JOB',
    object_id: createdJob?.id || 'new-job',
    event_type: 'JOB_CREATED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    organisation_id: payload.contractor_org_id,
    reason: `Created independent job: ${payload.title} (${jobRef})`,
    after_state: createdJob,
  });

  return { success: true, job: createdJob };
}

export async function updateContractorIndependentJobStatus(
  jobId: string,
  contractorOrgId: string,
  status: 'DRAFT' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'INVOICED' | 'CANCELLED',
  session: UserSession,
  extra?: { sign_off_name?: string; completed_at?: string }
): Promise<{ success: boolean; error?: string }> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== contractorOrgId) {
    return { success: false, error: 'Unauthorized' };
  }

  const updateBody: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'COMPLETED' || extra?.completed_at) {
    updateBody.completed_at = extra?.completed_at || new Date().toISOString();
  }
  if (extra?.sign_off_name) {
    updateBody.sign_off_name = extra.sign_off_name;
    updateBody.sign_off_at = new Date().toISOString();
  }

  const { error } = await dbQuery(
    `contractor_independent_jobs?id=eq.${encodeURIComponent(jobId)}&contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}`,
    {
      method: 'PATCH',
      body: updateBody,
    }
  );

  if (error) {
    return { success: false, error };
  }

  return { success: true };
}
