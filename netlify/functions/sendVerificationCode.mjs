import { Twilio } from 'twilio';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = new Twilio(accountSid, authToken);

export async function handler(event, context) {
    const { phoneNumber } = JSON.parse(event.body);

    // Ensure phone number is in E.164 format
    const parsedNumber = parsePhoneNumberFromString(phoneNumber);
    const e164PhoneNumber = parsedNumber ? parsedNumber.format('E.164') : phoneNumber;

    try {
        console.log('Sending verification code to:', e164PhoneNumber);
        const verification = await client.verify.v2.services(serviceSid)
            .verifications
            .create({ to: e164PhoneNumber, channel: 'sms' });

        console.log('Verification response:', verification);
        return {
            statusCode: 200,
            body: JSON.stringify(verification),
        };
    } catch (error) {
        console.error('Error sending verification code:', error);
        console.error('Error details:', error.details);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}