import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const MAX_RETRIES = 3;
const RATE_LIMIT_INTERVAL = 1000; // 1 second
const BATCH_SIZE = 50;

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
            .filter(review => review.rawReview.overall_rating === 5)
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
};

const fetchGuestFullName = async (guestId, retries = MAX_RETRIES) => {
    const url = `https://open-api.guesty.com/v1/guests-crud/${guestId}?fields=fullName`;
    const response = await fetchWithRetry(url, {
        headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
            'Accept': 'application/json'
        }
    });

    const data = await response.json();
    console.log(`Fetched full name for guest ID ${guestId}: ${data.fullName}`);
    return data.fullName;
};

const fetchReviewsWithFullNames = async (reviews) => {
    const uniqueReviews = Array.from(new Set(reviews.map(review => review._id)))
        .map(id => reviews.find(review => review._id === id));

    for (const review of uniqueReviews) {
        review.guestFullName = await fetchGuestFullName(review.guestId);
    }

    return uniqueReviews;
};

const fetchListingIds = async () => {
    const url = 'https://open-api.guesty.com/v1/listings?limit=100';
    const response = await fetchWithRetry(url, {
        headers: {
            'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`,
            'Accept': 'application/json'
        }
    });

    const data = await response.json();
    return data.results.map(listing => listing._id);
};

const fetchAndStoreReviews = async () => {
    try {
        const propertyIds = await fetchListingIds();
        const allReviews = [];

        for (const propertyId of propertyIds) {
            const reviews = await fetchReviews(propertyId);
            allReviews.push(...reviews);
        }

        const randomReviews = allReviews.sort(() => 0.5 - Math.random()).slice(0, 3);
        const reviewsWithFullNames = await fetchReviewsWithFullNames(randomReviews);

        fs.writeFileSync('/home/adam-noah/Desktop/lp_web/data/reviews.json', JSON.stringify(reviewsWithFullNames, null, 2));
        console.log('Reviews fetched and stored successfully');
    } catch (error) {
        console.error(`Error fetching and storing reviews: ${error.message}`);
    }
};

fetchAndStoreReviews();