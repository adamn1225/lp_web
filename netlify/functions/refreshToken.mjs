import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const MY_SITE_ID = process.env.MY_SITE_ID;
const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function handler(event, context) {
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

    // Update the environment variable in Netlify
    const updateResponse = await fetch(`https://api.netlify.com/api/v1/sites/${MY_SITE_ID}/env/VITE_API_TOKEN`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`
      },
      body: JSON.stringify({
        value: token
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update environment variable: ${updateResponse.status} ${updateResponse.statusText}`);
    }

    const updateData = await updateResponse.json();
    console.log('Update Response:', updateData);

    // Send a Slack notification
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: `Token refreshed successfully: ${token}`
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Token refreshed successfully', token })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}