import SymptomLog from "../models/SymptomLog.js";
import { analyzeSymptoms } from "../services/aiService.js";

export const checkSymptoms = async (req, res) => {
    try {
        const { symptoms, patientId } = req.body;

        if (!symptoms) {
            return res.status(400).json({ message: "Symptoms are required" });
        }

        const aiResult = await analyzeSymptoms(symptoms);

        // Save log (optional)
        const log = await SymptomLog.create({
            patientId,
            symptoms,
            aiResponse: aiResult,
        });

        res.status(200).json({
            success: true,
            message: "Analysis completed",
            data: aiResult,
            logId: log._id,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error analyzing symptoms",
            error: error.message,
        });
    }
};