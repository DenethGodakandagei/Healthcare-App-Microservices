import twilio from "twilio";

// It's good practice to ensure these are defined
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;

const client = twilio(accountSid, authToken);

export default client;