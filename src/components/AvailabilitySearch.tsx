import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from "date-fns";
import { ClipLoader } from 'react-spinners';
import DateRangePickerComponent from './ui/DateRangePickerComponent';
import Modal from './ui/Modal';
import GoogleMap from './GoogleMap'; // Import the GoogleMap component
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

const allowedTags = ["Pets"];
const CACHE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

const AvailabilitySearch: React.FC = () => {
  const [minOccupancy, setMinOccupancy] = useState<number>(1);
  const [numGuests, setNumGuests] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [available, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState([{ startDate: addDays(new Date(), 1), endDate: addDays(new Date(), 3), key: 'selection' }]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedBedroomAmount, setSelectedBedroomAmount] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<number[]>([]);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState<boolean>(false);
  const [isSearchComplete, setIsSearchComplete] = useState<boolean>(false);
  const [displayedItems, setDisplayedItems] = useState<number>(1); // Initialize with 1 item
  const [nextSkip, setNextSkip] = useState<number | null>(0); // Initialize nextSkip

  const apiUrl = '/.netlify/functions/availability';

  const listingRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastListingElementRef = useRef<HTMLAnchorElement | null>(null);

  const cache = useRef<{ [key: string]: any[] }>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [citiesResponse, bedroomsResponse, tagsResponse] = await Promise.all([
          fetch('/.netlify/functions/availability?fetchCities=true'),
          fetch('/.netlify/functions/availability?fetchBedrooms=true'),
          fetch('/.netlify/functions/searchTags')
        ]);

        if (!citiesResponse.ok || !bedroomsResponse.ok || !tagsResponse.ok) {
          throw new Error('Failed to fetch initial data');
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
        const allowedTags = ["Public_pool", "Ocean_view", "web_featured", "Ocean_front", "Pets"];
        const filteredTags = tagsData.results.filter((tag: string) => allowedTags.includes(tag));
        setTags(filteredTags);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load initial data');
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedHandleSubmit(e);
  };

  const debouncedHandleSubmit = debounce(async (e: React.FormEvent) => {
    setLoading(true);
    setError('');
    setSearchAttempted(true);

    try {
      const tagsQuery = allowedTags.join(',');
      const startDate = dateRange[0].startDate.toISOString().slice(0, 10);
      const endDate = dateRange[0].endDate.toISOString().slice(0, 10);
      const cacheKey = `${startDate}-${endDate}-${minOccupancy}-${selectedLocation}-${selectedBedroomAmount}-${tagsQuery}`;

      if (cache.current[cacheKey]) {
        console.log('Returning cached results');
        setListings(cache.current[cacheKey]);
        setFilteredListings(cache.current[cacheKey]);
        setDisplayedItems(1); // Initialize with 1 item
        setLoading(false);
        setIsResultsModalOpen(true);
        setIsSearchComplete(true);
        return;
      }

      let url = `${apiUrl}?checkIn=${encodeURIComponent(startDate)}&checkOut=${encodeURIComponent(endDate)}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}${tagsQuery ? `&tags=${encodeURIComponent(tagsQuery)}` : ''}`;

      if (selectedLocation) {
        url += `&location=${encodeURIComponent(selectedLocation)}`;
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
        setIsResultsModalOpen(true);
        setIsSearchComplete(true);
        return;
      }

      const filteredListings = data.results.filter((listing: any) => listing.accommodates >= minOccupancy);

      setListings(filteredListings);
      setFilteredListings(filteredListings);
      setDisplayedItems(1); // Initialize with 1 item
      cache.current[cacheKey] = filteredListings;

      console.log('Filtered Listings:', filteredListings);

      if (resultsContainerRef.current) {
        resultsContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      setIsResultsModalOpen(true);
      setIsSearchComplete(true);
      setNextSkip(data.nextSkip || null); // Set nextSkip value

      if (data.partial) {
        await fetchRemainingResults(startDate, endDate, minOccupancy, selectedLocation, selectedBedroomAmount, tagsQuery, cacheKey, data.nextSkip);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, 300);

  const fetchRemainingResults = async (startDate: string, endDate: string, minOccupancy: number, selectedLocation: string, selectedBedroomAmount: string, tagsQuery: string, cacheKey: string, skip: number | null) => {
    let hasMoreResults = true;

    while (hasMoreResults && skip !== null) {
      try {
        let url = `${apiUrl}?checkIn=${encodeURIComponent(startDate)}&checkOut=${encodeURIComponent(endDate)}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}${tagsQuery ? `&tags=${encodeURIComponent(tagsQuery)}` : ''}&skip=${skip}`;

        if (selectedLocation) {
          url += `&location=${encodeURIComponent(selectedLocation)}`;
        }

        if (selectedBedroomAmount) {
          url += `&bedroomAmount=${encodeURIComponent(selectedBedroomAmount)}`;
        }

        console.log('Fetching remaining results from URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch remaining listings: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched remaining Data:', data);

        if (data.results) {
          const filteredListings = data.results.filter((listing: any) => listing.accommodates >= minOccupancy);
          setListings(prevListings => [...prevListings, ...filteredListings]);
          setFilteredListings(prevListings => [...prevListings, ...filteredListings]);
          cache.current[cacheKey] = [...cache.current[cacheKey], ...filteredListings];
        }

        hasMoreResults = data.partial;
        skip = data.nextSkip || null; // Update skip value
      } catch (err) {
        console.error('Error fetching remaining results:', err);
        setError(err.message || 'An error occurred');
        hasMoreResults = false;
      }
    }
  };

  const clearResults = () => {
    setListings([]);
    setFilteredListings([]);
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

  // Determine the grid columns based on the number of filtered listings
  const getGridColsClass = () => {
    if (filteredListings.length >= 4) {
      return 'md:grid-cols-2 xxl:grid-cols-3';
    } else if (filteredListings.length >= 1 && filteredListings.length <= 4) {
      return 'grid-cols-2';
    } else {
      return 'grid-cols-2';
    }
  };

  const currentListings = useMemo(() => {
    return filteredListings.slice(0, displayedItems);
  }, [filteredListings, displayedItems]);

  const loadMoreListings = useCallback(() => {
    if (displayedItems < filteredListings.length) {
      setDisplayedItems(prev => prev + 1);
    }
  }, [displayedItems, filteredListings.length]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreListings();
      }
    });

    if (lastListingElementRef.current) {
      observerRef.current.observe(lastListingElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreListings]);

  return (
    <div className="availability-search w-full flex flex-col pt-5 justify-center items-center bg-secondary/10">
      {loading && available.length < 6 && (
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
          className="w-4/5 md:w-1/4 mx-auto h-fit z-50 flex flex-col items-start gap-1 shadow-lg justify-start bg-gray-100 pt-2.5 pb-0.5 px-3 font-bold text-base text-start rounded-lg text-secondary"
        >
          <span className="flex w-fit items-start justify-start text-start gap-1"><Search size={20} /> <p>Search Where</p></span><span className="flex justify-center self-center items-end"><p>When - Where - Who</p></span>
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="z-50">
        <form onSubmit={handleSubmit} className="flex flex-col justify-center bg-zinc-100 items-center h-full md:h-1/2 rounded-md p-7">
          <div className="flex flex-col items-center justify-center w-full px-6">
            <div className="flex flex-col justify-center items-center gap-1 w-full">
              <div className="w-full flex flex-col">
                <label className="text-slate-800 font-semibold" htmlFor="dateRange">Select Dates:</label>
                <DateRangePickerComponent
                  state={dateRange}
                  setState={setDateRange}
                  disabledDates={[]}
                  onClick={async () => {
                    const checkIn = dateRange[0].startDate.toISOString().split('T')[0];
                    const checkOut = dateRange[0].endDate ? dateRange[0].endDate.toISOString().split('T')[0] : new Date(checkIn).toISOString().split('T')[0]; // Default to one day if endDate is not selected
                    const minOccupancy = 1;
                    const city = 'North Myrtle Beach';
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
                  }}
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
                  <option value="any">Any City</option>
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
                  <option value="">Any</option>
                  {bedroomOptions.map(bedroom => (
                    <option key={bedroom} value={bedroom}>{bedroom === 0 ? 'Studio' : `${bedroom} Bedroom${bedroom > 1 ? 's' : ''}`}</option>
                  ))}
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
      <Modal isOpen={isResultsModalOpen} onClose={clearResults} fullScreen showCloseButton>
        <div className={`bg-white overflow-hidden m-0 z-20 ${available.length > 0 ? 'h-screen' : ''}`}>
          {error && <p>Error: {error}</p>}
          <div className="w-full">
            <FilterComponent
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              cities={cities}
              tags={tags}
              amenities={amenities}
              initialPriceOrder={filters.priceOrder || ''}
              initialBedroomCount={Number(filters.bedroomCount) || 0}
              initialSelectedCity={filters.selectedCity || ''}
              initialSelectedAmenities={filters.selectedAmenities || []}
              initialSelectedTags={filters.selectedTags || []}
              showBedroomFilter={selectedBedroomAmount === ''}
              bedroomOptions={bedroomOptions}
            />
          </div>

          {available.length > 0 ? (
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 w-screen h-screen">
              <div className="md:hidden h-96 flex flex-col w-full max-h-[100vh] mt-1">
                <GoogleMap listings={filteredListings} onMarkerClick={handleMarkerClick} selectedCity={selectedLocation || "North Myrtle Beach"} />
              </div>
              <div ref={resultsContainerRef} className="h-full overflow-y-auto flex flex-col items-center w-full max-h-[100vh]">

                <div className="text-center py-2 md:py-4">
                  <h2 className="text-xl font-semibold">Available Listings</h2>
                  <p className="text-sm text-muted-400">
                    {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`search-results h-full w-full overflow-y-auto flex flex-col items-centergap-4 md:grid md:mr-0 md:grid-cols-2 xxl:${getGridColsClass()} 
                  gap-x-12 gap-y-1 place-items-center justify-items-start px-2 pb-40 mb-40`}>
                  {currentListings.length > 0 ? (
                    currentListings.map((property, index) => {
                      const price = property.prices.length > 0 ? property.prices[0].price : property.basePrice;
                      if (index === currentListings.length - 1) {
                        return (
                          <a href={property._id} key={property._id} ref={(el) => { listingRefs.current[property._id] = el; lastListingElementRef.current = el; }}>
                            <article className="flex flex-col bg-white shadow-lg shadow-muted-300/30 w-full h-full mb-4 rounded-xl relative">
                              <div className="relative w-full h-56 lg:h-64">
                                <img
                                  className="absolute inset-0 w-full h-full object-cover"
                                  src={property.pictures[0].original}
                                  alt={property.picture.caption}
                                />
                                <div className="absolute inset-0 bg-neutral-950/50" />
                              </div>
                              <div className="p-2 w-full bg-white flex flex-col justify-start ">
                                <h4 className="font-sans text-wrap font-medium text-xl text-slate-900">
                                  {property.title}
                                </h4>
                                <p className="text-sm text-muted-400">
                                  {property.address.city}, {property.address.state}
                                </p>
                                <span className="hidden">{property.bedrooms}</span>
                                <hr className="border border-muted-200 dark:border-muted-800 my-2" />
                                <div className="flex items-end h-full">
                                  <p className="font-semibold text-base text-nowrap">Starting at ${price} Per Night</p>
                                </div>
                              </div>
                            </article>
                          </a>
                        );
                      } else {
                        return (
                          <a href={property._id} key={property._id} ref={(el) => (listingRefs.current[property._id] = el)}>
                            <article className="flex flex-col bg-white shadow-lg shadow-muted-300/30 w-full h-full mb-4 rounded-xl relative">
                              <div className="relative w-full h-56 lg:h-64">
                                <img
                                  className="absolute inset-0 w-full h-full object-cover"
                                  src={property.pictures[0].original}
                                  alt={property.picture.caption}
                                />
                                <div className="absolute inset-0 bg-neutral-950/50" />
                              </div>
                              <div className="p-2 w-full bg-white flex flex-col justify-start">
                                <h4 className="font-sans text-wrap font-medium text-normal lg:text-xl text-slate-900">
                                  {property.title}
                                </h4>
                                <p className="text-sm text-muted-400">
                                  {property.address.city}, {property.address.state}
                                </p>
                                <span className="hidden">{property.bedrooms}</span>
                                <hr className="border border-muted-200 dark:border-muted-800 my-2" />
                                <div className="flex items-end h-full">
                                  <p className="font-semibold text-sm lg:text-base text-nowrap">Starting at ${price} Per Night</p>
                                </div>
                              </div>
                            </article>
                          </a>
                        );
                      }
                    })
                  ) : (
                    <p className="pt-12 text-center">No results - try adjusting the filters or click on Reset Filters</p>
                  )}
                  <div className="flex justify-center items-center w-full ml-70 mt-12">
                    {loading && available.length >= 6 && (
                      <div className="h-40 w-full pl-96">
                        <ClipLoader size={70} color={"#123abc"} loading={true} />
                      </div>
                    )}
                  </div>
                </div>


              </div>
              <div className="w-full md:h-full md:pb-20 xl:pr-4">
                <GoogleMap listings={filteredListings} onMarkerClick={handleMarkerClick} selectedCity={selectedLocation || "North Myrtle Beach"} />
              </div>
              <div className="md:hidden flex justify-center items-baseline mt-4 h-fit w-full md:w-1/4">
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="w-2/3 flex gap-1 text-lg justify-center font-semibold bg-secondary text-white py-1.5 rounded-md"
                >
                  <SlidersHorizontal />  Filter
                </button>
                <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} className="z-40 h-3/4">
                  <FilterComponent
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    cities={cities}
                    tags={tags}
                    amenities={amenities}
                    initialPriceOrder={filters.priceOrder || ''}
                    initialBedroomCount={Number(filters.bedroomCount) || 0} // Ensure it's a number
                    initialSelectedCity={filters.selectedCity || ''}
                    initialSelectedAmenities={filters.selectedAmenities || []}
                    initialSelectedTags={filters.selectedTags || []}
                    showBedroomFilter={selectedBedroomAmount === ''}
                    bedroomOptions={bedroomOptions}
                  />
                </Modal>
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-0 w-screen h-screen">
              <div className="h-full flex flex-col w-full md:w-2/3 max-h-[100vh]">
                <div className="flex flex-col items-center justify-start h-full">
                  <p className="pt-12 text-center">Sorry, no results were displayed. Please try your search again.</p>
                  <button className="lp-button mt-4"><a href="/">Back to Search</a></button>
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