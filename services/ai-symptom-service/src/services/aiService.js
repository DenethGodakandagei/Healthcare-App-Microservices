import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeSymptoms = async (symptoms) => {
    const prompt = `
        As a medical assistant, analyze the following symptoms and provide structured feedback in JSON format.
        
        Symptoms: ${symptoms}
        
        The response MUST be a valid JSON object with the following keys:
        - "possibleConditions": A list of strings representing potential conditions.
        - "suggestions": A list of strings representing preliminary health suggestions or immediate steps.
        - "recommendedSpecialties": A list of strings representing doctor specialties to consult.
        - "disclaimer": A mandatory medical disclaimer stating this is not an official diagnosis.

        Return ONLY the JSON object.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON in case there's markdown formatting (like \`\`\`json ... \`\`\`)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to receive structured analysis from AI.");
        }
        
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Error analyzing symptoms with AI service.");
    }
};