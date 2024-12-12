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
import LazyLoad from 'react-lazyload';

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
  amenities: string[]; // Add amenities property
  tags: string[]; // Add tags property
}

const allowedAmenities = ["Ocean_front", "Ocean_view", "web_featured", "Public_pool"];
const allowedTags = ["Pets"];

const tagDisplayNames: { [key: string]: string } = {
  "Ocean_front": "Ocean Front",
  "Ocean_view": "Ocean View",
  "web_featured": "Featured",
  "Public_pool": "Pool",
  "Pets": "Pet Friendly"
};

const formatTag = (tag: string): string => {
  return tagDisplayNames[tag] || tag;
};

// const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
//   const toRad = (value: number) => (value * Math.PI) / 180;
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = toRad(lat2 - lat1);
//   const dLng = toRad(lat2 - lng2);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//     Math.sin(dLng / 2) * Math.sin(dLng / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in kilometers
// };

// const cityCoordinates: { [key: string]: { lat: number, lng: number } } = {
//   "North Myrtle Beach": { lat: 33.8160, lng: -78.6800 },
//   "Little River": { lat: 33.8732, lng: -78.6142 },
//   // Add other cities and their coordinates here
// };

// const sortListingsByDistance = (listings: Listing[], cityLat: number, cityLng: number): Listing[] => {
//   return listings.sort((a, b) => {
//     const distanceA = calculateDistance(cityLat, cityLng, a.address.lat, a.address.lng);
//     const distanceB = calculateDistance(cityLat, cityLng, b.address.lat, b.address.lng);
//     return distanceA - distanceB;
//   });
// };

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
  const [amenities, setAmenities] = useState<string[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<number[]>([]);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState<boolean>(false);
  const [isSearchComplete, setIsSearchComplete] = useState<boolean>(false); // Add state to track search completion

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

    const fetchBedroomOptions = async () => {
      try {
        const response = await fetch('/.netlify/functions/availability?fetchBedrooms=true');
        const data = await response.json();
        const sortedBedrooms = data.results.sort((a: number, b: number) => a - b);
        setBedroomOptions(sortedBedrooms);
      } catch (err) {
        console.error('Error fetching bedroom options:', err);
        setError('Failed to load bedroom options');
      }
    };

    const fetchTags = async () => {
      setLoading(true);
      try {
        const response = await fetch('/.netlify/functions/searchTags');
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        const allowedTags = ["Public_pool", "Ocean_view", "web_featured", "Ocean_front", "Pets"];
        const filteredTags = data.results.filter((tag: string) => allowedTags.includes(tag));
        setTags(filteredTags);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
    fetchBedroomOptions();
    fetchTags();
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
      console.log('Fetched Data:', data);

      if (!data.results) {
        setError('No results found');
        setListings([]);
        setFilteredListings([]);
        setIsResultsModalOpen(true);
        setIsSearchComplete(true);
        return;
      }

      const filteredListings = data.results.filter((listing: Listing) => listing.accommodates >= numGuests);

      setListings(filteredListings);
      setFilteredListings(filteredListings);

      if (resultsContainerRef.current) {
        resultsContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      setIsResultsModalOpen(true);
      setIsSearchComplete(true); // Set search completion state to true
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
    setFilteredListings([]);
    setSearchAttempted(false);
    setIsResultsModalOpen(false);
    setIsSearchComplete(false); // Reset search completion state
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
      // const selectedCity = cities.find(city => city === filters.selectedCity);
      // if (selectedCity) {
      //   const cityCoords = cityCoordinates[selectedCity];
      //   if (cityCoords) {
      //     filtered = sortListingsByDistance(filtered, cityCoords.lat, cityCoords.lng);
      //   }
      // }
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
    if (filteredListings.length >= 6) {
      return 'grid-cols-2 lg:grid-cols-3';
    } else if (filteredListings.length >= 1 && filteredListings.length <= 5) {
      return 'grid-cols-2';
    } else {
      return 'grid-cols-2';
    }
  };


  return (
    <div className="w-full flex flex-col pt-5 justify-center items-center bg-secondary/10">
      <div className="flex flex-col md:flex-row justify-center align-middle w-full">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-4/5 md:w-1/4 mx-auto h-fit flex flex-col items-start gap-1 shadow-lg justify-start bg-gray-100 pt-2.5 pb-0.5 px-3 font-bold text-base text-start rounded-lg text-secondary"
        >
          <span className="flex w-fit items-start justify-start text-start gap-1"><Search size={20} /> <p>Search Where</p></span><span className="flex justify-center self-center items-end"><p>When - Where - Who</p></span>
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center bg-zinc-100 items-center h-1/2 rounded-md p-7">
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
                  <option value="any">Any City</option> {/* Add the "Any City" option */}
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
        <div className={`bg-white w-screen overflow-y-auto m-0 z-20 ${available.length > 0 ? 'h-screen' : ''}`}>
          {loading && (
            <div ref={resultsContainerRef} className="flex flex-col items-center justify-center h-full">
              <ClipLoader size={50} color={"#102C57"} loading={loading} />
              <p>One moment while we load your results...</p>
            </div>
          )}
          {error && <p>Error: {error}</p>}
          <div className="w-full">
            <FilterComponent
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              cities={cities}
              tags={tags}
              amenities={amenities}
              initialPriceOrder={filters.priceOrder || ''}
              initialBedroomCount={filters.bedroomCount || ''}
              initialSelectedCity={filters.selectedCity || ''}
              initialSelectedAmenities={filters.selectedAmenities || []}
              initialSelectedTags={filters.selectedTags || []}
              showBedroomFilter={selectedBedroomAmount === ''}
            />
          </div>
          {available.length > 0 ? (
            <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-0 w-screen h-screen">
              <div ref={resultsContainerRef} className="h-full flex flex-col w-full md:w-2/3 overflow-y-auto max-h-[100vh]">
                <div className={`search-results h-full w-full overflow-y-auto grid ${getGridColsClass()} gap-x-6 gap-y-3 self-center px-2`}>
                  {filteredListings.length > 0 ? (
                    filteredListings.map((property) => (
                      <a href={property._id} key={property._id} ref={(el) => (listingRefs.current[property._id] = el)}>
                        <article className="xs:mx-2 flex flex-col bg-white shadow-lg shadow-muted-300/30 h-fit rounded-xl overflow-hidden relative">
                          <div className="relative w-full h-48">
                            <img
                              className="absolute inset-0 w-full h-full object-cover"
                              src={property.pictures[0].original}
                              alt={property.picture.caption}
                            />
                            <div className="absolute inset-0 bg-neutral-950/50" />
                          </div>
                          <div className="p-2 w-full bg-white flex flex-col justify-start flex-grow">
                            <h4 className="font-sans text-wrap font-medium text-xl text-slate-900">
                              {property.title}
                            </h4>
                            <p className="text-sm text-muted-400">
                              {property.address.city}, {property.address.state}
                            </p>
                            <span className="hidden">{property.bedrooms}</span>
                            <hr className="border border-muted-200 dark:border-muted-800 my-2" />
                            <div className="flex items-end h-full">
                              <button className="text-slate-900 font-extrabold mb-4">
                                <strong>Starting at:</strong> ${property.prices.basePrice} Night
                              </button>
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
                <GoogleMap listings={filteredListings} onMarkerClick={handleMarkerClick} selectedCity={selectedLocation || "Myrtle Beach"} />
              </div>
              <div className="md:hidden flex justify-center items-baseline mt-4 h-fit w-full md:w-1/4">
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="w-2/3 flex gap-1 text-lg justify-center font-semibold bg-secondary text-white py-1.5 rounded-md"
                >
                  <SlidersHorizontal />  Filter Search
                </button>
                <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
                  <FilterComponent
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    cities={cities}
                    tags={tags}
                    amenities={amenities}
                    initialPriceOrder={filters.priceOrder || ''}
                    initialBedroomCount={filters.bedroomCount || ''}
                    initialSelectedCity={filters.selectedCity || ''}
                    initialSelectedAmenities={filters.selectedAmenities || []}
                    initialSelectedTags={filters.selectedTags || []}
                    showBedroomFilter={selectedBedroomAmount === ''}
                  />
                </Modal>
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-0 w-screen h-screen">
              <div className="h-full flex flex-col w-full md:w-2/3 overflow-y-auto max-h-[100vh]">
                <div className="flex flex-col items-start justify-center h-full">
                  <p className="pt-12 text-center">Sorry, no results were displayed. Please try your search again.</p>
                    <button className="lp-button mt-4"><a href="/">Back to Search</a></button>
                </div>
              </div>
              <div className="w-full md:w-2/3 md:h-full">
                <GoogleMap listings={[]} onMarkerClick={handleMarkerClick} selectedCity="Myrtle Beach" />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AvailabilitySearch;