import { Router, type Request, type Response } from 'express';
import { getJournalEntries } from '../services/supabase.service.js';
import type { BurnoutLevel } from '../types/index.js';

const router = Router();

// GET /api/burnout/:userId — Get current burnout risk level
router.get('/burnout/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const entries = await getJournalEntries(userId);

    if (entries.length === 0) {
      res.json({
        burnoutRisk: 'Low' as BurnoutLevel,
        recentStressAvg: 0,
        recentAnxietyAvg: 0,
        entryCount: 0,
        recommendation: 'Start journaling to track your mental wellness!',
      });
      return;
    }

    // Use last 7 entries (or fewer if not enough)
    const recent = entries.slice(0, 7);

    const avgStress = recent.reduce((s, e) => s + e.stress_level, 0) / recent.length;
    const avgAnxiety = recent.reduce((s, e) => s + e.anxiety_level, 0) / recent.length;
    const avgMotivation = recent.reduce((s, e) => s + e.motivation_score, 0) / recent.length;

    // Calculate burnout risk from averages
    let burnoutRisk: BurnoutLevel = 'Low';
    const burnoutScore = avgStress * 0.4 + avgAnxiety * 0.3 + (10 - avgMotivation) * 0.3;

    if (burnoutScore >= 7) {
      burnoutRisk = 'High';
    } else if (burnoutScore >= 4) {
      burnoutRisk = 'Medium';
    }

    const recommendations: Record<BurnoutLevel, string> = {
      Low: "You're managing well! Keep up your healthy routines and self-care practices.",
      Medium:
        "You're showing some signs of strain. Consider taking breaks more frequently and adding a relaxation routine.",
      High: "Your stress indicators are elevated. Please prioritize rest, talk to someone you trust, and consider reducing your study load temporarily.",
    };

    res.json({
      burnoutRisk,
      recentStressAvg: Math.round(avgStress * 10) / 10,
      recentAnxietyAvg: Math.round(avgAnxiety * 10) / 10,
      recentMotivationAvg: Math.round(avgMotivation * 10) / 10,
      entryCount: recent.length,
      recommendation: recommendations[burnoutRisk],
    });
  } catch (err) {
    console.error('GET /api/burnout/:userId error:', err);
    res.status(500).json({ error: 'Failed to calculate burnout risk' });
  }
});

export default router;
