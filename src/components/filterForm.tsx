import React, { useState } from 'react';

const MyForm = () => {
  // State for form inputs
  const [checkIn, setParam1] = useState('');
  const [checkOut, setParam2] = useState('');
  
  // State for fetch results
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(checkIn, checkOut);
  };

  // Fetch data from API
  const fetchData = (checkInValue, checkOutValue) => {
    setLoading(true);
    setError(null);

    // Base URL of your API
    const baseURL = '/listings';

    // Create URLSearchParams with multiple query parameters
    const params = new URLSearchParams({
      checkIn: checkInValue,
      checkOut: checkOutValue
    });

    // Construct the full URL with query parameters
    const url = `${baseURL}?${params.toString()}`;

    // Fetch data from the API
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Parameter 1:
            <input
              type="text"
              value={checkIn}
              onChange={(e) => setParam1(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Parameter 2:
            <input
              type="text"
              value={checkOut}
              onChange={(e) => setParam2(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          <h1>Data:</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MyForm;