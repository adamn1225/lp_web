import { handler } from './netlify/functions/refreshToken.mjs';
import dotenv from 'dotenv';

dotenv.config();

async function testHandler() {
    const event = {}; // Mock event object
    const context = {}; // Mock context object

    try {
        const response = await handler(event, context);
        console.log('Response:', response);
    } catch (error) {
        console.error('Error:', error);
    }
}

testHandler();