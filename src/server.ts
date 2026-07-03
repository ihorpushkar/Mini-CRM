import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase, disconnectDatabase } from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', routes);
app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDatabase();
  app.listen(3000, () => console.log('Server on 3000'));
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export default app;
