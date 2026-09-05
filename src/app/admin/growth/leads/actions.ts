'use server';

import { revalidatePath } from 'next/cache';
import { deleteLead } from '@/server/growth/store';

export async function deleteLeadAction(leadId: string) {
  const success = await deleteLead(leadId);
  if (success) {
    revalidatePath('/admin/growth/leads');
  }
  return success;
}
