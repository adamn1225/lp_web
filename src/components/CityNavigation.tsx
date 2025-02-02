import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CityNavigationProps {
    cities: string[];
    onCityClick: (city: string) => Promise<void>;
}

const CityNavigation: React.FC<CityNavigationProps> = ({ cities, onCityClick }) => {
    const [activeCity, setActiveCity] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCityClick = (city: string) => {
        setActiveCity(city);
    };

    const handleSubmit = () => {
        if (activeCity) {
            setLoading(true);
            onCityClick(activeCity).finally(() => {
                setLoading(false);
            });
        }
    };

    return (
        <div className="city-navigation flex flex-col items-center gap-4 py-2 bg-gray-100 relative">
            <div className={`flex justify-center gap-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {cities.map((city) => (
                    <button
                        key={city}
                        onClick={() => handleCityClick(city)}
                        className={`text-secondary font-semibold hover:underline px-4 py-2 rounded-md ${activeCity === city ? 'bg-white underline text-secondary font-bold border border-secondary/90 shadow-md' : ''}`}
                        disabled={loading} // Disable button while loading
                    >
                        {city}
                    </button>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-secondary text-white font-semibold rounded-md"
                disabled={loading || !activeCity} // Disable button while loading or no city selected
            >
                Search another city
            </button>
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