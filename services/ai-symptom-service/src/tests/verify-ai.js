import { analyzeSymptoms } from '../services/aiService.js';
import 'dotenv/config';

const testSymptoms = "I have a severe headache and nausea.";

async function runTest() {
    console.log("Testing AI Symptom Analysis...");
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("Error: GEMINI_API_KEY not found in environment.");
            return;
        }
        const result = await analyzeSymptoms(testSymptoms);
        console.log("Analysis Result:");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

runTest();
