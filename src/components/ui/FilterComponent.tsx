import React, { useState, useEffect } from 'react';
import { FiSun, FiEye, FiStar, FiDroplet, FiHeart } from "react-icons/fi";
import CityNavigation from '../CityNavigation'; // Import the CityNavigation component

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
  onCityClick: (city: string | null) => Promise<void>; // Add the onCityClick prop
  setActiveCity: (city: string) => void; // Add the setActiveCity prop
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  onFilterChange,
  onResetFilters,
  cities,
  tags,
  bedroomOptions, // Destructure bedroomOptions prop
  initialPriceOrder,
  initialBedroomCount,
  initialSelectedCity,
  initialSelectedAmenities,
  initialSelectedTags,
  onCityClick, // Destructure the onCityClick prop
  setActiveCity // Destructure the setActiveCity prop
}) => {
  const [priceOrder, setPriceOrder] = useState<string>(initialPriceOrder);
  const [bedroomCount, setBedroomCount] = useState<number | null>(initialBedroomCount === 0 ? null : initialBedroomCount); (initialBedroomCount);
  const [selectedCity, setSelectedCity] = useState<string>(initialSelectedCity);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialSelectedAmenities);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);

  useEffect(() => {
    onFilterChange({ priceOrder, bedroomCount, selectedCity, selectedAmenities, selectedTags });
  }, [priceOrder, bedroomCount, selectedCity, selectedAmenities, selectedTags]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriceOrder = e.target.value;
    setPriceOrder(newPriceOrder);
  };

  const handleBedroomChange = (bedroom: number | null) => {
    setBedroomCount(bedroom);
    onFilterChange({ priceOrder, bedroomCount: bedroom, selectedCity, selectedAmenities, selectedTags });
  };

  const handleCityChange = async (city: string | null): Promise<void> => {
    setSelectedCity(city || '');
    onFilterChange({ priceOrder, bedroomCount, selectedCity: city || '', selectedAmenities, selectedTags });
  };

  const handleTagChange = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    onFilterChange({ priceOrder, bedroomCount, selectedCity, selectedAmenities, selectedTags: newSelectedTags });
  };

  const formatTag = (tag: string): string => {
    const tagDisplayNames: { [key: string]: string } = {
      "Ocean_front": "Ocean Front",
      "Ocean_view": "Ocean View",
      "Public_pool": "Pool",
      "Pets": "Pet Friendly"
    };
    return tagDisplayNames[tag] || tag;
  };

  const getIconForTag = (tag: string) => {
    switch (tag) {
      case "Ocean_front":
        return <FiSun className="text-foreground size-8 desktop-icon" />;
      case "Ocean_view":
        return <FiStar className="text-foreground size-8 desktop-icon" />;
      case "Public_pool":
        return <FiDroplet className="text-foreground size-8 desktop-icon" />;
      case "Pets":
        return <FiHeart className="text-foreground size-8 desktop-icon" />;
      default:
        return null;
    }
  };

  const getIconForMobileTag = (tag: string) => {
    switch (tag) {
      case "Ocean_front":
        return <FiSun className="text-foreground size-5 mobile-icon" />;
      case "Ocean_view":
        return <FiEye className="text-foreground size-5 mobile-icon" />;
      case "Public_pool":
        return <FiDroplet className="text-foreground size-5 mobile-icon" />;
      case "Pets":
        return <FiHeart className="text-foreground size-5 mobile-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="filter-component flex flex-col items-center justify-start w-full bg-primary/40 h-full">
      <div className='items-start justify-center text-sm md:text-base'>
        <div className="flex flex-col md:flex-row-reverse w-full items-center justify-center amenities-filter mt-2">
          <div className="flex md:flex-nowrap flex-col md:flex-row w-full items-center justify-center">
            <div className="tags-container flex w-full justify-start md:justify-center items-center overflow-x-auto whitespace-nowrap no-scrollbar px-4">
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagChange(tag)}
                  className={`px-2 py-2 text-nowrap w-fit text-secondary rounded flex flex-col justify-evenly items-center ${selectedTags.includes(tag) ? 'bg-secondary rounded-lg text-white' : ' text-secondary'}`}
                >
                  {getIconForTag(tag)}
                  {getIconForMobileTag(tag)}
                  {formatTag(tag)}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 p-6 w-1/2">
              <select value={priceOrder} onChange={handlePriceChange} className="border border-secondary/30 rounded-lg p-2 w-full">
                <option value="">Sort by price</option>
                <option value="default">Default</option>
                <option value="lowToHigh">Lowest to Highest</option>
                <option value="highToLow">Highest to Lowest</option>
              </select>
            </div>
          </div>

        </div>
      </div>
      <div className="bedroom-navigation flex justify-start md:justify-center items-center gap-2 py-2 bg-secondary/80 w-full overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleBedroomChange(null)}
          className={`px-3 py-2 text-nowrap rounded ${bedroomCount === null ? 'bg-secondary text-white border border-white' : 'bg-primary/75 text-secondary'}`}
        >
          Any
        </button>
        {bedroomOptions.map(bedroom => (
          <button
            key={bedroom}
            onClick={() => handleBedroomChange(bedroom)}
            className={`px-3 py-2 text-nowrap rounded ${bedroomCount === bedroom ? 'bg-secondary text-white border border-white' : 'bg-primary/75 text-secondary'}`}
          >
            {bedroom === 0 ? 'Studio' : `${bedroom} Bedroom${bedroom > 1 ? 's' : ''}`}
          </button>
        ))}
      </div>
      <CityNavigation cities={cities} onCityClick={onCityClick} setActiveCity={setActiveCity} />

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .desktop-icon {
          display: none;
        }
        .mobile-icon {
          display: inline;
        }
        @media (min-width: 768px) {
          .desktop-icon {
            display: inline;
          }
          .mobile-icon {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default FilterComponent;