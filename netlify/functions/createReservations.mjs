import fetch from 'node-fetch';

export const handler = async (event, context) => {
  const reservationInfo = JSON.parse(event.body);

  console.log('Received request with data:', reservationInfo);

  const url = 'https://open-api.guesty.com/v1/reservations'; // Correct endpoint URL
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.VITE_API_TOKEN}` // Ensure the token is correctly set in your environment variables
    },
    body: JSON.stringify({
      listingId: reservationInfo.listingId,
      checkInDateLocalized: reservationInfo.start,
      checkOutDateLocalized: reservationInfo.end,
      status: 'confirmed',
      guestId: reservationInfo.guestId
    })
  };

  try {
    const response = await fetch(url, options);
    const responseText = await response.text();
    console.log('Guesty API Response Text:', responseText);

    if (!response.ok) {
      console.error('Guesty API Error:', responseText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to create reservation. Guesty API error.' })
      };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create reservation. Invalid response from Guesty API.' })
      };
    }

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create reservation.' })
    };
  }
};