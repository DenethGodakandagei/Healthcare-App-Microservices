import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// 1. Initialize transporter at the top level
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

/**
 * Helper function to send Login Alerts
 */
export const sendLoginEmail = async (email, username) => {
    // Safety check to debug the "undefined" error
    if (!transporter) {
        console.error("❌ Critical: Transporter failed to initialize. Check your .env file.");
        return;
    }

    const mailOptions = {
        from: `"Healthcare Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Security Alert: New Login Detected",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #2c3e50; text-align: center;">New Login Detected</h2>
                <p>Hello <strong>${username}</strong>,</p>
                <p>Your account was successfully logged into on <strong>${new Date().toLocaleString()}</strong>.</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                    <p style="margin: 0;">If this was you, you can safely ignore this message.</p>
                </div>
                <p>If you did <strong>not</strong> perform this action, please change your password immediately.</p>
                <br>
                <p>Best regards,<br>Healthcare Portal Security Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Login notification sent to: ${email}`);
    } catch (error) {
        console.error("❌ Nodemailer Error during sendLoginEmail:", error.message);
    }
};

/**
 * General Notification function
 */
export const sendNotification = async (req, res) => {
    try {
        const { receiverId, message, type, senderId, role } = req.body;

        // Save to DB first
        const notification = new Notification({
            senderId,
            receiverId,
            role,
            message,
            type,
            status: "sent"
        });
        await notification.save();

        if (type === "email") {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: receiverId,
                subject: "New Message from Healthcare Portal",
                text: message,
                html: `<p>${message}</p>`
            });
        }

        if (type === "sms") {
            const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: receiverId
            });
        }

        res.status(200).json({ success: true, message: "Notification sent", notification });
    } catch (error) {
        console.error("❌ sendNotification Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const notifications = await Notification.find({ receiverId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};