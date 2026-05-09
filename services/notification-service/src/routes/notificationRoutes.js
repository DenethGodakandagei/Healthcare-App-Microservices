import express from "express";
import {
    sendNotification,
    getNotifications,
    loginAlert,
    appointmentAlert,
    updateNotificationStatus,
    deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

// Send a new notification
router.post("/send", sendNotification);

// Login alert - Called internally by identity-service
router.post("/login-alert", loginAlert);

// Appointment alert - Called internally by appointment-service
router.post("/appointment-alert", appointmentAlert);

// Get all notifications for a specific user (doctor/patient)
router.get("/:receiverId", getNotifications);

// Update notification status
router.put("/:notificationId/status", updateNotificationStatus);

// Delete a notification
router.delete("/:notificationId", deleteNotification);

export default router;