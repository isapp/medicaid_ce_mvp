import express from 'express';
import cors from 'cors';
import { config } from './shared/config';
import { logInfo, logError } from './shared/logging';
import { AppError } from './shared/errors';
import { apiRouter } from './routes/api';

const app = express();

app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1', apiRouter);

// Error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    logError('AppError', { code: err.code, message: err.message, status: err.status, details: err.details });
    return res.status(err.status).json({ data: null, error: { code: err.code, message: err.message } });
  }

  const message = err instanceof Error ? err.message : 'Unknown error';
  logError('Unhandled error', { message });
  return res.status(500).json({ data: null, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Unexpected error' } });
});

app.listen(config.port, () => {
  logInfo('Backend listening', { port: config.port });
});
