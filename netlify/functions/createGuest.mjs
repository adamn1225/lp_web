import fetch from 'node-fetch';

export async function handler(event, context) {
  const { firstName, lastName, phone, email, checkIn, checkOut, listingId, captchaToken } = JSON.parse(event.body);

  if (!firstName || !lastName || !phone || !checkIn || !checkOut || !listingId || !captchaToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' })
    };
  }

  // Verify reCAPTCHA token
  const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
  });

  const captchaData = await captchaResponse.json();

  if (!captchaData.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Captcha verification failed' })
    };
  }

  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: `Bearer ${process.env.API_TOKEN}`
  };

  const guestUrl = 'https://open-api.guesty.com/v1/guests-crud';
  const guestOptions = {
    method: 'POST',
    headers,
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
    if (!guestResponse.ok) {
      const errorText = await guestResponse.text();
      throw new Error(`Failed to create guest: ${errorText}`);
    }
    const guestData = await guestResponse.json();
    const { _id: guestId } = guestData;

    // Create reservation inquiry
    const reservationUrl = 'https://open-api.guesty.com/v1/reservations';
    const reservationOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        listingId,
        checkInDateLocalized: checkIn,
        checkOutDateLocalized: checkOut,
        status: 'inquiry',
        guestId
      })
    };

    const reservationResponse = await fetch(reservationUrl, reservationOptions);
    if (!reservationResponse.ok) {
      const errorText = await reservationResponse.text();
      throw new Error(`Failed to create reservation inquiry: ${errorText}`);
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