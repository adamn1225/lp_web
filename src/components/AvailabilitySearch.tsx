import React, { useState } from "react";
import { Search } from "lucide-react";
import { DateRange } from "react-date-range";
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
      toggleModal(); // Close the modal after form submission
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const clearResults = () => {
    setListings([]);
  };

  return (
    <div className="bg-[url('/images/line-hero.png')] bg-slate-700 pt-64 md:pt-96 bg-contain md:bg-left bg-bottom bg-no-repeat w-full h-full">
<div className="w-full items-end align-bottom md:pb-12 pb-40">
    <div className="flex flex-row justify-center w-full">
        <button onClick={toggleModal} className="flex align-bottom justify-center h-full bg-cyan-600 md:mb-28 md:w-1/5 sm:w-4/5 py-3 px-2 shadow-md shadow-cyan-500/30 rounded-xl text-white">
            <Search size={24} /> <h3>Search available properties</h3>
        </button>
    </div>
    {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 object-contain flex align-evenly justify-evenly items-center overflow-auto">
    <div className="bg-slate-100 md:p-6 p-4 rounded-lg shadow-lg md:flex justify-center md:w-3/5 sm:w-4/5 w-full overflow-hidden">

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-3 items-center justify-center w-full">
          <button onClick={toggleModal} className="bg-red-500 mb-2 sm:my-12 flex justify-center md:w-2/3 w-full z-50 font-bold text-muted-50 text-xl rounded-md py-3">
            Close Property Search
          </button>
          <div className="flex flex-col md:flex-row md:w-1/4 justify-center items-center w-full">
            <div className="px-2 pb-2 pt-3 bg-slate-100 drop-shadow border rounded-lg w-full overflow-hidden">
              <h3 className="text-center pb-4 text-2xl">How long is your trip?</h3>
              <DateRange
                editableDateInputs={true}
                onChange={item => setState([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={state}
                className="w-full"
              />
            </div>
          </div>

          <div className="w-full flex align-middle justify-center h-full">
            <button type="submit" className="flex align-middle justify-center h-full bg-cyan-600 m-0 md:w-2/3 w-full py-3 sm:mx-12 font-bold text-xl rounded-md text-muted-50">
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
</div>

      <div className="bg-white w-full h-full overflow-auto">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {available.length > 0 && (
          <div className="flex justify-center px-4 pt-8">
            <button onClick={clearResults} className="bg-red-500 text-white py-3 px-6 rounded-md">
             X Clear Results
            </button>
          </div>
        )}
        <div className="search-results grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 md:px-12 px-4">
          {available.map((property, title) => (
            
    
<article className="flex flex-col bg-white shadow-lg shadow-muted-300/30 h-full border border-slate-500/30 rounded-md">
                  <div className="p-1 result-item" key={property._id}>
                    <img className="w-full h-64" src={property.picture.thumbnail} alt={property.picture.caption} />
                   <div className="md:p-5 p-2 bg-white flex flex-col align-middle h-1/1 justify-center border-t-2 border-slate-500/30">
                    <h3 className="font-sans font-bold text-lg text-muted-900 pb-4 text-center">{title}</h3>
                   <div className="flex md:flex-row flex-col justify-center self-center md:justify-between border-t-2 border-slate-500/30 pt-6"> 
                    <p className="font-sans font-bold text-lg text-center text-muted-900 ">Price: ${property.prices.basePrice} {property.prices.currency}</p>
                    <a href={property._id}><button className=" bg-cyan-600 m-0 py-3 md:px-12 px-4 shadow-md shadow-cyan-500/30 rounded-xl text-white">Book Instantly!</button></a> 
                    </div>

                    </div>
                  </div>
</article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySearch;