import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const { conversationId } = JSON.parse(event.body);

    if (!conversationId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing conversationId' }),
      };
    }

    const url = `https://open-api.guesty.com/v1/communication/conversations/${conversationId}/posts`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.VITE_API_TOKEN}` // Replace with your actual access token
      }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Error: ${response.status} ${response.statusText} - ${errorText}` }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(`Internal Server Error - ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Internal Server Error - ${error.message}` }),
    };
  }
}