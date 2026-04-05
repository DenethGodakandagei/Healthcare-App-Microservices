import Notification from "../models/Notification.js";
import * as notificationService from "../services/notificationService.js";

export const sendNotification = async (req, res) => {
    const { email, phone, message } = req.body;

    const notification = new Notification({
        email,
        phone,
        message,
        type: email && phone ? "BOTH" : email ? "EMAIL" : "SMS"
    });

    try {
        await notification.save();

        if (email) {
            await notificationService.sendEmail(email, "Notification", message);
        }

        if (phone) {
            await notificationService.sendSMS(phone, message);
        }

        notification.status = "SENT";
        await notification.save();

        res.status(200).json(notification);
    } catch (err) {
        notification.status = "FAILED";
        notification.error = err.message;
        await notification.save();

        res.status(500).json({ error: err.message });
    }
};