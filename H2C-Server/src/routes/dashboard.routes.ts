import { Router, type Request, type Response } from 'express';
import { getDashboardData } from '../services/supabase.service.js';

const router = Router();

// GET /api/dashboard/:userId — Get aggregated dashboard data
router.get('/dashboard/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const data = await getDashboardData(userId);
    res.json(data);
  } catch (err) {
    console.error('GET /api/dashboard/:userId error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
