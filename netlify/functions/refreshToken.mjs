import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID; // Replace with your actual site ID
const ACCOUNT_SLUG = 'line-properties';

async function triggerRedeploy() {
  const redeployUrl = `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/builds`;

  const response = await fetch(redeployUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to trigger redeploy: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Redeploy triggered:', data);
}

export async function handler(event, context) {
  try {
    console.log('Starting token refresh process...');

    // Fetch new token from Guesty API
    const tokenResponse = await fetch('https://open-api.guesty.com/oauth2/token', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': 'open-api',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Failed to fetch new token: ${tokenResponse.status} ${tokenResponse.statusText} - ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;
    console.log('Fetched new token:', token);

    // Construct the URL for updating the environment variable
    const updateUrl = `https://api.netlify.com/api/v1/accounts/${ACCOUNT_SLUG}/env/VITE_API_TOKEN?site_id=${NETLIFY_SITE_ID}`;

    // Update environment variable in Netlify
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH', // Use PATCH method
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`
      },
      body: JSON.stringify({
        key: 'VITE_API_TOKEN',
        value: token,
        context: 'production' // Set context to a valid value
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update environment variable: ${updateResponse.status} ${updateResponse.statusText} - ${errorText}`);
    }

    const updateData = await updateResponse.json();
    console.log('Environment variable updated:', updateData);

    // Trigger a redeploy
    await triggerRedeploy();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Token refreshed successfully and redeploy triggered', token })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

export const config = {
  schedule: '@daily' // Runs once a day at midnight UTC
};