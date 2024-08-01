import fetch, { Headers } from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function refreshToken() {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("scope", "open-api");
  urlencoded.append("client_secret", process.env.CLIENT_SECRET);
  urlencoded.append("client_id", process.env.CLIENT_ID);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "manual"
  };

  try {
    const response = await fetch("https://open-api.guesty.com/oauth2/token", requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refresh token: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Token refreshed successfully:', data);

    // Update the .env file with the new token
    const envFilePath = '.env';
    const envFileContent = fs.readFileSync(envFilePath, 'utf8');
    const updatedEnvFileContent = envFileContent.replace(/VITE_API_TOKEN=.*/, `VITE_API_TOKEN=${data.access_token}`);
    fs.writeFileSync(envFilePath, updatedEnvFileContent, 'utf8');
    console.log('.env file updated successfully');
  } catch (error) {
    console.error('Error refreshing token:', error);
    process.exit(1);
  }
}

refreshToken();