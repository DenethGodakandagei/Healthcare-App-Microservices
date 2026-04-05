import * as aiService from "../services/aiService.js";

export const checkSymptoms = async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms) {
        return res.status(400).json({ error: "Symptoms are required." });
    }

    try {
        const analysis = await aiService.analyzeSymptoms(symptoms);

        res.json({
            symptoms,
            ...analysis
        });
    } catch (err) {
        console.error("Analysis Error:", err);
        res.status(500).json({ error: err.message });
    }
};