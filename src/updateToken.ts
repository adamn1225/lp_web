import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const clientId: string | undefined = process.env.CLIENT_ID;
const clientSecret: string | undefined = process.env.CLIENT_SECRET;
const tokenUrl: string = 'https://open-api.guesty.com/oauth2/token';

if (!clientId || !clientSecret) {
  throw new Error('CLIENT_ID and CLIENT_SECRET must be set in the .env file');
}

interface TokenResponse {
  access_token: string;
}

async function updateBearerToken(): Promise<void> {
  try {
    // Create URLSearchParams with non-nullable values
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'open-api',
      client_id: clientId!,
      client_secret: clientSecret!,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(), // Convert URLSearchParams to string
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
