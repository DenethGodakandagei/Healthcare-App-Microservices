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
export const sendLoginEmail = async (email, username, userId = null, role = null) => {
    // Safety check to debug the "undefined" error
    if (!transporter) {
        console.error("Transporter failed to initialize. Check your .env file.");
        return;
    }

    const mailOptions = {
        from: `"MEDSTAR Healthcare Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Security Alert: New Login Detected",
        html: `
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Security Notification</title>
            </head>
            <body style="margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4;">

            <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                
                <div style="background: #0d6efd; padding: 30px 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 21px;">MEDSTAR Healthcare Portal</h2>
                <p style="color: #dfe9ff; margin: 8px 0 0; font-size: 16px; letter-spacing: 0.5px;">Security Notification</p>
                </div>

                <div style="padding: 30px 25px;">
                <p style="font-size: 16px; color: #333333; margin-top: 0;">
                    Hello <strong>${username}</strong>,
                </p>

                <p style="font-size: 15px; color: #555555; line-height: 1.5;">
                    We detected a new login to your account. Here are the details:
                </p>

                <div style="background: #f1f5ff; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e9ff;">
                    <p style="margin: 0 0 10px 0; color: #444;"><strong>Date &amp; Time:</strong> ${new Date().toLocaleString()}</p>
                    <p style="margin: 0 0 10px 0; color: #444;"><strong>Device:</strong> Windows Device</p>
                    <p style="margin: 0; color: #444;"><strong>Location:</strong> Malabe, Sri Lanka.</p>
                </div>

                <p style="font-size: 15px; color: #555555;">
                    If this was you, no further action is required.
                </p>

                <p style="font-size: 15px; color: #d9534f; font-weight: 500;">
                    If you did <strong>not</strong> recognize this activity, please secure your account immediately.
                </p>

                <div style="text-align: center; margin: 35px 0;">
                    <a href="#" style="background: #dc3545; color: #ffffff; padding: 14px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Reset Your Password
                    </a>
                </div>

                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 25px 0;">

                <p style="font-size: 13px; color: #888888; font-style: italic; text-align: center;">
                    For your safety, never share your login credentials or OTP with anyone.
                </p>
                </div>

                <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} MEDSTAR Healthcare Portal</p>
                <p style="margin: 6px 0 0;">This is an automated message, please do not reply.</p>
                </div>

            </div>
            </body>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Login notification sent to: ${email}`);
    } catch (error) {
        console.error("Nodemailer Error during sendLoginEmail:", error.message);
    }

    // Also persist a notification record so it appears in the dashboard
    if (userId) {
        try {
            const notification = new Notification({
                senderId: "system",
                receiverId: String(userId),
                role: role || "patient",
                message: `New Login Detected: A login was recorded for your account on ${new Date().toLocaleString()}. If this wasn't you, please reset your password immediately.`,
                type: "security",
                status: "PENDING"
            });
            await notification.save();
        } catch (dbError) {
            console.error("Failed to save login notification to DB:", dbError.message);
        }
    }
};

/**
 * Controller wrapper for login alerts to be called via API
 */
export const loginAlert = async (req, res) => {
    try {
        const { email, username, userId, role } = req.body;

        // Pass everything to the utility function
        await sendLoginEmail(email, username, userId, role);

        res.status(200).json({ success: true, message: "Login alert processed" });
    } catch (error) {
        console.error("loginAlert Controller Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
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
                subject: "New Message from MEDSTAR Healthcare Portal",
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
        console.error("sendNotification Error:", error.message);
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