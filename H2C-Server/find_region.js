import pg from 'pg';

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'sa-east-1',
  'ca-central-1'
];

async function main() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connStr = `postgresql://postgres.piazqmwttuvlfxoybbhy:amP3!XYq7YN+PNu@${host}:5432/postgres`;
    console.log(`Checking region ${region}...`);
    const client = new pg.Client({ connectionString: connStr, connectionTimeoutMillis: 3000 });
    try {
      await client.connect();
      console.log(`✅ SUCCESS! Project exists in region: ${region}`);
      await client.end();
      return;
    } catch (err) {
      console.log(`Region ${region} error: ${err.message}`);
      try {
        await client.end();
      } catch {}
      if (err.message.includes('password authentication failed') || err.message.includes('database "postgres" does not exist') || err.message.includes('SSL connection')) {
        console.log(`✅ FOUND! Project exists in region: ${region} (Auth/DB error instead of tenant not found)`);
        return;
      }
    }
  }
  console.log('❌ Could not find the project in any common region.');
}

main();
