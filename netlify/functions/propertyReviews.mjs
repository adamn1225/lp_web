import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const fetchReviews = async (propertyId) => {
    const url = `https://open-api.guesty.com/v1/reviews?listingId=${propertyId}&channelId=airbnb2`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data
        .filter(review => review.rawReview.overall_rating > 2)
        .map(review => ({
            _id: review._id,
            guestId: review.guestId,
            listingId: review.listingId,
            overall_rating: review.rawReview.overall_rating,
            public_review: review.rawReview.public_review
        }));
}

export async function handler(event) {
    const propertyId = event.queryStringParameters.propertyId;

    try {
        const reviews = await fetchReviews(propertyId);
        return {
            statusCode: 200,
            body: JSON.stringify(reviews)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}