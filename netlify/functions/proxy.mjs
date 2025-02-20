import fetch from 'node-fetch';

export async function handler(event, context) {
    const { url } = event.queryStringParameters;
    if (!url) {
        return {
            statusCode: 400,
            body: 'Missing URL parameter'
        };
    }
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: `Failed to fetch ${url}`
            };
        }

        const contentType = response.headers.get('content-type');
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000'
            },
            body: buffer.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error fetching ${url}: ${error.message}`
        };
    }
};