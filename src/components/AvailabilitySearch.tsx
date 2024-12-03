import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/global.scss';
import { addDays } from "date-fns";
import { ClipLoader } from 'react-spinners';
import DateRangePickerComponent from './ui/DateRangePickerComponent';
import Modal from './ui/Modal';
import GoogleMap from './GoogleMap'; // Import the GoogleMap component
import FilterComponent from './ui/FilterComponent'; // Import the FilterComponent

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
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: addDays(new Date(), 7), key: 'selection' }]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedBedroomAmount, setSelectedBedroomAmount] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false); // Add state to track the visibility of the filter modal
  const [isResultsModalOpen, setIsResultsModalOpen] = useState<boolean>(false); // Add state to track the visibility of the results modal

  const apiUrl = '/.netlify/functions/availability';

  const listingRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const resultsContainerRef = useRef<HTMLDivElement>(null); // Add reference to the results container

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
      let url = `${apiUrl}?checkIn=${encodeURIComponent(dateRange[0].startDate.toISOString().slice(0, 10))}&checkOut=${encodeURIComponent(dateRange[0].endDate.toISOString().slice(0, 10))}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}${tagsQuery ? `&tags=${encodeURIComponent(tagsQuery)}` : ''}`;
      
      if (selectedLocation) {
        url += `&city=${encodeURIComponent(selectedLocation)}`;
      }

      if (selectedBedroomAmount) {
        url += `&bedroomAmount=${encodeURIComponent(selectedBedroomAmount)}`;
      }

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
      setFilteredListings(filteredListings); // Set the filtered listings to the initial search results

      // Scroll to the top of the results container
      if (resultsContainerRef.current) {
        resultsContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      // Open the results modal
      setIsResultsModalOpen(true);
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
    setFilteredListings([]);
    setSearchAttempted(false);
    setIsResultsModalOpen(false); // Close the results modal
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filters: any) => {
    let filtered = [...available];

    if (filters.priceOrder) {
      if (filters.priceOrder === 'lowToHigh') {
        filtered = filtered.sort((a, b) => a.prices.basePrice - b.prices.basePrice);
      } else if (filters.priceOrder === 'highToLow') {
        filtered = filtered.sort((a, b) => b.prices.basePrice - a.prices.basePrice);
      }
    }

    if (filters.bedroomCount) {
      filtered = filtered.filter(listing => {
        if (filters.bedroomCount === 'studio') {
          return listing.bedrooms === 0;
        }
        return listing.bedrooms === parseInt(filters.bedroomCount, 10);
      });
    }

    if (filters.selectedTags && filters.selectedTags.length > 0) {
      filtered = filtered.filter(listing => filters.selectedTags.every(tag => listing.publicDescription.summary.includes(tag)));
    }

    if (filters.selectedCity) {
      filtered = filtered.filter(listing => listing.address.city === filters.selectedCity);
    }

    setFilteredListings(filtered);
  };

  const resetFilters = () => {
    setFilters({});
    setFilteredListings(available);
  };

  const handleMarkerClick = (id: string) => {
    const listingElement = listingRefs.current[id];
    if (listingElement) {
      listingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col pt-5 justify-center items-center bg-secondary/10">
      <a href="/" className="absolute left-5 top-6">
        <img
          src="/images/lp-final-top.png"
          alt="logo"
          className="xs:w-44 xs:h-8 md:w-64"
        />
      </a>
      <div className="flex flex-col md:flex-row justify-center align-middle w-full">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-4/5 md:w-1/4 mx-auto h-fit flex flex-col items-start gap-1 shadow-lg justify-start bg-gray-100 pt-2.5 pb-0.5 px-3 font-bold text-base text-start rounded-lg text-secondary"
        >
          <span className="flex w-fit items-start justify-start text-start gap-1"><Search size={20} /> <p>Search Where</p></span><span className="flex justify-center self-center items-end"><p>When - Where - Who</p></span>
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} showCloseButton>
        <form onSubmit={handleSubmit} className="flex flex-col justify-start bg-zinc-100 items-center h-full rounded-md p-8">
          <div className="flex flex-col items-center justify-center w-full px-6">
            <div className="flex flex-col justify-center items-center gap-4 w-full pt-6 md:pt-0">
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

      <Modal isOpen={isResultsModalOpen} onClose={clearResults} fullScreen>
        <div className={`bg-white w-screen h-screen z-20`}>
          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <ClipLoader size={50} color={"#102C57"} loading={loading} />
              <p>One moment while we load your results...</p>
            </div>
          )}
          {error && <p>Error: {error}</p>}
          {available.length > 0 && (
            <div className="flex flex-col justify-start items-center ">
              <button onClick={clearResults} className="bg-gray-600 text-white md:w-1/5 px-3 py-2 font-semibold my-3 rounded-md">
                Clear Search Display
              </button>
            </div>
          )}
          {available.length > 0 && (
            <div className="flex flex-col gap-3 w-screen h-screen">
              <div ref={resultsContainerRef} className="w-full">
                <FilterComponent onFilterChange={handleFilterChange} onResetFilters={resetFilters} cities={cities} />
              </div>
              <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-0 w-full h-full">
                <div className="h-full flex flex-col w-full md:w-2/3 overflow-y-auto">
                  <div className="search-results h-full w-full overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 self-center px-2">
                    {filteredListings.length > 0 ? (
                      filteredListings.map((property) => (
                        <a href={property._id} key={property._id} ref={(el) => (listingRefs.current[property._id] = el)}>
                          <article className="bg-white w-full flex flex-col shadow-lg shadow-slate-300/30 h-full border border-slate-500/30 rounded-md">
                            <div className="result-item h-full flex flex-col justify-between">
                              <div>
                                <img className="w-full md:h-auto md:w-fit md:object-center shadow-lg" src={property.pictures[0].original} alt={property.picture.caption} />
                                <div className="p-4">
                                  <h3 className="text-sm font-bold text-slate-900">{property.title}</h3>
                                  <p className="text-sm font-light">{property.address.city}, {property.address.state}</p>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="border md:w-1/2 border-stone-300"></div>
                                <div className="flex min-h-min flex-row justify-start align-bottom">
                                  <button className="text-slate-900 font-extrabold"><strong>Starting at:</strong> ${property.prices.basePrice} Night</button>
                                </div>
                              </div>
                            </div>
                          </article>
                        </a>
                      ))
                    ) : (
                      <p className="pt-12 text-center">No results - try adjusting the filters or click on Reset Filters</p>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-2/3 md:h-full">
                  <GoogleMap listings={filteredListings} onMarkerClick={handleMarkerClick} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AvailabilitySearch;