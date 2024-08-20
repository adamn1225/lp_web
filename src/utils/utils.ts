import { fetchOneHundred, fetchThreeHundred, fetchTwoHundred, fetchFeaturedListings } from '../pages/api/fetch';

async function fetchAllListings() {
  const [oneHundred, threeHundred, twoHundred, featured] = await Promise.all([
    fetchOneHundred(),
    fetchThreeHundred(),
    fetchTwoHundred(),
    fetchFeaturedListings(),
  ]);

  // Combine the listings into one object or array as needed
  const combinedListings = {
    oneHundred,
    threeHundred,
    twoHundred,
    featured
  };

  return combinedListings;
}

const allListings = await fetchAllListings();

export function processListing(title: string, _id: string) {
  return {
    title: title === "" ? allListings.oneHundred.title : title,
    _id: _id === "" ? allListings.oneHundred._id : _id
  };
}

export async function fetchReservedDates(listingId: string, startDate: string, endDate: string): Promise<Date[]> {
  // Check if listingId is provided
  if (!listingId) {
    throw new Error('Listing ID is required.');
  }

  try {
    // Get the API token from environment variables
    const apiToken = import.meta.env.VITE_API_TOKEN;
  
    // Log the API token for debugging
    console.log('API Token:', apiToken);
  
    // Check if the API token is set
    if (!apiToken) {
      throw new Error('API token is not set. Please check your environment variables.');
    }
  
    // Construct the URL for the API request
    const url = `https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${listingId}?startDate=${startDate}&endDate=${endDate}`;
    console.log(`Fetching reserved dates from URL: ${url}`);
  
    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    });
  
    // Get the response text
    const responseText = await response.text();
    console.log('Response Text:', responseText);
  
    // Check if the response is not OK
    if (!response.ok) {
      throw new Error(`Failed to fetch reserved dates: ${response.statusText}`);
    }
  
    // Parse the response JSON
    const data = JSON.parse(responseText);
    return data.dates; // Adjust this based on the actual response structure
  } catch (error) {
    console.error('Error fetching reserved dates:', error);
    throw error;
  }
}