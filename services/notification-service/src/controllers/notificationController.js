import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   VALIDATION (ENV CHECK)
========================= */
if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error("Missing EMAIL credentials in .env");
}

if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn("Twilio credentials missing - SMS will not work");
}

/* =========================
   EMAIL TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

/* =========================
   TWILIO CLIENT (INIT ONCE)
========================= */
const twilioClient = process.env.TWILIO_SID
    ? twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

/* =========================
   LOGIN EMAIL FUNCTION
========================= */
export const sendLoginEmail = async (email, username, userId = null, role = null) => {
    const mailOptions = {
        from: `"MEDSTAR Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Security Notice: New Login Detected on Your Account",
        html: `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px; color: #333333; margin: 0;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            
            <h2 style="color: #0d6efd; border-bottom: 2px solid #0d6efd; padding-bottom: 10px; margin-top: 0; font-size: 24px;">
                Security Notice
            </h2>
            
            <p style="font-size: 16px;">Dear <b>${username}</b>,</p>
            
            <p style="font-size: 16px; line-height: 1.6;">
                Please be advised that a new login to your MEDSTAR Healthcare Portal account was recently detected.
            </p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0d6efd; margin: 25px 0;">
                <p style="margin: 0; font-size: 15px; color: #555555;">
                    <b>Date and Time:</b> ${new Date().toLocaleString()}
                </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">
                If you authorized this login, no further action is required on your part.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
                However, if you do not recognize this activity, we strongly urge you to secure your account immediately by resetting your password to protect your personal health information.
            </p>
            
            <br>
            
            <p style="font-size: 16px; margin-bottom: 5px;">Sincerely,</p>
            <p style="font-size: 16px; font-weight: bold; margin-top: 0; color: #0d6efd;">
                The MEDSTAR Security Team
            </p>
            
            <hr style="border: none; border-top: 1px solid #eeeeee; margin-top: 40px; margin-bottom: 20px;">
            <p style="font-size: 12px; color: #888888; text-align: center; line-height: 1.4;">
                This is an automated security alert. Please do not reply directly to this email. <br>
                If you require assistance, please contact MEDSTAR Customer Support.
            </p>
            
        </div>
    </body>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Login notification sent to: ${email}`);
    } catch (error) {
        console.error("Email Error:", error.message);
    }

    if (userId) {
        try {
            await Notification.create({
                senderId: "system",
                receiverId: String(userId),
                role: role || "patient",
                message: `New login detected on Windows device at ${new Date().toLocaleString()}. If this wasn't you, reset your password immediately.`,
                type: "security",
                status: "PENDING"
            });
        } catch (err) {
            console.error("DB Error:", err.message);
        }
    }
};

/* =========================
   LOGIN CONTROLLER
========================= */
export const loginAlert = async (req, res) => {
    try {
        const { email, username, userId, role } = req.body;

        await sendLoginEmail(email, username, userId, role);

        res.status(200).json({
            success: true,
            message: "Login alert processed"
        });
    } catch (error) {
        console.error("loginAlert Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

/* =========================
   APPOINTMENT EMAIL FUNCTION
========================= */
export const sendAppointmentEmail = async (email, patientName, appointmentDetails) => {
    if (!appointmentDetails) {
        throw new Error("appointmentDetails is required");
    }

    const { appointmentNumber, date, startTime, appointmentType, doctorName, doctorId, patientId } = appointmentDetails;

    const mailOptions = {
        from: `"MEDSTAR Healthcare Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Appointment Confirmed - ${appointmentNumber}`,
        html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f7fa;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f7fa; padding: 40px 0;">
            <tr>
                <td align="center">
                    <!-- Main Container -->
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #198754, #146c43); padding: 30px 40px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Appointment Confirmed</h1>
                                <p style="color: #e0f2e9; margin: 8px 0 0 0; font-size: 16px;">MEDSTAR Healthcare Portal</p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px 40px 30px;">
                                <p style="font-size: 18px; color: #333333; margin: 0 0 20px 0;">
                                    Hello <strong>${patientName}</strong>,
                                </p>
                                
                                <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                                    Great news! Your appointment has been successfully booked. Here are the details:
                                </p>

                                <!-- Appointment Details Card -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f9fa; border-radius: 10px; padding: 25px; margin: 25px 0;">
                                    <tr>
                                        <td>
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="8">
                                                <tr>
                                                    <td style="font-weight: bold; color: #198754; width: 140px; vertical-align: top;">Appointment No:</td>
                                                    <td style="color: #333333;">${appointmentNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-weight: bold; color: #198754; vertical-align: top;">Doctor:</td>
                                                    <td style="color: #333333;">${doctorName || 'Not specified'}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-weight: bold; color: #198754; vertical-align: top;">Date:</td>
                                                    <td style="color: #333333;">${new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-weight: bold; color: #198754; vertical-align: top;">Time:</td>
                                                    <td style="color: #333333;">${startTime}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-weight: bold; color: #198754; vertical-align: top;">Appointment Type:</td>
                                                    <td style="color: #333333;">${appointmentType}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <p style="font-size: 16px; line-height: 1.6; color: #555555;">
                                    Please arrive 10-15 minutes early. If you need to reschedule or cancel, please do so at least 24 hours in advance through the MEDSTAR Healthcare Portal.
                                </p>

                                <!-- Action Buttons -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="${process.env.FRONTEND_URL}/appointments/${appointmentNumber}" 
                                               style="background-color: #198754; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                                View Appointment Details
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">

                                <!-- Important Notes -->
                                <p style="font-size: 15px; color: #666666; line-height: 1.5;">
                                    <strong>What to bring:</strong><br>
                                    • Valid ID<br>
                                    • Insurance card (if applicable)<br>
                                    • List of current medications
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;">
                                    Thank you for choosing <strong>MEDSTAR Healthcare</strong>
                                </p>
                                <p style="margin: 0; color: #999999; font-size: 13px;">
                                    If you have any questions, contact us at 
                                    <a href="mailto:support@medstar.com" style="color: #198754; text-decoration: none;">support@medstar.com</a>
                                </p>
                                <p style="margin: 15px 0 0 0; color: #aaaaaa; font-size: 12px;">
                                    © 2026 MEDSTAR Healthcare Portal. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Appointment notification sent to: ${email}`);
    } catch (error) {
        console.error("Email Error:", error.message);
    }

    if (patientId) {
        try {
            await Notification.create({
                senderId: "system",
                receiverId: String(patientId),
                role: "patient",
                message: `🎉 Your appointment ${appointmentNumber} has been successfully booked with ${doctorName || 'your doctor'} on ${new Date(date).toLocaleDateString()} at ${startTime}.
                Please make sure to arrive at least 10-15 minutes early. Don't forget to bring your ID, insurance card (if applicable), and a list of any current medications.`,
                type: "appointment",
                status: "PENDING"
            });
        } catch (err) {
            console.error("DB Error (Patient Notification):", err.message);
        }
    }

    // Also notify the doctor
    if (doctorId) {
        try {
            await Notification.create({
                senderId: "system",
                receiverId: String(doctorId),
                role: "doctor",
                message: `New appointment ${appointmentNumber}: ${patientName} on ${new Date(date).toLocaleDateString()} at ${startTime} (${appointmentType})`,
                type: "appointment",
                status: "PENDING"
            });
        } catch (err) {
            console.error("DB Error (Doctor Notification):", err.message);
        }
    }
};

/* =========================
   APPOINTMENT CONTROLLER
========================= */
export const appointmentAlert = async (req, res) => {
    try {
        const { email, patientName, ...appointmentDetails } = req.body;

        await sendAppointmentEmail(email, patientName, appointmentDetails);

        res.status(200).json({
            success: true,
            message: "Appointment alert processed"
        });
    } catch (error) {
        console.error("appointmentAlert Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

/* =========================
   GENERAL NOTIFICATION
========================= */
export const sendNotification = async (req, res) => {
    try {
        const { receiverId, receiverEmail, message, type, senderId, role } = req.body;

        const notification = await Notification.create({
            senderId,
            receiverId,
            role,
            message,
            type,
            status: "SENT"
        });

        /* EMAIL */
        if (type === "email" && receiverEmail) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: receiverEmail,
                subject: "New Message",
                html: `<p>${message}</p>`
            });
        }

        /* SMS */
        if (type === "sms" && twilioClient) {
            await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: receiverId
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification sent",
            notification
        });
    } catch (error) {
        console.error("sendNotification Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

/* =========================
   GET NOTIFICATIONS
========================= */
export const getNotifications = async (req, res) => {
    try {
        const { receiverId } = req.params;

        const notifications = await Notification.find({ receiverId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/* =========================
   UPDATE STATUS
========================= */
export const updateNotificationStatus = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { status } = req.body;

        const allowed = ["PENDING", "SENT", "FAILED", "SEEN"];

        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { status },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/* =========================
   DELETE NOTIFICATION
========================= */
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};