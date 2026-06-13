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

export async function createUser(name: string, examType: ExamType): Promise<User> {
  const user: User = {
    id: uuidv4(),
    name,
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
