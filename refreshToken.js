import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function refreshToken(retries = 3, delay = 1000) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing required environment variables: CLIENT_ID or CLIENT_SECRET');
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("client_id", clientId);
  urlencoded.append("client_secret", clientSecret);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "manual"
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://open-api.guesty.com/oauth2/token', requestOptions);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      const bearerToken = data.access_token;

      // Update the .env.local file with the new bearer token
      const envPath = path.resolve(__dirname, '.env.local');
      const envContent = fs.readFileSync(envPath, 'utf8');
      const updatedEnvContent = envContent.replace(/VITE_API_TOKEN=.*/, `VITE_API_TOKEN=${bearerToken}`);
      fs.writeFileSync(envPath, updatedEnvContent, 'utf8');

      console.log('Token:', bearerToken);
      return bearerToken;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error('All attempts to refresh token failed');
      }
    }
  }
}

refreshToken().catch(error => console.error('Error refreshing token:', error));