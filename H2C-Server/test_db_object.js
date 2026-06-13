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

async function check() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    console.log(`Checking region ${region} using config object...`);
    const client = new pg.Client({
      user: 'postgres.piazqmwttuvlfxoybbhy',
      password: 'amP3!XYq7YN+PNu',
      host: host,
      port: 6543,
      database: 'postgres',
      connectionTimeoutMillis: 3000,
      ssl: {
        rejectUnauthorized: false
      }
    });
    try {
      await client.connect();
      console.log(`✅ SUCCESS! Connected to region: ${region}`);
      await client.end();
      return region;
    } catch (err) {
      console.log(`Region ${region} failed: ${err.message}`);
      try {
        await client.end();
      } catch {}
    }
  }
}
check();
