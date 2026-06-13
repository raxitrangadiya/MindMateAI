export interface User {
  id: string;
  name: string;
  email?: string;
  password_hash?: string;
  exam_type: ExamType;
  created_at: string;
}

export type ExamType = 'JEE' | 'NEET' | 'UPSC' | 'GATE' | 'CAT' | 'CUET';

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  emotion: string;
  stress_level: number;
  anxiety_level: number;
  burnout_risk: BurnoutLevel;
  motivation_score: number;
  triggers: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  emergency_detected: boolean;
  created_at: string;
}

export type BurnoutLevel = 'Low' | 'Medium' | 'High';

export interface ChatMessage {
  id: string;
  user_id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ActionPlan {
  id: string;
  user_id: string;
  daily_goal: string;
  stress_plan: string;
  mindfulness_exercise: string;
  motivation_challenge: string;
  created_at: string;
}

export interface WeeklySummary {
  id: string;
  user_id: string;
  week_start: string;
  avg_stress: number;
  avg_anxiety: number;
  avg_motivation: number;
  burnout_trend: BurnoutLevel;
  top_triggers: string[];
  ai_summary: string;
  created_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  mood_rating: number;
  energy_level: number;
  created_at: string;
}

export interface DashboardData {
  moodTrend: { date: string; value: number }[];
  stressTrend: { date: string; value: number }[];
  anxietyTrend: { date: string; value: number }[];
  burnoutTrend: { date: string; value: string }[];
  motivationTrend: { date: string; value: number }[];
  currentBurnoutRisk: BurnoutLevel;
  totalEntries: number;
  avgMood: number;
  streak: number;
  triggers: { name: string; count: number }[];
}

export interface GeminiJournalAnalysis {
  emotion: string;
  stress_level: number;
  anxiety_level: number;
  burnout_risk: BurnoutLevel;
  motivation_score: number;
  triggers: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  emergency_detected: boolean;
  supportive_message: string;
}

export interface GeminiActionPlan {
  daily_goal: string;
  stress_plan: string;
  mindfulness_exercise: string;
  motivation_challenge: string;
}
