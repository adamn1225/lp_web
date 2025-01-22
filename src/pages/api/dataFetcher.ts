import { fetchListings, fetchFeaturedListings } from './fetch.ts';

export async function fetchAllListings() {
    const [fetchedListings, featuredListings] = await Promise.all([
        fetchListings(),
        fetchFeaturedListings()
    ]);

    return [...fetchedListings, ...featuredListings];
}