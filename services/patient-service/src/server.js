const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Patient Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Patient Service' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Patient Service listening on port ${PORT}`);
});
