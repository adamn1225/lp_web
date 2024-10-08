import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Debugging statement to check if the script is running
console.log('Starting server...');

const app = express();
const port = process.env.PORT || 5000; // Ensure PORT is set in .env

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Function to get Bearer token
function getBearerToken() {
  if (process.env.NODE_ENV === 'development') {
    const TOKEN_FILE_PATH = path.resolve(__dirname, 'guesty_token.json');
    const tokenData = fs.readFileSync(TOKEN_FILE_PATH, 'utf-8');
    const { token } = JSON.parse(tokenData);
    return token;
  } else {
    return process.env.VITE_API_TOKEN;
  }
}

app.get('/api/available', async (req, res) => {
  const { checkIn, checkOut, minOccupancy } = req.query;
  if (!checkIn || !checkOut || !minOccupancy) {
    return res.status(400).json({ error: 'Missing required query parameters: checkIn, checkOut, minOccupancy' });
  }

  const apiUrl = `https://open-api.guesty.com/v1/listings?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&minOccupancy=${encodeURIComponent(minOccupancy)}`;
  const token = getBearerToken();

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Guesty API error: ${errorText}`);
      return res.status(response.status).json({ error: `Guesty API error: ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from Guesty API:', error);
    res.status(500).json({ error: 'Failed to fetch data from API' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});

export default app;