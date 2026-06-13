import { User, JournalEntry, ChatMessage, DashboardData, ActionPlan } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('mindmate_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: headers as HeadersInit,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json() as Promise<T>;
}

// Simulated mock data generators for graceful fallbacks if backend is not running
const MOCK_TRIGGERS = ['Mock Exam Prep', 'Procrastination', 'Time Management', 'Peer Pressure', 'Lack of Sleep', 'Silly Mistakes'];
const MOCK_DISTORTIONS = ['All-or-Nothing Thinking', 'Catastrophizing', 'Should Statements', 'Emotional Reasoning'];

// Mappers to translate backend database schemas to frontend types
function mapServerJournal(e: any): JournalEntry {
  const stress = e.stress_level ?? 5;
  const motivation = e.motivation_score ?? 5;
  // Mood rating: higher motivation & lower stress => better mood (1 to 5)
  const moodRating = Math.round(10 - stress + motivation) / 2;
  const moodVal = moodRating > 4 ? 'high' : moodRating < 2 ? 'low' : 'neutral';

  return {
    id: e.id,
    content: e.content,
    createdAt: e.created_at || e.createdAt,
    analysis: {
      mood: e.mood || moodVal,
      stressLevel: stress,
      anxietyLevel: e.anxiety_level || e.anxietyLevel || 0,
      motivationLevel: motivation,
      triggers: e.triggers || [],
      primaryEmotion: e.emotion || 'Neutral',
      cognitiveDistortions: e.cognitive_distortions || [],
      recommendations: e.recommendations || [
        'Engage in a 5-minute somatic breathing exercise to calm your amygdala.',
        'Reflect on your past wins. You have cleared challenging hurdles before.',
        'Focus on 3 small topics you can improve tomorrow rather than the whole test score.'
      ],
      summary: e.supportive_message || e.summary || 'AI feedback analysis completed.'
    }
  };
}

function mapServerChatMessage(m: any): ChatMessage {
  return {
    id: m.id,
    sender: m.role === 'assistant' ? 'bot' : 'user',
    text: m.content,
    timestamp: m.created_at || m.timestamp || new Date().toISOString(),
    suggestions: m.role === 'assistant' ? getChatSuggestions(m.content) : undefined
  };
}

function getChatSuggestions(text: string): string[] {
  const lower = text.toLowerCase();
  if (lower.includes('breathing') || lower.includes('exercise') || lower.includes('box')) {
    return ["Let's do the exercise", "How does breathing help?", "I feel a bit better"];
  }
  if (lower.includes('burnout') || lower.includes('exhausted') || lower.includes('tired')) {
    return ["How to set study boundaries", "Symptoms of burnout", "Relaxing techniques"];
  }
  return ["Help me plan study sessions", "Help me reframe negative thoughts", "Guide me through a breathing exercise"];
}

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetchJson<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return {
      token: res.token,
      user: {
        id: res.user.id,
        name: res.user.name,
        examType: res.user.examType,
        joinedAt: res.user.joinedAt
      }
    };
  },

  async register(name: string, email: string, password: string, examType: string): Promise<{ token: string; user: User }> {
    const res = await fetchJson<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, examType }),
    });
    return {
      token: res.token,
      user: {
        id: res.user.id,
        name: res.user.name,
        examType: res.user.examType,
        joinedAt: res.user.joinedAt
      }
    };
  },

  async demoLogin(): Promise<{ token: string; user: User }> {
    const res = await fetchJson<{ token: string; user: any }>('/auth/demo', {
      method: 'POST',
    });
    return {
      token: res.token,
      user: {
        id: res.user.id,
        name: res.user.name,
        examType: res.user.examType,
        joinedAt: res.user.joinedAt
      }
    };
  },

  // Onboard User (Legacy fallback)
  async onboardUser(name: string, examType: string): Promise<User> {
    try {
      return await fetchJson<User>('/user', {
        method: 'POST',
        body: JSON.stringify({ name, examType }),
      });
    } catch (err) {
      console.warn('Backend offline, using fallback onboarding mock.');
      const user: User = { name, examType, joinedAt: new Date().toISOString() };
      return user;
    }
  },

  // Journal Entries
  async getJournalEntries(): Promise<JournalEntry[]> {
    const userJson = localStorage.getItem('mindmate_user');
    if (!userJson) return [];
    
    const user = JSON.parse(userJson);
    if (!user.id) return [];

    try {
      const serverEntries = await fetchJson<any[]>('/journal/' + user.id);
      return serverEntries.map(mapServerJournal);
    } catch (err) {
      console.warn('Backend offline or failed, fetching mock/localStorage journal entries.');
      const stored = localStorage.getItem('mindmate_mock_journals');
      if (stored) return JSON.parse(stored);

      // Default mock entries
      const mockEntries: JournalEntry[] = [
        {
          id: 'mock-1',
          content: 'Today was hard. I took a practice test for my exam and scored much lower than I expected. I feel like I am letting down my parents and myself.',
          createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
          analysis: {
            mood: 'low',
            stressLevel: 8,
            anxietyLevel: 7,
            motivationLevel: 4,
            triggers: ['Mock Exam Prep', 'Peer Pressure'],
            primaryEmotion: 'Defeat / Fear of Failure',
            cognitiveDistortions: ['Catastrophizing', 'All-or-Nothing Thinking'],
            recommendations: [
              'Try to break down the incorrect answers. They are data points, not reflections of your intelligence.',
              'Engage in a 5-minute somatic breathing exercise to calm your amygdala.',
              'Focus on 3 small topics you can improve tomorrow rather than the whole test score.'
            ],
            summary: 'User feels disappointed and overwhelmed after a mock test score, catastrophizing the result as a predictor of their final exam outcome.'
          }
        },
        {
          id: 'mock-2',
          content: 'Managed to study for 6 hours today and actually completed my review of Organic Chemistry. Feeling a bit more confident and relaxed.',
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          analysis: {
            mood: 'high',
            stressLevel: 4,
            anxietyLevel: 3,
            motivationLevel: 8,
            triggers: ['Time Management'],
            primaryEmotion: 'Accomplishment',
            cognitiveDistortions: [],
            recommendations: [
              'Celebrate this consistency, but ensure you do not push too hard tomorrow to avoid energy crashes.',
              'Maintain your sleep schedule; sleep consolidation is vital for memorization.',
            ],
            summary: 'User experienced a highly productive day, completing a key revision topic which reduced stress and raised motivation.'
          }
        }
      ];
      localStorage.setItem('mindmate_mock_journals', JSON.stringify(mockEntries));
      return mockEntries;
    }
  },

  async submitJournalEntry(content: string): Promise<JournalEntry> {
    const userJson = localStorage.getItem('mindmate_user');
    const user = userJson ? JSON.parse(userJson) : null;

    try {
      if (!user || !user.id) throw new Error('Unauthenticated user');

      const response = await fetchJson<{ entry: any; analysis: any }>('/journal', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, content }),
      });

      return mapServerJournal(response.entry);
    } catch (err) {
      console.warn('Backend offline or failed, simulating AI journal analysis locally.');
      
      // Local Simulation of AI analysis
      const stressVal = Math.floor(Math.random() * 5) + 5; // 5-9
      const anxietyVal = Math.floor(Math.random() * 6) + 4; // 4-9
      const motivationVal = Math.floor(Math.random() * 5) + 3; // 3-7

      const mockEntry: JournalEntry = {
        id: 'journal-' + Math.random().toString(36).substr(2, 9),
        content,
        createdAt: new Date().toISOString(),
        analysis: {
          mood: stressVal > 7 ? 'low' : 'neutral',
          stressLevel: stressVal,
          anxietyLevel: anxietyVal,
          motivationLevel: motivationVal,
          triggers: [MOCK_TRIGGERS[Math.floor(Math.random() * MOCK_TRIGGERS.length)]],
          primaryEmotion: 'Overwhelmed',
          cognitiveDistortions: [MOCK_DISTORTIONS[Math.floor(Math.random() * MOCK_DISTORTIONS.length)]],
          recommendations: [
            'Adopt the 20-20-20 rule during screen-based revisions to ease physical strain.',
            'Give yourself permission to take a 15-minute walk outside without thinking of the syllabus.',
            'Reflect on your past wins. You have cleared challenging hurdles before.'
          ],
          summary: 'The journal entry indicates typical preparation fatigue combined with high self-imposed pressure. Cognitive restructuring can assist.'
        }
      };

      const stored = localStorage.getItem('mindmate_mock_journals');
      const list: JournalEntry[] = stored ? JSON.parse(stored) : [];
      list.unshift(mockEntry);
      localStorage.setItem('mindmate_mock_journals', JSON.stringify(list));
      
      // Also trigger a refresh of the dashboard mock data to align
      localStorage.removeItem('mindmate_mock_dashboard');

      return mockEntry;
    }
  },

  // Coaching Chat
  async sendChatMessage(content: string, sessionId?: string): Promise<{ messages: ChatMessage[]; sessionId: string }> {
    const userJson = localStorage.getItem('mindmate_user');
    const user = userJson ? JSON.parse(userJson) : null;

    try {
      if (!user || !user.id) throw new Error('Unauthenticated user');

      const activeSession = sessionId || 'session-' + Math.random().toString(36).substr(2, 9);
      
      await fetchJson<any>('/chat', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, message: content, sessionId: activeSession }),
      });

      const history = await this.getChatHistory(activeSession);
      return {
        messages: history,
        sessionId: activeSession
      };
    } catch (err) {
      console.warn('Backend offline, generating local simulated AI chatbot reply.');
      const activeSession = sessionId || 'session-' + Math.random().toString(36).substr(2, 9);
      
      const userMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        sender: 'user',
        text: content,
        timestamp: new Date().toISOString()
      };

      // Generate a nice supportive response contextually if we can spot keywords
      let botReply = "I hear you, and it is completely normal to feel this way. Exam preparation is a marathon, not a sprint. Remember to treat yourself with kindness. What is one tiny step you can focus on in the next hour?";
      let suggestions = ["Help me plan study sessions", "Help me reframe negative thoughts", "Guide me through a breathing exercise"];

      const lowerContent = content.toLowerCase();
      if (lowerContent.includes('stress') || lowerContent.includes('anxiety') || lowerContent.includes('scared') || lowerContent.includes('afraid')) {
        botReply = "When stress gets high, our brains enter 'fight-or-flight' mode, making focus hard. Let's do a simple 4-7-8 breathing practice right now: inhale for 4 seconds, hold for 7, exhale slowly for 8. Let's try it together.";
        suggestions = ["Let's do the exercise", "Talk about exam fear", "How to study under pressure"];
      } else if (lowerContent.includes('burnout') || lowerContent.includes('tired') || lowerContent.includes('exhausted') || lowerContent.includes('sleep')) {
        botReply = "Exhaustion is a critical warning signal from your body. Burnout isn't solved by studying harder; it is solved by scheduled recovery. Please consider wrapping up for the night or taking a 30-minute complete unplugged break.";
        suggestions = ["How to set study boundaries", "Symptoms of burnout", "Relaxing techniques"];
      } else if (lowerContent.includes('schedule') || lowerContent.includes('plan') || lowerContent.includes('time') || lowerContent.includes('manage')) {
        botReply = "Structuring your day makes the massive syllabus feel manageable. I recommend using the Pomodoro technique (25m study, 5m break) with a maximum of three core targets daily. Shall we map out your targets for tomorrow?";
        suggestions = ["Define my top 3 goals", "How many hours should I study?", "Creating active recall templates"];
      }

      const botMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        sender: 'bot',
        text: botReply,
        timestamp: new Date(Date.now() + 500).toISOString(),
        suggestions
      };

      const storedSessionKey = `mindmate_chat_${activeSession}`;
      const existing = localStorage.getItem(storedSessionKey);
      const messages: ChatMessage[] = existing ? JSON.parse(existing) : [];
      
      messages.push(userMsg);
      messages.push(botMsg);
      localStorage.setItem(storedSessionKey, JSON.stringify(messages));

      return {
        messages,
        sessionId: activeSession
      };
    }
  },

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    const userJson = localStorage.getItem('mindmate_user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user || !user.id) return [];

    try {
      const serverHistory = await fetchJson<any[]>(`/chat/${user.id}/${sessionId}`);
      return serverHistory.map(mapServerChatMessage);
    } catch (err) {
      const storedSessionKey = `mindmate_chat_${sessionId}`;
      const existing = localStorage.getItem(storedSessionKey);
      return existing ? JSON.parse(existing) : [];
    }
  },

  // Dashboard Data
  async getDashboardData(): Promise<DashboardData> {
    const userJson = localStorage.getItem('mindmate_user');
    const user = userJson ? JSON.parse(userJson) : null;

    try {
      if (!user || !user.id) throw new Error('Unauthenticated user');

      const serverData = await fetchJson<any>('/dashboard/' + user.id);
      
      const recentMoodTrend = serverData.moodTrend.map((m: any, idx: number) => {
        return {
          date: m.date,
          mood: m.value, // value represents mood
          stress: serverData.stressTrend[idx]?.value || 0,
          anxiety: serverData.anxietyTrend[idx]?.value || 0,
          motivation: serverData.motivationTrend[idx]?.value || 0
        };
      });

      const riskMap: Record<string, number> = { Low: 20, Medium: 50, High: 80 };
      const burnoutRisk = riskMap[serverData.currentBurnoutRisk] || 25;

      const triggersFrequency = serverData.triggers.map((t: any) => ({
        trigger: t.name,
        count: t.count
      }));

      return {
        weeklySummary: `Dashboard loaded with data. You have completed ${serverData.totalEntries} journal entries with a streak of ${serverData.streak} days. Your average mood rating is ${serverData.avgMood}/5.`,
        burnoutRisk,
        recentMoodTrend,
        triggersFrequency,
        insights: [
          'Stress levels typically spike after mock test scores. Reframing errors as data points will help lower your anxiety.',
          'Your motivation is strongly linked to completing your daily top targets. Keep them bite-sized!',
          'Sleep quality dropped below 6 hours on Wednesday. Focus on restoring a 7-8 hour sleep schedule to boost memory consolidation.'
        ]
      };
    } catch (err) {
      console.warn('Backend offline, using fallback mock dashboard data.');
      const stored = localStorage.getItem('mindmate_mock_dashboard');
      if (stored) return JSON.parse(stored);

      // Generate dashboard data from journals or fallback to default templates
      const journalsStored = localStorage.getItem('mindmate_mock_journals');
      const journals: JournalEntry[] = journalsStored ? JSON.parse(journalsStored) : [];
      
      const moodTrend = [
        { date: 'Mon', mood: 4, stress: 5, anxiety: 4, motivation: 7 },
        { date: 'Tue', mood: 3, stress: 6, anxiety: 6, motivation: 6 },
        { date: 'Wed', mood: 2, stress: 8, anxiety: 7, motivation: 4 },
        { date: 'Thu', mood: 4, stress: 4, anxiety: 3, motivation: 8 },
        { date: 'Fri', mood: 5, stress: 3, anxiety: 2, motivation: 9 },
        { date: 'Sat', mood: 3, stress: 6, anxiety: 5, motivation: 7 },
        { date: 'Sun', mood: 4, stress: 5, anxiety: 4, motivation: 8 },
      ];

      if (journals.length > 0) {
        const latest = journals[0];
        if (latest.analysis) {
          const mapping: Record<string, number> = { very_low: 1, low: 2, neutral: 3, high: 4, very_high: 5 };
          moodTrend[moodTrend.length - 1] = {
            date: 'Today',
            mood: mapping[latest.analysis.mood] || 3,
            stress: latest.analysis.stressLevel,
            anxiety: latest.analysis.anxietyLevel,
            motivation: latest.analysis.motivationLevel,
          };
        }
      }

      let avgStress = 5.5;
      if (journals.length > 0) {
        const sum = journals.reduce((acc, entry) => acc + (entry.analysis?.stressLevel || 5), 0);
        avgStress = sum / journals.length;
      }
      const burnoutRisk = Math.min(Math.round(avgStress * 10), 100);

      const dashboard: DashboardData = {
        weeklySummary: journals.length > 0 && journals[0].analysis?.summary 
          ? `You have been dealing with some preparation fatigue recently. ${journals[0].analysis.summary} Keep using active coping mechanisms.`
          : 'Your stress is moderate. You have successfully balanced study load with micro-rests. Your primary stress triggers center around Mock Exams and time limits.',
        burnoutRisk,
        recentMoodTrend: moodTrend,
        triggersFrequency: [
          { trigger: 'Mock Exam Prep', count: 4 },
          { trigger: 'Procrastination', count: 3 },
          { trigger: 'Time Management', count: 2 },
          { trigger: 'Peer Pressure', count: 2 },
          { trigger: 'Lack of Sleep', count: 1 }
        ],
        insights: [
          'Stress levels typically spike after mock test scores. Reframing errors as data points will help lower your anxiety.',
          'Your motivation is strongly linked to completing your daily top targets. Keep them bite-sized!',
          'Sleep quality dropped below 6 hours on Wednesday. Focus on restoring a 7-8 hour sleep schedule to boost memory consolidation.'
        ]
      };

      localStorage.setItem('mindmate_mock_dashboard', JSON.stringify(dashboard));
      return dashboard;
    }
  },

  // Action Plan
  async getActionPlan(): Promise<ActionPlan> {
    const userJson = localStorage.getItem('mindmate_user');
    const user = userJson ? JSON.parse(userJson) : null;

    try {
      if (!user || !user.id) throw new Error('Unauthenticated user');

      const serverPlan = await fetchJson<any>('/action-plan/' + user.id);
      return {
        dailyGoal: JSON.parse(serverPlan.daily_goal),
        stressPlan: JSON.parse(serverPlan.stress_plan),
        mindfulnessExercise: JSON.parse(serverPlan.mindfulness_exercise),
        motivationChallenge: JSON.parse(serverPlan.motivation_challenge)
      };
    } catch (err) {
      console.warn('Backend offline, using fallback mock action plan.');
      const plan: ActionPlan = {
        dailyGoal: {
          title: 'Review 20 incorrect mock questions',
          description: 'Focus on understanding the concept errors, not just the correction. Take a 5-minute break every 5 questions.',
          completed: false
        },
        stressPlan: {
          triggers: ['Time pressure during tests', 'Feeling behind on syllabus'],
          copingMechanisms: [
            'Do 4-7-8 breathing for 2 minutes before opening the study desk.',
            'Use the Pomodoro technique to maintain focus blocks.',
            'Write down worries on a physical notepad to release working memory.'
          ]
        },
        mindfulnessExercise: {
          title: 'Box Breathing for Focus',
          type: 'breathing',
          duration: 4,
          steps: [
            'Sit comfortably with your back straight and feet flat on the floor.',
            'Exhale all the air from your lungs completely.',
            'Inhale slowly through your nose for a count of 4.',
            'Hold your breath for a count of 4.',
            'Exhale slowly and smoothly through your mouth for a count of 4.',
            'Hold your lungs empty for a count of 4.',
            'Repeat this cycle 4 to 5 times.'
          ]
        },
        motivationChallenge: {
          title: 'The Unplugged Study Hour',
          description: 'Study for a block of 60 minutes with all devices in another room. Check off only after complete silence.',
          reward: '20 minutes of guilt-free relaxation or favourite hobby'
        }
      };
      return plan;
    }
  }
};
