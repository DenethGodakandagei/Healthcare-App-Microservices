import express from "express";
import * as notificationController from "../controllers/notificationController.js";

const router = express.Router();

/**
 * @route   POST /api/notifications/send
 * @desc    Send email/SMS notification
 * @access  Private (should be protected via API Gateway / JWT)
 */
router.post("/send", notificationController.sendNotification);

export default router;