import fetch from 'node-fetch';

export const handler = async (event, context) => {
  const guestInfo = JSON.parse(event.body);

  console.log('Received guest creation request with data:', guestInfo);

  const url = 'https://open-api.guesty.com/v1/guests-crud';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.VITE_API_TOKEN}` // Ensure this token is correctly set in your environment variables
    },
    body: JSON.stringify(guestInfo)
  };

  try {
    const response = await fetch(url, options);
    const responseText = await response.text();
    console.log('Guesty API Response Text:', responseText);

    if (!response.ok) {
      console.error('Guesty API Error:', responseText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to create guest. Guesty API error.' })
      };
    }

    const data = JSON.parse(responseText);

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create guest.' })
    };
  }
};