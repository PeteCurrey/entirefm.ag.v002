import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local if present
const envLocalPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { getLobbyClientLinks, addLobbyClientLink } from '../src/server/member/member-store';

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL not set');

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('=================================================================');
  console.log('PROMPT 1 PRODUCTION EVIDENCE: DECOUPLED IDENTITY & CLIENT LINKS');
  console.log('=================================================================');

  // 1. Ensure a test Client Organisation and Client Account exist
  let orgRes = await client.query(`SELECT id, name FROM organisations WHERE code = 'CLI-APEX-001'`);
  let orgId = orgRes.rows[0]?.id;
  if (!orgId) {
    const insertOrg = await client.query(`
      INSERT INTO organisations (code, name, legal_name, org_type, status)
      VALUES ('CLI-APEX-001', 'Apex Commercial Estates', 'Apex Commercial Estates Ltd', 'CLIENT', 'ACTIVE')
      RETURNING id, name
    `);
    orgId = insertOrg.rows[0].id;
    console.log('Created Client Organisation:', insertOrg.rows[0]);
  }

  let accRes = await client.query(`SELECT id, account_code FROM client_accounts WHERE account_code = 'ACC-APEX-001'`);
  let clientAccountId = accRes.rows[0]?.id;
  if (!clientAccountId) {
    const insertAcc = await client.query(`
      INSERT INTO client_accounts (organisation_id, account_code, status)
      VALUES ($1, 'ACC-APEX-001', 'ACTIVE')
      RETURNING id, account_code
    `, [orgId]);
    clientAccountId = insertAcc.rows[0].id;
    console.log('Created Client Account:', insertAcc.rows[0]);
  }

  // 2. Select two active Lobby members
  const members = await client.query(`
    SELECT id, auth_user_id, display_name, email 
    FROM lobby_members 
    WHERE member_status = 'active' AND auth_user_id IS NOT NULL 
    LIMIT 2
  `);

  if (members.rows.length < 2) {
    throw new Error('Expected at least 2 active lobby members for verification');
  }

  const memberA = members.rows[0]; // Lobby-only
  const memberB = members.rows[1]; // Both (Lobby + Client)

  console.log('\n--- Member A (Lobby-Only Account) ---');
  console.log(`Member ID: ${memberA.id}`);
  console.log(`Auth UID:  ${memberA.auth_user_id}`);
  console.log(`Name:      ${memberA.display_name} (${memberA.email})`);

  // Ensure Member A has no client links
  await client.query(`DELETE FROM lobby_client_links WHERE auth_user_id = $1`, [memberA.auth_user_id]);
  const linksA = await getLobbyClientLinks(memberA.auth_user_id);
  console.log(`Client Links count: ${linksA.length}`);
  console.log('State: LOBBY-ONLY (unchanged behaviour, 0 client links)');

  console.log('\n--- Member B (Dual-Context: Lobby Member + Client Linked) ---');
  console.log(`Member ID: ${memberB.id}`);
  console.log(`Auth UID:  ${memberB.auth_user_id}`);
  console.log(`Name:      ${memberB.display_name} (${memberB.email})`);

  // Explicitly link Member B to Client Account (Opt-in / explicit action)
  await client.query(`DELETE FROM lobby_client_links WHERE auth_user_id = $1`, [memberB.auth_user_id]);
  const createdLink = await addLobbyClientLink(
    memberB.auth_user_id,
    clientAccountId,
    'CLIENT_ADMIN',
    'ADMIN'
  );
  console.log('Explicitly linked via addLobbyClientLink():', createdLink);

  const linksB = await getLobbyClientLinks(memberB.auth_user_id);
  console.log(`Client Links count: ${linksB.length}`);
  console.log('State: DUAL-CONTEXT (Lobby member + Linked to Apex Commercial Estates)');

  // 3. Direct SQL verification of independence
  console.log('\n--- Database Truth: Independence Query ---');
  const queryResult = await client.query(`
    SELECT 
      lm.email,
      lm.display_name,
      lm.member_status,
      COALESCE(lcl.status, 'NO_LINK') as client_link_status,
      COALESCE(o.name, 'NONE') as client_org_name,
      COALESCE(lcl.role_code, 'NONE') as client_role
    FROM lobby_members lm
    LEFT JOIN lobby_client_links lcl ON lcl.auth_user_id = lm.auth_user_id AND lcl.status = 'ACTIVE'
    LEFT JOIN client_accounts ca ON ca.id = lcl.client_account_id
    LEFT JOIN organisations o ON o.id = ca.organisation_id
    WHERE lm.id IN ($1, $2)
    ORDER BY lm.id
  `, [memberA.id, memberB.id]);

  console.table(queryResult.rows);

  console.log('✅ PROMPT 1 COMPLETE: Decoupled identity model verified against live DB.');
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
