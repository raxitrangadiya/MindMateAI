export interface User {
  name: string;
  examType: 'JEE' | 'NEET' | 'UPSC' | 'GATE' | 'CAT' | 'CUET' | string;
  joinedAt: string;
}

export interface JournalAnalysis {
  mood: 'very_low' | 'low' | 'neutral' | 'high' | 'very_high';
  stressLevel: number; // 0 to 10
  anxietyLevel: number; // 0 to 10
  motivationLevel: number; // 0 to 10
  triggers: string[];
  primaryEmotion: string;
  cognitiveDistortions: string[];
  recommendations: string[];
  summary: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
  analysis?: JournalAnalysis;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface DashboardData {
  weeklySummary: string;
  burnoutRisk: number; // 0 to 100
  recentMoodTrend: {
    date: string;
    mood: number; // 1 to 5
    stress: number; // 0 to 10
    anxiety: number; // 0 to 10
    motivation: number; // 0 to 10
  }[];
  triggersFrequency: {
    trigger: string;
    count: number;
  }[];
  insights: string[];
}

export interface ActionPlan {
  dailyGoal: {
    title: string;
    description: string;
    completed: boolean;
  };
  stressPlan: {
    triggers: string[];
    copingMechanisms: string[];
  };
  mindfulnessExercise: {
    title: string;
    type: 'breathing' | 'meditation' | 'somatic';
    duration: number; // in minutes
    steps: string[];
  };
  motivationChallenge: {
    title: string;
    description: string;
    reward: string;
  };
}
