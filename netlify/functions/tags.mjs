import fetch from 'node-fetch';

export const handler = async (event, context) => {
    const tagsApiUrl = 'https://open-api.guesty.com/v1/listings/tags';

    try {
        const response = await fetch(tagsApiUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Guesty API error: ${errorText}`);
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: errorText })
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error fetching tags:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};