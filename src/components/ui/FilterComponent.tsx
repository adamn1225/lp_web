import React, { useState } from 'react';

interface FilterComponentProps {
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
  cities: string[];
  tags: string[];
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilterChange, onResetFilters, cities, tags }) => {
  const [priceOrder, setPriceOrder] = useState<string>('default');
  const [bedroomCount, setBedroomCount] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allowedTags = ["Ocean_front", "Ocean_view", "Public_pool", "Pets"];

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriceOrder = e.target.value;
    setPriceOrder(newPriceOrder);
    onFilterChange({ priceOrder: newPriceOrder, bedroomCount, selectedCity, selectedTags });
  };

  const handleBedroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBedroomCount = Number(e.target.value);
    setBedroomCount(newBedroomCount);
    onFilterChange({ priceOrder, bedroomCount: newBedroomCount, selectedCity, selectedTags });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedCity = e.target.value;
    setSelectedCity(newSelectedCity);
    onFilterChange({ priceOrder, bedroomCount, selectedCity: newSelectedCity, selectedTags });
  };

  const handleTagChange = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    onFilterChange({ priceOrder, bedroomCount, selectedCity, selectedTags: newSelectedTags });
  };

  const handleResetFilters = () => {
    setPriceOrder('default');
    setBedroomCount(null);
    setSelectedCity('');
    setSelectedTags([]);
    onResetFilters();
  };

  const formatTag = (tag: string): string => {
    const tagDisplayNames: { [key: string]: string } = {
      "Ocean_front": "Ocean Front",
      "Ocean_view": "Ocean View",
      "Public_pool": "Pool",
      "Pets": "Toggle Pet Friendly"
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
          {/* <div className="bedroom-filter">
            <label className="font-semibold">Bedrooms:</label>
            <select value={bedroomCount || ''} onChange={handleBedroomChange} className="border border-secondary/30 rounded-lg p-2 w-full">
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
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
          </div> */}
        </div>
        <div className="tags-filter">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {tags.filter(tag => allowedTags.includes(tag)).map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagChange(tag)}
                className={`px-3 py-1 mt-2 text-nowrap w-fit shadown-md text-secondary rounded ${selectedTags.includes(tag) ? 'bg-foreground text-white' : 'bg-secondary text-white'}`}
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