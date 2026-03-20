const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Appointment Service health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Appointment Service' });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Appointment Service listening on port ${PORT}`);
});
