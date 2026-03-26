import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from "./routes/symptomRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/ai", routes);

app.listen(5003, () => {
  console.log("AI Symptom Checker running on port 5003");
});