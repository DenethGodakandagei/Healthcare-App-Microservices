import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import 'dotenv/config';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
app.use(cors());

// Proxy requests to underlying microservices
// Public routes
app.use('/api/auth', createProxyMiddleware({ 
  target: (process.env.IDENTITY_SERVICE_URL || 'http://localhost:4004') + '/api/auth', 
  changeOrigin: true 
}));

// Protected routes (apply authMiddleware to all routes below)
app.use(authMiddleware);

app.use('/api/ai', createProxyMiddleware({ target: (process.env.AI_SYMPTOM_SERVICE_URL || 'http://localhost:4001') + '/api/ai', changeOrigin: true }));
app.use('/api/appointments', createProxyMiddleware({ target: (process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:4002') + '/api/appointments', changeOrigin: true }));
app.use('/api/doctors', createProxyMiddleware({ target: (process.env.DOCTOR_SERVICE_URL || 'http://localhost:4003') + '/api/doctors', changeOrigin: true }));
app.use('/api/notifications', createProxyMiddleware({ target: (process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4005') + '/api/notifications', changeOrigin: true }));
app.use('/api/patients', createProxyMiddleware({ target: (process.env.PATIENT_SERVICE_URL || 'http://localhost:4006') + '/api/patients', changeOrigin: true }));
app.use('/api/payments', createProxyMiddleware({ target: (process.env.PAYMENT_SERVICE_URL || 'http://localhost:4007') + '/api/payments', changeOrigin: true }));
app.use('/api/telemedicine', createProxyMiddleware({ target: (process.env.TELEMEDICINE_SERVICE_URL || 'http://localhost:4008') + '/api/telemedicine', changeOrigin: true }));

app.get('/health', (req, res) => res.status(200).send('API Gateway is active.'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Gateway listening on port ${PORT}`));
