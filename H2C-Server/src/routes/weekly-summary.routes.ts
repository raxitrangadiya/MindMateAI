import { Router, type Request, type Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getJournalEntries,
  getWeeklySummary,
  createWeeklySummary,
} from '../services/supabase.service.js';
import type { WeeklySummary, BurnoutLevel } from '../types/index.js';

const router = Router();

// GET /api/weekly-summary/:userId — Get or generate weekly summary
router.get('/weekly-summary/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;

    // Check for existing recent summary
    const existing = await getWeeklySummary(userId);
    if (existing) {
      const summaryDate = new Date(existing.created_at);
      const now = new Date();
      const diffDays = (now.getTime() - summaryDate.getTime()) / (1000 * 60 * 60 * 24);

      // Return existing if less than 7 days old
      if (diffDays < 7) {
        res.json(existing);
        return;
      }
    }

    // Generate new weekly summary from journal entries
    const entries = await getJournalEntries(userId);

    if (entries.length === 0) {
      res.status(404).json({
        error: 'No journal entries found. Start journaling to get a weekly summary.',
      });
      return;
    }

    // Get entries from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekEntries = entries.filter((e) => new Date(e.created_at) >= oneWeekAgo);

    const entriesToAnalyze = weekEntries.length > 0 ? weekEntries : entries.slice(0, 7);

    const avgStress =
      entriesToAnalyze.reduce((s, e) => s + e.stress_level, 0) / entriesToAnalyze.length;
    const avgAnxiety =
      entriesToAnalyze.reduce((s, e) => s + e.anxiety_level, 0) / entriesToAnalyze.length;
    const avgMotivation =
      entriesToAnalyze.reduce((s, e) => s + e.motivation_score, 0) / entriesToAnalyze.length;

    // Determine burnout trend
    const burnoutScore = avgStress * 0.4 + avgAnxiety * 0.3 + (10 - avgMotivation) * 0.3;
    let burnoutTrend: BurnoutLevel = 'Low';
    if (burnoutScore >= 7) burnoutTrend = 'High';
    else if (burnoutScore >= 4) burnoutTrend = 'Medium';

    // Aggregate triggers
    const triggerCounts = new Map<string, number>();
    for (const entry of entriesToAnalyze) {
      for (const t of entry.triggers) {
        triggerCounts.set(t, (triggerCounts.get(t) || 0) + 1);
      }
    }
    const topTriggers = Array.from(triggerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    // Generate AI summary text
    const emotions = entriesToAnalyze.map((e) => e.emotion);
    const uniqueEmotions = [...new Set(emotions)];
    const aiSummary = `This week you wrote ${entriesToAnalyze.length} journal entries. Your predominant emotions were ${uniqueEmotions.join(', ')}. Your average stress level was ${avgStress.toFixed(1)}/10 and motivation was ${avgMotivation.toFixed(1)}/10. ${
      burnoutTrend === 'High'
        ? 'Your burnout risk is elevated — please prioritize self-care and rest.'
        : burnoutTrend === 'Medium'
          ? 'You are showing moderate stress — consider adding more breaks to your routine.'
          : "You're managing your wellness well — keep up the great work!"
    }${topTriggers.length > 0 ? ` Key stress triggers to watch: ${topTriggers.join(', ')}.` : ''}`;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const summary: WeeklySummary = {
      id: uuidv4(),
      user_id: userId,
      week_start: weekStart.toISOString().slice(0, 10),
      avg_stress: Math.round(avgStress * 10) / 10,
      avg_anxiety: Math.round(avgAnxiety * 10) / 10,
      avg_motivation: Math.round(avgMotivation * 10) / 10,
      burnout_trend: burnoutTrend,
      top_triggers: topTriggers,
      ai_summary: aiSummary,
      created_at: new Date().toISOString(),
    };

    const saved = await createWeeklySummary(summary);
    res.json(saved);
  } catch (err) {
    console.error('GET /api/weekly-summary/:userId error:', err);
    res.status(500).json({ error: 'Failed to generate weekly summary' });
  }
});

export default router;
