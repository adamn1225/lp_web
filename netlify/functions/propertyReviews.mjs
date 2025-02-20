import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const MAX_RETRIES = 3;
const RATE_LIMIT_INTERVAL = 2000;
const CACHE_TTL = 60 * 60 * 1000;
const BATCH_SIZE = 25;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_INTERVAL;
            await delay(delayMs);
        } else if (response.ok) {
            return response;
        } else {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
    }
    throw new Error('Max retries reached');
};

const cache = {
    reviews: {},
    guestNames: {},
    timestamps: {}
};

const fetchReviews = async (propertyId) => {
    let allReviews = [];
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
        const url = `https://open-api.guesty.com/v1/reviews?listingId=${propertyId}&channelId=airbnb2&skip=${skip}&limit=${BATCH_SIZE}`;
        const response = await fetchWithRetry(url, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        const reviews = data.data
            .filter(review => review.rawReview.overall_rating > 2)
            .map(review => ({
                _id: review._id,
                guestId: review.guestId,
                listingId: review.listingId,
                overall_rating: review.rawReview.overall_rating,
                public_review: review.rawReview.public_review
            }));

        allReviews = [...allReviews, ...reviews];
        skip += BATCH_SIZE;
        hasMore = reviews.length === BATCH_SIZE;
    }

    return allReviews;
}

const fetchGuestFullName = async (guestId, retries = MAX_RETRIES) => {
    if (cache.guestNames[guestId]) {
        return cache.guestNames[guestId];
    }

    const url = `https://open-api.guesty.com/v1/guests-crud/${guestId}?fields=fullName`;
    const response = await fetchWithRetry(url, {
        headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
            'Accept': 'application/json'
        }
    });

    const data = await response.json();
    console.log(`Fetched full name for guest ID ${guestId}: ${data.fullName}`);
    cache.guestNames[guestId] = data.fullName;
    return data.fullName;
}

const fetchReviewsWithFullNames = async (reviews) => {
    const uniqueReviews = Array.from(new Set(reviews.map(review => review._id)))
        .map(id => reviews.find(review => review._id === id));

    for (const review of uniqueReviews) {
        if (!cache.guestNames[review.guestId]) {
            try {
                cache.guestNames[review.guestId] = await fetchGuestFullName(review.guestId);
            } catch (error) {
                console.error(`Failed to fetch full name for guest ID: ${review.guestId}`, error);
                cache.guestNames[review.guestId] = 'Unknown';
            }
        }
    }

    return uniqueReviews.map(review => ({
        ...review,
        guestFullName: cache.guestNames[review.guestId]
    }));
}

export async function handler(event) {
    const propertyId = event.queryStringParameters.propertyId;
    const batch = event.queryStringParameters.batch || 'initial';

    try {
        console.log(`Fetching reviews for property ID: ${propertyId}`); // Log the propertyId for debugging

        if (!cache.reviews[propertyId] || (Date.now() - cache.timestamps[propertyId]) > CACHE_TTL) {
            const reviews = await fetchReviews(propertyId);
            cache.reviews[propertyId] = reviews;
            cache.timestamps[propertyId] = Date.now();
        }

        const reviews = cache.reviews[propertyId];
        console.log(`Fetched reviews: ${JSON.stringify(reviews)}`);

        let reviewsToFetch;
        if (batch === 'initial') {
            reviewsToFetch = reviews.slice(0, 25);
        } else {
            reviewsToFetch = reviews.slice(20);
        }

        const reviewsWithFullNames = await fetchReviewsWithFullNames(reviewsToFetch);

        console.log(`Reviews with full names: ${JSON.stringify(reviewsWithFullNames)}`);

        return {
            statusCode: 200,
            body: JSON.stringify(reviewsWithFullNames)
        };
    } catch (error) {
        console.error(`Error fetching reviews for property ID: ${propertyId}`, error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}