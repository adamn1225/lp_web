import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CityNavigationProps {
    cities: string[];
    onCityClick: (city: string | null) => Promise<void>;
    setActiveCity: (city: string) => void;
}

const CityNavigation: React.FC<CityNavigationProps> = ({ cities, onCityClick, setActiveCity }) => {
    const [activeCity, setActiveCityState] = useState<string | null>('All Locations');
    const [loading, setLoading] = useState<boolean>(false);

    const handleCityClick = (city: string | null) => {
        setActiveCityState(city);
        setActiveCity(city || '');
        setLoading(true);
        onCityClick(city).finally(() => {
            setLoading(false);
        });
    };

    const displayCities = ['All Locations', 'North Myrtle Beach', 'Myrtle Beach'];

    return (
        <div className="city-navigation flex flex-col items-center gap-4 bg-gray-100 py-2 relative w-full">
            <div className={`flex justify-center gap-1 overflow-x-auto w-full ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {displayCities.map((city) => (
                    <button
                        key={city}
                        onClick={() => handleCityClick(city === 'All Locations' ? null : city)}
                        className={`text-secondary text-sm md:text-base font-semibold hover:underline px-2 py-2 rounded-md whitespace-nowrap ${activeCity === city ? 'bg-white underline text-secondary font-bold border border-secondary/90 shadow-md' : ''}`}
                        disabled={loading}
                    >
                        {city}
                    </button>
                ))}
            </div>
            {loading && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
                />
            )}
        </div>
    );
};

export default CityNavigation;