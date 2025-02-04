import React, { useState, useEffect, Suspense } from "react";
import { FiSun, FiEye, FiStar, FiDroplet, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

const LazyLoadCard = React.lazy(() => import('./ui/LazyLoadCard'));

interface Listing {
    _id: string;
    title: string;
    pictures: {
        original: string;
    }[];
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
    bedrooms: number;
    bathrooms: number;
}

const TagNavigation: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>('web_featured'); // Set initial selected tag to 'web_featured'
    const [tags, setTags] = useState<string[]>(["web_featured", "Ocean_front", "Ocean_view", "Public_pool", "Pets"]);
    const [tagsLoading, setTagsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const tagsApiUrl = '/.netlify/functions/tags';

    const tagDisplayNames: { [key: string]: string } = {
        "web_featured": "Featured",
        "Ocean_front": "Ocean Front",
        "Ocean_view": "Ocean View",
        "Public_pool": "Pool",
        "Pets": "Pet Friendly"
    };

    const formatTag = (tag: string): string => {
        return tagDisplayNames[tag] || tag;
    };

    const getIconForTag = (tag: string) => {
        switch (tag) {
            case "web_featured":
                return <FiStar className="text-foreground size-7" />;
            case "Ocean_front":
                return <FiSun className="text-foreground size-7" />;
            case "Ocean_view":
                return <FiEye className="text-foreground size-7" />;
            case "Public_pool":
                return <FiDroplet className="text-foreground size-7" />;
            case "Pets":
                return <FiHeart className="text-foreground size-7" />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const fetchTags = async () => {
            setTagsLoading(true);
            try {
                const response = await fetch(tagsApiUrl);
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                const filteredTags = data.filter((tag: string) => tags.includes(tag));
                setTags(filteredTags);
            } catch (err) {
                console.error('Error fetching tags:', err);
                setError('');
            } finally {
                setTagsLoading(false);
            }
        };

        fetchTags();
    }, []);

    useEffect(() => {
        // Fetch listings for the initial selected tag when the component mounts
        fetchListingsForTag('web_featured');
    }, []);

    const fetchListingsForTag = async (tag: string) => {
        setLoading(true);
        setListings([]); // Clear previous listings
        try {
            const response = await fetch(`${tagsApiUrl}?tags=${tag}`);
            if (response.status === 429) {
                throw new Error('Too many requests');
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setListings(data.results);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError('');
        } finally {
            setLoading(false);
        }
    };

    const handleTagClick = (tag: string) => {
        if (tag !== selectedTag) {
            setSelectedTag(tag);
            fetchListingsForTag(tag);
        }
    };

    return (
        <div className="w-full mt-2">
            <div className="ml-0 mb-4 tags flex gap-6 justify-start md:justify-center items-center overflow-x-auto whitespace-nowrap no-scrollbar px-4">
                {tagsLoading ? (
                    <p>Loading Search...</p>
                ) : (
                    tags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagClick(tag)}
                            className={`px-2 py-2 text-nowrap w-fit text-secondary rounded flex flex-col justify-evenly items-center ${selectedTag === tag ? 'bg-secondary rounded-2xl text-white' : ''}`}
                        >
                            {getIconForTag(tag)}
                            {formatTag(tag)}
                        </button>
                    ))
                )}
            </div>
            <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
            {loading && listings.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <ClipLoader size={50} color={"#102C57"} loading={loading} />
                </div>
            ) : (
                <motion.div
                    className="search-results grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8 justify-center md:px-12 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        {listings.map((property) => (
                            <LazyLoadCard key={property._id} property={property} />
                        ))}
                    </Suspense>
                </motion.div>
            )}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default TagNavigation;