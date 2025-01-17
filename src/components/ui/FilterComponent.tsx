import React, { useState, useEffect } from 'react';
import { FiSun, FiEye, FiStar, FiDroplet, FiHeart } from "react-icons/fi";
import { Search, SlidersHorizontal } from "lucide-react";
import Modal from './Modal'; // Import the Modal component

interface FilterComponentProps {
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
  cities: string[];
  amenities: string[];
  tags: string[];
  bedroomOptions: number[]; // Add bedroomOptions prop
  initialPriceOrder: string;
  initialBedroomCount: number | null;
  initialSelectedCity: string;
  initialSelectedAmenities: string[];
  initialSelectedTags: string[];
  showBedroomFilter: boolean; // Add the showBedroomFilter prop
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  onFilterChange,
  onResetFilters,
  cities,
  amenities,
  tags,
  bedroomOptions, // Destructure bedroomOptions prop
  initialPriceOrder,
  initialBedroomCount,
  initialSelectedCity,
  initialSelectedAmenities,
  initialSelectedTags,
  showBedroomFilter // Destructure the showBedroomFilter prop
}) => {
  const [priceOrder, setPriceOrder] = useState<string>(initialPriceOrder);
  const [bedroomCount, setBedroomCount] = useState<number | null>(initialBedroomCount);
  const [selectedCity, setSelectedCity] = useState<string>(initialSelectedCity);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialSelectedAmenities);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  useEffect(() => {
    onFilterChange({ priceOrder, bedroomCount, selectedCity, selectedAmenities, selectedTags });
  }, [priceOrder, bedroomCount, selectedCity, selectedAmenities, selectedTags]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriceOrder = e.target.value;
    setPriceOrder(newPriceOrder);
  };

  const handleBedroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBedroomCount = Number(e.target.value);
    setBedroomCount(newBedroomCount);
    onFilterChange({ priceOrder, bedroomCount: newBedroomCount, selectedCity, selectedAmenities, selectedTags });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedCity = e.target.value;
    setSelectedCity(newSelectedCity);
  };

  const handleAmenityChange = (amenity: string) => {
    const newSelectedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(newSelectedAmenities);
  };

  const handleTagChange = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    onFilterChange({ priceOrder, bedroomCount, selectedCity, selectedAmenities, selectedTags: newSelectedTags });
  };

  const handleResetFilters = () => {
    setPriceOrder('default');
    setBedroomCount(null);
    setSelectedCity('');
    setSelectedAmenities([]);
    setSelectedTags([]);
    onResetFilters();
  };

  const formatTag = (tag: string): string => {
    const tagDisplayNames: { [key: string]: string } = {
      "Ocean_front": "Ocean Front",
      "Ocean_view": "Ocean View",
      "web_featured": "Featured",
      "Public_pool": "Pool",
      "Pets": "Pet Friendly"
    };
    return tagDisplayNames[tag] || tag;
  };

  const getIconForTag = (tag: string) => {
    switch (tag) {
      case "Ocean_front":
        return <FiSun className="text-foreground size-7" />;
      case "Ocean_view":
        return <FiEye className="text-foreground size-7" />;
      case "web_featured":
        return <FiStar className="text-foreground size-7" />;
      case "Public_pool":
        return <FiDroplet className="text-foreground size-7" />;
      case "Pets":
        return <FiHeart className="text-foreground size-7" />;
      default:
        return null;
    }
  };

  return (
    <div className="filter-component flex flex-col items-center justify-start gap-4 p-2 md:p-4 w-full bg-primary/40 h-full">
      <div className='items-start justify-center text-sm md:text-base'>
        <div className="amenities-filter mt-2">
          <div className="flex flex-wrap items-center gap-2">
            {amenities.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityChange(amenity)}
                className={`px-3 py-1 text-nowrap w-fit text-secondary rounded ${selectedAmenities.includes(amenity) ? 'bg-foreground text-white' : 'bg-secondary text-white'}`}
              >
                {formatTag(amenity)}
              </button>
            ))}
            {tags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagChange(tag)}
                className={`px-3 py-1 text-nowrap w-fit flex flex-col justify-evenly items-center ${selectedTags.includes(tag) ? 'bg-secondary rounded-lg text-white' : ' text-secondary'}`}
              >
                {getIconForTag(tag)}
                {formatTag(tag)}
              </button>
            ))}
            <button onClick={() => setIsFilterModalOpen(true)} className="h-fit py-2 px-2 flex gap-1 text-base justify-center items-center font-medium bg-secondary text-white rounded-md">
              <SlidersHorizontal className='size-5' />   Filters
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
        <div className="flex flex-col gap-2 p-6">
          <label className="font-semibold">Price Order:</label>
          <select value={priceOrder} onChange={handlePriceChange} className="border border-secondary/30 rounded-lg p-2 w-full">
            <option value="default">Default</option>
            <option value="lowToHigh">Lowest to Highest</option>
            <option value="highToLow">Highest to Lowest</option>
          </select>
          {showBedroomFilter && (
            <>
              <label className="font-semibold">Bedrooms:</label>
              <select value={bedroomCount || ''} onChange={handleBedroomChange} className="border border-secondary/30 rounded-lg p-2 w-full">
                <option value="">Any</option>
                {bedroomOptions.map(bedroom => (
                  <option key={bedroom} value={bedroom}>{bedroom === 0 ? 'Studio' : `${bedroom} Bedroom${bedroom > 1 ? 's' : ''}`}</option>
                ))}
              </select>
            </>
          )}
          <label className="font-semibold">City:</label>
          <select value={selectedCity} onChange={handleCityChange} className="border border-secondary/30 rounded-lg p-2 w-full">
            <option value="">Any</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <button onClick={() => setIsFilterModalOpen(false)} className="mt-4 bg-secondary w-full text-white px-2 py-2 rounded">
            Close Filters
          </button>
          <button onClick={handleResetFilters} className="bg-gray-700 text-white px-2 py-2 rounded">
            Reset Filters
          </button>
        </div>
      </Modal>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default FilterComponent;