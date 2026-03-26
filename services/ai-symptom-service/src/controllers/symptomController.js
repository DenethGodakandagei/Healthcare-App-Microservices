import * as aiService from "../services/aiService.js";

export const checkSymptoms = async (req, res) => {
    const { symptoms } = req.body;

    try {
        const result = await aiService.analyzeSymptoms(symptoms);

        res.json({
            symptoms,
            analysis: result
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};