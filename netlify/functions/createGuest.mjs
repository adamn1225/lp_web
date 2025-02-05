import fetch from 'node-fetch';

export async function handler(event, context) {
  const { firstName, lastName, phone, email, checkIn, checkOut, listingId } = JSON.parse(event.body);

  // Only validate firstName and lastName
  if (!firstName || !lastName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' })
    };
  }

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: `Bearer ${process.env.VITE_API_TOKEN}`
  };

  const reservationUrl = 'https://open-api.guesty.com/v1/reservations';
  const reservationOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      guest: {
        firstName,
        lastName,
        phone,
        email
      },
      status: 'inquiry',
      listingId,
      checkInDateLocalized: checkIn,
      checkOutDateLocalized: checkOut
    })
  };

  try {
    // Create reservation inquiry
    const reservationResponse = await fetch(reservationUrl, reservationOptions);
    if (!reservationResponse.ok) {
      throw new Error('Failed to create reservation inquiry');
    }
    const reservationData = await reservationResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ reservationData })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}