const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Telemedicine Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Telemedicine Service' });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Telemedicine Service listening on port ${PORT}`);
});
