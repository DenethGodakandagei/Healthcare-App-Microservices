const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// AI Symptom Checker Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'AI Symptom Checker Service' });
});

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`AI Symptom Checker Service listening on port ${PORT}`);
});
