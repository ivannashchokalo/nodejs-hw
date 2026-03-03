import express from 'express';
import 'dotenv/config';
import pino from 'pino-http';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
);

app.get('/notes', (_req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', (_req, _res, next) => {
  next(new Error('Simulated server error'));
});

app.use((_req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
