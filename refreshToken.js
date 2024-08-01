const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

async function refreshToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  // Log the clientId and clientSecret to verify they are being read correctly
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