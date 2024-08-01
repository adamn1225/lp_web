import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tokenUrl = 'https://open-api.guesty.com/oauth2/token';

if (!clientId || !clientSecret) {
  throw new Error('CLIENT_ID and CLIENT_SECRET must be set in the .env file');
}

async function updateBearerToken() {
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        scope: 'open-api',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
  
    if (!data.access_token) {
      throw new Error('Access token is missing in the response');
    }
  
    const bearerToken = data.access_token;
  
    // Update .env file
    const envFilePath = '.env';
    let envFileContent = fs.readFileSync(envFilePath, 'utf8');
    const updatedEnvFileContent = envFileContent.replace(/VITE_API_TOKEN=.*/g, `VITE_API_TOKEN=${bearerToken}`);
  
    fs.writeFileSync(envFilePath, updatedEnvFileContent, 'utf8');
  
    console.log('Bearer token updated successfully');
  } catch (error) {
    console.error('Error fetching bearer token:', error);
  }
}

updateBearerToken();
