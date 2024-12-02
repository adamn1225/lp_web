import React, { useState, useEffect } from 'react';

interface FilterComponentProps {
    onFilterChange: (filters: any) => void;
    onResetFilters: () => void;
    cities: string[];
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilterChange, onResetFilters, cities }) => {
    const [priceOrder, setPriceOrder] = useState<string>('default');
    const [bedroomCount, setBedroomCount] = useState<number | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');

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

    const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriceOrder = e.target.value;
        setPriceOrder(newPriceOrder);
        onFilterChange({ priceOrder: newPriceOrder, bedroomCount, selectedTags, selectedCity });
    };

    const handleBedroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBedroomCount = Number(e.target.value);
        setBedroomCount(newBedroomCount);
        onFilterChange({ priceOrder, bedroomCount: newBedroomCount, selectedTags, selectedCity });
    };

    const handleTagChange = (tag: string) => {
        const newSelectedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        setSelectedTags(newSelectedTags);
        onFilterChange({ priceOrder, bedroomCount, selectedTags: newSelectedTags, selectedCity });
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSelectedCity = e.target.value;
        setSelectedCity(newSelectedCity);
        onFilterChange({ priceOrder, bedroomCount, selectedTags, selectedCity: newSelectedCity });
    };

    const handleResetFilters = () => {
        setPriceOrder('default');
        setBedroomCount(null);
        setSelectedTags([]);
        setSelectedCity('');
        onResetFilters();
    };

    const tags = ["Ocean_front", "Ocean_view", "web_featured", "Public_pool", "Pets"];

    return (
        <div className="filter-component flex flex-col items-center justify-start gap-4 p-4 w-full bg-secondary/10 h-full">
            <button onClick={handleResetFilters} className="mt-4 bg-gray-500 text-white px-2 py-1 rounded">
                Reset Filters
            </button>
            <div className='items-start'>
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
                </div>
                <div className="tags-filter w-full flex flex-col items-center text-start md:mt-4">
                    <label className="font-semibold">Amenities:</label>
                    <div className="tags w-full flex flex-col items-center gap-2 mt-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagChange(tag)}
                                className={`tag-button px-3 py-1 text-nowrap w-fit text-secondary rounded flex flex-col items-center gap-2 ${selectedTags.includes(tag) ? 'bg-secondary text-white' : 'bg-slate-500 text-white'}`}
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