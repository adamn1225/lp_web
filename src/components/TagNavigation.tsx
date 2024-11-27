import React, { useState, useEffect } from "react";
import { FiSun, FiEye, FiStar, FiDroplet, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { useInView } from "react-intersection-observer";

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
    // Add other properties as needed
}

const TagNavigation: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagsLoading, setTagsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const tagsApiUrl = '/.netlify/functions/tags';

    const allowedTags = ["Ocean_front", "Ocean_view", "web_featured", "Public_pool", "Pets"];

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
                return <FiSun className="text-foreground size-7"/>;
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
                const filteredTags = data.filter((tag: string) => allowedTags.includes(tag));
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

    const handleTagClick = async (tag: string) => {
        setSelectedTag(tag === selectedTag ? null : tag);

        setLoading(true);
        try {
            const response = await fetch(`${tagsApiUrl}?tags=${tag}`);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setListings(data.results);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError('Failed to load listings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-4 tags flex gap-6 justify-center items-center">
                {tagsLoading ? (
                    <p>Loading tags...</p>
                ) : (
                    tags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagClick(tag)}
                            className={`px-3 py-2 text-nowrap w-fit rounded flex flex-col items-center gap-2 ${selectedTag === tag ? 'bg-secondary rounded-2xl text-white' : ''}`}
                        >
                            {getIconForTag(tag)}
                            {formatTag(tag)}
                        </button>
                    ))
                )}
            </div>
            {loading ? (
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
                    {listings.map((property) => (
                        <LazyLoadCard key={property._id} property={property} />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

const LazyLoadCard: React.FC<{ property: Listing }> = ({ property }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div ref={ref}>
            {inView && (
                <a href={property._id}>
                    <article className="flex flex-col bg-white pt-4 w shadow-lg shadow-slate-300/30 h-full border border-slate-500/30 rounded-md mx-auto">
                        <div className="result-item">
                            <img className="w-full object-cover h-64" src={property.picture.thumbnail} alt={property.picture.caption} />
                            <div className="p-4 text-normal flex flex-col gap-4">
                                <h3 className="text-sm font-bold text-slate-900">{property.title}</h3>
                                <p className="text-sm font-light">{property.address.city}, {property.address.state}</p>
                                <div className="border border-stone-300"> </div>
                                <div className="flex min-h-min flex-row justify-start align-bottom"><button className="text-slate-900 font-extrabold mb-4">${property.prices.basePrice} Night</button></div>
                            </div>
                        </div>
                    </article>
                </a>
            )}
        </div>
    );
};

export default TagNavigation;