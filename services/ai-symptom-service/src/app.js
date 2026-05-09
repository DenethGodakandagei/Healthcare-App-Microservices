import express from "express";
import cors from "cors";
import symptomRoutes from "./routes/symptomRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai/symptoms", symptomRoutes);

app.get("/", (req, res) => {
  res.send("AI Symptom Checker Service Running");
});

export default app;