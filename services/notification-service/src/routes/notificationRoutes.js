import express from "express";
import {
    sendNotification,
    getNotifications
} from "../controllers/notificationController.js";

const router = express.Router();

// Send a new notification
router.post("/send", sendNotification);

// Get all notifications for a specific user (doctor/patient)
router.get("/:receiverId", getNotifications);

export default router;