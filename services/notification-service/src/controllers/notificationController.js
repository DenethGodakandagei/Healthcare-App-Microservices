import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";
import twilio from "twilio";

// Send notification (patient -> doctor or doctor -> patient)
export const sendNotification = async (req, res) => {
    try {
        const { senderId, receiverId, role, message, type } = req.body;

        // Validate required fields
        if (!senderId || !receiverId || !message || !type) {
            return res.status(400).json({
                success: false,
                message: "senderId, receiverId, message, and type are required"
            });
        }

        const notification = new Notification({
            senderId,
            receiverId,
            role,
            message,
            type,
            status: "sent"   // optional: you can add status field in model
        });

        await notification.save();

        // Send Email
        if (type === "email") {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_APP_PASSWORD
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: receiverId,           // assuming receiverId is email when type=email
                subject: "New Message from Healthcare Portal",
                text: message,
                html: `<p>${message}</p>` // better to send HTML
            });
        }

        // Send SMS
        if (type === "sms") {
            const client = twilio(
                process.env.TWILIO_SID,
                process.env.TWILIO_AUTH_TOKEN
            );

            await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,   // e.g., +1234567890
                to: receiverId                           // assuming receiverId is phone number when type=sms
            });
        }

        res.status(201).json({
            success: true,
            message: "Notification sent successfully",
            notification
        });

    } catch (error) {
        console.error("Notification Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send notification",
            error: error.message
        });
    }
};

// Get notifications for a user (doctor or patient)
export const getNotifications = async (req, res) => {
    try {
        const { receiverId } = req.params;

        const notifications = await Notification.find({
            receiverId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {
        console.error("Get Notifications Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};