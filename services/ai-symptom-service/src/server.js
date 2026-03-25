import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received at ${req.url}`);
  next();
});

// AI Symptom Checker Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'AI Symptom Checker Service' });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`AI Symptom Checker Service listening on port ${PORT}`);
});
