import SymptomLog from "../models/SymptomLog.js";
import { analyzeSymptoms } from "../services/aiService.js";

export const checkSymptoms = async (req, res) => {
    console.log("AI Controller: Received request", req.body);
    try {
        const { symptoms, patientId } = req.body;

        if (!symptoms) {
            return res.status(400).json({ message: "Symptoms are required" });
        }

        console.log("Analyzing symptoms:", symptoms);
        const aiResult = await analyzeSymptoms(symptoms);
        console.log("AI Analysis Result (first 50 chars):", aiResult?.substring(0, 50));

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
        console.error("AI Controller Error:", error);
        res.status(500).json({
            message: "Error analyzing symptoms",
            error: error.message,
            stack: error.stack
        });
    }
};