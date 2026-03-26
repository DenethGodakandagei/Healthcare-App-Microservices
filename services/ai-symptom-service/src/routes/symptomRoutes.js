import express from "express";
import * as symptomController from "../controllers/symptomController.js";

const router = express.Router();

/**
 * @route   POST /api/ai/check
 * @desc    Check symptoms using AI
 * @access  Public Output or Private
 */
router.post("/check", symptomController.checkSymptoms);

export default router;
