// netlify/functions/refreshToken.js
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { schedule } from '@netlify/functions';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_FILE_PATH = path.resolve(__dirname, 'guesty_token.json');

const refreshTokenHandler = async function(event, context) {
  try {
    const response = await fetch('https://open-api.guesty.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': 'open-api',
        'client_secret': CLIENT_SECRET,
        'client_id': CLIENT_ID
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const token = data.access_token;

    // Store the token in an environment variable or a secure storage
    if (process.env.NODE_ENV === 'development') {
      // Store the token in a local file for development
      fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify({ token }));
    } else {
      // Store the token in an environment variable for production
      process.env.GUESTY_BEARER_TOKEN = token;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Token refreshed successfully', token })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const handler = schedule('0 */23 * * *', refreshTokenHandler); // Every 23 hours