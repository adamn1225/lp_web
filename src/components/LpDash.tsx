import React, { useState, useEffect } from 'react';
import Pagination from './ui/Pagination'; // Import Pagination component
import Modal from './Modal'; // Import Modal component

interface Property {
    id: string;
    title: string;
    images: string[];
    address: {
        street: string;
        apt: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    price: number;
    occupiedDates: string[];
    propertyType: string;
    amenities?: string[];
    description: string;
    otherAmenities?: string[];
    bathrooms: number;
    pictures: { original: string }[];
    listingRooms: string[];
    beds: number;
    publicDescription: string;
    bedrooms: number;
    defaultCheckInTime: string;
    defaultCheckOutTime: string;
}

const LpDash: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [propertiesPerPage] = useState(10);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [qaComment, setQaComment] = useState('');
    const [qaResults, setQaResults] = useState<{ [key: string]: string }>({});
    const [promoCodes, setPromoCodes] = useState<{ [key: string]: string }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('/.netlify/functions/fetchListings');
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, [currentPage]);

    const handlePass = (propertyId: string) => {
        setQaResults((prevResults) => ({
            ...prevResults,
            [propertyId]: 'pass',
        }));
        alert('QA check saved as pass');
    };

    const handleNoPass = (property: Property) => {
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const handleSubmitQaComment = () => {
        if (selectedProperty) {
            setQaResults((prevResults) => ({
                ...prevResults,
                [selectedProperty.id]: `no pass: ${qaComment}`,
            }));
            alert('QA check saved as no pass');
            setSelectedProperty(null);
            setQaComment('');
            setIsModalOpen(false);
        }
    };

    const generatePromoCode = (propertyId: string) => {
        const code = `PROMO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setPromoCodes((prevCodes) => ({
            ...prevCodes,
            [propertyId]: code,
        }));
        alert(`Generated Promo Code for ${propertyId}: ${code}`);
    };

    // Get current properties for pagination
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);

    return (
        <div className="dashboard my-24">
            <h1 className="text-3xl text-center font-bold mb-6">Property Listings QA Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {currentProperties.map((property) => (
                    <div key={property.id} className="property-item">
                        <article className="flex flex-col bg-white shadow-lg shadow-muted-300/30 h-full border border-muted-200">
                            <div className="bg-muted-100">
                                <img className="w-full h-48 object-cover" src={property.pictures[0].original} alt={property.title} />
                            </div>
                            <div className="p-5 bg-white flex flex-col justify-start h-2/3">
                                <div className="min-h-[100px]">
                                    <h4 className="font-sans font-bold text-xl text-muted-900">{property.title}</h4>
                                    <h3 className="font-sans font-bold text-xl text-muted-900">${property.price}/ Day</h3>
                                    <p className="text-sm text-muted-400">{property.address.city}, {property.address.state}</p>
                                </div>
                                <hr className="border-t border-muted-200 dark:border-muted-800 my-5" />
                                <div className="h-max grid grid-cols-2 flex-row justify-center items-center">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 text-muted-900 dark:text-white">
                                            <svg className="size-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path>
                                                <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path>
                                                <path d="M12 4v6"></path>
                                                <path d="M2 18h20"></path>
                                            </svg>
                                            <p className="text-xl font-bold">{property.bedrooms}</p>
                                        </div>
                                        <p className="text-md text-muted-400">Bedrooms</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 text-muted-900 dark:text-white">
                                            <svg className="size-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
                                                <line x1="10" y1="5" x2="8" y2="7"></line>
                                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                                <line x1="7" y1="19" x2="7" y2="21"></line>
                                                <line x1="17" y1="19" x2="17" y2="21"></line>
                                            </svg>
                                            <p className="text-xl font-bold">{property.bathrooms}</p>
                                        </div>
                                        <p className="text-md text-muted-400">Bathrooms</p>
                                    </div>
                                </div>
                                <div className="flex min-h-min flex-row justify-center align-bottom">
                                    <button className="lp-button mt-4" onClick={() => handlePass(property.id)}>Pass</button>
                                    <button className="lp-button mt-4 ml-2" onClick={() => handleNoPass(property)}>No Pass</button>
                                </div>
                                {qaResults[property.id] && <p className="mt-2 text-red-500">QA Result: {qaResults[property.id]}</p>}
                                <button className="py-2 px-3 w-fit rounded self-center text-white font-semibold bg-green-500 mt-4" onClick={() => generatePromoCode(property.id)}>Generate Promo Code</button>
                                {promoCodes[property.id] && <p className="mt-2 text-green-500">Promo Code: {promoCodes[property.id]}</p>}
                                <div className="mt-4">
                                    <textarea
                                        value={qaResults[property.id]?.includes('no pass') ? qaResults[property.id].split(': ')[1] : ''}
                                        onChange={(e) => setQaResults((prevResults) => ({
                                            ...prevResults,
                                            [property.id]: `no pass: ${e.target.value}`,
                                        }))}
                                        placeholder="Enter QA comment"
                                        className="w-full p-2 border border-gray-300 rounded mb-4"
                                    />
                                </div>
                            </div>
                        </article>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                propertiesPerPage={propertiesPerPage}
                totalProperties={properties.length} // Use the actual total count
                paginate={setCurrentPage}
            />
            {selectedProperty && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">QA Comment for {selectedProperty.title}</h2>
                        <textarea
                            value={qaComment}
                            onChange={(e) => setQaComment(e.target.value)}
                            placeholder="Enter QA comment"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        <button onClick={handleSubmitQaComment} className="lp-button">Submit</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default LpDash;