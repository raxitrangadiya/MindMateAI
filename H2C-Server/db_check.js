import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://piazqmwttuvlfxoybbhy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXpxbXd0dHV2bGZ4b3liYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMjkwOTEsImV4cCI6MjA5NjkwNTA5MX0.APkpMLV-sMIaZTZA5y7J9zYNvRVAMThkM3eNwy4PU9M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.error('Error fetching from users table:', error.message);
    } else {
      console.log('Successfully connected and queried users table! Row count:', data.length);
    }
  } catch (err) {
    console.error('Exception caught:', err);
  }
}

test();
