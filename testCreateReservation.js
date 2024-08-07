import { config } from 'dotenv';
config();

import { handler } from './netlify/functions/createReservations.mjs';

console.log('VITE_API_TOKEN:', process.env.VITE_API_TOKEN); // Log the environment variable to verify it's loaded

const mockEvent = {
  body: JSON.stringify({
    start: '2023-10-01',
    end: '2023-10-10'
  })
};

handler(mockEvent)
  .then(response => {
    console.log('Function response:', response);
  })
  .catch(error => {
    console.error('Function error:', error);
  });