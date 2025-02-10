import React, { useEffect, useState } from 'react';
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';

interface Review {
    _id: string;
    guestId: string;
    guestFullName: string;
    overall_rating: number;
    public_review: string;
}

interface AirReviewsProps {
    listingId: string;
}

const AirReviews: React.FC<AirReviewsProps> = ({ listingId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [displayedReviewsCount, setDisplayedReviewsCount] = useState<number>(6);

    const fetchReviews = async (batch: 'initial' | 'remaining') => {
        try {
            const url = `/.netlify/functions/propertyReviews?propertyId=${listingId}&batch=${batch}`;
            console.log(`Fetching reviews from URL: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch reviews: ${response.statusText}`);
            }
            const data = await response.json();
            setReviews((prevReviews) => {
                const newReviews = batch === 'initial' ? data : [...prevReviews, ...data];
                return Array.from(new Set(newReviews.map(review => review._id)))
                    .map(id => newReviews.find(review => review._id === id));
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(`Listing ID: ${listingId}`); // Log the listingId for debugging
        fetchReviews('initial');
    }, [listingId]);

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
    };

    const handleViewMore = async () => {
        setDisplayedReviewsCount((prevCount) => prevCount + 5);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay of 1 second
        fetchReviews('remaining');
    };

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortOrder === 'desc') {
            return b.overall_rating - a.overall_rating;
        } else {
            return a.overall_rating - b.overall_rating;
        }
    });

    const displayedReviews = sortedReviews.slice(0, displayedReviewsCount);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (sortedReviews.length === 0) {
        return <p>No reviews available</p>;
    }

    return (
        <div className='w-full flex flex-col items-center justify-center md:w-2/3'>
            <div className="flex flex-col justify-center w-full items-center md:items-start gap-y-2 md:gap-x-6">
                {displayedReviews.map((review) => (
                    <div className="relative" key={review._id}>
                        <div className="gap-1 mb-6 flex items-center">
                            <div className="meta">
                                <div className="flex gap-2 md:justify-start items-center flex-wrap mx-4 md:w-3/4">
                                    <h4 className="text-slate-950 text-base font-semibold font-sans">
                                        Guest: {review.guestFullName}
                                    </h4>
                                    <span className="text-muted-700 text-sm font-semibold">
                                        Rating: {review.overall_rating}
                                    </span>
                                    <p className="text-slate-950 text-base">
                                        {review.public_review}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {displayedReviewsCount < reviews.length && (
                <button className='mt-4 text-secondary text-lg font-medium underline underline-offset-2 shadow-sm' onClick={handleViewMore}>
                    View More Reviews
                </button>
            )}
        </div>
    );
};

export default AirReviews;