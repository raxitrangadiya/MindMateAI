import pg from 'pg';

const connectionStrings = [
  'postgresql://postgres.piazqmwttuvlfxoybbhy:amP3!XYq7YN+PNu@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres.piazqmwttuvlfxoybbhy:amP3!XYq7YN+PNu@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  'postgresql://postgres:amP3!XYq7YN+PNu@db.piazqmwttuvlfxoybbhy.supabase.co:5432/postgres'
];

const sql = `
-- 1. Create Users Table with Auth fields
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  exam_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  emotion VARCHAR(50) NOT NULL,
  stress_level INT NOT NULL,
  anxiety_level INT NOT NULL,
  burnout_risk VARCHAR(20) NOT NULL,
  motivation_score INT NOT NULL,
  triggers TEXT[] NOT NULL,
  sentiment VARCHAR(20) NOT NULL,
  emergency_detected BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  session_id VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Action Plans Table
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  daily_goal TEXT NOT NULL,
  stress_plan TEXT NOT NULL,
  mindfulness_exercise TEXT NOT NULL,
  motivation_challenge TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create Weekly Summaries Table
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  week_start VARCHAR(10) NOT NULL,
  avg_stress REAL NOT NULL,
  avg_anxiety REAL NOT NULL,
  avg_motivation REAL NOT NULL,
  burnout_trend VARCHAR(20) NOT NULL,
  top_triggers TEXT[] NOT NULL,
  ai_summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable indexes for performance querying
CREATE INDEX IF NOT EXISTS idx_journals_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_session ON chat_messages(user_id, session_id);
`;

async function main() {
  let success = false;
  for (const connStr of connectionStrings) {
    console.log(`Trying to connect with: ${connStr.replace(/:[^:@]+@/, ':****@')}`);
    const client = new pg.Client({
      connectionString: connStr,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log('Connected! Executing DDL schema statements...');
      await client.query(sql);
      console.log('✅ Database schema initialized successfully!');
      await client.end();
      success = true;
      break;
    } catch (err) {
      console.error(`❌ Connection failed: ${err.message}`);
      try {
        await client.end();
      } catch {}
    }
  }

  if (!success) {
    console.error('❌ All connection attempts failed. Database could not be initialized.');
    process.exit(1);
  }
}

main();
