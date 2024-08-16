// src/api/gapi.ts
export async function fetchListings(type: string) {
  const response = await fetch(`/.netlify/functions/fetchListings?type=${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}
