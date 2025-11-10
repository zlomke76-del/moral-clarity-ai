// scripts/seed-storage.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

async function ensureBucket(name) {
  const { data: list, error: listError } = await admin.storage.listBuckets();
  if (listError) throw listError;

  const exists = (list || []).some(b => b.name === name);
  if (!exists) {
    const { error } = await admin.storage.createBucket(name, { public: true });
    if (error) throw error;
    console.log(`🪣 Created bucket: ${name}`);
  } else {
    const { error } = await admin.storage.updateBucket(name, { public: true });
    if (error) throw error;
    console.log(`✅ Bucket already exists and ensured public: ${name}`);
  }
}

async function main() {
  console.log('🔑 Using Supabase:', url);
  await ensureBucket('attachments');
  await ensureBucket('moralclarity_uploads');

  const blob = new Blob([`ok ${new Date().toISOString()}`], { type: 'text/plain' });
  const { error: uploadError } = await admin.storage
    .from('attachments')
    .upload('diagnostics.txt', blob, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = admin.storage.from('attachments').getPublicUrl('diagnostics.txt');
  console.log('🌐 Public URL:', data.publicUrl);
  console.log('✅ Done seeding storage.');
}

main().catch(err => {
  console.error('❌ SEED ERROR:', err.message || err);
  process.exit(1);
});
