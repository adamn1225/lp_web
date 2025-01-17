import React from 'react';
import DateRangePickerComponent from './ui/DateRangePickerComponent';
import FilterComponent from './ui/FilterComponent';
import Modal from './ui/Modal';
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchFiltersProps {
  dateRange: { startDate: Date; endDate: Date; key: string }[];
  setDateRange: React.Dispatch<React.SetStateAction<{ startDate: Date; endDate: Date; key: string }[]>>;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedBedroomAmount: string;
  setSelectedBedroomAmount: (bedroomAmount: string) => void;
  numGuests: number;
  setNumGuests: (numGuests: number) => void;
  cities: string[];
  bedroomOptions: number[];
  tags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (isOpen: boolean) => void;
  handleFilterChange: (filters: any) => void;
  resetFilters: () => void;
  filters: any;
  amenities: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  dateRange,
  setDateRange,
  selectedLocation,
  setSelectedLocation,
  selectedBedroomAmount,
  setSelectedBedroomAmount,
  numGuests,
  setNumGuests,
  cities,
  bedroomOptions,
  tags,
  selectedTags,
  setSelectedTags,
  handleSubmit,
  isModalOpen,
  setIsModalOpen,
  isFilterModalOpen,
  setIsFilterModalOpen,
  handleFilterChange,
  resetFilters,
  filters,
  amenities,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center align-middle w-full">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-4/5 md:w-1/4 mx-auto h-fit z-50 flex flex-col items-start gap-1 shadow-lg justify-start bg-gray-100 pt-2.5 pb-0.5 px-3 font-bold text-base text-start rounded-lg text-secondary"
        >
          <span className="flex w-fit items-start justify-start text-start gap-1"><Search size={20} /> <p>Search Where</p></span><span className="flex justify-center self-center items-end"><p>When - Where - Who</p></span>
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="z-50">
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
    </>
  );
};

export default SearchFilters;