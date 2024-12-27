import fetch from 'node-fetch';

export async function handler(event, context) {
    const apiUrl = process.env.VITE_API_URL;
    const apiToken = process.env.VITE_API_TOKEN;

    try {
        const response = await fetch(`${apiUrl}/listings`, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching listings: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data.results)
        };
    } catch (error) {
        console.error('Error fetching listings:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}