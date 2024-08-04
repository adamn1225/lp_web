import React, { useState } from "react";
import { Search } from "lucide-react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";

interface Listing {
  _id: string;
  picture: {
    thumbnail: string;
    caption: string;
  };
  publicDescription: {
    summary: string;
  };
  prices: {
    basePrice: number;
    currency: string;
  };
  // Add other properties as needed
}

const AvailabilitySearch: React.FC = () => {
  const [minOccupancy, setMinOccupancy] = useState<number>(1);
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [available, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<any[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  const formatDate = (date: string): string => {
    return new Date(date).toISOString().slice(0, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedCheckIn = formatDate(state[0].startDate);
      const formattedCheckOut = formatDate(state[0].endDate);
      const serverPort = import.meta.env.VITE_SERVER_PORT || '5000';

      const response = await fetch(`http://localhost:${serverPort}/api/available?checkIn=${encodeURIComponent(formattedCheckIn)}&checkOut=${encodeURIComponent(formattedCheckOut)}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}`, {
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

  return (
    <div className="w-full h-screen ">
      <div className="bg-[url('/images/hero.jpg')] pt-24 pb-16 obect-fill overflow-visible">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 items-center justify-center items-end">
            <div className="flex flex-row w-full justify-center items-stretch">
              <div className="px-2 pb-2 pt-3 bg-white drop-shadow border rounded-lg">
                <h3 className="text-center pb-4 text-2xl">How long is your trip?</h3>
                <DateRangePicker
                  editableDateInputs={true}
                  onChange={item => setState([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                  
                />
                {/* <DateRangePicker
                  onChange={item => setState([item.selection])}                
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={state}
                  direction="horizontal"
                />; */}
              </div>
            </div>

            <div className="w-full flex items-stretch align-middle justify-center h-full">
              <button type="submit" className="flex align-middle justify-center gap-2 h-full bg-cyan-600 m-0 w-2/5 py-3 px-12 shadow-md shadow-cyan-500/30 rounded-xl text-white">
                <Search size={24} /> <h3>Search available properties</h3>
              </button>
            </div>
            
            <div className="hidden">
              <label htmlFor="minOccupancy">Minimum Occupancy:</label>
              <input
                type="number"
                id="minOccupancy"
                value={minOccupancy}
                onChange={(e) => setMinOccupancy(parseInt(e.target.value))}
              />
            </div>
          </div>
        </form>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="search-results grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-8 px-10">
        {available.map((property) => (
          <div className="py-3 result-item" key={property._id}>
            <img className="object-cover" src={property.picture.thumbnail} alt={property.pictures[0].original} />
            <h3 className="font-bold text-md">{property.title}</h3>
            <p className="font-medium">Price: ${property.prices.basePrice} {property.prices.currency}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilitySearch;


{/* <div className="w-full h-screen ">
<div className="bg-[url('/images/hero.jpg')] pt-34 pb-16 obect-fill overflow-visible h-screen flex w-full  items-center">
  <div className="flex flex-row justify-center w-full">
    <button onClick={toggleModal} className="flex align-middle justify-center item-stretch gap-2 h-full bg-cyan-600 m-0 w-2/5 py-3 px-2 shadow-md shadow-cyan-500/30 rounded-xl text-white">
    <Search size={24} /> <h3>Search available properties</h3>
    </button>
  </div>
  {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex align-evenly justify-evenly items-center mt-32">
      <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center w-3/5">
        <button onClick={toggleModal} className="bg-cyan-600 absolute top-2 right-2 text-black z-50 font-bold text-muted-50 text-xl rounded-md py-2 px-8 mr-">
          &times; Close Date Search
        </button>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 items-center justify-center items-end">
            <div className="flex flex-row w-full justify-center items-stretch">
              <div className="px-2 pb-2 pt-3 bg-white drop-shadow border rounded-lg">
                <h3 className="text-center pb-4 text-2xl">How long is your trip?</h3>
                <DateRangePicker
                  editableDateInputs={true}
                  onChange={item => setState([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                />
              </div>
            </div>

            <div className="w-full flex items-stretch align-middle justify-center h-full">
              <button type="submit" className="flex align-middle justify-center gap-2 h-full bg-cyan-600 m-0 w-4/5 py-3 px-12 shadow-md shadow-cyan-500/30 rounded-xl text-white">
                <Search size={24} /> <h3>Search available properties</h3>
              </button>
            </div>

            <div className="hidden">
              <label htmlFor="minOccupancy">Minimum Occupancy:</label>
              <input
                type="number"
                id="minOccupancy"
                value={minOccupancy}
                onChange={(e) => setMinOccupancy(parseInt(e.target.value))}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )}

  {loading && <p>Loading...</p>}
  {error && <p>Error: {error}</p>}
  <div className="search-results grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-8 px-10">
    {available.map((property) => (
      <div className="py-3 result-item" key={property._id}>
        <img className="object-cover" src={property.picture.thumbnail} alt={property.pictures[0].original} />
        <h3 className="font-bold text-md">{property.title}</h3>
        <p className="font-medium">Price: ${property.prices.basePrice} {property.prices.currency}</p>
      </div>
    ))}
  </div>
</div>
</div> */}