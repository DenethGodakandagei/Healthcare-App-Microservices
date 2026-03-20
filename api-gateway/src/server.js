const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
app.use(cors());

// Proxy requests to underlying microservices
app.use('/api/patients', createProxyMiddleware({ target: 'http://patient-service:5001', changeOrigin: true }));
app.use('/api/doctors', createProxyMiddleware({ target: 'http://doctor-service:5002', changeOrigin: true }));
app.use('/api/appointments', createProxyMiddleware({ target: 'http://appointment-service:5003', changeOrigin: true }));

app.get('/health', (req, res) => res.status(200).send('API Gateway is active.'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway listening on port ${PORT}`));
