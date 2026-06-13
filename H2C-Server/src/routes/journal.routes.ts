import { Router, type Request, type Response } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { validateJournal } from '../middleware/validator.js';
import { sanitizeInputs } from '../middleware/sanitizer.js';
import { promptGuard } from '../middleware/promptGuard.js';
import { getUser, createJournalEntry, getJournalEntries } from '../services/supabase.service.js';
import { analyzeJournal } from '../services/gemini.service.js';
import type { JournalEntry } from '../types/index.js';

const router = Router();

// POST /api/journal — Submit a journal entry for AI analysis
router.post(
  '/journal',
  sanitizeInputs,
  promptGuard,
  validateJournal,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { userId, content } = req.body as { userId: string; content: string };

      // Verify user exists
      const user = await getUser(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Analyze with Gemini
      const analysis = await analyzeJournal(content, user.exam_type);

      // Build journal entry
      const entry: JournalEntry = {
        id: uuidv4(),
        user_id: userId,
        content,
        emotion: analysis.emotion,
        stress_level: analysis.stress_level,
        anxiety_level: analysis.anxiety_level,
        burnout_risk: analysis.burnout_risk,
        motivation_score: analysis.motivation_score,
        triggers: analysis.triggers,
        sentiment: analysis.sentiment,
        emergency_detected: analysis.emergency_detected,
        created_at: new Date().toISOString(),
      };

      // Store entry
      const saved = await createJournalEntry(entry);

      res.status(201).json({
        entry: saved,
        analysis: {
          ...analysis,
        },
      });
    } catch (err) {
      console.error('POST /api/journal error:', err);
      res.status(500).json({ error: 'Failed to process journal entry' });
    }
  },
);

// GET /api/journal/:userId — Get all journal entries for a user
router.get('/journal/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const entries = await getJournalEntries(userId);
    res.json(entries);
  } catch (err) {
    console.error('GET /api/journal/:userId error:', err);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

export default router;
