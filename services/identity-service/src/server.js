import dotenv from 'dotenv';
dotenv.config();

console.log('Identity Service MONGO_URI loaded:', process.env.MONGO_URI ? 'YES' : 'NO');

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

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

// Auth routes
app.use('/api/auth', authRoutes);

// Identity Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Identity Service' });
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Identity Service listening on port ${PORT}`);
});
