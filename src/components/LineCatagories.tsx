import React, { useState, useEffect } from 'react';

interface Listing {
    _id: string;
    tags: string[];
    pictures: {
        thumbnail: string;
        caption: string;
    }[];
    title: string;
    address: {
        city: string;
        state: string;
    };
}

const LineCatagories: React.FC = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasSelectedTag, setHasSelectedTag] = useState<boolean>(false);

    const listingsApiUrl = '/.netlify/functions/available'; // Using the same function for listings

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(listingsApiUrl);
                const data = await response.json();
                console.log('Fetched listings:', data); // Log the fetched listings
                if (!data.results || !Array.isArray(data.results)) {
                    throw new Error('Invalid response format');
                }
                const listings: Listing[] = data.results; // Explicitly type the data.results
                setListings(listings);

                // Extract unique tags
                const uniqueTags = Array.from(new Set(listings.flatMap((listing: Listing) => listing.tags)));
                setTags(uniqueTags as string[]); // Ensure uniqueTags is typed as string[]
                console.log('Tags:', uniqueTags); // Log the tags array
            } catch (error) {
                setError('Failed to fetch listings');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const handleTagClick = (tag: string) => {
        setSelectedTags((prevSelected) =>
            prevSelected.includes(tag)
                ? prevSelected.filter((t) => t !== tag)
                : [...prevSelected, tag]
        );
        setHasSelectedTag(true);
    };

    useEffect(() => {
        if (selectedTags.length === 0) {
            setFilteredListings([]);
        } else {
            const filtered = listings.filter(listing =>
                selectedTags.every(tag => listing.tags.includes(tag))
            );
            setFilteredListings(filtered);
        }
    }, [selectedTags, listings]);

    return (
        <div>
            <div className='flex flex-wrap mx-8 gap-4'>
                {tags.map((tag, index) => (
                    <button
                        key={index} // Use index as key if tag names are not unique
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className={`text-slate-950 ${selectedTags.includes(tag) ? 'btn-selected' : ''}`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className='error'>{error}</p>}
            {hasSelectedTag && (
                <div className='grid grid-cols-3 justify-items-center items-center w-full h-full'>
                    {filteredListings.map((property) => (
                        <article key={property._id} className="bg-white shadow-lg shadow-slate-300/30 h-full border border-slate-500/30 rounded-md">
                            <div className="p-1 result-item">
                                <img className="w-full object-cover h-64" src={property.pictures[0]?.thumbnail} alt={property.pictures[0]?.caption} />
                                <div className="px-10 py-4 text-center flex flex-col gap-4">
                                    <h3 className="text-xl font-medium">{property.title}</h3>
                                    <div className="border border-stone-300"> </div>
                                    <p className="text-lg font-light">{property.address.city}, {property.address.state}</p>
                                    {/* <p className="font-bold">${property.prices.basePrice} {property.prices.currency}</p> */}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LineCatagories;