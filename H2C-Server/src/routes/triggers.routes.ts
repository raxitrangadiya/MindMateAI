import { Router, type Request, type Response } from 'express';
import { getJournalEntries } from '../services/supabase.service.js';

const router = Router();

// GET /api/triggers/:userId — Get aggregated stress triggers with counts
router.get('/triggers/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const entries = await getJournalEntries(userId);

    const triggerCounts = new Map<string, number>();
    for (const entry of entries) {
      for (const trigger of entry.triggers) {
        const normalized = trigger.toLowerCase().trim();
        if (normalized) {
          triggerCounts.set(normalized, (triggerCounts.get(normalized) || 0) + 1);
        }
      }
    }

    const triggers = Array.from(triggerCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      triggers,
      totalEntries: entries.length,
    });
  } catch (err) {
    console.error('GET /api/triggers/:userId error:', err);
    res.status(500).json({ error: 'Failed to fetch triggers' });
  }
});

export default router;
