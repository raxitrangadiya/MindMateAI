import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
console.log('Using API key:', key ? key.substring(0, 8) + '...' : 'none');

if (!key || key.includes('your_gemini_api_key')) {
  console.error('❌ Gemini API key not found in env!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);

async function test() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];
  for (const modelName of models) {
    try {
      console.log(`Calling Gemini API (${modelName})...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Explain AI in three words');
      console.log(`✅ Gemini connection SUCCESSFUL with model ${modelName}!`);
      console.log('Response:', result.response.text().trim());
      return;
    } catch (err) {
      console.error(`❌ Gemini API model ${modelName} failed:`, err.message);
    }
  }
}

test();
