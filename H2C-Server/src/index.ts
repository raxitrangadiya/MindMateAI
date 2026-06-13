import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import journalRoutes from './routes/journal.routes.js';
import chatRoutes from './routes/chat.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import burnoutRoutes from './routes/burnout.routes.js';
import triggersRoutes from './routes/triggers.routes.js';
import actionPlanRoutes from './routes/action-plan.routes.js';
import weeklySummaryRoutes from './routes/weekly-summary.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientUrl }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', journalRoutes);
app.use('/api', chatRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', burnoutRoutes);
app.use('/api', triggersRoutes);
app.use('/api', actionPlanRoutes);
app.use('/api', weeklySummaryRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(config.port, () => {
  console.log(`MindMate API running on port ${config.port}`);
});

export default app;
