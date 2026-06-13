import { analyzeJournal, chatWithCoach, generateActionPlan } from './src/services/gemini.service.js';
import type { JournalEntry } from './src/types/index.js';

async function runServiceTests() {
  console.log('🚀 Starting live tests for Gemini Service...');

  // Test 1: Journal Analysis
  try {
    console.log('\n--- Test 1: analyzeJournal ---');
    const journalText = "I'm feeling very overwhelmed with my JEE preparation today. There's too much syllabus left and I'm scared I won't finish in time.";
    console.log(`Input journal text: "${journalText}"`);
    const analysis = await analyzeJournal(journalText, 'JEE');
    console.log('Result:', JSON.stringify(analysis, null, 2));

    // Basic assertions
    if (analysis && typeof analysis.stress_level === 'number' && analysis.emotion) {
      console.log('✅ analyzeJournal SUCCESS!');
    } else {
      console.error('❌ analyzeJournal returned invalid format or fallback data!');
    }
  } catch (err: any) {
    console.error('❌ analyzeJournal test failed:', err.message);
  }

  // Test 2: Chat Coach
  try {
    console.log('\n--- Test 2: chatWithCoach ---');
    const messages = [
      { role: 'user', content: "I feel like giving up. I failed my mock test today." }
    ];
    console.log('Input messages:', JSON.stringify(messages));
    const response = await chatWithCoach(messages, 'JEE');
    console.log('Result:', response);

    if (response && response.length > 0 && !response.includes("I can sense you're feeling overwhelmed")) { // Avoid matches with mock responses
      console.log('✅ chatWithCoach SUCCESS!');
    } else {
      console.log('⚠️ chatWithCoach returned response (might be live or fallback, please verify above)');
    }
  } catch (err: any) {
    console.error('❌ chatWithCoach test failed:', err.message);
  }

  // Test 3: Action Plan
  try {
    console.log('\n--- Test 3: generateActionPlan ---');
    const recentEntries: JournalEntry[] = [
      {
        id: '1',
        user_id: 'user_1',
        content: 'Stressed about physics prep.',
        emotion: 'anxious',
        stress_level: 8,
        anxiety_level: 7,
        burnout_risk: 'High',
        motivation_score: 3,
        triggers: ['mock tests', 'physics'],
        sentiment: 'negative',
        emergency_detected: false,
        created_at: new Date().toISOString()
      }
    ];
    console.log('Input entries:', JSON.stringify(recentEntries));
    const plan = await generateActionPlan(recentEntries, 'JEE');
    console.log('Result:', JSON.stringify(plan, null, 2));

    if (plan && plan.daily_goal && plan.stress_plan) {
      console.log('✅ generateActionPlan SUCCESS!');
    } else {
      console.error('❌ generateActionPlan returned invalid format or fallback data!');
    }
  } catch (err: any) {
    console.error('❌ generateActionPlan test failed:', err.message);
  }
}

runServiceTests();
