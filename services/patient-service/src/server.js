import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';

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

// Patient Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Patient Service' });
});

app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
  console.log(`Patient Service listening on port ${PORT}`);
});
