import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';
import type { JournalEntry, GeminiJournalAnalysis, GeminiActionPlan } from '../types/index.js';

/* ------------------------------------------------------------------ */
/*  Gemini client initialisation                                      */
/* ------------------------------------------------------------------ */

const isConfigured = Boolean(config.geminiApiKey && !config.geminiApiKey.includes('your_gemini_api_key'));

let genAI: GoogleGenerativeAI | null = null;

if (isConfigured) {
  try {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
    console.log('✅ Gemini AI client initialized');
  } catch (err) {
    console.error('❌ Failed to initialize Gemini client:', err);
  }
} else {
  console.log('⚠️  Gemini API key not set or placeholders detected – using mock responses (demo mode)');
}

/* ================================================================== */
/*  analyzeJournal                                                    */
/* ================================================================== */

export async function analyzeJournal(
  content: string,
  examType: string,
): Promise<GeminiJournalAnalysis> {
  if (!isConfigured || !genAI) {
    return getMockJournalAnalysis(content);
  }

  const prompt = `You are a mental wellness AI assistant for students preparing for ${examType}.
Analyze this journal entry and return a JSON object with:
- emotion: the primary emotion detected (e.g., "anxious", "stressed", "hopeful", "frustrated", "overwhelmed", "motivated")
- stress_level: 1-10 scale
- anxiety_level: 1-10 scale
- burnout_risk: "Low" | "Medium" | "High"
- motivation_score: 1-10 scale
- triggers: array of detected stress triggers (e.g., ["exam pressure", "lack of sleep"])
- sentiment: "positive" | "negative" | "neutral" | "mixed"
- emergency_detected: boolean - TRUE if content contains self-harm indicators, severe distress, suicidal thoughts, or crisis signals
- supportive_message: a short empathetic response (2-3 sentences)

IMPORTANT: Return ONLY valid JSON, no markdown formatting.

Journal entry: "${content}"`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const analysis: GeminiJournalAnalysis = JSON.parse(cleaned);
    return analysis;
  } catch (err) {
    console.error('Gemini analyzeJournal error:', err);
    return getMockJournalAnalysis(content);
  }
}

/* ================================================================== */
/*  chatWithCoach                                                     */
/* ================================================================== */

export async function chatWithCoach(
  messages: { role: string; content: string }[],
  examType: string,
): Promise<string> {
  if (!isConfigured || !genAI) {
    return getMockChatResponse(messages[messages.length - 1]?.content ?? '');
  }

  const systemPrompt = `You are MindMate, an empathetic AI wellness coach for students preparing for ${examType}. Your role:
- Provide emotional support and encouragement
- Suggest practical stress management techniques
- Recommend breathing exercises and mindfulness
- Offer study-life balance advice
- Keep responses SHORT (2-4 sentences max)
- Be warm, understanding, and non-judgmental
- NEVER provide medical diagnoses
- If you detect severe distress or self-harm indicators, respond with: "I hear you, and I want you to know you're not alone. Please reach out to a professional: iCall (9152987821), Vandrevala Foundation (1860-2662-345), or NIMHANS (080-46110007). You deserve support."`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // Build conversation history for multi-turn
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user' as const, parts: [{ text: systemPrompt }] },
        {
          role: 'model' as const,
          parts: [
            {
              text: "I understand. I'm MindMate, your wellness companion. I'm here to support you through your preparation journey. How are you feeling today?",
            },
          ],
        },
        ...history,
      ],
    });

    const lastMessage = messages[messages.length - 1]?.content ?? '';
    const result = await chat.sendMessage(lastMessage);
    return result.response.text().trim();
  } catch (err) {
    console.error('Gemini chatWithCoach error:', err);
    return getMockChatResponse(messages[messages.length - 1]?.content ?? '');
  }
}

/* ================================================================== */
/*  generateActionPlan                                                */
/* ================================================================== */

export async function generateActionPlan(
  recentEntries: JournalEntry[],
  examType: string,
): Promise<GeminiActionPlan> {
  if (!isConfigured || !genAI) {
    return getMockActionPlan();
  }

  const entrySummaries = recentEntries.map((e) => ({
    emotion: e.emotion,
    stress: e.stress_level,
    triggers: e.triggers,
  }));

  const prompt = `Based on these recent journal entries from a ${examType} student, generate a personalized action plan.

Recent entries: ${JSON.stringify(entrySummaries)}

Return a JSON object with:
- daily_goal: one specific achievable goal for today
- stress_plan: a short stress reduction activity
- mindfulness_exercise: a specific exercise with duration
- motivation_challenge: an uplifting challenge

Keep each field to 1-2 sentences. Be specific and actionable.
Return ONLY valid JSON.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const plan: GeminiActionPlan = JSON.parse(cleaned);
    return plan;
  } catch (err) {
    console.error('Gemini generateActionPlan error:', err);
    return getMockActionPlan();
  }
}

/* ================================================================== */
/*  Mock / fallback responses (demo mode)                             */
/* ================================================================== */

function getMockJournalAnalysis(content: string): GeminiJournalAnalysis {
  const lower = content.toLowerCase();
  const hasStress =
    lower.includes('stress') || lower.includes('overwhelm') || lower.includes('pressure');
  const hasPositive =
    lower.includes('happy') || lower.includes('good') || lower.includes('great');
  const hasEmergency =
    lower.includes('suicide') || lower.includes('self-harm') || lower.includes('end it');

  return {
    emotion: hasStress ? 'stressed' : hasPositive ? 'hopeful' : 'anxious',
    stress_level: hasStress ? 7 : hasPositive ? 3 : 5,
    anxiety_level: hasStress ? 6 : hasPositive ? 2 : 4,
    burnout_risk: hasStress ? 'High' : hasPositive ? 'Low' : 'Medium',
    motivation_score: hasPositive ? 8 : hasStress ? 4 : 6,
    triggers: hasStress
      ? ['exam pressure', 'time constraints']
      : ['study workload', 'performance anxiety'],
    sentiment: hasPositive ? 'positive' : hasStress ? 'negative' : 'mixed',
    emergency_detected: hasEmergency,
    supportive_message: hasEmergency
      ? "I hear you, and I want you to know you're not alone. Please reach out to a professional: iCall (9152987821), Vandrevala Foundation (1860-2662-345), or NIMHANS (080-46110007). You deserve support."
      : hasStress
        ? "It sounds like you're carrying a lot right now. Remember, taking small breaks can actually improve your productivity. You're doing better than you think."
        : "Thank you for sharing. It's great that you're reflecting on your feelings. Keep up the positive momentum!",
  };
}

function getMockChatResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('stress') || lower.includes('overwhelm')) {
    return "I can sense you're feeling overwhelmed. Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. Even a 5-minute break can reset your focus.";
  }
  if (lower.includes('sleep') || lower.includes('tired')) {
    return "Sleep is crucial for memory consolidation. Try to maintain a consistent sleep schedule, and avoid screens 30 minutes before bed. Your brain needs rest to perform at its best.";
  }
  if (lower.includes('motivat') || lower.includes('give up')) {
    return "Every small step counts toward your goal. Remember why you started this journey. Break your study session into 25-minute focused blocks with short breaks — progress will follow.";
  }
  return "I hear you. Taking a moment to check in with yourself is a sign of strength. Would you like to try a quick mindfulness exercise, or would you prefer to talk more about what's on your mind?";
}

function getMockActionPlan(): GeminiActionPlan {
  return {
    daily_goal:
      'Complete two focused 45-minute study sessions with a 15-minute nature break in between.',
    stress_plan:
      'Practice progressive muscle relaxation for 10 minutes after lunch — tense and release each muscle group from toes to forehead.',
    mindfulness_exercise:
      '5-minute body scan meditation: sit comfortably, close your eyes, and slowly bring awareness to each part of your body.',
    motivation_challenge:
      'Write down three things you learned today and one thing you are proud of accomplishing, no matter how small.',
  };
}
