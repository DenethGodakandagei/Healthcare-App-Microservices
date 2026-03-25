import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import 'dotenv/config';

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received at ${req.url}`);
  next();
});

// Doctor Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Doctor Service' });
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Doctor Service listening on port ${PORT}`);
});
