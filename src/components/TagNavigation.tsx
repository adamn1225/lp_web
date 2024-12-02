import React, { useState, useEffect, Suspense } from "react";
import { FiSun, FiEye, FiStar, FiDroplet, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { useInView } from "react-intersection-observer";

const LazyLoadCard = React.lazy(() => import('./ui/LazyLoadCard'));

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
    bedrooms: number;
    bathrooms: number;
}

const TagNavigation: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>(["Ocean_front", "Ocean_view", "web_featured", "Public_pool", "Pets"]);
    const [tagsLoading, setTagsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [prefetchedListings, setPrefetchedListings] = useState<{ [key: string]: Listing[] }>({});

    const tagsApiUrl = '/.netlify/functions/tags';

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

    const getIconForTag = (tag: string) => {
        switch (tag) {
            case "Ocean_front":
                return <FiSun className="text-foreground size-7" />;
            case "Ocean_view":
                return <FiEye className="text-foreground size-7" />;
            case "web_featured":
                return <FiStar className="text-foreground size-7" />;
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
                setError('Failed to load tags');
            } finally {
                setTagsLoading(false);
            }
        };

        fetchTags();
    }, []);

    const fetchListingsForTag = async (tag: string) => {
        setLoading(true);
        setListings([]); // Clear previous listings
        try {
            const response = await fetch(`${tagsApiUrl}?tags=${tag}`);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            // Incrementally update listings as they are fetched
            for (const listing of data.results) {
                setListings((prevListings) => [...prevListings, listing]);
            }
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError('Failed to load listings');
        } finally {
            setLoading(false);
        }
    };

    const handleTagClick = (tag: string) => {
        setSelectedTag(tag === selectedTag ? null : tag);
        if (prefetchedListings[tag]) {
            setListings(prefetchedListings[tag]);
        } else {
            fetchListingsForTag(tag);
        }
    };

    useEffect(() => {
        const prefetchListings = async () => {
            try {
                const listingsPromises = tags.map(async (tag: string) => {
                    const response = await fetch(`${tagsApiUrl}?tags=${tag}`);
                    const data = await response.json();
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    return { tag, listings: data.results };
                });

                const listingsResults = await Promise.all(listingsPromises);
                const listingsMap: { [key: string]: Listing[] } = {};
                listingsResults.forEach(({ tag, listings }) => {
                    listingsMap[tag] = listings;
                });
                setPrefetchedListings(listingsMap);
            } catch (err) {
                console.error('Error prefetching listings:', err);
            }
        };

        prefetchListings();
    }, [tags]);

    return (
        <div className="w-full mt-2">
            <div className="mb-4 tags flex gap-6 justify-center items-center overflow-x-auto whitespace-nowrap no-scrollbar">
                {tagsLoading ? (
                    <p>Loading Search...</p>
                ) : (
                    tags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagClick(tag)}
                            className={`px-3 py-2 text-nowrap w-fit text-secondary rounded flex flex-col items-center gap-2 ${selectedTag === tag ? 'bg-secondary rounded-2xl text-white' : ''}`}
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
        </div>
    );
};

export default TagNavigation;