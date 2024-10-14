import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Replace with your Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Replace with your Twilio Auth Token
const serviceSid = process.env.TWILIO_SERVICE_SID; // Replace with your Twilio Verify Service SID

const client = new Twilio(accountSid, authToken);

export async function handler(event, context) {
    const { phoneNumber, code } = JSON.parse(event.body);

    // Ensure phone number is in E.164 format
    const e164PhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
        const verificationCheck = await client.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: e164PhoneNumber, code: code });

        return {
            statusCode: 200,
            body: JSON.stringify(verificationCheck),
        };
    } catch (error) {
        console.error('Error verifying code:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}