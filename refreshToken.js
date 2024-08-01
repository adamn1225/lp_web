import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function refreshToken(retries = 3, delay = 1000) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  console.log('CLIENT_ID:', clientId);
  console.log('CLIENT_SECRET:', clientSecret);

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
      const response = await fetch("https://open-api.guesty.com/oauth2/token", requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 && attempt < retries) {
          console.log(`Rate limited. Retrying in ${delay}ms...`);
          await new Promise(res => setTimeout(res, delay));
          delay *= 2; // Exponential backoff
          continue;
        }
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Token refreshed successfully:', data);

      const envFilePath = '.env';
      const envFileContent = fs.readFileSync(envFilePath, 'utf8');
      const updatedEnvFileContent = envFileContent.replace(/VITE_API_TOKEN=.*/, `VITE_API_TOKEN=${data.access_token}`);
      fs.writeFileSync(envFilePath, updatedEnvFileContent, 'utf8');
      console.log('.env file updated successfully');
      return;
    } catch (error) {
      if (attempt === retries) {
        console.error('Error refreshing token:', error);
        process.exit(1);
      }
    }
  }
}

refreshToken();