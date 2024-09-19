import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    if (!event.body) {
      throw new Error('Request body is missing');
    }

    const reservationInfo = JSON.parse(event.body);

    // Log the parsed reservation info
    console.log('Parsed reservation info:', JSON.stringify(reservationInfo, null, 2));

    if (!process.env.VITE_API_TOKEN) {
      throw new Error('VITE_API_TOKEN environment variable is not set');
    }

    const url = 'https://open-api.guesty.com/v1/reservations';
    const requestBody = {
      guest: {
        firstName: reservationInfo.firstName,
        lastName: reservationInfo.lastName,
        phone: reservationInfo.phone,
        email: reservationInfo.email,
      },
      listingId: reservationInfo.listingId,
      checkInDateLocalized: reservationInfo.checkInDateLocalized,
      checkOutDateLocalized: reservationInfo.checkOutDateLocalized,
      status: 'confirmed',
      guestsCount: reservationInfo.guestsCount
    };

    // Log the request body before making the API call
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.VITE_API_TOKEN}`
      },
      body: JSON.stringify(requestBody)
    };

    console.log('Request URL:', url);
    console.log('Request Headers:', JSON.stringify(options.headers, null, 2));

    const response = await fetch(url, options);
    const responseText = await response.text(); // Get the response text
    console.log('Response text:', responseText); // Log the response text

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText} - ${responseText}`);
    }

    const data = JSON.parse(responseText); // Parse the response text as JSON

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error creating reservation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};