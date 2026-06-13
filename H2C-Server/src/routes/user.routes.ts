import { Router, type Request, type Response } from 'express';
import { validationResult } from 'express-validator';
import { validateUser } from '../middleware/validator.js';
import { sanitizeInputs } from '../middleware/sanitizer.js';
import { createUser, getUser } from '../services/supabase.service.js';
import type { ExamType } from '../types/index.js';

const router = Router();

// POST /api/user — Create a new user
router.post('/user', sanitizeInputs, validateUser, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, examType } = req.body as { name: string; examType: ExamType };
    const user = await createUser(name, examType);
    res.status(201).json(user);
  } catch (err) {
    console.error('POST /api/user error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/user/:userId — Get user by ID
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const user = await getUser(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error('GET /api/user/:userId error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
