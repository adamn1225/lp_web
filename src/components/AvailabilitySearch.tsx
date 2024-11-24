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
  bedrooms: number;
  bathrooms: number;
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
  const [tagsLoading, setTagsLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedBedroomAmount, setSelectedBedroomAmount] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  
  const apiUrl = '/.netlify/functions/availability';
  const tagsApiUrl = '/.netlify/functions/tags';

  const allowedTags = ["Ocean_front", "Ocean_view", "web_featured", "Public_pool", "Pets"];

  const formatTag = (tag: string): string => {
    return tag
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const fetchTags = async () => {
      setTagsLoading(true);
      try {
        const response = await fetch(tagsApiUrl);
        const data: string[] = await response.json();
        const filteredTags = data.filter((tag) => allowedTags.includes(tag));
        setTags(filteredTags);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags');
      } finally {
        setTagsLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/.netlify/functions/availability?fetchCities=true');
        const data = await response.json();
        setCities(data.results);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('Failed to load cities');
      }
    };

    fetchCities();
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
      const tagsQuery = selectedTags.join(',');
      const url = `${apiUrl}?checkIn=${encodeURIComponent(checkInDate?.toISOString().slice(0, 10) || '')}&checkOut=${encodeURIComponent(checkOutDate?.toISOString().slice(0, 10) || '')}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}&tags=${encodeURIComponent(tagsQuery)}&city=${encodeURIComponent(selectedLocation)}&bedroomAmount=${encodeURIComponent(selectedBedroomAmount)}`;
      console.log('API URL:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.results) {
        setError('No results found');
      }

      setListings(data.results);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Clear the search results
  const clearResults = () => {
    setListings([]);
  };

  return (
    <div className="static w-full h-full flex flex-col justify-center items-center gap-2">
        <h1 className="font-extrabold text-secondary mb-4 text-3xl md:text-5xl text-center">Find your perfect vacation rental</h1>
      <h2 className="text-center text-slate-50 font-bold pb-2 text-xl md:text-3xl text-wrap md:w-1/2">Book your next vacation rental with us. We offer a wide selection of vacation rentals in the most popular destinations.</h2>
        <div className="flex flex-col md:flex-row justify-center align-middle h-full w-full md:mb-16">

        <form onSubmit={handleSubmit} className="w-full  z-10 xs:py-5 p-4 flex flex-col justify-center max-w-6xl min-h-72 bg-white px-6 rounded-3xl shadow-2xl">


            <div className="flex flex-col gap-3 items-center justify-center w-full">
              <div className="flex xs:flex-col md:flex-row justify-center items-center gap-4 w-full">
                  <div className="w-full flex flex-col">
                    <label className="text-slate-800 font-semibold" htmlFor="checkInDate">Check-In Date:</label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date: Date | null) => setCheckInDate(date)}
                  className="border border-slate-300 rounded-md p-2 w-full custom-date-input"
                      id="checkInDate"
                    />
                  </div>
                <div className="w-full flex flex-col">
                    <label className="text-slate-800 font-semibold" htmlFor="checkOutDate">Check-Out Date:</label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date: Date | null) => setCheckOutDate(date)}
                      className="border border-slate-300 rounded-md p-2 w-full custom-date-input"
                      id="checkOutDate"
                    />
                  </div>
                <div className="w-3/5 flex flex-col">
                  <label htmlFor="minOccupancy" className="text-slate-800 font-semibold max-w-min text-nowrap">
                    How many guests?
                  </label>
                  <div className="flex w-full">
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
                      className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-cyan-600 focus:border-cyan-600 block w-full py-2.5 custom-number-input"
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
            <div className="mt-4 flex flex-wrap gap-2">
              {tagsLoading ? (
                <p>Loading tags...</p>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-2 rounded ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                  >
                    {formatTag(tag)}
                  </button>
                ))
              )}
            </div>
            <div className="flex gap-12 items-center justify-center pt-8">
              <div className="w-full flex flex-col">
                <label htmlFor="location" className="text-slate-800 font-semibold">Search by City</label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="border border-slate-300 rounded-md p-2 w-full"
                >
                  <option value="">Select Location</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="bedroomAmount" className="text-slate-800 font-semibold">Bedroom Amount:</label>
                <select
                  id="bedroomAmount"
                  value={selectedBedroomAmount}
                  onChange={(e) => setSelectedBedroomAmount(e.target.value)}
                  className="border border-slate-300 rounded-md p-2 w-full"
                >
                  <option value="">Select Bedroom Amount</option>
                  <option value="Studio">Studio</option>
                  <option value="1BR">One Bedroom</option>
                  <option value="2BR">Two Bedroom</option>
                  <option value="3BR">Three Bedroom</option>
                  <option value="4BR">Four Bedroom</option>
                  <option value="5BR">Five Bedroom</option>
                  <option value="6BR">Six Bedroom</option>
                  <option value="7BR">Seven Bedroom</option>
                </select>
              </div>
            </div>
              <div className="md:w-2/3 flex align-middle justify-center h-full mt-4 gap-4">
              {/* <button className="text-grey-950 shadow-lg shadow-secondary/40 bg-slate-300 font-semibold py-1 px-4 rounded-md w-full max-w-min text-nowrap">
                  Advanced Search
                  </button> */}
                
              <button type="submit" className="flex items-stretch shadow-lg shadow-secondary/40 justify-stretch text-nowrap md:justify-center h-full bg-cyan-600 m-0 w-full md:w-4/5  py-3 px-1 font-bold text-xl rounded-md text-slate-50">
                  <Search size={24} /> <h3>Search properties</h3>
                </button>
              </div>
            </div>
          </form>
        </div>
      <div className="bg-stone-50 w-screen mb-64 pb-12 z-20 h-full overflow-auto">
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
        <div className="search-results grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 md:px-12 px-4">
          {available.map((property) => (
            <a href={property._id} key={property._id}>
              <article className="flex flex-col bg-white w shadow-lg shadow-slate-300/30 h-full border border-slate-500/30 rounded-md">
                <div className="result-item">
                  <img className="w-full object-cover h-64" src={property.picture.thumbnail} alt={property.picture.caption} />
                  <div className="px-10 py-4 text-center flex flex-col gap-4">
                    <h3 className="text-xl font-medium">{property.title}</h3>
                    <div className="border border-stone-300"> </div>
                    <p className="text-lg font-light">{property.address.city}, {property.address.state}</p>
                    <div className="h-max grid grid-cols-2 flex-row justify-center items-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-muted-900 dark:text-white">
                          <svg
                            className="size-8"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            style={{ stroke: "currentColor" }}
                            data-darkreader-inline-stroke=""
                          ><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M12 4v6"></path><path d="M2 18h20"></path>
                          </svg>

                          <p className="text-xl font-bold">{property.bedrooms}</p>
                        </div>

                        <p className="text-md text-muted-400">Bedrooms</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-muted-900 dark:text-white">
                          <svg
                            className="size-8"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            style={{ stroke: "currentColor" }}
                            data-darkreader-inline-stroke=""
                          ><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path><line x1="10" y1="5" x2="8" y2="7"></line><line
                            x1="2"
                            y1="12"
                            x2="22"
                            y2="12"></line><line x1="7" y1="19" x2="7" y2="21"></line><line x1="17" y1="19" x2="17" y2="21"></line>
                          </svg>

                          <p className="text-xl font-bold">{property.bathrooms}</p>
                        </div>

                        <p className="text-md text-muted-400">Bathroom</p>
                      </div>
                  </div>
                  <div className="flex min-h-min flex-row justify-center align-bottom"><button className="lp-button mt-4 ">View Details</button></div>
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