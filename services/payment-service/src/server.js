const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Payment Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Payment Service' });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Payment Service listening on port ${PORT}`);
});
