import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from "date-fns";
import { ClipLoader } from 'react-spinners';
import DateRangePickerComponent from './ui/DateRangePickerComponent';
import Modal from './ui/Modal';
import GoogleMap from './GoogleMap';
import FilterComponent from './ui/FilterComponent';
import { debounce } from 'lodash';

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
  accommodates: number;
  amenities: string[];
  tags: string[];
}
const allowedTags = [];

const AvailabilitySearch: React.FC = () => {
  const [minOccupancy, setMinOccupancy] = useState<number>(1);
  const [numGuests, setNumGuests] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [available, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [mapListings, setMapListings] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState([{ startDate: addDays(new Date(), 1), endDate: addDays(new Date(), 3), key: 'selection' }]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedBedroomAmount, setSelectedBedroomAmount] = useState<string>();
  const [cities, setCities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<number[]>([]);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState<boolean>(false);
  const [isSearchComplete, setIsSearchComplete] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(100); // Number of items per page
  const [validationError, setValidationError] = useState<string>('');

  const apiUrl = '/.netlify/functions/availability';

  const listingRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const cache = useRef<{ [key: string]: any[] }>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [citiesResponse, bedroomsResponse, tagsResponse] = await Promise.all([
          fetch('/.netlify/functions/availability?fetchCities=true'),
          fetch('/.netlify/functions/availability?fetchBedrooms=true'),
          fetch('/.netlify/functions/searchTags')
        ]);

        if (!citiesResponse.ok) {
          throw new Error(`Failed to fetch cities: ${citiesResponse.statusText}`);
        }
        if (!bedroomsResponse.ok) {
          throw new Error(`Failed to fetch bedrooms: ${bedroomsResponse.statusText}`);
        }
        if (!tagsResponse.ok) {
          throw new Error(`Failed to fetch tags: ${tagsResponse.statusText}`);
        }

        const citiesData = await citiesResponse.json();
        const bedroomsData = await bedroomsResponse.json();
        const tagsData = await tagsResponse.json();

        if (citiesData.results) {
          setCities(citiesData.results);
        } else {
          setCities([]);
        }

        if (bedroomsData.results) {
          const sortedBedrooms = bedroomsData.results.sort((a: number, b: number) => a - b);
          setBedroomOptions(sortedBedrooms);
        } else {
          setBedroomOptions([]);
        }

        if (tagsData.error) {
          throw new Error(tagsData.error);
        }
        const allowedTags = ["Public_pool", "Ocean_view", "Ocean_front", "Pets"];
        const filteredTags = tagsData.results.filter((tag: string) => allowedTags.includes(tag));
        setTags(filteredTags);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load initial data');
      }
    };

    fetchInitialData();
  }, []);

  const handleCityClick = async (city: string | null): Promise<void> => {
    setSelectedLocation(city || '');
    if (city) {
      let filteredListings: Listing[];
      if (city === 'Myrtle Beach') {
        filteredListings = available.filter(listing =>
          listing.address.city === 'Myrtle Beach' ||
          listing.address.city === 'Surfside Beach' ||
          listing.address.city === 'Murrells Inlet'
        );
      } else if (city === 'North Myrtle Beach') {
        filteredListings = available.filter(listing =>
          listing.address.city === 'North Myrtle Beach' ||
          listing.address.city === 'Little River'
        );
      }
      else if (city === 'All') {
        filteredListings = available;
      }
      else {
        filteredListings = available.filter(listing => listing.address.city === city);
      }
      setFilteredListings(filteredListings);
      setMapListings(filteredListings);
    } else {
      setFilteredListings(available);
      setMapListings(available);
    }
  };

  const citySelection = async (city: string | null): Promise<void> => {
    if (!city) {
      setFilteredListings(available);
      setMapListings(available);
      return;
    }

    let filteredListings: Listing[] = [];

    // Grouping related locations under each selection
    const locationMapping: Record<string, string[]> = {
      'Myrtle Beach': ['Myrtle Beach', 'Surfside Beach', 'Murrells Inlet'],
      'North Myrtle Beach': ['North Myrtle Beach', 'Little River']
    };

    // If city is in mapping, filter by all associated locations
    if (locationMapping[city]) {
      filteredListings = available.filter(listing =>
        locationMapping[city].includes(listing.address.city)
      );
    } else {
      // If city is not in mapping, just filter by the exact city
      filteredListings = available.filter(listing => listing.address.city === city);
    }

    // Update the state with the filtered results
    setSelectedLocation(city);
    setFilteredListings(filteredListings);
    setMapListings(filteredListings);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) {
      setValidationError('Please select a city.');
      return;
    }
    setValidationError('');
    debouncedHandleSubmit(e);
  };

  const debouncedHandleSubmit = debounce(async (e: React.FormEvent | null) => {
    setLoading(true);
    setError('');
    setSearchAttempted(true);

    try {
      const tagsQuery = allowedTags.join(',');
      const startDate = dateRange[0].startDate.toISOString().slice(0, 10);
      const endDate = dateRange[0].endDate.toISOString().slice(0, 10);
      const cacheKey = `${startDate}-${endDate}-${minOccupancy}-${selectedLocation}-${selectedBedroomAmount}-${tagsQuery}-${currentPage}-${itemsPerPage}`;

      if (cache.current[cacheKey]) {
        console.log('Returning cached results');
        setListings(cache.current[cacheKey]);
        setFilteredListings(cache.current[cacheKey]);
        setMapListings(cache.current[cacheKey]);
        setLoading(false);
        setIsResultsModalOpen(true);
        setIsSearchComplete(true);
        return;
      }

      let url = `${apiUrl}?checkIn=${encodeURIComponent(startDate)}&checkOut=${encodeURIComponent(endDate)}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}${tagsQuery ? `&tags=${encodeURIComponent(tagsQuery)}` : ''}&page=${currentPage}&limit=${itemsPerPage}`;

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
      console.log('Fetched Data:', data);

      if (!data.results) {
        setError('No results found');
        setListings([]);
        setFilteredListings([]);
        setMapListings([]);
        setIsResultsModalOpen(true);
        setIsSearchComplete(true);
        return;
      }

      const filteredListings = data.results.filter((listing: any) => listing.accommodates >= minOccupancy);

      setListings(filteredListings);
      setFilteredListings(filteredListings);
      setMapListings(filteredListings);
      cache.current[cacheKey] = filteredListings;

      console.log('Filtered Listings:', filteredListings);

      if (resultsContainerRef.current) {
        resultsContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      setIsResultsModalOpen(true);
      setIsSearchComplete(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, 300);

  const clearResults = () => {
    setListings([]);
    setFilteredListings([]);
    setMapListings([]);
    setSearchAttempted(false);
    setIsResultsModalOpen(false);
    setIsSearchComplete(false);
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
      filtered = filtered.filter(listing => listing.bedrooms === Number(filters.bedroomCount));
    }

    if (filters.selectedTags && filters.selectedTags.length > 0) {
      filtered = filtered.filter(listing => filters.selectedTags.every(tag => listing.tags.includes(tag)));
    }

    if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
      filtered = filtered.filter(listing => filters.selectedAmenities.every(amenity => listing.amenities.includes(amenity)));
    }

    if (filters.selectedCity) {
      filtered = filtered.filter(listing => listing.address.city === filters.selectedCity);
    }

    setFilteredListings(filtered);
    setMapListings(filtered);
  };

  const resetFilters = () => {
    setFilters({});
    setFilteredListings(available);
    setMapListings(available);
  };

  const handleMarkerClick = (id: string) => {
    const listingElement = listingRefs.current[id];
    if (listingElement) {
      listingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    debouncedHandleSubmit(null);
  };

  const handleDateChange = async () => {
    const checkIn = dateRange[0].startDate.toISOString().split('T')[0];
    const checkOut = dateRange[0].endDate ? dateRange[0].endDate.toISOString().split('T')[0] : new Date(checkIn).toISOString().split('T')[0]; // Default to one day if endDate is not selected
    const minOccupancy = 1;
    const city = 'All';
    const bedroomAmount = 1;

    const cacheKey = `${checkIn}-${checkOut}-${minOccupancy}-${city}-${bedroomAmount}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (!cachedData) {
      try {
        const response = await fetch(`/.netlify/functions/availability?checkIn=${checkIn}&checkOut=${checkOut}&minOccupancy=${minOccupancy}&city=${city}&bedroomAmount=${bedroomAmount}`);
        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (error) {
        console.error('Error prefetching data:', error);
      }
    }
  };

  const paginatedListings = filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getGridColumns = (length: number) => {
    if (length > 3 && length % 2 === 0) {
      return 'md:grid-cols-2 xl:grid-cols-3';
    } else if (length > 3 && length % 2 !== 0) {
      return 'md:grid-cols-3 xl:grid-cols-3';
    } else {
      return 'md:grid-cols-2 xl:grid-cols-3';
    }
  };

  return (
    <div className="availability-search w-full flex flex-col pt-5 justify-center items-center bg-secondary/10">
      {loading && (
        <div className="progress-bar">
          <motion.div
            className="progress-bar-inner"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-center align-middle w-full">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-4/5 md:w-1/4 mx-auto h-fit z-30 flex items-start gap-1 shadow-lg justify-start bg-gray-100 pt-2.5 px-3 font-bold text-base text-start rounded-lg text-secondary"
        >
          <span className="flex w-fit items-start justify-start text-start"><Search size={20} /> <p>Search</p></span><span className="pt-4 pr-16 inline-flex justify-center text-center w-full self-center place-self-start"><p>When - Where</p></span>
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="md:mb-80  items-center h-full" showCloseButton={true}>
        <form onSubmit={handleSubmit} className="flex justify-center items-center bg-zinc-100 w-full h-full md:h-auto rounded-md py-5">
          <div className="flex flex-col items-center justify-center w-full px-4">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full text-lg">
              <div className="w-full flex flex-col">
                <DateRangePickerComponent
                  state={dateRange}
                  setState={setDateRange}
                  disabledDates={[]}
                  onDateChange={handleDateChange} // Use the new onDateChange prop
                />
                <button type="submit" className="my-1 flex items-center gap-1 shadow-lg justify-center text-nowrap md:justify-center bg-secondary m-0 pt-2.5 pb-2 px-3 font-bold text-base rounded-md text-slate-50">
                  <Search size={20} /> <p>Search</p>
                </button>
              </div>
              <div className="hidden w-full">
                <label htmlFor="bedroomAmount" className="text-slate-800 font-semibold">Bedroom Amount:</label>
                <select
                  id="bedroomAmount"
                  value={selectedBedroomAmount}
                  onChange={(e) => setSelectedBedroomAmount(e.target.value)}
                  className="border rounded-xl border-slate-400 p-2 w-full"
                >
                  <option value="">Any</option>
                  {bedroomOptions.map(bedroom => (
                    <option key={bedroom} value={bedroom}>{bedroom === 0 ? 'Studio' : `${bedroom} Bedroom${bedroom > 1 ? 's' : ''}`}</option>
                  ))}
                </select>
              </div>
              <div className=" hidden">
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
              </div>
            </div>

          </div>
        </form>
      </Modal>
      <div className="w-full my-3"></div>

      <Modal isOpen={isResultsModalOpen} onClose={clearResults} fullScreen showCloseButton>
        <div className={`bg-white m-0 z-20 ${available.length > 0 ? 'h-screen' : ''}`}>
          {error && <p>Error: {error}</p>}
          <div className="w-full">
            <FilterComponent
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              cities={cities}
              amenities={amenities}
              tags={tags}
              bedroomOptions={bedroomOptions}
              initialPriceOrder={filters.priceOrder || ''}
              initialBedroomCount={Number(filters.bedroomCount) || 0}
              initialSelectedCity={filters.selectedCity || ''}
              initialSelectedAmenities={filters.selectedAmenities || []}
              initialSelectedTags={filters.selectedTags || []}
              showBedroomFilter={selectedBedroomAmount === ''}
              onCityClick={handleCityClick}
              setActiveCity={setSelectedLocation}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:gap-0 w-full h-screen">
            <div className="md:hidden h-1/2 flex flex-col w-full max-h-[100vh] mt-1">
              <GoogleMap listings={mapListings} onMarkerClick={handleMarkerClick} selectedCity={selectedLocation} />
              <div className="text-center py-1 md:py-8">
                <h2 className="text-xl font-semibold">Available Listings</h2>
                <p className="text-sm text-muted-400">
                  {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div ref={resultsContainerRef} className=" h-full overflow-y-auto flex flex-col items-center w-full max-h-[100vh]">
              <div className="hidden md:block text-center py-1 md:pt-8">
                <h2 className="text-xl font-semibold">Available Listings</h2>
                <p className="text-sm text-muted-400">
                  {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
                </p>
              </div>
              <div className="w-full text-center py-2">
                <p className="text-lg font-semibold">{filteredListings.length} results found</p>
              </div>
              <div
                className={`md:search-results h-fit w-full sm:flex flex-col justify-start xs:items-stretch md:items-start gap-4 md:gap-0 md:grid md:mr-0 ${getGridColumns(paginatedListings.length)} md:gap-x-4 md:gap-y-4 px-2 pb-16`}>
                {paginatedListings.length > 0 ? (
                  paginatedListings.map((property, index) => {
                    const price = property.prices.length > 0 ? property.prices[0].price : property.basePrice;
                    return (
                      <a href={property._id} key={property._id} ref={(el) => { listingRefs.current[property._id] = el; }}>
                        <article className="flex flex-col items-start bg-white shadow-lg shadow-muted-300/30 w-full h-80 rounded-xl relative overflow-hidden">
                          <div className="relative w-full h-48">
                            <img
                              className="absolute inset-0 w-full h-full object-cover"
                              src={property.pictures[0].original}
                              alt={property.picture.caption}
                            />
                            <div className="absolute inset-0 bg-neutral-950/50" />
                          </div>
                          <div className="p-2 w-full bg-white flex flex-col justify-start flex-grow">
                            <h4 className="font-sans text-wrap font-medium text-lg text-slate-900">
                              {property.title}
                            </h4>
                            <p className="text-sm text-muted-400">
                              {property.address.city}, {property.address.state}
                            </p>
                            <div className="flex items-end h-full">
                              <p className="font-semibold text-base text-nowrap">Average price per night - ${price}</p>
                            </div>
                          </div>
                        </article>
                      </a>
                    );
                  })
                ) : (
                  <div className="flex justify-center w-full h-full col-span-4">
                    <p className="text-base text-center w-full text-nowrap">No results - try adjusting the filters or click on Reset Filters</p>
                  </div>
                )}
                {filteredListings.length > itemsPerPage && (
                  <div className="flex justify-center items-center w-full my-6 pb-6 col-span-3">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 mx-2 bg-secondary text-white rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">{currentPage}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={paginatedListings.length < itemsPerPage}
                      className="px-4 py-2 mx-2 bg-secondary text-white rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:flex w-full md:h-full object">
              <GoogleMap listings={mapListings} onMarkerClick={handleMarkerClick} selectedCity={selectedLocation} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default AvailabilitySearch;