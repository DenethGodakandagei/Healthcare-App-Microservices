import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`AI Symptom Server running on port ${PORT}`);
});