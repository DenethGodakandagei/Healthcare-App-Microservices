const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Notification Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Notification Service' });
});

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Notification Service listening on port ${PORT}`);
});
