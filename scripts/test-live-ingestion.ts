import fs from 'fs';
const envContent = fs.readFileSync('.env.local', 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    if ((val.startsWith('\"') && val.endsWith('\"')) || (val.startsWith('\'') && val.endsWith('\''))) val = val.slice(1, -1);
    process.env[match[1]] = val;
  }
}

import { runLiveIngestion } from '../src/server/intelligence/intelligence-engine';
import { dbQuery } from '../src/server/db/client';

async function testLiveIngestion() {
  console.log('=== RUNNING LIVE INGESTION INTO SUPABASE ===');
  const report = await runLiveIngestion();
  console.log('Ingestion completed:');
  console.log('  Sources processed:', report.sourcesProcessed);
  console.log('  Total items created:', report.totalItemsCreated);
  console.log('  Total tenders created:', report.totalTendersCreated);
  console.log('  Errors:', report.errors);

  console.log('\n=== VERIFYING SUPABASE PERSISTED RECORDS ===');
  const itemsRes = await dbQuery<any[]>('intelligence_items?select=id,title,source_name,event_type,severity,published_at&limit=5');
  console.log('Persisted intelligence_items count:', itemsRes.data?.length);
  if (itemsRes.data?.[0]) {
    console.log('Sample item:', itemsRes.data[0]);
  }

  const tendersRes = await dbQuery<any[]>('admin_tender_opportunities?select=id,title,buyer_name,match_score,match_strength,estimated_value_formatted&limit=5');
  console.log('\nPersisted admin_tender_opportunities count:', tendersRes.data?.length);
  if (tendersRes.data?.[0]) {
    console.log('Sample tender:', tendersRes.data[0]);
  }

  const runsRes = await dbQuery<any[]>('intelligence_ingestion_runs?select=id,source_name,status,records_created,duration_ms&order=started_at.desc&limit=5');
  console.log('\nPersisted ingestion_runs count:', runsRes.data?.length);
  if (runsRes.data?.[0]) {
    console.log('Sample ingestion run:', runsRes.data[0]);
  }
}

testLiveIngestion();
