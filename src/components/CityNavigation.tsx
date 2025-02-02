import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CityNavigationProps {
    cities: string[];
    onCityClick: (city: string) => void;
}

const CityNavigation: React.FC<CityNavigationProps> = ({ cities, onCityClick }) => {
    const [activeCity, setActiveCity] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCityClick = async (city: string) => {
        setActiveCity(city);
        setLoading(true);
        await onCityClick(city);
        setLoading(false);
    };

    return (
        <div className="city-navigation flex justify-center gap-6 py-2 bg-gray-100 relative">
            {cities.map((city) => (
                <button
                    key={city}
                    onClick={() => handleCityClick(city)}
                    className={`text-secondary font-semibold hover:underline ${activeCity === city ? 'underline' : ''}`}
                    disabled={loading} // Disable button while loading
                >
                    {city}
                </button>
            ))}
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