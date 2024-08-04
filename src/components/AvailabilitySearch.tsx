import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { Search } from 'react-feather';

const AvailabilitySearch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const clearResults = () => {
    setListings([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const checkIn = state[0].startDate.toISOString().split('T')[0];
    const checkOut = state[0].endDate.toISOString().split('T')[0];
    const minOccupancy = 1; // Adjust as needed

    try {
      const response = await fetch(`/.netlify/functions/availability?checkIn=${checkIn}&checkOut=${checkOut}&minOccupancy=${minOccupancy}`);
      if (!response.ok) {
        throw new Error('Failed to fetch available properties');
      }
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching available properties:', error);
    }
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
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-green-500 mt-4 py-2 px-4 rounded text-white">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySearch;