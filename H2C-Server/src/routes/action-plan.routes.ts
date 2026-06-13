import { Router, type Request, type Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getUser,
  getJournalEntries,
  createActionPlan,
  getLatestActionPlan,
} from '../services/supabase.service.js';
import { generateActionPlan } from '../services/gemini.service.js';
import type { ActionPlan } from '../types/index.js';

const router = Router();

// POST /api/action-plan/:userId — Generate a new action plan from recent entries
router.post('/action-plan/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;

    const user = await getUser(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const entries = await getJournalEntries(userId);
    const recentEntries = entries.slice(0, 5); // Use last 5 entries

    if (recentEntries.length === 0) {
      res.status(400).json({
        error: 'No journal entries found. Please write a journal entry first.',
      });
      return;
    }

    const geminiPlan = await generateActionPlan(recentEntries, user.exam_type);

    const plan: ActionPlan = {
      id: uuidv4(),
      user_id: userId,
      daily_goal: geminiPlan.daily_goal,
      stress_plan: geminiPlan.stress_plan,
      mindfulness_exercise: geminiPlan.mindfulness_exercise,
      motivation_challenge: geminiPlan.motivation_challenge,
      created_at: new Date().toISOString(),
    };

    const saved = await createActionPlan(plan);
    res.status(201).json(saved);
  } catch (err) {
    console.error('POST /api/action-plan/:userId error:', err);
    res.status(500).json({ error: 'Failed to generate action plan' });
  }
});

// GET /api/action-plan/:userId — Get the latest action plan
router.get('/action-plan/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const plan = await getLatestActionPlan(userId);

    if (!plan) {
      res.status(404).json({ error: 'No action plan found. Generate one first.' });
      return;
    }

    res.json(plan);
  } catch (err) {
    console.error('GET /api/action-plan/:userId error:', err);
    res.status(500).json({ error: 'Failed to fetch action plan' });
  }
});

export default router;
