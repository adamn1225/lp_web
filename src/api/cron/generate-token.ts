interface TokenResponse {
  access_token: string;
}

export default async function handler(req: Request): Promise<Response> {
  try {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const tokenUrl = 'https://open-api.guesty.com/oauth2/token';

    // Ensure clientId and clientSecret are defined
    if (!clientId || !clientSecret) {
      throw new Error('Client ID or Client Secret is missing');
    }

    // Fetch the token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'open-api',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get detailed error message if available
      throw new Error(`Failed to fetch token: ${errorText}`);
    }

    // Parse the response
    const data: TokenResponse = await response.json();
    return new Response(JSON.stringify({ success: true, token: data.access_token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating token:', error); // Log error for debugging
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}