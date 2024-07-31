import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const clientId: string | undefined = process.env.CLIENT_ID;
const clientSecret: string | undefined = process.env.CLIENT_SECRET;
const tokenUrl: string = 'https://api.example.com/oauth/token';

if (!clientId || !clientSecret) {
  throw new Error('CLIENT_ID and CLIENT_SECRET must be set in the .env file');
}

interface TokenResponse {
  access_token: string;
}

async function updateBearerToken(): Promise<void> {
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TokenResponse = await response.json();
    const bearerToken: string = data.access_token;

    // Update .env file
    const envFilePath: string = '.env';
    const envFileContent: string = fs.readFileSync(envFilePath, 'utf8');
    const updatedEnvFileContent: string = envFileContent.replace(/VITE_API_TOKEN=.*/g, `VITE_API_TOKEN=${bearerToken}`);

    fs.writeFileSync(envFilePath, updatedEnvFileContent, 'utf8');

    console.log('Bearer token updated successfully');
  } catch (error) {
    console.error('Error fetching bearer token:', error);
  }
}

updateBearerToken();
