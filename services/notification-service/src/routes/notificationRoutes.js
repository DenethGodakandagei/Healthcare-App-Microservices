import express from "express";
import {
    sendNotification,
    getNotifications,
    loginAlert,
    updateNotificationStatus
} from "../controllers/notificationController.js";

const router = express.Router();

// Send a new notification
router.post("/send", sendNotification);

// Login alert - Called internally by identity-service
router.post("/login-alert", loginAlert);

// Get all notifications for a specific user (doctor/patient)
router.get("/:receiverId", getNotifications);

// Update notification status
router.put("/:notificationId/status", updateNotificationStatus);


export default router;