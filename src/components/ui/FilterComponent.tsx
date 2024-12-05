import React, { useState, useEffect } from 'react';

interface FilterComponentProps {
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
  cities: string[];
  amenities: string[];
  tags: string[];
  initialPriceOrder: string;
  initialBedroomCount: number | null;
  initialSelectedCity: string;
  initialSelectedAmenities: string[];
  initialSelectedTags: string[];
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  onFilterChange,
  onResetFilters,
  cities,
  amenities,
  tags,
  initialPriceOrder,
  initialBedroomCount,
  initialSelectedCity,
  initialSelectedAmenities,
  initialSelectedTags
}) => {
  const [priceOrder, setPriceOrder] = useState<string>(initialPriceOrder);
  const [bedroomCount, setBedroomCount] = useState<number | null>(initialBedroomCount);
  const [selectedCity, setSelectedCity] = useState<string>(initialSelectedCity);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialSelectedAmenities);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
  const [bedroomOptions, setBedroomOptions] = useState<number[]>([]);

  useEffect(() => {
    const fetchBedroomOptions = async () => {
      try {
        const response = await fetch('/.netlify/functions/availability?fetchBedrooms=true');
        const data = await response.json();
        setBedroomOptions(data.results);
      } catch (err) {
        console.error('Error fetching bedroom options:', err);
      }
    };

    fetchBedroomOptions();
  }, []);

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

  return (
    <div className="filter-component flex flex-col items-center justify-start gap-4 p-2 md:p-4 w-full bg-primary/40 h-full">
      <button onClick={handleResetFilters} className="md:mt-4 bg-secondary w-1/2 md:w-1/5 text-white px-2 py-2 rounded">
        Reset Filters
      </button>
      <div className='items-start text-sm md:text-base'>
        <div className="flex gap-1">
          <div className="price-filter">
            <label className="font-semibold">Price Order:</label>
            <select value={priceOrder} onChange={handlePriceChange} className="border border-secondary/30 rounded-lg p-2 w-full">
              <option value="default">Default</option>
              <option value="lowToHigh">Lowest to Highest</option>
              <option value="highToLow">Highest to Lowest</option>
            </select>
          </div>
          <div className="bedroom-filter">
            <label className="font-semibold">Bedrooms:</label>
            <select value={bedroomCount || ''} onChange={handleBedroomChange} className="border border-secondary/30 rounded-lg p-2 w-full">
              <option value="">Any</option>
              {bedroomOptions.map(bedroom => (
                <option key={bedroom} value={bedroom}>{bedroom === 0 ? 'Studio' : `${bedroom} Bedroom${bedroom > 1 ? 's' : ''}`}</option>
              ))}
            </select>
          </div>
          <div className="city-filter">
            <label className="font-semibold">City:</label>
            <select value={selectedCity} onChange={handleCityChange} className="border border-secondary/30 rounded-lg p-2 w-full">
              <option value="">Any</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="amenities-filter mt-2">
          <div className="flex flex-wrap gap-2">
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
                className={`px-3 py-1 text-nowrap w-fit text-secondary rounded ${selectedTags.includes(tag) ? 'bg-foreground text-white' : 'bg-secondary text-white'}`}
              >
                {formatTag(tag)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;