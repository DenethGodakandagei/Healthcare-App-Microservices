import axios from "axios";

export const analyzeSymptoms = async (symptoms) => {
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
        console.error("AI Error:", error.response?.data || error.message);
        throw new Error("AI processing failed");
    }
};