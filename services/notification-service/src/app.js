import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received at ${req.url}`);
  next();
});

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`Notification Service listening on port ${PORT}`);
});
