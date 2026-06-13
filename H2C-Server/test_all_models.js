import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('❌ No GEMINI_API_KEY in environment');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);

const testModels = [
  'gemini-2.5-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-3.1-flash-lite'
];

async function testAll() {
  for (const modelName of testModels) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Explain AI in three words');
      console.log(`  ✅ SUCCESS! Response: "${result.response.text().trim()}"`);
    } catch (err) {
      console.error(`  ❌ FAILED: ${err.message}`);
    }
  }
}

testAll();
