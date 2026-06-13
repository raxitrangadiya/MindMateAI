import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';
import type {
  User,
  ExamType,
  JournalEntry,
  ChatMessage,
  ActionPlan,
  WeeklySummary,
  DashboardData,
  BurnoutLevel,
} from '../types/index.js';

/* ------------------------------------------------------------------ */
/*  In-memory fallback store (used when Supabase is not configured)   */
/* ------------------------------------------------------------------ */
interface InMemoryStore {
  users: Map<string, User>;
  journalEntries: Map<string, JournalEntry[]>;
  chatMessages: Map<string, ChatMessage[]>;
  actionPlans: Map<string, ActionPlan[]>;
  weeklySummaries: Map<string, WeeklySummary[]>;
}

const mem: InMemoryStore = {
  users: new Map(),
  journalEntries: new Map(),
  chatMessages: new Map(),
  actionPlans: new Map(),
  weeklySummaries: new Map(),
};

const useSupabase = Boolean(
  config.supabaseUrl &&
  config.supabaseUrl.startsWith('http') &&
  !config.supabaseUrl.includes('your_supabase') &&
  config.supabaseAnonKey &&
  !config.supabaseAnonKey.includes('your_supabase')
);

let supabase: SupabaseClient | null = null;

if (useSupabase) {
  try {
    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    console.log('✅ Supabase client initialized');
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err);
    console.log('⚠️  Falling back to in-memory store (demo mode)');
  }
} else {
  console.log('⚠️  Supabase not configured or placeholders detected – using in-memory store (demo mode)');
}

/* ================================================================== */
/*  USERS                                                             */
/* ================================================================== */

export async function createUser(
  name: string,
  examType: ExamType,
  email?: string,
  passwordHash?: string
): Promise<User> {
  const user: User = {
    id: uuidv4(),
    name,
    email,
    password_hash: passwordHash,
    exam_type: examType,
    created_at: new Date().toISOString(),
  };

  if (useSupabase && supabase) {
    const { data, error } = await supabase.from('users').insert(user).select().single();
    if (error) throw new Error(`Supabase createUser error: ${error.message}`);
    return data as User;
  }

  mem.users.set(user.id, user);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error) return null;
    return data as User;
  }

  for (const user of mem.users.values()) {
    if (user.email === email) return user;
  }
  return null;
}

export async function getUser(userId: string): Promise<User | null> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error) return null;
    return data as User;
  }

  return mem.users.get(userId) ?? null;
}

/* ================================================================== */
/*  JOURNAL ENTRIES                                                   */
/* ================================================================== */

export async function createJournalEntry(entry: JournalEntry): Promise<JournalEntry> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase.from('journal_entries').insert(entry).select().single();
    if (error) throw new Error(`Supabase createJournalEntry error: ${error.message}`);
    return data as JournalEntry;
  }

  const entries = mem.journalEntries.get(entry.user_id) ?? [];
  entries.push(entry);
  mem.journalEntries.set(entry.user_id, entries);
  return entry;
}

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`Supabase getJournalEntries error: ${error.message}`);
    return (data ?? []) as JournalEntry[];
  }

  const entries = mem.journalEntries.get(userId) ?? [];
  return [...entries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/* ================================================================== */
/*  CHAT MESSAGES                                                     */
/* ================================================================== */

export async function createChatMessage(msg: ChatMessage): Promise<ChatMessage> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase.from('chat_messages').insert(msg).select().single();
    if (error) throw new Error(`Supabase createChatMessage error: ${error.message}`);
    return data as ChatMessage;
  }

  const key = `${msg.user_id}:${msg.session_id}`;
  const messages = mem.chatMessages.get(key) ?? [];
  messages.push(msg);
  mem.chatMessages.set(key, messages);
  return msg;
}

export async function getChatMessages(userId: string, sessionId: string): Promise<ChatMessage[]> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (error) throw new Error(`Supabase getChatMessages error: ${error.message}`);
    return (data ?? []) as ChatMessage[];
  }

  const key = `${userId}:${sessionId}`;
  return mem.chatMessages.get(key) ?? [];
}

/* ================================================================== */
/*  ACTION PLANS                                                      */
/* ================================================================== */

export async function createActionPlan(plan: ActionPlan): Promise<ActionPlan> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase.from('action_plans').insert(plan).select().single();
    if (error) throw new Error(`Supabase createActionPlan error: ${error.message}`);
    return data as ActionPlan;
  }

  const plans = mem.actionPlans.get(plan.user_id) ?? [];
  plans.push(plan);
  mem.actionPlans.set(plan.user_id, plans);
  return plan;
}

export async function getLatestActionPlan(userId: string): Promise<ActionPlan | null> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase
      .from('action_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error) return null;
    return data as ActionPlan;
  }

  const plans = mem.actionPlans.get(userId) ?? [];
  if (plans.length === 0) return null;
  return plans[plans.length - 1];
}

/* ================================================================== */
/*  WEEKLY SUMMARIES                                                  */
/* ================================================================== */

export async function createWeeklySummary(summary: WeeklySummary): Promise<WeeklySummary> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase
      .from('weekly_summaries')
      .insert(summary)
      .select()
      .single();
    if (error) throw new Error(`Supabase createWeeklySummary error: ${error.message}`);
    return data as WeeklySummary;
  }

  const summaries = mem.weeklySummaries.get(summary.user_id) ?? [];
  summaries.push(summary);
  mem.weeklySummaries.set(summary.user_id, summaries);
  return summary;
}

export async function getWeeklySummary(userId: string): Promise<WeeklySummary | null> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase
      .from('weekly_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error) return null;
    return data as WeeklySummary;
  }

  const summaries = mem.weeklySummaries.get(userId) ?? [];
  if (summaries.length === 0) return null;
  return summaries[summaries.length - 1];
}

/* ================================================================== */
/*  DASHBOARD DATA                                                    */
/* ================================================================== */

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const entries = await getJournalEntries(userId);

  if (entries.length === 0) {
    return {
      moodTrend: [],
      stressTrend: [],
      anxietyTrend: [],
      burnoutTrend: [],
      motivationTrend: [],
      currentBurnoutRisk: 'Low',
      totalEntries: 0,
      avgMood: 0,
      streak: 0,
      triggers: [],
    };
  }

  // Build trends (most recent first → reverse for chronological)
  const sorted = [...entries].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const moodTrend = sorted.map((e) => ({
    date: e.created_at.slice(0, 10),
    value: Math.round(10 - e.stress_level + e.motivation_score) / 2,
  }));

  const stressTrend = sorted.map((e) => ({
    date: e.created_at.slice(0, 10),
    value: e.stress_level,
  }));

  const anxietyTrend = sorted.map((e) => ({
    date: e.created_at.slice(0, 10),
    value: e.anxiety_level,
  }));

  const burnoutTrend = sorted.map((e) => ({
    date: e.created_at.slice(0, 10),
    value: e.burnout_risk,
  }));

  const motivationTrend = sorted.map((e) => ({
    date: e.created_at.slice(0, 10),
    value: e.motivation_score,
  }));

  // Current burnout risk = latest entry's risk
  const currentBurnoutRisk: BurnoutLevel = entries[0].burnout_risk;

  // Avg mood (derived: higher motivation & lower stress ⇒ better mood)
  const avgMood =
    entries.reduce((sum, e) => sum + (10 - e.stress_level + e.motivation_score) / 2, 0) /
    entries.length;

  // Streak: count consecutive days with entries from today backward
  const streak = calculateStreak(entries);

  // Aggregate triggers
  const triggerCounts = new Map<string, number>();
  for (const entry of entries) {
    for (const t of entry.triggers) {
      triggerCounts.set(t, (triggerCounts.get(t) || 0) + 1);
    }
  }
  const triggers = Array.from(triggerCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    moodTrend,
    stressTrend,
    anxietyTrend,
    burnoutTrend,
    motivationTrend,
    currentBurnoutRisk,
    totalEntries: entries.length,
    avgMood: Math.round(avgMood * 10) / 10,
    streak,
    triggers,
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function calculateStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const uniqueDays = new Set(entries.map((e) => e.created_at.slice(0, 10)));
  const sortedDays = Array.from(uniqueDays).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diffMs = prev.getTime() - curr.getTime();
    if (diffMs <= 86_400_000) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Seed database or in-memory store with rich sample data for the demo user.
 */
export async function seedDemoData(userId: string): Promise<void> {
  const existingEntries = await getJournalEntries(userId);
  if (existingEntries.length > 0) {
    return; // Already seeded
  }

  // 1. Create Demo Journal Entries
  const journals: JournalEntry[] = [
    {
      id: uuidv4(),
      user_id: userId,
      content: 'Today was hard. I took a practice test for my exam and scored much lower than I expected. I feel like I am letting down my parents and myself.',
      emotion: 'Defeat / Fear of Failure',
      stress_level: 8,
      anxiety_level: 7,
      burnout_risk: 'Medium',
      motivation_score: 4,
      triggers: ['Mock Exam Prep', 'Peer Pressure'],
      sentiment: 'negative',
      emergency_detected: false,
      created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      user_id: userId,
      content: 'Managed to study for 6 hours today and actually completed my review of Organic Chemistry. Feeling a bit more confident and relaxed.',
      emotion: 'Accomplishment',
      stress_level: 4,
      anxiety_level: 3,
      burnout_risk: 'Low',
      motivation_score: 8,
      triggers: ['Time Management'],
      sentiment: 'positive',
      emergency_detected: false,
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      user_id: userId,
      content: 'Really tired today. Felt like I could not focus at all. Every time I look at the calendar I feel this weight in my chest. I need to take a break but I feel guilty doing it.',
      emotion: 'Exhaustion & Guilt',
      stress_level: 9,
      anxiety_level: 8,
      burnout_risk: 'High',
      motivation_score: 3,
      triggers: ['Lack of Sleep', 'Silly Mistakes', 'Mock Exam Prep'],
      sentiment: 'negative',
      emergency_detected: false,
      created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      user_id: userId,
      content: 'Had a good talk with a peer. Did some box breathing and managed to complete a study block. Feel like I am getting back on track.',
      emotion: 'Relief',
      stress_level: 5,
      anxiety_level: 4,
      burnout_risk: 'Medium',
      motivation_score: 7,
      triggers: ['Time Management', 'Peer Pressure'],
      sentiment: 'mixed',
      emergency_detected: false,
      created_at: new Date().toISOString(),
    }
  ];

  for (const entry of journals) {
    await createJournalEntry(entry);
  }

  // 2. Create Demo Chat Messages
  const sessionId = 'demo-session-123';
  const chatMessages: ChatMessage[] = [
    {
      id: uuidv4(),
      user_id: userId,
      session_id: sessionId,
      role: 'user',
      content: 'I feel completely overwhelmed by the syllabus, there is just too much to cover.',
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      user_id: userId,
      session_id: sessionId,
      role: 'assistant',
      content: 'I hear you. The syllabus is massive, and it is completely natural to feel overwhelmed. Let\'s break it down. Have you defined your top 3 targets for today, or is the syllabus size making it hard to start?',
      created_at: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      user_id: userId,
      session_id: sessionId,
      role: 'user',
      content: 'Yes, I try to target them but I keep thinking about what if I fail.',
      created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      user_id: userId,
      session_id: sessionId,
      role: 'assistant',
      content: 'Fear of failure is a very real source of anxiety. It activates our fight-or-flight response, making logical planning hard. Try to focus on the process rather than the outcome. Let\'s start with a very small study sprint: just 25 minutes of active recall on one topic. How does that sound?',
      created_at: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      user_id: userId,
      session_id: sessionId,
      role: 'user',
      content: 'That sounds manageable. I will do that.',
      created_at: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      user_id: userId,
      session_id: sessionId,
      role: 'assistant',
      content: 'Excellent! Turn off all distractions for the next 25 minutes. You\'ve got this. I\'m here whenever you want to check back in or do a breathing exercise.',
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    }
  ];

  for (const msg of chatMessages) {
    await createChatMessage(msg);
  }

  // 3. Create Demo Action Plan
  const plan: ActionPlan = {
    id: uuidv4(),
    user_id: userId,
    daily_goal: JSON.stringify({
      title: 'Complete one active recall sprint (25m) on a high-yield topic',
      description: 'Focus entirely on understanding the core concept. Put all devices away.',
      completed: false
    }),
    stress_plan: JSON.stringify({
      triggers: ['Syllabus size', 'Fear of failure', 'Mock Exam Prep'],
      copingMechanisms: [
        'Do 4-7-8 breathing for 2 minutes when chest feels tight.',
        'Write down distracting worries on a physical notepad to release working memory.',
        'Set solid study-rest boundaries—no study after 10 PM.'
      ]
    }),
    mindfulness_exercise: JSON.stringify({
      title: 'Box Breathing for Focus',
      type: 'breathing',
      duration: 4,
      steps: [
        'Sit comfortably with your back straight.',
        'Exhale all the air from your lungs.',
        'Inhale slowly through your nose for a count of 4.',
        'Hold your breath for a count of 4.',
        'Exhale slowly and smoothly for a count of 4.',
        'Hold your lungs empty for a count of 4.',
        'Repeat this cycle 4 to 5 times.'
      ]
    }),
    motivation_challenge: JSON.stringify({
      title: 'The Unplugged Revision Block',
      description: 'Study for a block of 50 minutes without checking notifications or social media.',
      reward: '20 minutes of your favorite activity guilt-free'
    }),
    created_at: new Date().toISOString()
  };

  await createActionPlan(plan);
}

