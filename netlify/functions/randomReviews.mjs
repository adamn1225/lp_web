import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const MAX_RETRIES = 5; // Increased retry limit
const RATE_LIMIT_INTERVAL = 2000;
const CACHE_TTL = 60 * 60 * 1000;
const BATCH_SIZE = 21;
const MAX_PROPERTIES = 15; // Limit the number of properties to fetch reviews from

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_INTERVAL * Math.pow(2, i); // Exponential backoff
                await delay(delayMs);
            } else if (response.ok) {
                return response;
            } else {
                console.error(`Error fetching data: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Network error: ${error.message}`);
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

    const guestIds = uniqueReviews.map(review => review.guestId);
    const uniqueGuestIds = [...new Set(guestIds)];

    await Promise.all(uniqueGuestIds.map(async (guestId) => {
        if (!cache.guestNames[guestId]) {
            try {
                cache.guestNames[guestId] = await fetchGuestFullName(guestId);
            } catch (error) {
                console.error(`Failed to fetch full name for guest ID: ${guestId}`, error);
                cache.guestNames[guestId] = 'Unknown';
            }
        }
    }));

    return uniqueReviews.map(review => ({
        ...review,
        guestFullName: cache.guestNames[review.guestId]
    }));
}

const fetchListingIds = async () => {
    const url = 'https://open-api.guesty.com/v1/listings?limit=100&skip=50';
    const response = await fetchWithRetry(url, {
        headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
            'Accept': 'application/json'
        }
    });

    const data = await response.json();
    return data.results.map(listing => listing._id);
}

export async function handler(event) {
    const count = parseInt(event.queryStringParameters.count, 10) || 3;

    try {
        const propertyIds = await fetchListingIds();
        const limitedPropertyIds = propertyIds.slice(0, MAX_PROPERTIES); // Limit the number of properties
        const allReviews = [];

        const reviewPromises = limitedPropertyIds.map(async (propertyId) => {
            if (!cache.reviews[propertyId] || (Date.now() - cache.timestamps[propertyId]) > CACHE_TTL) {
                const reviews = await fetchReviews(propertyId);
                cache.reviews[propertyId] = reviews;
                cache.timestamps[propertyId] = Date.now();
            }

            const reviews = cache.reviews[propertyId];
            allReviews.push(...reviews);
        });

        await Promise.all(reviewPromises);

        console.log(`Fetched reviews: ${JSON.stringify(allReviews)}`);

        const randomReviews = allReviews.sort(() => 0.5 - Math.random()).slice(0, count);
        const reviewsWithFullNames = await fetchReviewsWithFullNames(randomReviews);

        console.log(`Reviews with full names: ${JSON.stringify(reviewsWithFullNames)}`);

        return {
            statusCode: 200,
            body: JSON.stringify(reviewsWithFullNames)
        };
    } catch (error) {
        console.error(`Error fetching reviews: ${error.message}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}