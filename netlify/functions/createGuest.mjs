import fetch from 'node-fetch';

export async function handler(event, context) {
  const { firstName, lastName, phone, email, checkIn, checkOut, listingId } = JSON.parse(event.body);

  const guestUrl = 'https://open-api.guesty.com/v1/guests-crud';
  const guestOptions = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.VITE_API_TOKEN}`
    },
    body: JSON.stringify({
      firstName,
      lastName,
      phone,
      contactType: 'guest',
      email,
    })
  };

  try {
    // Create guest
    const guestResponse = await fetch(guestUrl, guestOptions);
    const guestData = await guestResponse.json();
    const { _id: guestId } = guestData;

    // Create reservation inquiry
    const reservationUrl = 'https://open-api.guesty.com/v1/reservations';
    const reservationOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.VITE_API_TOKEN}`
      },
      body: JSON.stringify({
        listingId,
        checkInDateLocalized: checkIn,
        checkOutDateLocalized: checkOut,
        status: 'inquiry',
        guestId
      })
    };

    const reservationResponse = await fetch(reservationUrl, reservationOptions);
    const reservationData = await reservationResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ guestData, reservationData })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create guest or reservation inquiry' })
    };
  }
}