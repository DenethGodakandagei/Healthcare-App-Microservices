import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from "./app.js";
import connectDB from "./config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Ensure path is correct relative to this file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debugging: verify key is loaded
console.log('AI Service: GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'YES (Starts with: ' + process.env.GEMINI_API_KEY.substring(0, 5) + '...)' : 'NO');

connectDB();

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`AI Symptom Server running on port ${PORT}`);
});