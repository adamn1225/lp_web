import fetch from 'node-fetch';

export async function handler(event, context) {
  const { firstName, lastName, phone, email, checkIn, checkOut, listingId } = JSON.parse(event.body);

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

  const guestUrl = 'https://open-api.guesty.com/v1/guests-crud';
  const guestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      firstName,
      lastName,
      contactType: 'guest',
    })
  };

  try {
    const guestResponse = await fetch(guestUrl, guestOptions);
    if (!guestResponse.ok) {
      throw new Error('Failed to create guest');
    }
    const guestData = await guestResponse.json();
    const { _id: guestId } = guestData;

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

    const reservationResponse = await fetch(reservationUrl, reservationOptions);
    if (!reservationResponse.ok) {
      throw new Error('Failed to create reservation inquiry');
    }
    const reservationData = await reservationResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ guestData, reservationData })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}