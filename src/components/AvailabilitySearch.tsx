import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { addDays } from "date-fns";

interface Listing {
  _id: string;
  title: string;
  picture: {
    thumbnail: string;
    caption: string;
  };
  publicDescription: {
    summary: string;
  };
  address: {
    city: string;
    state: string;
  };
  prices: {
    basePrice: number;
    currency: string;
  };
  // Add other properties as needed
}

const AvailabilitySearch: React.FC = () => {
  const [minOccupancy, setMinOccupancy] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [available, setListings] = useState<Listing[]>([]);
  const [checkInDate, setCheckInDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [checkOutDate, setCheckOutDate] = useState<string>(addDays(new Date(), 7).toISOString().slice(0, 10));
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const apiUrl = '/.netlify/functions/availability';
  const tagsApiUrl = '/.netlify/functions/tags'; // Netlify function endpoint for fetching tags

  const allowedTags = ["ocean front", "Ocean view", "pool", "studio", "Pets"];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(tagsApiUrl);
        const data = await response.json();
        console.log('Fetched tags:', data); // Log the fetched tags
        const filteredTags = data.filter((tag: string) => allowedTags.includes(tag));
        setTags(filteredTags); // Set only the allowed tags
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag)
        : [...prevSelected, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tagsQuery = selectedTags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
      const url = `${apiUrl}?checkIn=${encodeURIComponent(checkInDate)}&checkOut=${encodeURIComponent(checkOutDate)}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}&${tagsQuery}`;
      console.log('API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      console.log('API Response Text:', responseText);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        throw new Error('Invalid JSON response');
      }

      if (!Array.isArray(data.results)) {
        throw new Error('Unexpected response format');
      }

      setListings(data.results);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setListings([]);
  };

  return (
    <div className="static w-full h-full">
      <div className="w-full items-end align-bottom md:pb-12 pb-20">
        <div className="flex flex-row justify-center align-middle h-full w-full md:mb-16">
          <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-slate-100 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col gap-3 items-center justify-center">
              <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                <div>
                  <label className="text-slate-800 font-semibold" htmlFor="checkInDate">Check-In Date:</label>
                  <input
                    type="date"
                    id="checkInDate"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <label className="text-slate-800 font-semibold" htmlFor="checkOutDate">Check-Out Date:</label>
                  <input
                    type="date"
                    id="checkOutDate"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <label className="text-slate-800 font-semibold" htmlFor="minOccupancy">How many guests?</label>
                  <input
                    type="number"
                    id="minOccupancy"
                    value={minOccupancy}
                    onChange={(e) => setMinOccupancy(parseInt(e.target.value))}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2 flex-wrap justify-center items-end">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`text-grey-950 font-semibold py-1 px-4 rounded-3xl w-full max-w-min text-nowrap ${selectedTags.includes(tag) ? 'bg-cyan-600 text-slate-300 drop-shadow-xl' : 'bg-slate-300 drop-shadow'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="w-full flex align-middle justify-center h-full">
                <button type="submit" className="flex align-middle justify-center h-full bg-cyan-600 m-0 md:w-4/5 w-full py-3 px-1 font-bold text-xl rounded-md text-slate-50">
                  <Search size={24} /> <h3>Search properties</h3>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-stone-50 w-full h-full overflow-auto">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {available.length > 0 && (
          <div className="flex flex-col justify-start items-center pt-8">
            <h2 className="font-sans font-light border-b-2 border-slate-700 text-3xl text-cyan-900 bb-4 text-center">Available for Instant Booking!</h2>
            <button onClick={clearResults} className="bg-red-500 text-white w-1/5 py-3 px-1 my-6 rounded-md">
              X Clear Results
            </button>
          </div>
        )}
        <div className="search-results grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 md:px-12 px-4">
          {available.map((property) => (
            <a href={property._id} key={property._id}>
              <article className="flex flex-col bg-white shadow-lg shadow-slate-300/30 h-full border border-slate-500/30 rounded-md">
                <div className="p-1 result-item">
                  <img className="w-full object-cover h-64" src={property.picture.thumbnail} alt={property.picture.caption} />
                  <div className="px-10 py-4 text-center flex flex-col gap-4">
                    <h3 className="text-xl font-medium">{property.title}</h3>
                    <div className="border border-stone-300"> </div>
                    <p className="text-lg font-light">{property.address.city}, {property.address.state}</p>
                    {/* <p className="font-bold">${property.prices.basePrice} {property.prices.currency}</p> */}
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySearch;