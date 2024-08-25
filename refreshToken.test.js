import fetch from 'node-fetch';
import { handler } from './netlify/functions/refreshToken.mjs';
import dotenv from 'dotenv';

dotenv.config();

jest.mock('node-fetch', () => require('jest-fetch-mock'));

describe('refreshToken handler', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('should load environment variables', () => {
        expect(process.env.CLIENT_ID).toBeDefined();
        expect(process.env.CLIENT_SECRET).toBeDefined();
        expect(process.env.MY_SITE_ID).toBeDefined();
        expect(process.env.NETLIFY_AUTH_TOKEN).toBeDefined();
    });

    it('should fetch a new token successfully', async () => {
        fetch.mockResponses(
            [JSON.stringify({ access_token: 'new_token' }), { status: 200 }],
            [JSON.stringify({ value: 'new_token' }), { status: 200 }]
        );

        const event = {};
        const context = {};

        await handler(event, context);

        expect(fetch).toHaveBeenCalledWith('https://open-api.guesty.com/oauth2/token', expect.any(Object));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://api.netlify.com/api/v1/sites/'), expect.any(Object));
    });
});