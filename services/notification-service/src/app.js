import dotenv from "dotenv";
import express from "express";
import routes from "./routes/notificationRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());


app.use("/api/notifications", routes);

app.listen(5002, () => {
  console.log("Notification Service running on port 5002");
});