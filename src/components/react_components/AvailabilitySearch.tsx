import React, { useState } from 'react';

const AvailabilitySearch: React.FC = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetchListings = async () => {
    try {
      const response = await fetch(`/api/listings?checkIn=${checkIn}&checkOut=${checkOut}`);
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      setListings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleFetchListings();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="checkIn">Check-In Date:</label>
          <input
            type="date"
            id="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="checkOut">Check-Out Date:</label>
          <input
            type="date"
            id="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>
        <button type="submit">Search</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {listings.length > 0 ? (
          <ul>
            {listings.map((listing, index) => (
              <li key={index}>{listing.name}</li>
            ))}
          </ul>
        ) : (
          <p>No listings found</p>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySearch;