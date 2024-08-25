import { fetchThreeHundred, fetchOneHundred, fetchTwoHundred, fetchFeaturedListings } from './fetch.ts';

export async function fetchAllListings() {
    const [threeHundredListings, oneHundredListings, twoHundredListings, featuredListings] = await Promise.all([
        fetchThreeHundred(),
        fetchOneHundred(),
        fetchTwoHundred(),
        fetchFeaturedListings()
    ]);

    return [...threeHundredListings, ...oneHundredListings, ...twoHundredListings, ...featuredListings];
}