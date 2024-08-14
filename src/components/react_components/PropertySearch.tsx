import React, { useEffect, useState } from 'react';

interface Listing {
  _id: string;
  SaaS: {
    autoRenew: boolean;
  };
  cleaningStatus: {
    value: string;
    updatedBy: string;
    updatedAt: string;
  };
  picture: {
    caption: string;
    thumbnail: string;
  };
  terms: {
    minNights: number;
    maxNights: number;
  };
}

const PropertySearch: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings?checkIn=2024-08-04&checkOut=2024-08-15&minOccupancy=1');
        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // console.log('API Response:', data); // Log the response data

        // Ensure the data structure is as expected
        if (!data.results || !Array.isArray(data.results)) {
          throw new Error('Unexpected API response structure');
        }

        setListings(data.results); // Set the listings state with data.results
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to fetch listings');
      }
    };

    fetchListings();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Listings</h1>
      <ul>
        {listings.map((listing) => (
          <li key={listing._id}>
            <img src={listing.picture.thumbnail} alt={listing.picture.caption} />
            <p>Cleaning Status: {listing.cleaningStatus.value}</p>
            <p>Min Nights: {listing.terms.minNights}</p>
            <p>Max Nights: {listing.terms.maxNights}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertySearch;