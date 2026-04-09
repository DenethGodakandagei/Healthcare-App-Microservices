import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import 'dotenv/config';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
app.use(cors());

app.get('/health', (req, res) => res.status(200).send('API Gateway is active.'));

// Public routes (no auth required)
app.use('/api/auth', createProxyMiddleware({
  target: (process.env.IDENTITY_SERVICE_URL || 'http://localhost:4004') + '/api/auth',
  changeOrigin: true
}));

// Public GET /api/doctors (list and detail)
app.use('/api/doctors', (req, res, next) => {
  if (req.method === 'GET' && (req.path === '/' || (req.path !== '/profile' && req.path.length > 1))) {
    return createProxyMiddleware({
      target: (process.env.DOCTOR_SERVICE_URL || 'http://localhost:4003') + '/api/doctors',
      changeOrigin: true
    })(req, res, next);
  }
  next();
});

// Public GET /api/appointments/sessions
app.use('/api/appointments/sessions', (req, res, next) => {
  if (req.method === 'GET') {
    return createProxyMiddleware({
      target: (process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:4002') + '/api/appointments/sessions',
      changeOrigin: true
    })(req, res, next);
  }
  next();
});

// Apply authentication middleware to all protected routes below
app.use(authMiddleware);

// Protected routes with proper path rewriting for chat & message
app.use('/api/ai', createProxyMiddleware({
  target: (process.env.AI_SYMPTOM_SERVICE_URL || 'http://localhost:4001') + '/api/ai',
  changeOrigin: true
}));

app.use('/api/appointments', createProxyMiddleware({
  target: (process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:4002') + '/api/appointments',
  changeOrigin: true
}));

app.use('/api/doctors', createProxyMiddleware({
  target: (process.env.DOCTOR_SERVICE_URL || 'http://localhost:4003') + '/api/doctors',
  changeOrigin: true
}));

app.use('/api/patients', createProxyMiddleware({
  target: (process.env.PATIENT_SERVICE_URL || 'http://localhost:4006') + '/api/patients',
  changeOrigin: true
}));

app.use('/api/payments', createProxyMiddleware({
  target: (process.env.PAYMENT_SERVICE_URL || 'http://localhost:4007') + '/api/payments',
  changeOrigin: true
}));

app.use('/api/telemedicine', createProxyMiddleware({
  target: (process.env.TELEMEDICINE_SERVICE_URL || 'http://localhost:4008') + '/api/telemedicine',
  changeOrigin: true
}));

app.use('/api/notifications', createProxyMiddleware({
  target: (process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4005') + '/api/notifications',
  changeOrigin: true
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Gateway listening on port ${PORT}`));