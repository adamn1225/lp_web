import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function refreshToken(retries = 3, delay = 1000) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const contentfulApiToken = process.env.CONTENTFUL_API_TOKEN;

  console.log('CLIENT_ID:', clientId);
  console.log('CLIENT_SECRET:', clientSecret);
  console.log('CONTENTFUL_API_TOKEN:', contentfulApiToken);

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newToken = data.access_token;

      console.log('Generated Bearer Token:', newToken);

      // Append the new token to the .env file
      fs.appendFileSync('.env', `\nGUESTY_API_TOKEN=${newToken}\n`);

      console.log('Token saved to .env file');
      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error('All attempts to refresh token failed');
      }
    }
  }
}

refreshToken();