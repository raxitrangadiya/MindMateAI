import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('❌ No GEMINI_API_KEY in environment');
  process.exit(1);
}

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(key);
    // Use the fetch endpoint directly to get a complete list of models available to this key
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error('Response:', text);
      return;
    }
    const data = await res.json();
    console.log('Available Models:');
    if (data.models) {
      data.models.forEach(m => {
        console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log('No models returned. Response:', data);
    }
  } catch (err) {
    console.error('Failed to list models:', err);
  }
}

listModels();
