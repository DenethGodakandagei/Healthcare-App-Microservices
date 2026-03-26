import transporter from "../config/mail.js";
import smsClient from "../config/sms.js";

export const sendEmail = async (to, subject, text) => {
    return transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text
    });
};

export const sendSMS = async (to, message) => {
    return smsClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to
    });
};