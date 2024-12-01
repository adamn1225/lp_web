import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/global.scss';
import { addDays } from "date-fns";
import { ClipLoader } from 'react-spinners';
import DateRangePickerComponent from './ui/DateRangePickerComponent';
import Modal from './ui/Modal';
import GoogleMap from './GoogleMap'; // Import the GoogleMap component

interface Listing {
  _id: string;
  title: string;
  picture: {
    thumbnail: string;
    caption: string;
  };
  pictures: {
    original: string;
  };
  publicDescription: {
    summary: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    lat: number;
    lng: number;
    apt: string;
    full: string;
  };
  prices: {
    basePrice: number;
    currency: string;
  };
  bedrooms: number;
  bathrooms: number;
  accommodates: number; // Add accommodates property
  // Add other properties as needed
}

const AvailabilitySearch: React.FC = () => {
  const [minOccupancy, setMinOccupancy] = useState<number>(1);
  const [numGuests, setNumGuests] = useState<number>(1); // Add state for number of guests
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [available, setListings] = useState<Listing[]>([]);
  const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: addDays(new Date(), 7), key: 'selection' }]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedBedroomAmount, setSelectedBedroomAmount] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const apiUrl = '/.netlify/functions/availability';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearchAttempted(true);

    try {
      const tagsQuery = selectedTags.join(',');
      const url = `${apiUrl}?checkIn=${encodeURIComponent(dateRange[0].startDate.toISOString().slice(0, 10))}&checkOut=${encodeURIComponent(dateRange[0].endDate.toISOString().slice(0, 10))}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}${tagsQuery ? `&tags=${encodeURIComponent(tagsQuery)}` : ''}&city=${encodeURIComponent(selectedLocation)}&bedroomAmount=${encodeURIComponent(selectedBedroomAmount)}`;
      console.log('API URL:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.results) {
        setError('No results found');
      }

      // Filter listings based on the number of guests
      const filteredListings = data.results.filter((listing: Listing) => listing.accommodates >= numGuests);

      setListings(filteredListings);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setIsModalOpen(false); // Close the modal after search
    }
  };

  // Clear the search results
  const clearResults = () => {
    setListings([]);
    setSearchAttempted(false);
  };

  return (
    <div className="w-full h-full flex flex-col pt-5 justify-center items-center bg-secondary/10">
      <div className="flex flex-col md:flex-row justify-center align-middle w-full h-full ">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-4/5 md:w-1/4 mx-auto h-fit flex flex-col items-start gap-1 shadow-lg justify-start bg-gray-100 pt-2.5 pb-0.5 px-3 font-bold text-base text-start rounded-lg text-secondary"
        >
          <span className="flex w-fit items-start justify-start text-start gap-1"><Search size={20} /> <p>Search Where</p></span><span className="flex justify-center self-center items-end"><p>When - Where - Who</p></span>
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center bg-zinc-100 items-center h-1/2 rounded-md">
          <div className="flex flex-col items-center justify-center w-full px-6">
            <div className="flex flex-col justify-center items-center gap-1 w-full">
              <div className="w-full flex flex-col">
                <label className="text-slate-800 font-semibold" htmlFor="dateRange">Select Dates:</label>
                <DateRangePickerComponent
                  state={dateRange}
                  setState={setDateRange}
                  disabledDates={[]} // Add any disabled dates here
                />
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="location" className="text-slate-800 font-semibold">Search by City</label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="border border-slate-400 rounded-xl p-2 w-full"
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
                  className="border rounded-xl border-slate-400 p-2 w-full"
                >
                  <option value="">Select Bedroom Amount</option>
                  <option value="studio">Studio</option>
                  <option value="1BR">1 Bedroom</option>
                  <option value="2BR">2 Bedroom</option>
                  <option value="3BR">3 Bedroom</option>
                  <option value="4BR">4 Bedroom</option>
                  <option value="5BR">5 Bedroom</option>
                  <option value="6BR">6 Bedroom</option>
                  <option value="7BR">7 Bedroom</option>
                </select>
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="numGuests" className="text-slate-800 font-semibold">Number of Guests</label>
                <input
                  type="number"
                  id="numGuests"
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number(e.target.value))}
                  className="focus:outline-none focus:ring focus:border-primary border rounded-xl border-slate-400 p-2 w-full"
                  min="1"
                />
              </div>
              <div className="h-full flex items-end">
                <button type="submit" className="w-fit h-fit flex items-center gap-1 shadow-lg justify-center text-nowrap md:justify-center bg-secondary m-0 pt-2.5 pb-2 px-3 font-bold text-base rounded-md text-slate-50">
                  <Search size={20} /> <p>Search</p>
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
      <div className="w-full my-3"></div>
      <div className="bg-white w-screen mb-0 z-20">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full">
            <ClipLoader size={50} color={"#102C57"} loading={loading} />
            <p>One moment while we load your results...</p>
          </div>
        )}
        {error && <p>Error: {error}</p>}
        {available.length > 0 && (
          <div className="flex flex-col justify-start items-center pt-8">
            <h2 className="font-sans font-light border-b-2 border-slate-700 text-3xl text-cyan-900 bb-4 text-center">Available for Instant Booking!</h2>
            <button onClick={clearResults} className="bg-red-600 text-white w-1/5 py-3 px-1 my-6 rounded-md">
              Clear Search Display
            </button>
          </div>
        )}
        <div className="flex gap-1 w-screen h-full p-3">
          <div className="h-full w-full overflow-y-auto max-h-[100vh]">
            {available.length > 0 && (
              <div className="search-results overflow-y-auto grid grid-cols-1 gap-x-6 gap-y-1 px-4">
                {available.map((property) => (
                  <a href={property._id} key={property._id}>
                    <article className="bg-white w shadow-lg shadow-slate-300/30 h-fit border border-slate-500/30 rounded-md">
                      <div className="result-item">
                        <img className="w-full object-cover" src={property.pictures[0].original} alt={property.picture.caption} />
                        <div className="p-4 text-normal flex flex-col gap-4">
                          <h3 className="text-sm font-bold text-slate-900">{property.title}</h3>
                          <p className="text-sm font-light">{property.address.city}, {property.address.state}</p>
                          <div className="border border-stone-300"></div>
                          <div className="flex min-h-min flex-row justify-start align-bottom">
                            <button className="text-slate-900 font-extrabold">${property.prices.basePrice} Night</button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-full max-h-[100vh]"><GoogleMap listings={available} /></div>
        
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySearch;