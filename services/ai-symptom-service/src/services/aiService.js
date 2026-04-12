import axios from "axios";

export const analyzeSymptoms = async (symptoms) => {
    const isMock = process.env.USE_MOCK_AI === "true" || process.env.USE_MOCK_AI === true;
    if (isMock) {
        console.log("Mock AI Mode: Returning simulated response.");
        return `Based on your symptoms (${symptoms}), our AI suggests:
1. Possible Condition: Mild viral infection or seasonal fatigue.
2. Recommended Specialty: General Practitioner or Internal Medicine.
This is a simulated response because the AI service is in mock mode. Please consult a doctor for a professional diagnosis.`;
    }
    console.log("OpenAI API Key starts with:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) : "MISSING");
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a medical assistant. Based on symptoms, suggest possible conditions and recommended doctor specialties. Do NOT give final diagnosis.",
                    },
                    {
                        role: "user",
                        content: `Symptoms: ${symptoms}`,
                    },
                ],
                temperature: 0.3,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const result = response.data.choices[0].message.content;

        return result;
    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.error("AI Error:", errorMsg);
        throw new Error(errorMsg);
    }
};