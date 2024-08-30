import fetch from 'node-fetch';

export const handler = async (event, context) => {
  // console.log('Received event:', event);

  const { listingId, startDate, endDate } = event.queryStringParameters;

  if (!listingId || !startDate || !endDate) {
    console.error('Missing required query parameters:', { listingId, startDate, endDate });
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing required query parameters: listingId, startDate, endDate' })
    };
  }

  const apiUrl = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${encodeURIComponent(listingId)}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;

  try {
    const startTime = Date.now();
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('Fetched data:', data);

    if (!data.data || !Array.isArray(data.data.days)) {
      // console.error('Invalid data structure:', data);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid data structure' })
      };
    }

    // Log each day's status and date
    data.data.days.forEach(day => console.log(`Day status: ${day.status}, Day date: ${day.date}`));

    // Extract unavailable dates
    const unavailableDates = data.data.days
      .filter(day => day.status === 'unavailable')
      .map(day => day.date);

    // Extract booked dates
    const bookedDates = data.data.days
      .filter(day => day.status === 'booked')
      .map(day => day.date);

    // console.log('Unavailable dates:', unavailableDates);
    // console.log('Booked dates:', bookedDates);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ unavailableDates, bookedDates })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};