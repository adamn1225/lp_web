import fetch from 'node-fetch';

const apiToken = process.env.VITE_API_TOKEN;

if (!apiToken) {
  throw new Error('VITE_API_TOKEN is not defined in the environment variables');
}

const refreshToken = async () => {
  try {
    const response = await fetch('https://open-api.guesty.com/v1/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Add any required body parameters here
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('New token:', data.newToken);
    return data.newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    process.exit(1);
  }
};

refreshToken();