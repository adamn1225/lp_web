import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";

interface Listing {
    _id: string;
    title: string;
    picture: {
        thumbnail: string;
        caption: string;
    };
    publicDescription: {
        summary: string;
    };
    address: {
        city: string;
        state: string;
    };
    prices: {
        basePrice: number;
        currency: string;
    };
    // Add other properties as needed
}

const AvailabilitySearch: React.FC = () => {
    const [minOccupancy, setMinOccupancy] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [available, setListings] = useState<Listing[]>([]);
    const [state, setState] = useState<any[]>([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const apiUrl = '/.netlify/functions/availability';

    const formatDate = (date: Date): string => {
        return date.toISOString().slice(0, 10);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formattedCheckIn = formatDate(state[0].startDate);
            const formattedCheckOut = formatDate(state[0].endDate);

            console.log('API URL:', `${apiUrl}?checkIn=${encodeURIComponent(formattedCheckIn)}&checkOut=${encodeURIComponent(formattedCheckOut)}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}`);

            const response = await fetch(`${apiUrl}?checkIn=${encodeURIComponent(formattedCheckIn)}&checkOut=${encodeURIComponent(formattedCheckOut)}&minOccupancy=${encodeURIComponent(minOccupancy.toString())}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const responseText = await response.text();
            console.log('API Response Text:', responseText);

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText} - ${responseText}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (err) {
                throw new Error('Invalid JSON response');
            }

            if (!Array.isArray(data.results)) {
                throw new Error('Unexpected response format');
            }

            setListings(data.results);
            toggleModal(); // Close the modal after form submission
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const clearResults = () => {
        setListings([]);
    };

    return (
        <div className="static w-full h-full">
            <div className="w-full items-end align-bottom md:pb-12 pb-20">
                <div className="flex flex-row justify-center align-middle h-full w-full md:mb-40">
                    <button onClick={toggleModal} className="flex align-bottom justify-center h-full bg-cyan-600 sm:w-1/5 py-3 px-2 shadow-md shadow-cyan-500/30 rounded-xl text-white">
                        <Search size={24} /> <h3>Search available properties</h3>
                    </button>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 object-contain flex align-evenly justify-evenly items-center overflow-auto">
                        <div className="bg-slate-100 pb-10 xs:mt-24 md:py-4 mx-1 lg:p-6 rounded-lg shadow-lg flex align-bottom md:flex justify-center lg:w-1/4 sm:w-4/5 w-full overflow-hidden">
                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="flex flex-col gap-3 items-center xs:mx-2 justify-center md:w-full">
                                    <div className="flex flex-col md:flex-row sx:w-full justify-center items-center">
                                        <div className="px-2 pb-2 pt-3 w-full bg-slate-100 drop-shadow border rounded-lg md:w-full xs:w-full overflow-hidden">
                                            <button
                                                className="absolute right-1 top-0 text-stone-900 hover:text-slate-800 text-4xl"
                                                onClick={toggleModal}
                                            >
                                                &times;
                                            </button>
                                            <h3 className="text-center pb-4 text-2xl">How long is your trip?</h3>
                                            <DateRange
                                                editableDateInputs={true}
                                                onChange={item => setState([item.selection])}
                                                moveRangeOnFirstSelection={false}
                                                ranges={state}
                                                className="max-w-max"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full flex align-middle justify-center h-full">
                                        <button type="submit" className="flex align-middle justify-center h-full bg-cyan-600 m-0 md:w-4/5 w-full py-3 px-1 xs:mx-2 font-bold text-xl rounded-md text-slate-50">
                                            <Search size={24} /> <h3>Search properties</h3>
                                        </button>
                                    </div>
                                    <div className="hidden">
                                        <label htmlFor="minOccupancy">Minimum Occupancy:</label>
                                        <input
                                            type="number"
                                            id="minOccupancy"
                                            value={minOccupancy}
                                            onChange={(e) => setMinOccupancy(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-stone-200 w-full h-full overflow-auto">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {available.length > 0 && (
                    <div className="flex flex-col justify-start items-center pt-8">
                        <h2 className="font-sans font-bold border-b-2 border-slate-700 text-3xl text-slate-900 bb-4 text-center">Available for Instant Booking!</h2>
                        <button onClick={clearResults} className="bg-red-500 text-white w-1/5 py-3 px-1 my-6 rounded-md">
                            X Clear Results
                        </button>
                    </div>

                )}
                <div className="search-results grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 md:px-12 px-4">
                    {available.map((property) => (
                        <a href={property._id}>
                            <article className="flex flex-col bg-white shadow-lg shadow-slate-300/30 h-full border border-slate-500/30 rounded-md" key={property._id}>
                                <div className="p-1 result-item">
                                    <img className="w-full object-cover h-64" src={property.picture.thumbnail} alt={property.picture.caption} />
                                    <div className="px-10 py-4 text-center flex flex-col gap-4">
                                        <h3 className="text-xl font-bold">{property.title}</h3>
                                        <div className="border border-stone-300"> </div>
                                        <p className="text-lg font-medium">{property.address.city}, {property.address.state}</p>
                                        {/* <p className="font-bold">${property.prices.basePrice} {property.prices.currency}</p> */}
                                    </div>
                                </div>
                            </article>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvailabilitySearch;