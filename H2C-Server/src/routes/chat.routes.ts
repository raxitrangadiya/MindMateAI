import { Router, type Request, type Response } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { validateChat } from '../middleware/validator.js';
import { sanitizeInputs } from '../middleware/sanitizer.js';
import { promptGuard } from '../middleware/promptGuard.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import { getUser, createChatMessage, getChatMessages } from '../services/supabase.service.js';
import { chatWithCoach } from '../services/gemini.service.js';
import type { ChatMessage } from '../types/index.js';

const router = Router();

// POST /api/chat — Send a chat message and get AI response
router.post(
  '/chat',
  chatLimiter,
  sanitizeInputs,
  promptGuard,
  validateChat,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { userId, message, sessionId } = req.body as {
        userId: string;
        message: string;
        sessionId: string;
      };

      // Verify user exists
      const user = await getUser(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Store user message
      const userMsg: ChatMessage = {
        id: uuidv4(),
        user_id: userId,
        session_id: sessionId,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };
      await createChatMessage(userMsg);

      // Fetch recent chat history for context
      const history = await getChatMessages(userId, sessionId);
      const recentHistory = history.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Get AI response
      const aiResponse = await chatWithCoach(recentHistory, user.exam_type);

      // Store AI response
      const assistantMsg: ChatMessage = {
        id: uuidv4(),
        user_id: userId,
        session_id: sessionId,
        role: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString(),
      };
      await createChatMessage(assistantMsg);

      res.json({
        message: assistantMsg,
      });
    } catch (err) {
      console.error('POST /api/chat error:', err);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  },
);

// GET /api/chat/:userId/:sessionId — Get chat history
router.get('/chat/:userId/:sessionId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const sessionId = req.params.sessionId as string;
    const messages = await getChatMessages(userId, sessionId);
    res.json(messages);
  } catch (err) {
    console.error('GET /api/chat/:userId/:sessionId error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

export default router;
