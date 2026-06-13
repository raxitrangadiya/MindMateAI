import { Router, type Request, type Response } from 'express';
import { validationResult } from 'express-validator';
import { validateRegister, validateLogin } from '../middleware/validator.js';
import { sanitizeInputs } from '../middleware/sanitizer.js';
import { createUser, getUserByEmail, seedDemoData } from '../services/supabase.service.js';
import { hashPassword, comparePassword, generateToken } from '../services/auth.service.js';

const router = Router();

// POST /api/auth/register — Register a new user
router.post('/register', sanitizeInputs, validateRegister, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password, examType } = req.body;
    
    const existing = await getUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: 'Email is already registered' });
      return;
    }
    
    const passwordHash = hashPassword(password);
    const user = await createUser(name, examType, email, passwordHash);
    
    const token = generateToken({ userId: user.id });
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        examType: user.exam_type,
        joinedAt: user.created_at
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login — Login an existing user
router.post('/login', sanitizeInputs, validateLogin, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    
    const user = await getUserByEmail(email);
    if (!user || !user.password_hash) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    
    const valid = comparePassword(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    
    const token = generateToken({ userId: user.id });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        examType: user.exam_type,
        joinedAt: user.created_at
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/demo — Quick login for a pre-seeded demo user
router.post('/demo', async (req: Request, res: Response) => {
  try {
    const email = 'demo@mindmate.ai';
    let user = await getUserByEmail(email);
    
    if (!user) {
      // Create the demo user if not exists
      const passwordHash = hashPassword('demopassword');
      user = await createUser('Demo Aspirant', 'JEE', email, passwordHash);
    }
    
    // Seed demo workspace data
    await seedDemoData(user.id);
    
    const token = generateToken({ userId: user.id });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        examType: user.exam_type,
        joinedAt: user.created_at
      }
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ error: 'Failed to initialize demo session' });
  }
});

export default router;
