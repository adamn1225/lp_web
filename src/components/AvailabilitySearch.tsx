import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/global.scss';
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
  const [checkInDate, setCheckInDate] = useState<Date | null>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(addDays(new Date(), 7));
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
      const url = `${apiUrl}?checkIn=${encodeURIComponent(checkInDate?.toISOString().slice(0, 10) || '')}&checkOut=${encodeURIComponent(checkOutDate?.toISOString().slice(0, 10) || '')}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}&${tagsQuery}`;
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
              <div className="flex sm:flex-col md:flex-row justify-center items-center gap-4 w-full">
                  <div className="w-full flex flex-col">
                    <label className="text-slate-800 font-semibold" htmlFor="checkInDate">Check-In Date:</label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date: Date | null) => setCheckInDate(date)}
                      className="border rounded-md p-2 w-full custom-date-input"
                      id="checkInDate"
                    />
                  </div>
                <div className="w-full flex flex-col">
                    <label className="text-slate-800 font-semibold" htmlFor="checkOutDate">Check-Out Date:</label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date: Date | null) => setCheckOutDate(date)}
                      className="border rounded-md p-2 w-full custom-date-input"
                      id="checkOutDate"
                    />
                  </div>
                <div className="w-4/5 flex flex-col">
                  <label htmlFor="minOccupancy" className="text-slate-800 font-semibold max-w-min text-nowrap">
                    How many guests?
                  </label>
                  <div className="flex">
                    <button
                      type="button"
                      id="decrement-button"
                      onClick={() => setMinOccupancy(minOccupancy > 0 ? minOccupancy - 1 : 0)}
                      className="bg-cyan-600 border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                    >
                      <svg className="w-3 h-3 text-slate-50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      id="minOccupancy"
                      value={minOccupancy}
                      onChange={(e) => setMinOccupancy(parseInt(e.target.value))}
                      className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-cyan-600 focus:border-cyan-600 block w-full py-2.5"
                      placeholder="0"
                      required
                    />
                    <button
                      type="button"
                      id="increment-button"
                      onClick={() => setMinOccupancy(minOccupancy + 1)}
                      className="bg-cyan-600 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                    >
                      <svg className="w-3 h-3 text-slate-50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                      </svg>
                    </button>
                  </div>
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
              <div className="w-full flex align-middle justify-center h-full gap-4">
                <button className="text-grey-950 drop-shadow-xl bg-slate-300 font-semibold py-1 px-4 rounded-md w-full max-w-min text-nowrap">
                  Advanced Search
                  </button>
                
                <button type="submit" className="flex align-middle drop-shadow-xl justify-center h-full bg-cyan-600 m-0 md:w-4/5 w-full py-3 px-1 font-bold text-xl rounded-md text-slate-50">
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