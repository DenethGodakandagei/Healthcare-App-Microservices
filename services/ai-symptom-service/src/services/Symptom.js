const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini (Ensure API Key is in your .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeSymptoms = async (symptoms, userContext = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI medical assistant. Analyze the following symptoms: "${symptoms}".
      User Context: ${JSON.stringify(userContext)}
      
      Return a JSON object with:
      1. "analysis": A brief overview of possible causes.
      2. "urgency": A scale from 1 (low) to 5 (critical).
      3. "recommendations": List of next steps (e.g., "Drink water", "See a GP").
      4. "disclaimer": A mandatory medical disclaimer.

      Return ONLY the JSON. Do not include markdown formatting or backticks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the string into a JS Object
    return JSON.parse(text.replace(/```json|```/gi, "").trim());
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error("Failed to analyze symptoms via AI.");
  }
};

module.exports = { analyzeSymptoms };